import { ArrowRight, Sparkles, Truck, Shield, Headset, Sun, BatteryCharging, Star } from "lucide-react";
import heroImage from "@/assets/hero.jpg";

interface HeroProps {
  onShopClick?: () => void;
}

export function Hero({ onShopClick }: HeroProps = {}) {
  const handleShop = (e: React.MouseEvent) => {
    if (onShopClick) {
      e.preventDefault();
      onShopClick();
    }
  };

  return (
    <section className="relative overflow-hidden bg-hero-glow">
      {/* Soft gradient mesh background */}
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
              Premium solar streetlights, inverters, fans, cameras and more — delivered fast across Nigeria. Order in seconds via WhatsApp.
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

          {/* Visual */}
          <div className="lg:col-span-6 relative animate-fade-up delay-200">
            <div className="relative">
              {/* Glow */}
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[2rem] bg-gradient-sun opacity-25 blur-3xl animate-float-slow"
              />

              {/* Main image card */}
              <div className="relative rounded-3xl overflow-hidden shadow-card border border-border/40 aspect-[4/3] sm:aspect-square lg:aspect-[5/4]">
                <img
                  src={heroImage}
                  alt="Solar panels at golden hour — clean, renewable energy"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[2000ms] ease-out"
                />
                {/* Subtle gradient overlay for text legibility */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, hsl(var(--background) / 0.55) 0%, transparent 45%)",
                  }}
                />

                {/* Live status chip */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-background/85 backdrop-blur rounded-full px-3 py-1.5 border border-border/60">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  <p className="text-[11px] font-semibold">In stock now</p>
                </div>

                {/* Bottom delivered chip */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5 bg-background/85 backdrop-blur rounded-xl px-3.5 py-2.5 border border-border/60">
                  <div className="flex -space-x-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-sun border-2 border-background flex items-center justify-center"
                      >
                        <Star className="w-3 h-3 text-primary-foreground fill-primary-foreground" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] font-semibold leading-tight">
                    2,400+ orders delivered <span className="text-muted-foreground font-medium">across Nigeria</span>
                  </p>
                </div>
              </div>

              {/* Floating stat - bottom-left */}
              <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-card rounded-2xl px-3.5 py-2.5 border border-border shadow-card flex items-center gap-3 animate-float-slow">
                <div className="w-9 h-9 rounded-xl bg-gradient-sun flex items-center justify-center shrink-0">
                  <Sun className="w-4 h-4 text-primary-foreground animate-sun-rotate" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground leading-none">Save up to</p>
                  <p className="font-display font-extrabold text-lg leading-tight">80%</p>
                </div>
              </div>

              {/* Floating stat - top-right */}
              <div
                className="hidden sm:flex absolute -top-3 -right-3 bg-card rounded-2xl px-3.5 py-2.5 border border-border shadow-card items-center gap-2.5 animate-float-slow"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <BatteryCharging className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground leading-none">Reliable</p>
                  <p className="font-display font-bold text-sm leading-tight">Clean power</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
