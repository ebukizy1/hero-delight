import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid3x3, Newspaper, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { CartDrawer } from "./CartDrawer";

export function MobileTabBar() {
  const items = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const onHome = location.pathname === "/";
  const onShop = location.pathname === "/shop";
  const onInsights = location.pathname.startsWith("/insights");

  return (
    <>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4 h-14">
          <Link to="/" className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${onHome ? "text-accent" : "text-muted-foreground"}`}>
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link
            to="/shop"
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${onShop ? "text-accent" : "text-muted-foreground"}`}
          >
            <Grid3x3 className="w-5 h-5" />
            Shop
          </Link>
          <Link
            to="/insights"
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${onInsights ? "text-accent" : "text-muted-foreground"}`}
          >
            <Newspaper className="w-5 h-5" />
            Insights
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground"
          >
            <span className="relative">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </span>
            Cart
          </button>
        </div>
      </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
