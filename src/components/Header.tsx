import { Link } from "react-router-dom";
import { ShoppingBag, Sun } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";

interface HeaderProps {
  onShopClick?: () => void;
}

export function Header({ onShopClick }: HeaderProps = {}) {
  const items = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);
  const [open, setOpen] = useState(false);

  const handleShop = (e: React.MouseEvent) => {
    if (onShopClick) {
      e.preventDefault();
      onShopClick();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/75 border-b border-border/60">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-sun shadow-soft">
              <Sun className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight">SolarHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#products" onClick={handleShop} className="hover:text-foreground transition-colors">Shop</a>
            <a href="#browse" className="hover:text-foreground transition-colors">Categories</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
          </nav>

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
      </header>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
