import type { ImgHTMLAttributes } from "react";
import { getOptimizedImageUrl, buildSrcSet, type ImageFit } from "@/lib/images";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "loading" | "fetchPriority"> {
  src: string;
  alt: string;
  /** Declared display size — also used to build the transform request and
   * the density srcset, so this should roughly match how big the image
   * actually renders (not just an aspect-ratio hint). */
  width: number;
  height: number;
  /** Eager-load + high fetch priority, for the page's LCP image. Everything
   * else defaults to lazy, matching the loading strategy already in use
   * across the site. */
  priority?: boolean;
  /** How wide the image actually renders, for the `sizes` attribute. */
  sizes?: string;
  quality?: number;
  /** "cover" (default) crops to fill — pair with `object-cover`. "contain"
   * fits within the box with no cropping — pair with `object-contain`. */
  fit?: ImageFit;
}

/**
 * Drop-in replacement for a raw `<img>` that serves Supabase product/article
 * photos through the resize + WebP/AVIF transform endpoint (see
 * `src/lib/images.ts`), with a density-based `srcset` and explicit
 * dimensions to prevent layout shift. Non-Supabase sources (bundled assets,
 * blob: previews) pass through untouched.
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = "100vw",
  quality = 75,
  fit = "cover",
  className,
  ...rest
}: OptimizedImageProps) {
  const srcSet = buildSrcSet(src, width, height, quality, fit);

  return (
    <img
      src={getOptimizedImageUrl(src, { width, height, quality, fit })}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={className}
      {...rest}
    />
  );
}
