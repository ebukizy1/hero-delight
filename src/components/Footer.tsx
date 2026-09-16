import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Shield, MessageCircle, Instagram, Twitter, Facebook } from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import { categoryToSlug } from "@/lib/categorySlug";
import { buildWhatsAppLink } from "@/lib/cart";
import { Logo } from "./Logo";

const FOOTER_WHATSAPP_LINK = buildWhatsAppLink(
  "Hello! I'd like to speak to someone at Emax Solar Store.",
);

export function Footer() {
  return (
    <footer className="bg-secondary/40 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo size="lg" />
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Smart Power. Reliable Future. Premium solar street lights, power stations and security cameras — delivered nationwide.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <SocialLink href="#" label="Instagram"><Instagram className="w-4 h-4" /></SocialLink>
              <SocialLink href="#" label="Twitter"><Twitter className="w-4 h-4" /></SocialLink>
              <SocialLink href="#" label="Facebook"><Facebook className="w-4 h-4" /></SocialLink>
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-3">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-foreground">Shop</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link to={`/category/${categoryToSlug(c)}`} className="hover:text-foreground transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="lg:col-span-2">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-foreground">Help</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/insights" className="hover:text-foreground transition-colors">Solar Insights</Link></li>
              <li><Link to="/about" className="hover:text-foreground transition-colors">About us</Link></li>
              <li><a href={FOOTER_WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">WhatsApp support</a></li>
              <li><Link to="/admin/login" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"><Shield className="w-3 h-3" /> Admin</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-foreground">Reach us</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </span>
                  Shop D442, Ojo Alaba International Market, Lagos
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <a href="tel:+2348037477275" className="hover:text-foreground transition-colors">0803 747 7275</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <a href="mailto:electricalemax@gmail.com" className="hover:text-foreground transition-colors">electricalemax@gmail.com</a>
                </li>
              </ul>
              <a
                href={FOOTER_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-success text-success-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Emax Solar Store. Smart Power. Reliable Future.</p>
          <p>Pay on delivery · 1-year warranty · Nationwide delivery</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground text-muted-foreground flex items-center justify-center transition-colors"
    >
      {children}
    </a>
  );
}
