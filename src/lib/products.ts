import { supabase, type DbProduct } from "./supabase";

export const CATEGORIES = [
  "Solar Streetlight",
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
}

export async function createProduct(p: ProductInput): Promise<Product> {
  const { data, error } = await supabase.from("products").insert(p).select().single();
  if (error) throw error;
  return dbToProduct(data as DbProduct);
}

export async function updateProduct(id: string, p: Partial<ProductInput>): Promise<Product> {
  const { data, error } = await supabase.from("products").update(p).eq("id", id).select().single();
  if (error) throw error;
  return dbToProduct(data as DbProduct);
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
