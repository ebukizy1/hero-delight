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
  created_at: string;
};
