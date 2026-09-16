import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { discountPercent, type Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

interface Props {
  products: Product[];
  loading: boolean;
}

function nextSundayEndOfDay(): Date {
  const now = new Date();
  const daysUntilSunday = now.getDay() === 0 ? 0 : 7 - now.getDay();
  const target = new Date(now);
  target.setDate(now.getDate() + daysUntilSunday);
  target.setHours(23, 59, 59, 999);
  return target;
}

function useCountdown(target: Date) {
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, target.getTime() - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemainingMs(Math.max(0, target.getTime() - Date.now()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
}

export function DealsSection({ products, loading }: Props) {
  const deadline = useMemo(() => nextSundayEndOfDay(), []);
  const countdown = useCountdown(deadline);

  const deals = useMemo(
    () =>
      [...products]
        .filter((p) => p.featured)
        .sort((a, b) => discountPercent(b.price, b.bonusPrice) - discountPercent(a.price, a.bonusPrice)),
    [products],
  );

  if (!loading && deals.length === 0) return null;

  return (
    <section id="deals" className="py-10 lg:py-14 scroll-mt-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">This week's deals</h2>
            <p className="text-muted-foreground text-sm mt-1">Prices held until Sunday</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-accent/10 text-accent-strong font-display font-bold text-sm tracking-wide">
              <Clock className="w-3.5 h-3.5" /> {countdown}
            </span>
            <a href="#browse" className="hidden sm:inline text-sm font-semibold text-foreground hover:text-accent transition-colors">
              See all
            </a>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-3 sm:gap-4 overflow-hidden -mx-4 px-4 sm:-mx-6 sm:px-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[42vw] sm:w-56 lg:w-64 shrink-0 aspect-[3/4] rounded-2xl bg-secondary/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            className="-mx-4 px-4 sm:-mx-6 sm:px-6 overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
            }}
          >
            <div
              className="flex gap-3 sm:gap-4 w-max animate-marquee hover:[animation-play-state:paused]"
              style={{ animationDuration: `${Math.max(18, deals.length * 7)}s` }}
            >
              {[...deals, ...deals].map((p, i) => (
                <div key={`${p.id}-${i}`} className="w-[42vw] sm:w-56 lg:w-64 shrink-0 h-full">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
