import { supabase, type DbProduct } from "./supabase";

export const CATEGORIES = [
  "Solar Streetlight",
  "Solar Floodlight",
  "Solar LED Light",
  "Solar Power Station",
  "Solar Inverter",
  "Solar Fan",
  "Solar Camera",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Product {
  id: string;
  /**
   * Human-readable identifier derived from the name, e.g. "solar-streetlight-60w". Used in
   * product URLs and as the content_id reported to Meta. Falls back to `id` until
   * supabase/migrations/0004_product_sku.sql has been run.
   */
  sku: string;
  name: string;
  /** Sale / current selling price */
  price: number;
  /** Original / "was" price shown struck-through. Optional. */
  bonusPrice?: number | null;
  category: string;
  image: string;
  images: string[];
  description: string;
  featured: boolean;
  specifications: Array<{ label: string; value: string }>;
  /** Short capability bullets shown on the product page's Features tab. */
  features: string[];
  /** Checklist of what the product can power/run, e.g. "1 fridge (medium)". */
  runsOn: string[];
  /** Free-text note under the "What this actually runs" checklist, e.g. runtime estimate. */
  runsOnNote: string | null;
}

export function dbToProduct(p: DbProduct): Product {
  const images = [p.image_url, p.image_url_2, p.image_url_3].filter((u): u is string => Boolean(u));
  return {
    id: p.id,
    sku: p.sku || p.id,
    name: p.name,
    price: p.price,
    bonusPrice: p.bonus_price ?? null,
    category: p.category,
    image: p.image_url,
    images,
    description: p.description,
    featured: Boolean(p.featured),
    specifications: Array.isArray(p.specifications)
      ? p.specifications.filter((s) => s && s.label && s.value)
      : [],
    features: Array.isArray(p.features) ? p.features.filter(Boolean) : [],
    runsOn: Array.isArray(p.runs_on) ? p.runs_on.filter(Boolean) : [],
    runsOnNote: p.runs_on_note ?? null,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbProduct[]).map(dbToProduct);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Looks a product up by SKU, or by UUID for old links shared before SKUs existed. */
export async function fetchProduct(idOrSku: string): Promise<Product | null> {
  const column = UUID_RE.test(idOrSku) ? "id" : "sku";
  const { data, error } = await supabase.from("products").select("*").eq(column, idOrSku).single();
  if (error) return null;
  return dbToProduct(data as DbProduct);
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";

/**
 * Turns `sku` (or the product name) into a SKU not used by any other product, appending
 * -2, -3, … on collisions. `excludeId` is the product being edited, so it doesn't collide
 * with itself.
 */
export async function uniqueSku(raw: string, excludeId?: string): Promise<string> {
  const base = slugify(raw);
  const { data, error } = await supabase.from("products").select("id, sku").like("sku", `${base}%`);
  // Column missing (migration not run yet) — safeWrite will strip `sku` anyway.
  if (error) return base;
  const taken = new Set(
    (data as Array<{ id: string; sku: string | null }>)
      .filter((r) => r.id !== excludeId && r.sku)
      .map((r) => r.sku),
  );
  let candidate = base;
  for (let n = 2; taken.has(candidate); n++) candidate = `${base}-${n}`;
  return candidate;
}

export interface ProductInput {
  sku?: string;
  name: string;
  price: number;
  bonus_price?: number | null;
  category: string;
  description: string;
  image_url: string;
  image_url_2?: string | null;
  image_url_3?: string | null;
  featured?: boolean;
  specifications?: Array<{ label: string; value: string }>;
  features?: string[];
  runs_on?: string[];
  runs_on_note?: string | null;
}

function isMissingColumn(err: unknown, col: string): boolean {
  const msg = (err as { message?: string })?.message ?? "";
  const re = new RegExp(col, "i");
  return re.test(msg) && /(column|schema|cache)/i.test(msg);
}

function stripField<T extends Record<string, unknown>>(p: T, field: string): Omit<T, typeof field> {
  const { [field]: _omit, ...rest } = p as Record<string, unknown>;
  return rest as Omit<T, typeof field>;
}

async function safeWrite<T>(
  fn: (payload: Record<string, unknown>) => Promise<{ data: T | null; error: unknown }>,
  payload: Record<string, unknown>,
): Promise<T> {
  const optional = [
    "sku",
    "bonus_price",
    "featured",
    "specifications",
    "image_url_2",
    "image_url_3",
    "features",
    "runs_on",
    "runs_on_note",
  ];
  let p = { ...payload };
  const stripped: string[] = [];
  for (let i = 0; i <= optional.length; i++) {
    const res = await fn(p);
    if (!res.error) {
      if (stripped.length) {
        // eslint-disable-next-line no-console
        console.warn(
          `[products] Saved without columns: ${stripped.join(", ")}. ` +
            `Run the SQL migration to add them so this data is persisted.`,
        );
      }
      return res.data as T;
    }
    const missing = optional.find((c) => isMissingColumn(res.error, c) && c in p);
    if (!missing) throw res.error;
    stripped.push(missing);
    p = stripField(p, missing);
  }
  throw new Error("Failed to save product");
}

export async function createProduct(p: ProductInput): Promise<Product> {
  const data = await safeWrite<DbProduct>(
    async (payload) => {
      const r = await supabase.from("products").insert(payload).select().single();
      return { data: r.data as DbProduct | null, error: r.error };
    },
    p as unknown as Record<string, unknown>,
  );
  return dbToProduct(data);
}

export async function updateProduct(id: string, p: Partial<ProductInput>): Promise<Product> {
  const data = await safeWrite<DbProduct>(
    async (payload) => {
      const r = await supabase.from("products").update(payload).eq("id", id).select().single();
      return { data: r.data as DbProduct | null, error: r.error };
    },
    p as Record<string, unknown>,
  );
  return dbToProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

export const formatNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
};

export const discountPercent = (price: number, bonus?: number | null) => {
  if (!bonus || bonus <= price) return 0;
  return Math.round(((bonus - price) / bonus) * 100);
};
