// Generates public/sitemap.xml from the current product/category/article catalogue.
// Runs automatically before `npm run build` (see package.json "prebuild"), so every
// deploy picks up new products and Solar Insights articles without a manual step.
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://www.onlinesolarstore.store";
const SUPABASE_URL = "https://qedxydsnanwmatvvsncp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_HEWk7xRUyywjbRWlNEDwrA_tM7-GzCg";

// Keep in sync with CATEGORIES in src/lib/products.ts and categoryToSlug in src/lib/categorySlug.ts
const CATEGORIES = [
  "Solar Streetlight",
  "Solar Floodlight",
  "Solar LED Light",
  "Solar Power Station",
  "Solar Inverter",
  "Solar Fan",
  "Solar Camera",
];
const categoryToSlug = (c) => c.toLowerCase().replace(/^solar\s+/i, "").replace(/\s+/g, "-");

const STATIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/insights", changefreq: "daily", priority: "0.8" },
];

function urlEntry(loc, lastmod, changefreq, priority) {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const today = new Date().toISOString().slice(0, 10);
  const urls = [];

  for (const r of STATIC_ROUTES) urls.push(urlEntry(`${SITE_URL}${r.path}`, today, r.changefreq, r.priority));
  for (const c of CATEGORIES) urls.push(urlEntry(`${SITE_URL}/category/${categoryToSlug(c)}`, today, "weekly", "0.7"));

  try {
    const { data, error } = await supabase.from("products").select("id, created_at").order("created_at", { ascending: false });
    if (error) throw error;
    for (const p of data ?? []) urls.push(urlEntry(`${SITE_URL}/product/${p.id}`, (p.created_at ?? today).slice(0, 10), "weekly", "0.6"));
    console.log(`[sitemap] Included ${data?.length ?? 0} products`);
  } catch (err) {
    console.warn(`[sitemap] Skipping products (${err?.message ?? err}) — sitemap will still build without them.`);
  }

  try {
    const { data, error } = await supabase
      .from("articles")
      .select("slug, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    for (const a of data ?? []) urls.push(urlEntry(`${SITE_URL}/insights/${a.slug}`, (a.created_at ?? today).slice(0, 10), "monthly", "0.6"));
    console.log(`[sitemap] Included ${data?.length ?? 0} Solar Insights articles`);
  } catch (err) {
    console.warn(`[sitemap] Skipping articles (${err?.message ?? err}) — run supabase/migrations/0002_articles.sql if this table doesn't exist yet.`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  const outPath = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
  writeFileSync(outPath, xml);
  console.log(`[sitemap] Wrote ${urls.length} URLs to public/sitemap.xml`);
}

main();
