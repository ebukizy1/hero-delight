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
  name: string;
  /** Sale / current selling price */
  price: number;
  /** Original / "was" price shown struck-through. Optional. */
  bonusPrice?: number | null;
  category: string;
  image: string;
  description: string;
  featured: boolean;
  specifications: Array<{ label: string; value: string }>;
}

export function dbToProduct(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    bonusPrice: p.bonus_price ?? null,
    category: p.category,
    image: p.image_url,
    description: p.description,
    featured: Boolean(p.featured),
    specifications: Array.isArray(p.specifications)
      ? p.specifications.filter((s) => s && s.label && s.value)
      : [],
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

export async function fetchProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) return null;
  return dbToProduct(data as DbProduct);
}

export interface ProductInput {
  name: string;
  price: number;
  bonus_price?: number | null;
  category: string;
  description: string;
  image_url: string;
  featured?: boolean;
  specifications?: Array<{ label: string; value: string }>;
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
  const optional = ["bonus_price", "featured", "specifications"];
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

export const discountPercent = (price: number, bonus?: number | null) => {
  if (!bonus || bonus <= price) return 0;
  return Math.round(((bonus - price) / bonus) * 100);
};
