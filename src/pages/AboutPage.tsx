import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lightbulb, HeartHandshake, Sparkles, Sun, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const VALUES = [
  { icon: ShieldCheck, title: "Quality first", body: "Every product is tested before it ships." },
  { icon: Lightbulb, title: "Innovation", body: "Curated, modern solar tech for everyday life." },
  { icon: HeartHandshake, title: "Customer focus", body: "Honest prices and friendly support, always." },
];

const STATS = [
  { n: "2,400+", l: "Orders delivered" },
  { n: "98%", l: "Happy customers" },
  { n: "24/7", l: "WhatsApp support" },
];

const AboutPage = () => {
  useEffect(() => { document.title = "About — SolarHub"; }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-hero-glow border-b border-border/60">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gradient-sun opacity-20 blur-3xl animate-float-slow" aria-hidden />
          <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16 relative">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-foreground text-xs font-semibold border border-accent/30 animate-fade-up">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> About SolarHub
            </span>
            <h1 className="mt-4 font-display font-extrabold text-3xl sm:text-5xl tracking-tight max-w-2xl leading-[1.05] animate-fade-up delay-100">
              Clean energy, <span className="text-gradient-sun">made simple</span>.
            </h1>
            <p className="mt-4 text-base text-muted-foreground max-w-xl leading-relaxed animate-fade-up delay-200">
              Nigeria's modern solar marketplace — quality streetlights, inverters, fans, cameras and power stations, delivered fast.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div key={s.l} className="rounded-2xl bg-card border border-border/60 p-4 sm:p-5 shadow-soft text-center hover:shadow-card transition-shadow">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-gradient-sun">{s.n}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values — 3 only */}
        <section className="container mx-auto px-4 sm:px-6 pb-12">
          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
            {VALUES.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="group bg-card border border-border/60 rounded-2xl p-5 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-sun flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 text-primary-foreground" strokeWidth={2.4} />
                </div>
                <h3 className="mt-3 font-display font-bold text-base">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary/40 border-t border-border py-12">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-sun items-center justify-center shadow-glow animate-float-slow mb-4">
              <Sun className="w-5 h-5 text-primary-foreground animate-sun-rotate" />
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">Ready to power your world?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Browse our full catalogue of trusted solar products.</p>
            <Link to="/#products" className="mt-5 inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-card">
              Shop now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
