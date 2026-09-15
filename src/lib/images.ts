/**
 * Turns raw Supabase Storage public URLs into resized, format-negotiated
 * URLs via Supabase's on-the-fly image transform endpoint
 * (`/storage/v1/render/image/...`), confirmed enabled on this project —
 * a 19.3MB source photo comes back as an ~85KB WebP at width=400/height=400.
 *
 * Important quirk (verified directly against the endpoint): passing only
 * `width` does NOT scale proportionally — it leaves height at the original
 * pixel count, badly distorting the image. `width` and `height` must always
 * be sent together; `resize` picks cover (crop-to-fill, matches CSS
 * `object-cover`) vs contain (fit-within, matches `object-contain`).
 *
 * Non-Supabase URLs (bundled Vite assets, `/logo.png`, blob: preview URLs)
 * are returned unchanged so this is safe to apply everywhere images render.
 */

const OBJECT_PREFIX = "/storage/v1/object/public/";
const RENDER_PREFIX = "/storage/v1/render/image/public/";

export type ImageFit = "cover" | "contain";

export interface OptimizeOptions {
  width: number;
  height: number;
  quality?: number;
  fit?: ImageFit;
}

export function isTransformableUrl(url: string | null | undefined): url is string {
  return Boolean(url && url.includes(OBJECT_PREFIX));
}

/** Browsers send an `Accept` header that includes `image/webp`/`image/avif`
 * for `<img>` requests, and Supabase's transform endpoint content-negotiates
 * on that automatically — no explicit `format` param needed. */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  { width, height, quality = 75, fit = "cover" }: OptimizeOptions,
): string {
  if (!url) return "";
  if (!isTransformableUrl(url)) return url;

  const transformed = url.replace(OBJECT_PREFIX, RENDER_PREFIX);
  const params = new URLSearchParams({
    width: String(Math.round(width)),
    height: String(Math.round(height)),
    resize: fit,
    quality: String(quality),
  });
  const sep = transformed.includes("?") ? "&" : "?";
  return `${transformed}${sep}${params.toString()}`;
}

/** 1x/1.5x/2x density srcset around a declared display size, keeping the
 * same aspect ratio at every step. */
export const DENSITY_MULTIPLIERS = [1, 1.5, 2] as const;

export function buildSrcSet(
  url: string | null | undefined,
  width: number,
  height: number,
  quality = 75,
  fit: ImageFit = "cover",
  multipliers: readonly number[] = DENSITY_MULTIPLIERS,
): string | undefined {
  if (!isTransformableUrl(url)) return undefined;
  return multipliers
    .map((m) => {
      const w = Math.round(width * m);
      const h = Math.round(height * m);
      return `${getOptimizedImageUrl(url, { width: w, height: h, quality, fit })} ${w}w`;
    })
    .join(", ");
}
