import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, MessageCircle, Shield, Truck, Headset, Loader2, Award, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { fetchProduct, fetchProducts, formatNaira, discountPercent, type Product } from "@/lib/products";
import { categoryToSlug } from "@/lib/categorySlug";
import { cart, buildWhatsAppLink, productShareMessage } from "@/lib/cart";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setCurrentImg(0);
    Promise.all([fetchProduct(id), fetchProducts().catch(() => [])]).then(([p, all]) => {
      setProduct(p);
      setAllProducts(all);
      setLoading(false);
      if (p) document.title = `${p.name} — E-maxsolarstore`;
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
    });
  }, [id]);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 8);
  }, [product, allProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/" className="text-accent underline">Back to shop</Link>
      </div>
    );
  }

  const images = [product.image, product.image2, product.image3].filter(Boolean) as string[];
  const discount = discountPercent(product.price, product.bonusPrice);
  const hasBonus = discount > 0;

  const handleAdd = () => {
    cart.add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const whatsappHref = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    return buildWhatsAppLink(productShareMessage(product, url));
  };

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted shadow-card">
              <img
                src={images[currentImg]}
                alt={product.name}
                className="w-full h-full object-contain bg-white sm:object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {hasBonus && (
                <span className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-destructive text-destructive-foreground shadow-soft">
                  -{discount}% OFF
                </span>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentImg ? "bg-accent w-6" : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`rounded-2xl overflow-hidden border-2 bg-muted transition-all ${
                      i === currentImg ? "border-accent shadow-soft" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      loading="lazy"
                      className="h-20 sm:h-28 w-full object-contain bg-white sm:object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">{product.category}</span>
            <h1 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight">{product.name}</h1>

            <div className="mt-5 flex items-baseline gap-3 flex-wrap">
              <p className="font-display font-extrabold text-3xl sm:text-4xl">{formatNaira(product.price)}</p>
              {hasBonus && (
                <p className="text-lg font-medium text-muted-foreground line-through">
                  {formatNaira(product.bonusPrice!)}
                </p>
              )}
              {hasBonus && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-success/15 text-success">
                  Save {formatNaira(product.bonusPrice! - product.price)}
                </span>
              )}
            </div>

            <p className="mt-5 text-muted-foreground leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {product.description}
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-card p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all text-sm shadow-soft"
              >
                <ShoppingCart className="w-4 h-4" />
                {added ? "Added to Cart" : "Add to Cart"}
              </button>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-4 sm:px-6 rounded-xl bg-whatsapp text-whatsapp-foreground font-semibold hover:opacity-90 transition-opacity text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Order via WhatsApp
              </a>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Fast add-to-cart for checkout, or order directly on WhatsApp if you prefer.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 pt-6 border-t border-border">
              <Badge icon={<Truck className="w-4 h-4" />} title="Free Delivery" sub="Within Lagos" />
              <Badge icon={<Shield className="w-4 h-4" />} title="1-Yr Warranty" sub="Manufacturer" />
              <Badge icon={<Headset className="w-4 h-4" />} title="Fast Support" sub="Via WhatsApp" />
            </div>
          </div>
        </div>

        {product.specifications.length > 0 && (
          <section className="mt-12 lg:mt-16">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-sun flex items-center justify-center">
                <Award className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl">Technical Specifications</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
              {product.specifications.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3"
                >
                  <span className="font-semibold text-sm text-foreground shrink-0">{s.label}:</span>
                  <span className="text-sm text-muted-foreground text-right">{s.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-14 lg:mt-20">
            <div className="flex items-end justify-between mb-5 sm:mb-6 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-sun flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </div>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-tight">
                  Related Products
                </h2>
              </div>
              <Link
                to={`/category/${categoryToSlug(product.category)}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/80 transition-colors whitespace-nowrap"
              >
                View All <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

function Badge({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5">
      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground">{icon}</div>
      <p className="font-semibold text-xs sm:text-sm leading-tight">{title}</p>
      <p className="text-muted-foreground text-[11px] sm:text-xs">{sub}</p>
    </div>
  );
}

export default ProductDetail;
