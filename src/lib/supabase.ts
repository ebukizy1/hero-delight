import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qedxydsnanwmatvvsncp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_HEWk7xRUyywjbRWlNEDwrA_tM7-GzCg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export type DbProduct = {
  id: string;
  name: string;
  price: number;
  bonus_price?: number | null;
  category: string;
  description: string;
  image_url: string;
  image_url_2?: string | null;
  image_url_3?: string | null;
  featured?: boolean | null;
  specifications?: Array<{ label: string; value: string }> | null;
  created_at: string;
};

export type DbArticle = {
  id: string;
  title: string;
  featured_image: string;
  center_image?: string | null;
  content: string;
  meta_description?: string | null;
  slug: string;
  published: boolean;
  published_date: string;
  sales_page_url?: string | null;
  created_at: string;
};

export type DbComparisonArticle = {
  id: string;
  title: string;
  banner_image: string;
  product_a_title: string;
  product_a_image?: string | null;
  product_a_details: string;
  product_b_title: string;
  product_b_image?: string | null;
  product_b_details: string;
  comparison_content: string;
  conclusion: string;
  slug: string;
  published: boolean;
  published_date: string;
  sales_page_url?: string | null;
  created_at: string;
};

export type DbComment = {
  id: string;
  article_id?: string | null;
  comparison_id?: string | null;
  author_name: string;
  author_email?: string | null;
  content: string;
  approved: boolean;
  created_at: string;
};
