import { ArrowRight, Sparkles, Truck, Shield, Headset, Sun, BatteryCharging } from "lucide-react";

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
          <div className="lg:col-span-6 relative z-10">
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

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-muted-foreground animate-fade-up delay-400">
              <span className="inline-flex items-center gap-2"><Truck className="w-4 h-4 text-accent" /> Fast delivery</span>
              <span className="inline-flex items-center gap-2"><Shield className="w-4 h-4 text-accent" /> 1-yr warranty</span>
              <span className="inline-flex items-center gap-2"><Headset className="w-4 h-4 text-accent" /> 24/7 support</span>
            </div>
          </div>

          {/* Animated SVG scene: solar streetlight on a clean street, day → night, light turns on */}
          <div className="lg:col-span-6 relative animate-fade-up delay-200">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[2rem] bg-gradient-sun opacity-20 blur-3xl animate-float-slow"
              />
              <div className="relative rounded-3xl overflow-hidden shadow-card border border-border/40 bg-[hsl(var(--secondary))]">
                <StreetlightScene />
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-background/85 backdrop-blur rounded-xl px-3.5 py-2.5 border border-border/60">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  <p className="text-[11px] font-semibold">2,400+ orders delivered across Nigeria</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-card rounded-2xl px-3.5 py-2.5 border border-border shadow-card flex items-center gap-3 animate-float-slow">
                <div className="w-9 h-9 rounded-xl bg-gradient-sun flex items-center justify-center shrink-0">
                  <Sun className="w-4 h-4 text-primary-foreground animate-sun-rotate" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground leading-none">Save up to</p>
                  <p className="font-display font-extrabold text-lg leading-tight">80%</p>
                </div>
              </div>

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

/**
 * Looping animated scene (~10s):
 *  - day sky fades to dusk
 *  - sun travels & sets
 *  - streetlight turns on with a warm glow
 *  - ambient particles drift
 *  - reset and repeat
 */
