import { Lightbulb, BatteryCharging, Zap, Fan, Camera, Sun, ArrowRight } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/products";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Solar Streetlight": Lightbulb,
  "Solar Power Station": BatteryCharging,
  "Solar Inverter": Zap,
  "Solar Fan": Fan,
  "Solar Camera": Camera,
};

interface Props {
  onSelect: (c: Category) => void;
}

export function Categories({ onSelect }: Props) {
  return (
    <section id="browse" className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
              Shop by category
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Find exactly what you need.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c] ?? Sun;
            return (
              <button
                key={c}
                onClick={() => onSelect(c)}
                className="group relative flex flex-col items-start gap-3 rounded-2xl bg-card border border-border/60 p-4 sm:p-5 shadow-soft hover:shadow-card hover:-translate-y-1 hover:border-accent/40 transition-all duration-300 text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-sun flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-sm sm:text-base leading-tight">
                    {c.replace("Solar ", "")}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Solar powered</p>
                </div>
                <ArrowRight className="absolute top-4 right-4 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
