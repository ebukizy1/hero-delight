import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lightbulb, HeartHandshake, Lock, Globe, Award, Sparkles, Sun } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const VALUES = [
  { icon: ShieldCheck, title: "Quality First", body: "Every product undergoes rigorous testing to ensure we deliver only the best to our customers." },
  { icon: Lightbulb, title: "Innovation", body: "We're constantly pushing boundaries with cutting-edge technology and fresh ideas." },
  { icon: HeartHandshake, title: "Customer Focus", body: "Your success is our success. We listen, adapt, and evolve based on your feedback." },
  { icon: Lock, title: "Trust & Security", body: "Your data and privacy are protected with bank-level security measures." },
  { icon: Globe, title: "Global Reach", body: "Serving customers worldwide with localized experiences and support." },
  { icon: Award, title: "Excellence", body: "We strive for excellence in everything we do, from products to customer service." },
];

const STATS = [
  { n: "2,400+", l: "Orders delivered" },
  { n: "98%", l: "Happy customers" },
  { n: "36", l: "Cities reached" },
  { n: "24/7", l: "Support" },
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
          <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-20 relative">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-foreground text-xs font-semibold border border-accent/30 animate-fade-up">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> About SolarHub
            </span>
            <h1 className="mt-4 font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight max-w-3xl leading-[1.05] animate-fade-up delay-100">
              Powering Nigeria with <span className="text-gradient-sun">clean, reliable energy</span>.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed animate-fade-up delay-200">
              SolarHub is Nigeria's modern solar marketplace. We curate the best streetlights, inverters, fans, cameras and power stations — and deliver them fast, with transparent prices and easy WhatsApp ordering.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {STATS.map((s) => (
              <div key={s.l} className="rounded-2xl bg-card border border-border/60 p-5 sm:p-6 shadow-soft text-center hover:shadow-card transition-shadow">
                <p className="font-display font-extrabold text-2xl sm:text-3xl text-gradient-sun">{s.n}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="container mx-auto px-4 sm:px-6 pb-12 lg:pb-16">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">Our story</h2>
              <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
                We started SolarHub because access to dependable solar power shouldn't be complicated. From everyday families to small businesses, our mission is simple: make clean energy products easy to discover, easy to compare, and easy to buy.
              </p>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
                Today, thousands of customers across Nigeria trust SolarHub for reliable products backed by warranty and friendly support — every single day.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-square rounded-3xl bg-gradient-sun p-1 shadow-card">
                <div className="w-full h-full rounded-[1.4rem] bg-card flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-sun flex items-center justify-center shadow-glow animate-float-slow">
                    <Sun className="w-8 h-8 text-primary-foreground animate-sun-rotate" />
                  </div>
                  <p className="mt-5 font-display font-bold text-xl">Built in Nigeria</p>
                  <p className="mt-2 text-sm text-muted-foreground max-w-xs">For Nigerian homes and businesses — by people who understand the local needs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-secondary/40 border-y border-border py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
                Built on values that <span className="text-gradient-sun">power trust</span>.
              </h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base">The principles that guide every product we list and every order we fulfill.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {VALUES.map(({ icon: Icon, title, body }, i) => (
                <div
                  key={title}
                  className="group bg-card border border-border/60 rounded-2xl p-5 sm:p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-sun flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-primary-foreground" strokeWidth={2.2} />
                  </div>
                  <h3 className="mt-4 font-display font-bold text-lg">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 sm:px-6 py-14 lg:py-20 text-center">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">Ready to power your world?</h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">Browse our full catalogue of trusted solar products.</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-card">
            Shop now
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
