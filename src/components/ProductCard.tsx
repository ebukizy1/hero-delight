import { Link } from "react-router-dom";
import { ShoppingCart, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatNaira, discountPercent } from "@/lib/products";
import { cart, buildWhatsAppLink, productShareMessage } from "@/lib/cart";
import { useState } from "react";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const discount = discountPercent(product.price, product.bonusPrice);
  const hasBonus = discount > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    cart.add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const whatsappHref = () => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/product/${product.id}`
      : `/product/${product.id}`;
    return buildWhatsAppLink(productShareMessage(product, url));
  };

  return (
    <div className="group flex flex-col rounded-2xl bg-card overflow-hidden border border-border/60 hover:-translate-y-1 hover:shadow-card transition-all duration-300 shadow-soft">
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-muted block">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
            <span className="text-3xl">☀️</span>
          </div>
        )}
        <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-background/90 backdrop-blur text-foreground border border-border/50">
          {product.category.replace("Solar ", "")}
        </span>
        {hasBonus && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-destructive text-destructive-foreground shadow-lg ring-2 ring-background/80 animate-fade-up">
            −{discount}%
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-2.5">
        <Link to={`/product/${product.id}`} className="flex-1 min-w-0 block">
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <p className="font-display font-extrabold text-lg sm:text-xl text-foreground leading-none tracking-tight">
              {formatNaira(product.price)}
            </p>
            {hasBonus && (
              <span className="text-sm font-semibold text-muted-foreground line-through decoration-destructive/70 leading-none">
                {formatNaira(product.bonusPrice!)}
              </span>
            )}
          </div>
          {hasBonus && (
            <span className="mt-1.5 inline-flex w-fit items-center text-[10px] font-bold text-success bg-success/15 px-2 py-1 rounded-md leading-none whitespace-nowrap">
              Save {formatNaira(product.bonusPrice! - product.price)} ({discount}% off)
            </span>
          )}
        </Link>

        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex-1 inline-flex items-center justify-center gap-1 h-9 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 active:scale-[0.97] transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {added ? "Added!" : "Add"}
          </button>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Order via WhatsApp"
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-whatsapp text-whatsapp-foreground hover:opacity-90 active:scale-[0.97] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
