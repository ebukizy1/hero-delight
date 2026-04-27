import { useEffect, useState, useRef, useCallback } from "react";
import { Loader2, Sparkles, Lightbulb, BatteryCharging, Zap, Fan, Camera, Sun } from "lucide-react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { About } from "@/components/About";
import { Categories } from "@/components/Categories";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, CATEGORIES, type Category, type Product } from "@/lib/products";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Solar Streetlight": Lightbulb,
  "Solar Power Station": BatteryCharging,
  "Solar Inverter": Zap,
  "Solar Fan": Fan,
  "Solar Camera": Camera,
};

const Index = () => {
  const [selected, setSelected] = useState<Category | "All">("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = selected === "All" ? products : products.filter((p) => p.category === selected);
  const featured = products.slice(0, 8);

  const handleSelectCategory = useCallback((c: Category | "All") => {
    setSelected(c);
    requestAnimationFrame(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onShopClick={() => handleSelectCategory("All")} />
      <Hero onShopClick={() => handleSelectCategory("All")} />

      {/* Category cards */}
      <Categories onSelect={handleSelectCategory} />

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

      {/* Featured */}
      {featured.length > 0 && (
        <section id="products" className="py-10 lg:py-14">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">Featured</h2>
                <p className="text-muted-foreground text-sm mt-1">Our top picks</p>
              </div>
            </div>
            <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 sm:gap-5 pb-4">
                {featured.map((p) => (
                  <div key={p.id} className="min-w-[170px] w-[46vw] sm:w-auto sm:min-w-[240px] sm:max-w-[280px]">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section ref={productsRef} className="pb-16 scroll-mt-32">
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
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

export default Index;
