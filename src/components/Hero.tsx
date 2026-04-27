import { ArrowRight, Sparkles, Truck, Shield, Headset, Sun, Zap, BatteryCharging } from "lucide-react";
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
      {/* Subtle grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, #000 50%, transparent 100%)",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 pt-10 pb-14 lg:pt-14 lg:pb-20 relative">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-foreground text-xs font-semibold border border-accent/30 animate-fade-up">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Nigeria's Solar Marketplace
            </span>

            <h1 className="mt-5 font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight animate-fade-up delay-100">
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

            {/* Trust strip */}
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-muted-foreground animate-fade-up delay-400">
              <span className="inline-flex items-center gap-2"><Truck className="w-4 h-4 text-accent" /> Fast delivery</span>
              <span className="inline-flex items-center gap-2"><Shield className="w-4 h-4 text-accent" /> 1-yr warranty</span>
              <span className="inline-flex items-center gap-2"><Headset className="w-4 h-4 text-accent" /> 24/7 support</span>
            </div>
          </div>

          {/* Visual */}
          <div className="lg:col-span-5 relative animate-fade-up delay-200">
            <div className="relative">
              {/* Animated glow halo */}
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[2rem] bg-gradient-sun opacity-20 blur-3xl animate-float-slow"
              />
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-card border border-border/40">
                <img
                  src={heroImage}
                  alt="Solar panels under bright sun"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
                {/* Live ticker */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-background/85 backdrop-blur rounded-xl px-3.5 py-2.5 border border-border/60">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  <p className="text-[11px] font-semibold">2,400+ orders delivered across Nigeria</p>
                </div>
              </div>

              {/* Floating chip — savings */}
              <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-card rounded-2xl px-3.5 py-2.5 border border-border shadow-card flex items-center gap-3 animate-float-slow">
                <div className="w-9 h-9 rounded-xl bg-gradient-sun flex items-center justify-center shrink-0">
                  <Sun className="w-4 h-4 text-primary-foreground animate-sun-rotate" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground leading-none">Save up to</p>
                  <p className="font-display font-extrabold text-lg leading-tight">80%</p>
                </div>
              </div>

              {/* Floating chip — power */}
              <div className="hidden sm:flex absolute -top-3 -right-3 bg-card rounded-2xl px-3.5 py-2.5 border border-border shadow-card items-center gap-2.5 animate-float-slow" style={{ animationDelay: "1.5s" }}>
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
