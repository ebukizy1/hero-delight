import { supabase, type DbArticle, type DbComparisonArticle, type DbComment } from "./supabase";
import { uploadProductImage } from "./products";

export type Article = {
  id: string;
  title: string;
  featuredImage: string;
  centerImage?: string | null;
  content: string;
  metaDescription?: string | null;
  slug: string;
  published: boolean;
  publishedDate: string;
  salesPageUrl?: string | null;
  createdAt: string;
};

export type ComparisonArticle = {
  id: string;
  title: string;
  bannerImage: string;
  productATitle: string;
  productAImage?: string | null;
  productADetails: string;
  productBTitle: string;
  productBImage?: string | null;
  productBDetails: string;
  comparisonContent: string;
  conclusion: string;
  slug: string;
  published: boolean;
  publishedDate: string;
  salesPageUrl?: string | null;
  createdAt: string;
};

export type Comment = {
  id: string;
  articleId?: string | null;
  comparisonId?: string | null;
  authorName: string;
  authorEmail?: string | null;
  content: string;
  approved: boolean;
  createdAt: string;
};

const PRODUCT_A_TITLE_MARKER = "[[product-a-title]]:";
const PRODUCT_B_TITLE_MARKER = "[[product-b-title]]:";
const PRODUCT_A_IMAGE_MARKER = "[[product-a-image]]:";
const PRODUCT_B_IMAGE_MARKER = "[[product-b-image]]:";

function dbToArticle(db: DbArticle): Article {
  return {
    id: db.id,
    title: db.title,
    featuredImage: db.featured_image,
    centerImage: db.center_image,
    content: db.content,
    metaDescription: db.meta_description,
    slug: db.slug,
    published: db.published,
    publishedDate: db.published_date,
    salesPageUrl: db.sales_page_url,
    createdAt: db.created_at,
  };
}

function dbToComparison(db: DbComparisonArticle): ComparisonArticle {
  const productATitle = extractStoredTitle(
    db.product_a_details,
    PRODUCT_A_TITLE_MARKER,
    db.product_a_title,
    "Product A",
  );
  const productBTitle = extractStoredTitle(
    db.product_b_details,
    PRODUCT_B_TITLE_MARKER,
    db.product_b_title,
    "Product B",
  );
  const productAImage = extractStoredImage(
    db.product_a_details,
    PRODUCT_A_IMAGE_MARKER,
    db.product_a_image,
    db.banner_image,
  );
  const productBImage = extractStoredImage(
    db.product_b_details,
    PRODUCT_B_IMAGE_MARKER,
    db.product_b_image,
    db.banner_image,
  );

  return {
    id: db.id,
    title: db.title,
    bannerImage: db.banner_image,
    productATitle,
    productAImage,
    productADetails: stripStoredMeta(db.product_a_details, [PRODUCT_A_TITLE_MARKER, PRODUCT_A_IMAGE_MARKER]),
    productBTitle,
    productBImage,
    productBDetails: stripStoredMeta(db.product_b_details, [PRODUCT_B_TITLE_MARKER, PRODUCT_B_IMAGE_MARKER]),
    comparisonContent: db.comparison_content,
    conclusion: db.conclusion,
    slug: db.slug,
    published: db.published,
    publishedDate: db.published_date,
    salesPageUrl: db.sales_page_url,
    createdAt: db.created_at,
  };
}

function dbToComment(db: DbComment): Comment {
  return {
    id: db.id,
    articleId: db.article_id,
    comparisonId: db.comparison_id,
    authorName: db.author_name,
    authorEmail: db.author_email,
    content: db.content,
    approved: db.approved,
    createdAt: db.created_at,
  };
}

function isMissingColumn(err: unknown, column: string): boolean {
  const message = (err as { message?: string })?.message ?? "";
  return new RegExp(column, "i").test(message) && /(column|schema|cache)/i.test(message);
}

function stripField<T extends Record<string, unknown>>(payload: T, field: string) {
  const { [field]: _omit, ...rest } = payload as Record<string, unknown>;
  return rest as T;
}

async function safeArticleWrite<T>(
  fn: (payload: Record<string, unknown>) => Promise<{ data: T | null; error: unknown }>,
  payload: Record<string, unknown>,
  optionalColumns: string[],
): Promise<T> {
  let nextPayload = { ...payload };

  for (let i = 0; i <= optionalColumns.length; i += 1) {
    const result = await fn(nextPayload);
    if (!result.error) {
      return result.data as T;
    }

    const missingColumn = optionalColumns.find(
      (column) => column in nextPayload && isMissingColumn(result.error, column),
    );

    if (!missingColumn) {
      throw result.error;
    }

    nextPayload = stripField(nextPayload, missingColumn);
  }

  throw new Error("Failed to save content");
}

