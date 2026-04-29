import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Truck, Shield, Headset, Sun, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchProducts, type Product, formatNaira, discountPercent } from "@/lib/products";
import streetlightImg from "@/assets/products/streetlight.jpg";
import inverterImg from "@/assets/products/inverter.jpg";
import powerStationImg from "@/assets/products/power-station.jpg";
import fanImg from "@/assets/products/fan.jpg";
import cameraImg from "@/assets/products/camera.jpg";

interface HeroProps {
  onShopClick?: () => void;
}

const DUMMY: Product[] = [
  { id: "d1", name: "Solar Streetlight 300W", price: 65000, bonusPrice: 80000, category: "Solar Streetlight", image: streetlightImg, description: "All-in-one solar streetlight", featured: true, specifications: [] },
  { id: "d2", name: "Hybrid Solar Inverter", price: 240000, bonusPrice: 295000, category: "Solar Inverter", image: inverterImg, description: "Reliable hybrid inverter", featured: true, specifications: [] },
  { id: "d3", name: "Portable Power Station", price: 185000, bonusPrice: 220000, category: "Solar Power Station", image: powerStationImg, description: "Portable backup power", featured: true, specifications: [] },
  { id: "d4", name: "Solar Rechargeable Fan", price: 32000, bonusPrice: 42000, category: "Solar Fan", image: fanImg, description: "Quiet rechargeable fan", featured: true, specifications: [] },
  { id: "d5", name: "4G Solar Security Camera", price: 95000, bonusPrice: 120000, category: "Solar Camera", image: cameraImg, description: "Wireless solar camera", featured: true, specifications: [] },
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

  useEffect(() => {
    if (slides.length <= 1) return;
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [slides.length]);

  const goto = (i: number) => {
    setIndex((i + slides.length) % slides.length);
    if (timer.current) { window.clearInterval(timer.current); timer.current = null; }
  };

  const handleShop = (e: React.MouseEvent) => {
    if (onShopClick) { e.preventDefault(); onShopClick(); }
  };

  const current = slides[index];
  const discount = discountPercent(current.price, current.bonusPrice);

  return (
    <section className="relative overflow-hidden bg-hero-glow">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, hsl(var(--accent) / 0.18), transparent 45%), radial-gradient(circle at 85% 80%, hsl(var(--primary) / 0.12), transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 pt-10 pb-14 lg:pt-16 lg:pb-24 relative">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-foreground text-xs font-semibold border border-accent/30 animate-fade-up">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Nigeria's Solar Marketplace
            </span>

            <h1 className="mt-5 font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.75rem] leading-[1.05] tracking-tight animate-fade-up delay-100">
              Power your world{" "}
              <span className="text-gradient-sun">with the sun.</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed animate-fade-up delay-200">
              Premium solar streetlights, inverters, fans, cameras and more — delivered fast across Nigeria.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 animate-fade-up delay-300">
              <a
                href="#products"
                onClick={handleShop}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-card"
              >
                Shop now <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#browse"
                className="inline-flex items-center h-12 px-6 rounded-xl border border-border bg-background/60 backdrop-blur font-semibold hover:bg-secondary transition-colors text-sm"
              >
                Browse categories
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-muted-foreground animate-fade-up delay-400">
              <span className="inline-flex items-center gap-2"><Truck className="w-4 h-4 text-accent" /> Fast delivery</span>
              <span className="inline-flex items-center gap-2"><Shield className="w-4 h-4 text-accent" /> 1-yr warranty</span>
              <span className="inline-flex items-center gap-2"><Headset className="w-4 h-4 text-accent" /> 24/7 support</span>
            </div>
          </div>

          {/* Carousel */}
          <div className="lg:col-span-6 relative animate-fade-up delay-200">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[2rem] bg-gradient-sun opacity-20 blur-3xl animate-float-slow"
              />

              <div className="relative rounded-3xl overflow-hidden shadow-card border border-border/40 aspect-[4/3] sm:aspect-square lg:aspect-[5/4] bg-card">
                {/* Slides */}
                {slides.map((p, i) => (
                  <div
                    key={p.id}
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      opacity: i === index ? 1 : 0,
                      transform: i === index ? "scale(1)" : "scale(1.04)",
                      pointerEvents: i === index ? "auto" : "none",
                    }}
                  >
                    <Link to={isDummy ? "#products" : `/product/${p.id}`} onClick={isDummy ? handleShop : undefined} className="block w-full h-full">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading={i === 0 ? "eager" : "lazy"}
                        fetchPriority={i === 0 ? "high" : "auto"}
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ animation: i === index ? "kenburns 8s ease-out both" : undefined }}
                      />
                      {/* Bottom-blend gradient using brand tones */}
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, hsl(220 40% 8% / 0.92) 0%, hsl(220 40% 8% / 0.55) 35%, hsl(220 40% 8% / 0.05) 65%, transparent 85%)",
                        }}
                      />

                      {/* Discount badge */}
                      {discountPercent(p.price, p.bonusPrice) > 0 && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-xl bg-gradient-to-r from-destructive to-[hsl(var(--sun-to))] text-white shadow-glow">
                          −{discountPercent(p.price, p.bonusPrice)}%
                        </span>
                      )}

                      {/* Category chip */}
                      <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 text-white backdrop-blur-md border border-white/20">
                        {p.category.replace("Solar ", "")}
                      </span>

                      {/* Info */}
                      <div className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-6 sm:bottom-6 text-white">
                        <h3 className="font-display font-bold text-lg sm:text-xl leading-tight line-clamp-2 drop-shadow-sm">
                          {p.name}
                        </h3>
                        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                          <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
                            {formatNaira(p.price)}
                          </span>
                          {discountPercent(p.price, p.bonusPrice) > 0 && (
                            <span className="text-sm font-medium text-white/70 line-through decoration-white/50">
                              {formatNaira(p.bonusPrice!)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}

                {/* Controls */}
                {slides.length > 1 && (
                  <>
                    <button
                      aria-label="Previous"
                      onClick={() => goto(index - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/85 backdrop-blur border border-border/60 flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      aria-label="Next"
                      onClick={() => goto(index + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/85 backdrop-blur border border-border/60 flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Dots */}
              {slides.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => goto(i)}
                      className={`h-1.5 rounded-full transition-all ${i === index ? "w-7 bg-foreground" : "w-2 bg-foreground/25 hover:bg-foreground/50"}`}
                    />
                  ))}
                </div>
              )}

              {/* Floating save chip */}
              {discount > 0 && (
                <div className="absolute -bottom-3 -left-3 sm:-left-5 bg-card rounded-2xl px-3.5 py-2.5 border border-border shadow-card flex items-center gap-3 animate-float-slow">
                  <div className="w-9 h-9 rounded-xl bg-gradient-sun flex items-center justify-center shrink-0">
                    <Sun className="w-4 h-4 text-primary-foreground animate-sun-rotate" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground leading-none">You save</p>
                    <p className="font-display font-extrabold text-base leading-tight">
                      {formatNaira((current.bonusPrice ?? current.price) - current.price)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes kenburns {
          from { transform: scale(1.08) translate3d(0,0,0); }
          to   { transform: scale(1) translate3d(0,0,0); }
        }
      `}</style>
    </section>
  );
}
