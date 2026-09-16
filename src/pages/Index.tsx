import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { DealsSection } from "@/components/DealsSection";
import { Categories } from "@/components/Categories";
import { BestSellers } from "@/components/BestSellers";
import { SolarInsightsSection } from "@/components/SolarInsightsSection";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, type Product } from "@/lib/products";
import { fetchArticlePreviews, type ArticlePreview } from "@/lib/articles";
import { Seo } from "@/components/Seo";

const PAGE_SIZE = 12;

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticlePreview[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const query = searchParams.get("q")?.trim() ?? "";

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchArticlePreviews({ publishedOnly: true, limit: 3 })
      .then(setArticles)
      .catch(() => setArticles([]));
  }, []);

  useEffect(() => { setPage(1); }, [query]);

  const searchResults = useMemo(() => {
    if (!query) return [];
    const term = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term),
    );
  }, [products, query]);

  const totalPages = Math.max(1, Math.ceil(searchResults.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = searchResults.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSearch = () => setSearchParams({});

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Seo
        title="Emax Solar Store — Solar Street Lights, Inverters, Power Stations & Cameras"
        description="Shop premium solar street lights, inverters, power stations and security cameras in Nigeria. 1-year warranty, nationwide delivery, Cash on Delivery available."
        path="/"
      />
      <TopBar />
      <Header />

      {query ? (
        <section className="py-8 sm:py-12 min-h-[50vh]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">
                  Search results for &ldquo;{query}&rdquo;
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {loading ? "Searching…" : `${searchResults.length} product${searchResults.length !== 1 ? "s" : ""} found`}
                </p>
              </div>
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading products…</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-sm">No products match your search. Try a different term.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                  {pageItems.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <Pagination page={safePage} totalPages={totalPages} onChange={goToPage} />
              </>
            )}
          </div>
        </section>
      ) : (
        <>
          <Hero />
          <TrustBar />
          <DealsSection products={products} loading={loading} />
          <Categories products={products} />
          <BestSellers products={products} loading={loading} />
          <SolarInsightsSection articles={articles} />
        </>
      )}

      <Footer />
      <MobileTabBar />
    </div>
  );
};

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-40 disabled:hover:text-muted-foreground transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-2 text-muted-foreground text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`min-w-9 h-9 px-3 rounded-lg text-sm font-semibold transition-colors ${
              p === page
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-40 disabled:hover:text-muted-foreground transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

export default Index;