function withDefinedFields(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
}

function encodeStoredMeta(
  details: string,
  metadata: Array<{ marker: string; value?: string | null }>,
) {
  const cleanDetails = stripStoredMeta(
    details,
    metadata.map((item) => item.marker),
  );
  const lines = metadata
    .filter((item) => item.value?.trim())
    .map((item) => `${item.marker}${item.value!.trim()}`);
  return [...lines, cleanDetails].filter(Boolean).join("\n").trim();
}

function extractStoredTitle(
  details: string,
  marker: string,
  directTitle?: string | null,
  fallback = "",
) {
  if (directTitle?.trim()) {
    return directTitle.trim();
  }

  const firstLine = details.split("\n")[0]?.trim() ?? "";
  if (firstLine.startsWith(marker)) {
    return firstLine.slice(marker.length).trim() || fallback;
  }

  return fallback;
}

function extractStoredImage(
  details: string,
  marker: string,
  directImage?: string | null,
  fallback?: string | null,
) {
  if (directImage?.trim()) {
    return directImage.trim();
  }

  const embedded = extractStoredValue(details, marker);
  if (embedded) {
    return embedded;
  }

  return fallback ?? null;
}

function extractStoredValue(details: string, marker: string) {
  const lines = details.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("[[")) {
      break;
    }
    if (trimmed.startsWith(marker)) {
      return trimmed.slice(marker.length).trim();
    }
  }
  return "";
}

function stripStoredMeta(details: string, markers: string[]) {
  const lines = details.split("\n");
  let startIndex = 0;

  while (startIndex < lines.length) {
    const trimmed = lines[startIndex].trim();
    if (!trimmed.startsWith("[[")) {
      break;
    }
    if (markers.some((marker) => trimmed.startsWith(marker))) {
      startIndex += 1;
      continue;
    }
    break;
  }

  return lines.slice(startIndex).join("\n").trim();
}

export async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_date", { ascending: false });
  if (error) throw error;
  return (data as DbArticle[]).map(dbToArticle);
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return dbToArticle(data as DbArticle);
}

export async function createArticle(article: Omit<Article, "id" | "createdAt">, imageFile: File, centerImageFile?: File): Promise<Article> {
  const imageUrl = await uploadProductImage(imageFile);
  let centerImageUrl = undefined;
  if (centerImageFile) {
    centerImageUrl = await uploadProductImage(centerImageFile);
  }
  const data = await safeArticleWrite<DbArticle>(
    async (payload) => {
      const result = await supabase.from("articles").insert(payload).select().single();
      return { data: result.data as DbArticle | null, error: result.error };
    },
    withDefinedFields({
      title: article.title,
      featured_image: imageUrl,
      center_image: centerImageUrl,
      content: article.content,
      meta_description: article.metaDescription,
      slug: article.slug,
      published: article.published,
      published_date: article.publishedDate,
      sales_page_url: article.salesPageUrl,
    }),
    ["meta_description", "sales_page_url", "center_image"],
  );

  return dbToArticle(data);
}