function StreetlightScene() {
  return (
    <div className="aspect-[4/3] sm:aspect-square w-full relative">
      <svg
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Solar streetlight on a quiet street, turning on at dusk"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.25)">
              <animate attributeName="stop-color"
                values="hsl(42 100% 80% / 0.55);hsl(28 90% 60% / 0.45);hsl(260 60% 25% / 0.65);hsl(230 50% 12% / 0.85);hsl(42 100% 80% / 0.55)"
                dur="10s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="hsl(var(--background))">
              <animate attributeName="stop-color"
                values="hsl(40 33% 98%);hsl(30 35% 88%);hsl(250 30% 30%);hsl(230 40% 15%);hsl(40 33% 98%)"
                dur="10s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(28 18% 30%)" />
            <stop offset="100%" stopColor="hsl(28 18% 18%)" />
          </linearGradient>

          <radialGradient id="lampGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="hsl(45 100% 75%)" stopOpacity="1" />
            <stop offset="60%" stopColor="hsl(40 100% 60%)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(40 100% 60%)" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="hsl(45 100% 70%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(45 100% 70%)" stopOpacity="0" />
          </radialGradient>

          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* Sky */}
        <rect width="600" height="430" fill="url(#sky)" />

        {/* Distant hills */}
        <path d="M0 380 Q150 320 300 360 T600 350 L600 430 L0 430 Z" fill="hsl(28 25% 20% / 0.55)" />
        <path d="M0 410 Q200 360 400 395 T600 390 L600 430 L0 430 Z" fill="hsl(28 25% 14% / 0.7)" />

        {/* Sun (rises, arcs, sets) */}
        <g>
          <circle r="55" fill="url(#sunGlow)">
            <animateMotion dur="10s" repeatCount="indefinite"
              path="M 100 380 Q 300 60 500 380" />
          </circle>
          <circle r="22" fill="hsl(45 100% 65%)">
            <animateMotion dur="10s" repeatCount="indefinite"
              path="M 100 380 Q 300 60 500 380" />
            <animate attributeName="opacity"
              values="0;1;1;1;0" keyTimes="0;0.1;0.5;0.85;1"
              dur="10s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Stars (appear at night) */}
        <g>
          {[
            [80, 70], [150, 110], [240, 60], [330, 130], [430, 80], [510, 140], [180, 180], [380, 50], [470, 200], [120, 220],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.6" fill="hsl(45 100% 90%)">
              <animate attributeName="opacity"
                values="0;0;0.9;0.9;0" keyTimes="0;0.55;0.7;0.85;1"
                dur="10s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
            </circle>
          ))}
        </g>

        {/* Ground / road */}
        <rect y="430" width="600" height="170" fill="url(#ground)" />
        {/* Road dashes */}
        <g stroke="hsl(45 90% 75% / 0.8)" strokeWidth="4" strokeLinecap="round">
          {[40, 140, 240, 340, 440, 540].map((x) => (
            <line key={x} x1={x} y1="510" x2={x + 40} y2="510" />
          ))}
        </g>
        {/* Curb highlight */}
        <rect y="430" width="600" height="2" fill="hsl(40 33% 98% / 0.15)" />

        {/* Lamp glow (turns on at dusk) */}
        <ellipse cx="430" cy="195" rx="170" ry="170" fill="url(#lampGlow)" opacity="0">
          <animate attributeName="opacity"
            values="0;0;0;0.95;0.95;0" keyTimes="0;0.45;0.55;0.65;0.9;1"
            dur="10s" repeatCount="indefinite" />
        </ellipse>

        {/* Streetlight pole */}
        <g>
          {/* base */}
          <rect x="420" y="425" width="20" height="10" rx="2" fill="hsl(28 15% 22%)" />
          {/* pole */}
          <rect x="427" y="200" width="6" height="230" rx="2" fill="hsl(28 12% 28%)" />
          {/* arm */}
          <rect x="395" y="195" width="40" height="5" rx="2" fill="hsl(28 12% 28%)" />

          {/* solar panel on top, slightly tilted */}
          <g transform="translate(395 175) rotate(-12)">
            <rect width="70" height="22" rx="2" fill="hsl(220 45% 18%)" stroke="hsl(28 12% 28%)" strokeWidth="2" />
            {/* panel cells */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={i * 14 + 7} y1="2" x2={i * 14 + 7} y2="20" stroke="hsl(220 45% 38%)" strokeWidth="0.8" />
            ))}
            <line x1="2" y1="11" x2="68" y2="11" stroke="hsl(220 45% 38%)" strokeWidth="0.8" />
            {/* panel sheen */}
            <rect width="70" height="22" rx="2" fill="hsl(45 100% 80% / 0.15)">
              <animate attributeName="opacity"
                values="0.05;0.4;0.05;0.05;0.05" keyTimes="0;0.25;0.5;0.75;1"
                dur="10s" repeatCount="indefinite" />
            </rect>
          </g>

          {/* lamp head */}
          <g>
            <rect x="385" y="190" width="22" height="10" rx="2" fill="hsl(28 12% 22%)" />
            {/* light bulb (glows at night) */}
            <rect x="388" y="196" width="16" height="6" rx="1.5" fill="hsl(45 30% 60%)">
              <animate attributeName="fill"
                values="hsl(45 30% 60%);hsl(45 30% 60%);hsl(45 100% 85%);hsl(45 100% 85%);hsl(45 30% 60%)"
                keyTimes="0;0.55;0.65;0.9;1"
                dur="10s" repeatCount="indefinite" />
            </rect>
          </g>
        </g>

        {/* Drifting particles (dust / fireflies) */}
        <g filter="url(#soft)">
          {[...Array(6)].map((_, i) => (
            <circle key={i} r={2 + (i % 3)} fill="hsl(45 100% 80%)" opacity="0">
              <animate attributeName="opacity"
                values="0;0.7;0" keyTimes="0;0.5;1"
                dur={`${4 + i}s`} begin={`${i * 0.6}s`} repeatCount="indefinite" />
              <animateMotion dur={`${8 + i}s`} repeatCount="indefinite"
                path={`M ${100 + i * 70} 350 q 30 -${40 + i * 10} 60 0 t 60 0`} />
            </circle>
          ))}
        </g>

        {/* Ground light pool under lamp */}
        <ellipse cx="430" cy="500" rx="120" ry="22" fill="hsl(45 100% 70% / 0)">
          <animate attributeName="fill"
            values="hsl(45 100% 70% / 0);hsl(45 100% 70% / 0);hsl(45 100% 70% / 0.55);hsl(45 100% 70% / 0.55);hsl(45 100% 70% / 0)"
            keyTimes="0;0.55;0.7;0.9;1" dur="10s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    </div>
  );
}
