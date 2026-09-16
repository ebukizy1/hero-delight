import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, LifeBuoy, Grid3x3, Truck } from "lucide-react";
import { useCart, buildWhatsAppLink } from "@/lib/cart";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { Logo } from "./Logo";

const HELP_WHATSAPP_LINK = buildWhatsAppLink(
  "Hello! I need some help with an order on Emax Solar Store.",
);

export function Header() {
  const items = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const onHome = location.pathname === "/";
  const [query, setQuery] = useState(onHome ? searchParams.get("q") ?? "" : "");

  const goSection = (id: string) => (e: React.MouseEvent) => {
    setMobileOpen(false);
    if (!onHome) return; // fall through to the default /#id navigation
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    const term = query.trim();
    navigate(term ? `/?q=${encodeURIComponent(term)}` : "/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center gap-4 sm:gap-8">
          <Logo />

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="flex w-full items-stretch rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-accent/40 overflow-hidden">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search "5KVA inverter", "300W streetlight"…'
                aria-label="Search products"
                className="flex-1 h-11 px-4 text-sm bg-transparent outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline">Search</span>
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center gap-5 ml-auto shrink-0">
            <a
              href={HELP_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <LifeBuoy className="w-4 h-4" /> Help
            </a>
            <button
              onClick={() => setOpen(true)}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-accent text-accent-foreground text-[11px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1 md:hidden ml-auto shrink-0">
            <button
              onClick={() => setOpen(true)}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-accent text-accent-foreground text-[11px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search — always visible below the logo row on small screens */}
        <form onSubmit={handleSearch} className="md:hidden px-4 sm:px-6 pb-3">
          <div className="flex w-full items-stretch rounded-xl border border-border bg-background overflow-hidden">
            <Search className="w-4 h-4 ml-3.5 self-center text-muted-foreground/70 shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search inverters, lights, packs…"
              aria-label="Search products"
              className="flex-1 h-10 px-2.5 text-sm bg-transparent outline-none placeholder:text-muted-foreground/70 min-w-0"
            />
            <button type="submit" className="inline-flex items-center justify-center px-4 bg-primary text-primary-foreground text-sm font-semibold shrink-0">
              Go
            </button>
          </div>
        </form>

        {/* Mobile pill nav */}
        <div className="md:hidden px-4 sm:px-6 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Link
            to="/shop"
            className={`shrink-0 inline-flex items-center h-8 px-3.5 rounded-full text-xs font-semibold transition-colors ${
              location.pathname === "/shop" ? "bg-primary text-primary-foreground" : "border border-border text-foreground"
            }`}
          >
            Shop
          </Link>
          <a href="/#deals" onClick={goSection("deals")} className="shrink-0 inline-flex items-center h-8 px-3.5 rounded-full text-xs font-semibold border border-border text-foreground">
            Deals
          </a>
          <a href="/#browse" onClick={goSection("browse")} className="shrink-0 inline-flex items-center h-8 px-3.5 rounded-full text-xs font-semibold border border-border text-foreground">
            Categories
          </a>
          <Link to="/insights" className="shrink-0 inline-flex items-center h-8 px-3.5 rounded-full text-xs font-semibold border border-border text-foreground">
            Insights
          </Link>
          <Link to="/about" className="shrink-0 inline-flex items-center h-8 px-3.5 rounded-full text-xs font-semibold border border-border text-foreground">
            About
          </Link>
        </div>

        {/* Category / nav row */}
        <div className="hidden md:block border-t border-border bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 h-11 flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a
              href="/#browse"
              onClick={goSection("browse")}
              className="inline-flex items-center gap-1.5 text-foreground font-semibold hover:text-accent transition-colors"
            >
              <Grid3x3 className="w-4 h-4" /> All categories
            </a>
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <a href="/#browse" onClick={goSection("browse")} className="hover:text-foreground transition-colors">Categories</a>
            <Link to="/insights" className="hover:text-foreground transition-colors">Solar Insights</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <a href="/#deals" onClick={goSection("deals")} className="text-accent font-semibold hover:text-accent-strong transition-colors">
              Deals
            </a>
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground/80 shrink-0">
              <Truck className="w-3.5 h-3.5" /> Delivering nationwide
            </span>
          </div>
        </div>

        {/* Mobile dropdown menu — secondary links not already covered by the pill row / bottom tab bar */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background animate-fade-in">
            <nav className="container mx-auto px-4 sm:px-6 py-3 flex flex-col">
              <a
                href={HELP_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-2 text-sm font-semibold text-foreground hover:text-accent transition-colors flex items-center gap-2"
              >
                <LifeBuoy className="w-4 h-4" /> Help &amp; WhatsApp support
              </a>
            </nav>
          </div>
        )}
      </header>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
