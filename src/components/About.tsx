import { ShieldCheck, Lightbulb, HeartHandshake, Lock, Globe, Award } from "lucide-react";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Quality First",
    body: "Every product undergoes rigorous testing to ensure we deliver only the best to our customers.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    body: "We're constantly pushing boundaries with cutting-edge technology and fresh ideas.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Focus",
    body: "Your success is our success. We listen, adapt, and evolve based on your feedback.",
  },
  {
    icon: Lock,
    title: "Trust & Security",
    body: "Your data and privacy are protected with bank-level security measures.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    body: "Serving customers worldwide with localized experiences and support.",
  },
  {
    icon: Award,
    title: "Excellence",
    body: "We strive for excellence in everything we do, from products to customer service.",
  },
];

export function About() {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-secondary/40 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-foreground text-xs font-semibold border border-accent/30">
            About SolarHub
          </span>
          <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
            Built on values that <span className="text-gradient-sun">power trust</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
            We're committed to bringing reliable, affordable solar solutions to every home and business across Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group bg-card border border-border/60 rounded-2xl p-5 sm:p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
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
  );
}
