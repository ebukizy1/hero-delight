import { useEffect, useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/pages/Index";
import { fetchProducts, type Product } from "@/lib/products";
import { slugToCategory } from "@/lib/categorySlug";

const PAGE_SIZE = 12;

const CategoryPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const category = useMemo(() => slugToCategory(slug), [slug]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (category) document.title = `${category} — OnlineSolarStore`;
  }, [category]);

  useEffect(() => { setPage(1); }, [slug]);

  if (!category) return <Navigate to="/" replace />;

  const items = products.filter((p) => p.category === category);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-hero-glow border-b border-border/60">
          <div className="container mx-auto px-4 sm:px-6 py-10 lg:py-14">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent animate-fade-up">
              <Sparkles className="w-3.5 h-3.5" /> Category
            </div>
            <h1 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight animate-fade-up delay-100">
              {category}
            </h1>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl animate-fade-up delay-200">
              {items.length} product{items.length !== 1 ? "s" : ""} available. Quality {category.toLowerCase()} delivered fast across Nigeria.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 py-10 lg:py-14">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">No products in this category yet.</p>
              <Link to="/" className="inline-flex mt-4 h-10 px-5 items-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                Browse all products
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {pageItems.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
