import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { Logo } from "./Logo";

interface HeaderProps {
  onShopClick?: () => void;
}

export function Header({ onShopClick }: HeaderProps = {}) {
  const items = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";

  const goSection = (id: string) => (e: React.MouseEvent) => {
    setMobileOpen(false);
    if (!onHome) {
      e.preventDefault();
      navigate(`/#${id}`);
      return;
    }
    e.preventDefault();
    if (id === "products" && onShopClick) {
      onShopClick();
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShop = (e: React.MouseEvent) => {
    setMobileOpen(false);
    if (onHome) {
      e.preventDefault();
      if (onShopClick) onShopClick();
      else document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    } else {
      e.preventDefault();
      navigate("/#products");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/75 border-b border-border/60">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <Logo />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="/#products" onClick={handleShop} className="hover:text-foreground transition-colors">Shop</a>
            <a href="/#browse" onClick={goSection("browse")} className="hover:text-foreground transition-colors">Categories</a>
            <a href="/#insights" onClick={goSection("insights")} className="hover:text-foreground transition-colors">Blog</a>
            <a href="/#comparisons" onClick={goSection("comparisons")} className="hover:text-foreground transition-colors">Compare</a>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          </nav>

          <div className="flex items-center gap-1">
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
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl animate-fade-in">
            <nav className="container mx-auto px-4 sm:px-6 py-3 flex flex-col">
              <a
                href="/#products"
                onClick={handleShop}
                className="py-3 px-2 text-sm font-semibold text-foreground hover:text-accent transition-colors border-b border-border/40"
              >
                Shop
              </a>
              <a
                href="/#browse"
                onClick={goSection("browse")}
                className="py-3 px-2 text-sm font-semibold text-foreground hover:text-accent transition-colors border-b border-border/40"
              >
                Categories
              </a>
              <a
                href="/#insights"
                onClick={goSection("insights")}
                className="py-3 px-2 text-sm font-semibold text-foreground hover:text-accent transition-colors border-b border-border/40"
              >
                Blog
              </a>
              <a
                href="/#comparisons"
                onClick={goSection("comparisons")}
                className="py-3 px-2 text-sm font-semibold text-foreground hover:text-accent transition-colors border-b border-border/40"
              >
                Compare
              </a>
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
        )}
      </header>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
