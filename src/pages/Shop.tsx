import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/pages/Index";
import { fetchProducts, CATEGORIES, type Category, type Product } from "@/lib/products";
import { Seo } from "@/components/Seo";

const PAGE_SIZE = 12;

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Category | "All">("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPage(1); }, [selected]);

  const filtered = useMemo(
    () => (selected === "All" ? products : products.filter((p) => p.category === selected)),
    [selected, products],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Seo
        title="Shop All Products — Emax Solar Store"
        description="Browse every solar street light, inverter, power station, fan and camera in stock at Emax Solar Store. 1-year warranty, nationwide delivery."
        path="/shop"
      />
      <TopBar />
      <Header />

      <div className="container mx-auto px-4 sm:px-6 pt-5 sm:pt-6">
        <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground font-medium">Shop</span>
        </nav>
        <h1 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl tracking-tight">All products</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`} · free delivery nationwide
        </p>

        <div className="mt-5 flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          <CategoryPill active={selected === "All"} onClick={() => setSelected("All")}>All</CategoryPill>
          {CATEGORIES.map((c) => (
            <CategoryPill key={c} active={selected === c} onClick={() => setSelected(c)}>
              {c.replace("Solar ", "")}
            </CategoryPill>
          ))}
        </div>
      </div>

      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading products…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-sm">No products in this category yet.</p>
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
      </section>

      <Footer />
      <MobileTabBar />
    </div>
  );
};

function CategoryPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center h-9 px-4 rounded-full text-sm font-semibold transition-colors ${
        active ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}

export default Shop;
