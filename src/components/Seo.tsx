import { useEffect } from "react";

export const SITE_URL = "https://www.onlinesolarstore.store";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

interface SeoProps {
  title: string;
  description: string;
  /** Path relative to SITE_URL, e.g. "/product/abc". Defaults to the current location. */
  path?: string;
  image?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
  jsonLd?: object | object[];
}

/**
 * Dependency-free per-page SEO: sets document.title, meta description/robots,
 * Open Graph + Twitter tags, canonical link, and JSON-LD structured data on mount.
 * This is a client-rendered SPA, so these only reach crawlers that execute JS
 * (Google, Bing) — social-card unfurls (Twitter/Facebook) fall back to the
 * static defaults in index.html since they don't reliably run JS.
 */
export function Seo({ title, description, path, image, type = "website", noindex = false, jsonLd }: SeoProps) {
  useEffect(() => {
    const url = `${SITE_URL}${path ?? window.location.pathname}`;
    const ogImage = image ?? DEFAULT_OG_IMAGE;

    document.title = title;
    setMeta("description", description);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:type", type === "product" ? "website" : type);
    setProperty("og:url", url);
    setProperty("og:image", ogImage);
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);
    setCanonical(url);
    setJsonLd(jsonLd);
  }, [title, description, path, image, type, noindex, jsonLd]);

  return null;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const JSON_LD_ID = "page-json-ld";

function setJsonLd(data?: object | object[]) {
  const existing = document.getElementById(JSON_LD_ID);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement("script");
  script.id = JSON_LD_ID;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}
