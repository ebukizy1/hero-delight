import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Lightbulb, BatteryCharging, Zap, Fan, Camera, Sun, FlashlightIcon, LightbulbIcon } from "lucide-react";
import { CATEGORIES, formatNaira, type Product } from "@/lib/products";
import { categoryToSlug } from "@/lib/categorySlug";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Solar Streetlight": Lightbulb,
  "Solar Floodlight": FlashlightIcon,
  "Solar LED Light": LightbulbIcon,
  "Solar Power Station": BatteryCharging,
  "Solar Inverter": Zap,
  "Solar Fan": Fan,
  "Solar Camera": Camera,
};

interface Props {
  products: Product[];
}

export function Categories({ products }: Props) {
  const stats = useMemo(() => {
    const map = new Map<string, { count: number; from: number }>();
    for (const p of products) {
      const entry = map.get(p.category);
      if (!entry) map.set(p.category, { count: 1, from: p.price });
      else map.set(p.category, { count: entry.count + 1, from: Math.min(entry.from, p.price) });
    }
    return map;
  }, [products]);

  const totalCount = products.length;

  return (
    <section id="browse" className="py-8 sm:py-10 scroll-mt-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">Shop by category</h2>
            <p className="text-muted-foreground text-sm mt-1">Tap a category to see its products.</p>
          </div>
          {totalCount > 0 && (
            <span className="hidden sm:inline text-sm text-muted-foreground shrink-0">
              {totalCount} product{totalCount !== 1 ? "s" : ""} in stock
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-4">
          {CATEGORIES.map((c, i) => {
            const Icon = CATEGORY_ICONS[c] ?? Sun;
            const stat = stats.get(c);
            return (
              <Link
                key={c}
                to={`/category/${categoryToSlug(c)}`}
                style={{ animationDelay: `${i * 60}ms` }}
                className="group flex flex-col items-center text-center md:items-start md:text-left gap-2 sm:gap-2.5 rounded-2xl bg-card border border-border p-2.5 sm:p-4 hover:border-accent/50 hover:shadow-soft transition-all duration-300 animate-fade-up"
              >
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-secondary flex items-center justify-center text-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0 w-full">
                  <p className="font-semibold text-xs sm:text-sm leading-tight truncate">{c.replace("Solar ", "")}</p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 leading-tight truncate hidden md:block">
                    {stat ? (
                      <>
                        {stat.count} item{stat.count !== 1 ? "s" : ""} · from {formatNaira(stat.from)}
                      </>
                    ) : (
                      "Coming soon"
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
