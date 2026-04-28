import { CATEGORIES, type Category } from "./products";

export const categoryToSlug = (c: string) =>
  c.toLowerCase().replace(/^solar\s+/i, "").replace(/\s+/g, "-");

export const slugToCategory = (slug: string): Category | null => {
  const found = CATEGORIES.find((c) => categoryToSlug(c) === slug.toLowerCase());
  return (found as Category) ?? null;
};
