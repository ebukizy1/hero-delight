import { Link } from "react-router-dom";
import { ShieldCheck, Lightbulb, HeartHandshake, ArrowRight } from "lucide-react";

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: "Quality first", body: "Every product is tested before it reaches you." },
  { icon: Lightbulb, title: "Innovation", body: "We curate cutting-edge solar tech for everyday use." },
  { icon: HeartHandshake, title: "Customer focus", body: "Friendly support and honest prices, always." },
];

export function About() {
  return (
    <section id="about" className="py-14 sm:py-16 bg-secondary/40 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 text-foreground text-xs font-bold uppercase tracking-wider border border-accent/40">
              About OnlineSolarStore
            </span>
            <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-[1.1]">
              Smart power, <span className="text-gradient-brand">made reliable</span>.
            </h2>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
              High-performance solar solutions for modern living — built for reliability, efficiency, and long-term savings.
            </p>
            <Link
              to="/about"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors group"
            >
              Learn more about us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-3 sm:gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="group bg-card border border-border/60 rounded-2xl p-4 sm:p-5 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-sun flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 text-primary-foreground" strokeWidth={2.4} />
                </div>
                <h3 className="mt-3 font-display font-bold text-sm sm:text-base">{title}</h3>
                <p className="mt-1 text-xs sm:text-[13px] text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
