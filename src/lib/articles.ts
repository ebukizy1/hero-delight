import { supabase } from "./supabase";

export type ArticleType = "guide" | "comparison";

export interface DbArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string | null;
  center_image: string | null;
  meta_description: string | null;
  article_type: ArticleType;
  published: boolean;
  published_date: string | null;
  sales_page_url: string | null;
  created_at: string;
}

export type Article = DbArticle;

/** Lightweight shape for home page / list previews — skips the (often large) markdown body. */
export type ArticlePreview = Omit<Article, "content" | "sales_page_url">;

const PREVIEW_COLUMNS =
  "id, title, slug, featured_image, center_image, meta_description, article_type, published, published_date, created_at";

export async function fetchArticles(
  options: { publishedOnly?: boolean; type?: ArticleType } = {},
): Promise<Article[]> {
  let query = supabase.from("articles").select("*").order("created_at", { ascending: false });
  if (options.publishedOnly) query = query.eq("published", true);
  if (options.type) query = query.eq("article_type", options.type);
  const { data, error } = await query;
  if (error) throw error;
  return data as Article[];
}

/** Fast, minimal-payload fetch for surfaces that only render a teaser (home page, "more articles"). */
export async function fetchArticlePreviews(
  options: { publishedOnly?: boolean; type?: ArticleType; limit?: number } = {},
): Promise<ArticlePreview[]> {
  let query = supabase.from("articles").select(PREVIEW_COLUMNS).order("created_at", { ascending: false });
  if (options.publishedOnly) query = query.eq("published", true);
  if (options.type) query = query.eq("article_type", options.type);
  if (options.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as ArticlePreview[];
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).single();
  if (error) return null;
  return data as Article;
}

export async function fetchArticle(id: string): Promise<Article | null> {
  const { data, error } = await supabase.from("articles").select("*").eq("id", id).single();
  if (error) return null;
  return data as Article;
}

export interface ArticleInput {
  title: string;
  slug: string;
  content: string;
  featured_image?: string | null;
  center_image?: string | null;
  meta_description?: string | null;
  article_type?: ArticleType;
  published?: boolean;
  published_date?: string | null;
  sales_page_url?: string | null;
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const { data, error } = await supabase.from("articles").insert(input).select().single();
  if (error) throw error;
  return data as Article;
}

export async function updateArticle(id: string, input: Partial<ArticleInput>): Promise<Article> {
  const { data, error } = await supabase.from("articles").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data as Article;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadArticleImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `articles/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
