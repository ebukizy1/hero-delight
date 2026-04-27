import { X, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { cart, useCart, buildWhatsAppLink, cartOrderMessage } from "@/lib/cart";
import { formatNaira } from "@/lib/products";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const items = useCart();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] bg-background flex flex-col transition-transform duration-300 shadow-card ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
          <h2 className="font-display font-bold text-lg">Your Cart</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
              <div className="text-5xl">🛒</div>
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm">Add some solar products to get started</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-muted shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-2">{item.name}</p>
                    <p className="text-sm font-bold mt-0.5">{formatNaira(item.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => cart.setQty(item.id, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-secondary rounded-l-lg"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                        <button
                          onClick={() => cart.setQty(item.id, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-secondary rounded-r-lg"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => cart.remove(item.id)}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Total</span>
              <span className="font-display font-extrabold text-xl">{formatNaira(total)}</span>
            </div>
            <a
              href={buildWhatsAppLink(cartOrderMessage(items))}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-whatsapp text-whatsapp-foreground font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Checkout via WhatsApp
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
