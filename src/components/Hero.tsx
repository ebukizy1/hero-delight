import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Zap, Headset, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchProducts, type Product, formatNaira, discountPercent } from "@/lib/products";
import heroNight from "@/assets/hero-night.jpg";
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

          {/* Visual — featured product carousel, blended with background */}
          <div className="lg:col-span-6 relative animate-fade-up delay-200">
            <div className="relative">
              {/* Soft halo behind the card — blends with hero bg */}
              <div aria-hidden className="absolute -inset-10 rounded-[2.5rem] bg-accent/10 blur-3xl" />

              {/* Main visual — borderless, blended */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-square lg:aspect-[5/4] ring-1 ring-white/5">
                <img
                  src={heroNight}
                  alt="Solar street light illuminating a modern home at night"
                  width={1536}
                  height={1280}
                  fetchPriority="high"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ animation: "kenburns 24s ease-out both infinite alternate" }}
                />
                {/* Edge fade — blends image into hero background on all sides */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 110% 90% at 50% 40%, transparent 30%, hsl(var(--hero-bg) / 0.65) 75%, hsl(var(--hero-bg)) 100%)",
                  }}
                />
                {/* Bottom legibility gradient */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/3"
                  style={{
                    background:
                      "linear-gradient(to top, hsl(var(--hero-bg)) 0%, hsl(var(--hero-bg) / 0.7) 35%, transparent 100%)",
                  }}
                />

                {/* Top chips */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-accent/95 text-accent-foreground backdrop-blur-sm">
                    Featured
                  </span>
                  {discountPercent(current.price, current.bonusPrice) > 0 && (
                    <span className="inline-flex items-center text-[11px] font-extrabold px-2.5 py-1.5 rounded-lg bg-success/95 text-success-foreground backdrop-blur-sm">
                      Save {discountPercent(current.price, current.bonusPrice)}%
                    </span>
                  )}
                </div>

                {/* Product info — sits inside the faded zone */}
                <Link
                  to={isDummy ? "#products" : `/product/${current.id}`}
                  onClick={isDummy ? handleShop : undefined}
                  className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-6 sm:bottom-6 group/info"
                >
                  <div className="flex items-end gap-3">
                    <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/[0.04] shrink-0">
                      <img src={current.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 text-white">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-accent/90">
                        {current.category.replace("Solar ", "")}
                      </p>
                      <h3 className="font-display font-bold text-base sm:text-lg leading-tight line-clamp-1 group-hover/info:text-accent transition-colors">
                        {current.name}
                      </h3>
                      <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                        <span className="font-display font-extrabold text-lg sm:text-xl">
                          {formatNaira(current.price)}
                        </span>
                        {discountPercent(current.price, current.bonusPrice) > 0 && (
                          <span className="text-xs font-medium text-white/45 line-through">
                            {formatNaira(current.bonusPrice!)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Controls — minimal, only on hover-capable area */}
                {slides.length > 1 && (
                  <>
                    <button
                      aria-label="Previous"
                      onClick={() => goto(index - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md ring-1 ring-white/10 text-white flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      aria-label="Next"
                      onClick={() => goto(index + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md ring-1 ring-white/10 text-white flex items-center justify-center transition-colors"
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

      <style>{`
        @keyframes kenburns {
          from { transform: scale(1) translate3d(0,0,0); }
          to   { transform: scale(1.08) translate3d(0,0,0); }
        }
      `}</style>
    </section>
  );
}
