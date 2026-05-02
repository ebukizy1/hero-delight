import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Zap, Headset, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchProducts, type Product, formatNaira, discountPercent } from "@/lib/products";

import streetlightImg from "@/assets/products/streetlight.jpg";
import inverterImg from "@/assets/products/inverter.jpg";
import powerStationImg from "@/assets/products/power-station.jpg";
import cameraImg from "@/assets/products/camera.jpg";

interface HeroProps {
  onShopClick?: () => void;
}

const DUMMY: Product[] = [
  { id: "d1", name: "Solar Streetlight 300W", price: 65000, bonusPrice: 80000, category: "Solar Streetlight", image: streetlightImg, description: "All-in-one solar streetlight", featured: true, specifications: [] },
  { id: "d2", name: "Hybrid Solar Inverter", price: 240000, bonusPrice: 295000, category: "Solar Inverter", image: inverterImg, description: "Reliable hybrid inverter", featured: true, specifications: [] },
  { id: "d3", name: "Portable Power Station", price: 185000, bonusPrice: 220000, category: "Solar Power Station", image: powerStationImg, description: "Portable backup power", featured: true, specifications: [] },
  { id: "d4", name: "4G Solar Security Camera", price: 95000, bonusPrice: 120000, category: "Solar Camera", image: cameraImg, description: "Wireless solar camera", featured: true, specifications: [] },
];

const TRUST = [
  { icon: ShieldCheck, label: "1 Year Warranty" },
  { icon: Truck, label: "Nationwide Delivery" },
  { icon: Zap, label: "Reliable Performance" },
  { icon: Headset, label: "Expert Support" },
];

export function Hero({ onShopClick }: HeroProps = {}) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((p) => { if (active) setProducts(p); })
      .catch(() => { if (active) setProducts([]); });
    return () => { active = false; };
  }, []);

  const slides = useMemo(() => {
    const featured = (products ?? []).filter((p) => p.featured);
    if (featured.length > 0) return featured.slice(0, 6);
    return DUMMY;
  }, [products]);
  const isDummy = !products || products.filter((p) => p.featured).length === 0;

  useEffect(() => { setIndex(0); }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [slides.length]);

  const goto = (i: number) => {
    setIndex((i + slides.length) % slides.length);
    if (timer.current) { window.clearInterval(timer.current); timer.current = null; }
  };

  const handleShop = (e: React.MouseEvent) => {
    if (onShopClick) { e.preventDefault(); onShopClick(); }
  };

  const safeIndex = slides.length > 0 ? index % slides.length : 0;
  const current = slides[safeIndex] ?? DUMMY[0];
  if (!current) return null;

  return (
    <section className="relative overflow-hidden bg-[hsl(var(--hero-bg))] text-white">
      {/* Ambient gradient layer */}
      <div aria-hidden className="absolute inset-0 bg-hero-glow" />

      {/* Soft accent glow blobs — single, subtle */}
      <div aria-hidden className="absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full bg-accent/15 blur-[120px] animate-glow-pulse" />
      <div aria-hidden className="absolute -bottom-48 -left-32 w-[30rem] h-[30rem] rounded-full bg-accent/5 blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 pt-12 pb-16 lg:pt-20 lg:pb-24 relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Copy */}
          <div className="lg:col-span-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider border border-accent/20 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Smart Power Solutions
            </span>

            <h1 className="mt-5 font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight animate-fade-up delay-100">
              No More Darkness.{" "}
              <span className="text-gradient-brand">Just Reliable Power.</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-white/65 max-w-xl leading-relaxed animate-fade-up delay-200">
              Shop high-performance solar street lights, power stations, and security cameras built for reliability, efficiency, and long-term savings.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 animate-fade-up delay-300">
              <a
                href="#products"
                onClick={handleShop}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-accent text-accent-foreground font-bold hover:brightness-110 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-glow"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#browse"
                className="inline-flex items-center h-12 px-6 rounded-xl border border-white/15 text-white font-semibold hover:bg-white/5 transition-colors text-sm"
              >
                Browse Products
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-up delay-400">
              {TRUST.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-accent shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-medium text-white/75 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual — clean product showcase card */}
          <div className="lg:col-span-6 relative animate-fade-up delay-200">
            <div className="relative">
              {/* Warm accent halo — blends card into hero */}
              <div aria-hidden className="absolute -inset-8 sm:-inset-12 rounded-[2.5rem] bg-accent/20 blur-[80px]" />
              <div aria-hidden className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-accent/40 via-accent/10 to-transparent blur-md" />

              {/* Clean product card — soft surface that blends with the navy hero */}
              <div className="relative rounded-3xl overflow-hidden bg-[hsl(45_40%_97%)] shadow-2xl ring-1 ring-accent/30">
                {/* Product image area */}
                <Link
                  to={isDummy ? "#products" : `/product/${current.id}`}
                  onClick={isDummy ? handleShop : undefined}
                  className="block relative aspect-[4/3] sm:aspect-[5/4] bg-gradient-to-br from-[hsl(45_50%_96%)] to-[hsl(215_20%_92%)] overflow-hidden"
                >
                  <img
                    key={current.id}
                    src={current.image}
                    alt={current.name}
                    fetchPriority="high"
                    className="absolute inset-0 w-full h-full object-contain p-6 sm:p-10 transition-transform duration-700 ease-out hover:scale-105 animate-fade-in"
                  />

                  {/* Top chips */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-accent text-accent-foreground shadow-md">
                      Featured
                    </span>
                    {discountPercent(current.price, current.bonusPrice) > 0 && (
                      <span className="inline-flex items-center text-[11px] font-extrabold px-2.5 py-1.5 rounded-lg bg-destructive text-destructive-foreground shadow-md">
                        −{discountPercent(current.price, current.bonusPrice)}%
                      </span>
                    )}
                  </div>
                </Link>

                {/* Info bar — clean white footer */}
                <Link
                  to={isDummy ? "#products" : `/product/${current.id}`}
                  onClick={isDummy ? handleShop : undefined}
                  className="block px-4 sm:px-6 py-4 sm:py-5 border-t border-[hsl(45_30%_90%)] group/info bg-[hsl(45_40%_97%)]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    {current.category.replace("Solar ", "")}
                  </p>
                  <h3 className="mt-1 font-display font-bold text-base sm:text-lg leading-tight line-clamp-1 text-slate-900 group-hover/info:text-accent transition-colors">
                    {current.name}
                  </h3>
                  <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
                    <span className="font-display font-extrabold text-lg sm:text-xl text-slate-900">
                      {formatNaira(current.price)}
                    </span>
                    {discountPercent(current.price, current.bonusPrice) > 0 && (
                      <span className="text-xs font-medium text-slate-400 line-through">
                        {formatNaira(current.bonusPrice!)}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Controls */}
                {slides.length > 1 && (
                  <>
                    <button
                      aria-label="Previous"
                      onClick={() => goto(index - 1)}
                      className="absolute left-2 sm:left-3 top-[40%] -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md ring-1 ring-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      aria-label="Next"
                      onClick={() => goto(index + 1)}
                      className="absolute right-2 sm:right-3 top-[40%] -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md ring-1 ring-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Dots */}
              {slides.length > 1 && (
                <div className="mt-5 flex items-center justify-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => goto(i)}
                      className={`h-1.5 rounded-full transition-all ${i === safeIndex ? "w-7 bg-accent" : "w-2 bg-white/20 hover:bg-white/40"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
