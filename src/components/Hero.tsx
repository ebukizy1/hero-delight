import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Home, Store, Lightbulb, Fan, Camera } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/cart";
import { OptimizedImage } from "@/components/OptimizedImage";

import heroNightImg from "@/assets/hero-night.jpg";

const ENQUIRY_WHATSAPP_LINK = buildWhatsAppLink(
  "Hello! I'd like to speak to an expert about solar products at Emax Solar Store.",
);

const NEEDS = [
  { icon: Home, label: "My whole house", sub: "Inverter + battery bank", slug: "inverter" },
  { icon: Store, label: "A shop or office", sub: "Daytime load, long hours", slug: "power-station" },
  { icon: Lightbulb, label: "Street or compound lighting", sub: "All-in-one streetlights", slug: "streetlight" },
  { icon: Fan, label: "Just fans and lights", sub: "Small, portable kit", slug: "led-light" },
  { icon: Camera, label: "Security cameras", sub: "4G, no power needed", slug: "camera" },
];

export function Hero() {
  const goSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Copy */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider border border-accent/20 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Nigeria's Trusted Solar Store
            </span>

            <h1 className="mt-5 font-display font-extrabold text-3xl sm:text-5xl lg:text-[3.25rem] leading-[1.05] tracking-tight text-foreground animate-fade-up delay-100">
              No More Darkness.
              <br />
              <span className="text-accent">Just Reliable Power.</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed animate-fade-up delay-200">
              Shop high-performance solar street lights, inverters, power stations, and security cameras — built for reliability, backed by a 1-year warranty, and delivered nationwide.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 animate-fade-up delay-300">
              <a
                href="#deals"
                onClick={goSection("deals")}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-accent-strong text-white font-bold hover:brightness-110 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-glow w-full sm:w-auto"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-3">
                <a
                  href="#browse"
                  onClick={goSection("browse")}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center h-12 px-6 rounded-xl border border-foreground/20 text-foreground font-semibold hover:bg-secondary transition-colors text-sm"
                >
                  Browse Products
                </a>
                <a
                  href={ENQUIRY_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl border border-success text-success hover:text-success/80 font-semibold transition-colors text-sm shrink-0"
                >
                  <MessageCircle className="w-4 h-4" /> Chat<span className="hidden sm:inline">&nbsp;with an expert</span>
                </a>
              </div>
            </div>

            <div className="hidden sm:block mt-9 pt-6 border-t border-border animate-fade-up delay-400">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Or tell us what you're powering — we shortlist the kit
              </span>
              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {NEEDS.map(({ icon: Icon, label, sub, slug }) => (
                  <Link
                    key={label}
                    to={`/category/${slug}`}
                    className="group flex items-center gap-2.5 rounded-xl border border-border bg-card p-3 hover:border-accent/50 hover:shadow-soft transition-all"
                  >
                    <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-accent shrink-0 group-hover:bg-accent/10 transition-colors">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold leading-tight truncate">{label}</span>
                      <span className="block text-[11px] text-muted-foreground leading-tight truncate">{sub}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Visual — installed-product lifestyle shot */}
          <div className="hidden sm:block lg:col-span-6 animate-fade-up delay-200">
            <div className="relative rounded-3xl overflow-hidden shadow-card aspect-[4/3] sm:aspect-[16/11]">
              <OptimizedImage
                src={heroNightImg}
                alt="Installed solar street lighting at night"
                width={900}
                height={650}
                priority
                sizes="(min-width: 1024px) 42vw, 92vw"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent p-5 sm:p-6">
                <p className="text-white font-display font-bold text-base sm:text-lg leading-tight">
                  Powering 2,400+ homes and shops across Nigeria
                </p>
                <p className="mt-1 text-white/70 text-xs sm:text-sm">
                  Lagos · Abuja · Port Harcourt · Ibadan · Kano
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
