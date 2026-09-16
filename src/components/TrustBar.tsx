import { Banknote, ShieldCheck, Truck, MessageCircle } from "lucide-react";

const ITEMS = [
  { icon: Banknote, title: "Pay on delivery", sub: "Cash or transfer when it arrives" },
  { icon: ShieldCheck, title: "1-year warranty", sub: "Replaced, not repaired" },
  { icon: Truck, title: "Free delivery nationwide", sub: "Every order, every state" },
  { icon: MessageCircle, title: "WhatsApp support", sub: "Usually replies in 5 min" },
];

export function TrustBar() {
  return (
    <section className="border-b border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {ITEMS.map(({ icon: Icon, title, sub }, i) => (
            <div
              key={title}
              style={{ animationDelay: `${i * 70}ms` }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 sm:p-4 animate-fade-up"
            >
              <span className="w-10 h-10 rounded-xl bg-primary text-accent-light flex items-center justify-center shrink-0">
                <Icon className="w-[18px] h-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-tight">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug truncate">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