export async function updateArticle(id: string, article: Partial<Omit<Article, "id" | "createdAt">>, imageFile?: File, centerImageFile?: File): Promise<Article> {
  let imageUrl = undefined;
  if (imageFile) {
    imageUrl = await uploadProductImage(imageFile);
  }
  let centerImageUrl = undefined;
  if (centerImageFile) {
    centerImageUrl = await uploadProductImage(centerImageFile);
  }
  const data = await safeArticleWrite<DbArticle>(
    async (payload) => {
      const result = await supabase.from("articles").update(payload).eq("id", id).select().single();
      return { data: result.data as DbArticle | null, error: result.error };
    },
    withDefinedFields({
      title: article.title,
      featured_image: imageUrl,
      center_image: centerImageUrl,
      content: article.content,
      meta_description: article.metaDescription,
      slug: article.slug,
      published: article.published,
      published_date: article.publishedDate,
      sales_page_url: article.salesPageUrl,
    }),
    ["meta_description", "sales_page_url", "center_image"],
  );

  return dbToArticle(data);
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchComparisonArticles(): Promise<ComparisonArticle[]> {
  const { data, error } = await supabase
    .from("comparison_articles")
    .select("*")
    .order("published_date", { ascending: false });
  if (error) throw error;
  return (data as DbComparisonArticle[]).map(dbToComparison);
}

export async function fetchComparisonBySlug(slug: string): Promise<ComparisonArticle | null> {
  const { data, error } = await supabase
    .from("comparison_articles")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return dbToComparison(data as DbComparisonArticle);
}

export async function createComparisonArticle(
  article: Omit<ComparisonArticle, "id" | "createdAt">,
  bannerImageFile: File,
  productAImageFile: File,
  productBImageFile: File
): Promise<ComparisonArticle> {
  const [bannerUrl, productAUrl, productBUrl] = await Promise.all([
    uploadProductImage(bannerImageFile),
    uploadProductImage(productAImageFile),
    uploadProductImage(productBImageFile),
  ]);

  const data = await safeArticleWrite<DbComparisonArticle>(
    async (payload) => {
      const result = await supabase.from("comparison_articles").insert(payload).select().single();
      return { data: result.data as DbComparisonArticle | null, error: result.error };
    },
    withDefinedFields({
      title: article.title,
      banner_image: bannerUrl,
      product_a_title: article.productATitle,
      product_a_image: productAUrl,
      product_a_details: encodeStoredMeta(
        article.productADetails,
        [
          { marker: PRODUCT_A_TITLE_MARKER, value: article.productATitle },
          { marker: PRODUCT_A_IMAGE_MARKER, value: productAUrl },
        ],
      ),
      product_b_title: article.productBTitle,
      product_b_image: productBUrl,
      product_b_details: encodeStoredMeta(
        article.productBDetails,
        [
          { marker: PRODUCT_B_TITLE_MARKER, value: article.productBTitle },
          { marker: PRODUCT_B_IMAGE_MARKER, value: productBUrl },
        ],
      ),
      comparison_content: article.comparisonContent,
      conclusion: article.conclusion,
      slug: article.slug,
      published: article.published,
      published_date: article.publishedDate,
      sales_page_url: article.salesPageUrl,
    }),
    ["product_a_title", "product_b_title", "product_a_image", "product_b_image", "sales_page_url"],
  );

  return dbToComparison(data);
}

export async function updateComparisonArticle(
  id: string,
  article: Partial<Omit<ComparisonArticle, "id" | "createdAt">>,
  bannerImageFile?: File,
  productAImageFile?: File,
  productBImageFile?: File
): Promise<ComparisonArticle> {
  const uploads: Promise<string>[] = [];
  let bannerUrl: string | undefined;
  let productAUrl: string | undefined;
  let productBUrl: string | undefined;

  if (bannerImageFile) {
    uploads.push(uploadProductImage(bannerImageFile).then(url => { bannerUrl = url; return url; }));
  }
  if (productAImageFile) {
    uploads.push(uploadProductImage(productAImageFile).then(url => { productAUrl = url; return url; }));
  }
  if (productBImageFile) {
    uploads.push(uploadProductImage(productBImageFile).then(url => { productBUrl = url; return url; }));
  }

  if (uploads.length > 0) {
    await Promise.all(uploads);
  }

  const data = await safeArticleWrite<DbComparisonArticle>(
    async (payload) => {
      const result = await supabase
        .from("comparison_articles")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      return { data: result.data as DbComparisonArticle | null, error: result.error };
    },
    withDefinedFields({
      title: article.title,
      banner_image: bannerUrl,
      product_a_title: article.productATitle,
      product_a_image: productAUrl,
      product_a_details: article.productADetails
        ? encodeStoredMeta(article.productADetails, [
            { marker: PRODUCT_A_TITLE_MARKER, value: article.productATitle },
            { marker: PRODUCT_A_IMAGE_MARKER, value: productAUrl || article.productAImage },
          ])
        : undefined,
      product_b_title: article.productBTitle,
      product_b_image: productBUrl,
      product_b_details: article.productBDetails
        ? encodeStoredMeta(article.productBDetails, [
            { marker: PRODUCT_B_TITLE_MARKER, value: article.productBTitle },
            { marker: PRODUCT_B_IMAGE_MARKER, value: productBUrl || article.productBImage },
          ])
        : undefined,
      comparison_content: article.comparisonContent,
      conclusion: article.conclusion,
      slug: article.slug,
      published: article.published,
      published_date: article.publishedDate,
      sales_page_url: article.salesPageUrl,
    }),
    ["product_a_title", "product_b_title", "product_a_image", "product_b_image", "sales_page_url"],
  );

  return dbToComparison(data);
}

export async function deleteComparisonArticle(id: string): Promise<void> {
  const { error } = await supabase.from("comparison_articles").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchCommentsForArticle(articleId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("article_id", articleId)
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbComment[]).map(dbToComment);
}

export async function fetchCommentsForComparison(comparisonId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("comparison_id", comparisonId)
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbComment[]).map(dbToComment);
}

export async function createComment(comment: Omit<Comment, "id" | "createdAt" | "approved">): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      article_id: comment.articleId,
      comparison_id: comment.comparisonId,
      author_name: comment.authorName,
      author_email: comment.authorEmail,
      content: comment.content,
      approved: false,
    })
    .select()
    .single();
  if (error) throw error;
  return dbToComment(data as DbComment);
}
