import { useMemo } from "react";
import { Link } from "react-router-dom";
import { type Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

interface Props {
  products: Product[];
  loading: boolean;
}

const DESKTOP_COUNT = 5;
const MOBILE_COUNT = 4;

export function BestSellers({ products, loading }: Props) {
  const items = useMemo(() => {
    const featured = products.filter((p) => p.featured);
    const fillers = products.filter((p) => !p.featured);
    return [...featured, ...fillers].slice(0, DESKTOP_COUNT);
  }, [products]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-8 lg:py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">All products</h2>
            <p className="text-muted-foreground text-sm mt-1">Best sellers this month</p>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-foreground hover:text-accent transition-colors shrink-0">
            See all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: DESKTOP_COUNT }).map((_, i) => (
              <div
                key={i}
                className={`aspect-[3/4] rounded-2xl bg-secondary/60 animate-pulse ${i >= MOBILE_COUNT ? "hidden sm:block" : ""}`}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {items.map((p, i) => (
              <div key={p.id} className={`h-full ${i >= MOBILE_COUNT ? "hidden sm:block" : ""}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
