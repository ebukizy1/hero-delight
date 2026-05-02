import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Loader2, Sparkles, Lightbulb, BatteryCharging, Zap, Fan, Camera, Sun, ChevronLeft, ChevronRight, FlashlightIcon, LightbulbIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { About } from "@/components/About";
import { Categories } from "@/components/Categories";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, CATEGORIES, type Category, type Product } from "@/lib/products";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Solar Streetlight": Lightbulb,
  "Solar Floodlight": FlashlightIcon,
  "Solar LED Light": LightbulbIcon,
  "Solar Power Station": BatteryCharging,
  "Solar Inverter": Zap,
  "Solar Fan": Fan,
  "Solar Camera": Camera,
};

// Distinct color identity per category — helps users spot the right pill at a glance
const CATEGORY_COLORS: Record<string, { idle: string; active: string }> = {
  "All": {
    idle: "bg-background border-foreground/20 text-foreground",
    active: "bg-primary text-primary-foreground border-primary shadow-soft",
  },
  "Solar Streetlight": {
    idle: "bg-amber-50 border-amber-300 text-amber-800",
    active: "bg-amber-500 text-white border-amber-500 shadow-soft",
  },
  "Solar Floodlight": {
    idle: "bg-orange-50 border-orange-300 text-orange-800",
    active: "bg-orange-500 text-white border-orange-500 shadow-soft",
  },
  "Solar LED Light": {
    idle: "bg-yellow-50 border-yellow-300 text-yellow-800",
    active: "bg-yellow-500 text-white border-yellow-500 shadow-soft",
  },
  "Solar Power Station": {
    idle: "bg-emerald-50 border-emerald-300 text-emerald-800",
    active: "bg-emerald-600 text-white border-emerald-600 shadow-soft",
  },
  "Solar Inverter": {
    idle: "bg-blue-50 border-blue-300 text-blue-800",
    active: "bg-blue-600 text-white border-blue-600 shadow-soft",
  },
  "Solar Fan": {
    idle: "bg-sky-50 border-sky-300 text-sky-800",
    active: "bg-sky-600 text-white border-sky-600 shadow-soft",
  },
  "Solar Camera": {
    idle: "bg-violet-50 border-violet-300 text-violet-800",
    active: "bg-violet-600 text-white border-violet-600 shadow-soft",
  },
};

const PAGE_SIZE = 8;

const Index = () => {
  const [selected, setSelected] = useState<Category | "All">("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (selected === "All" ? products : products.filter((p) => p.category === selected)),
    [selected, products],
  );
  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 12), [products]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [selected]);

  const handleSelectCategory = useCallback((c: Category | "All") => {
    setSelected(c);
    requestAnimationFrame(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const goToPage = (p: number) => {
    setPage(p);
    requestAnimationFrame(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onShopClick={() => handleSelectCategory("All")} />
      <Hero onShopClick={() => handleSelectCategory("All")} />

      {/* Category cards — link to dedicated category pages */}
      <Categories />

      {/* Quick filter pills */}
      <section id="categories" className="border-y border-border bg-card/80 backdrop-blur sticky top-16 z-30">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
            <CategoryPill active={selected === "All"} onClick={() => handleSelectCategory("All")} icon={<Sparkles className="w-3.5 h-3.5" />}>
              All
            </CategoryPill>
            {CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICONS[c] ?? Sun;
              return (
                <CategoryPill key={c} active={selected === c} onClick={() => handleSelectCategory(c)} icon={<Icon className="w-3.5 h-3.5" />}>
                  {c.replace("Solar ", "")}
                </CategoryPill>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured — auto-scrolling marquee carousel */}
      {featured.length > 0 && (
        <section className="py-10 lg:py-14 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">Featured</h2>
                <p className="text-muted-foreground text-sm mt-1">Our top picks</p>
              </div>
            </div>
          </div>
          <div
            className="relative group"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
            }}
          >
            <div
              className="flex gap-3 sm:gap-5 w-max animate-marquee group-hover:[animation-play-state:paused] py-2"
              style={{ animationDuration: `${Math.max(25, featured.length * 6)}s` }}
            >
              {[...featured, ...featured].map((p, i) => (
                <div key={`${p.id}-${i}`} className="w-[170px] sm:w-[230px] lg:w-[250px] shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section id="products" ref={productsRef} className="pb-16 scroll-mt-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
                {selected === "All" ? "All Products" : selected}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">{filtered.length} item{filtered.length !== 1 ? "s" : ""}</p>
            </div>
            {selected !== "All" && (
              <button
                onClick={() => handleSelectCategory("All")}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>

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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {pageItems.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <Pagination page={safePage} totalPages={totalPages} onChange={goToPage} />
            </>
          )}
        </div>
      </section>

      <About />
      <Footer />
    </div>
  );
};

function CategoryPill({
  active, onClick, children, icon,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode; icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-sm font-semibold transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-soft"
          : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

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
