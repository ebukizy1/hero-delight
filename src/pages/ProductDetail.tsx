import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  MessageCircle,
  Minus,
  Plus,
  Shield,
  ShoppingCart,
  Truck,
  Wrench,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { LogoLoader } from "@/components/LogoLoader";
import { fetchProduct, fetchProducts, formatNaira, discountPercent, truncateText, type Product } from "@/lib/products";
import { OptimizedImage } from "@/components/OptimizedImage";
import { categoryToSlug } from "@/lib/categorySlug";
import { cart, buildWhatsAppLink, productShareMessage } from "@/lib/cart";
import { Seo, SITE_URL } from "@/components/Seo";
import { fbTrack, generateEventId } from "@/lib/metaPixel";
import { sendCapiEvent } from "@/lib/metaCapi";

type Tab = "description" | "features" | "specifications";

const DESKTOP_RELATED = 5;
const MOBILE_RELATED = 4;
const DESKTOP_DESCRIPTION_MAX_LENGTH = 220;
const MOBILE_DESCRIPTION_MAX_LENGTH = 200;

type Tint = "accent" | "success" | "primary";

const TINT_CLASSES: Record<Tint, string> = {
  accent: "bg-accent/15 text-accent-strong",
  success: "bg-success/15 text-success",
  primary: "bg-primary/10 text-primary",
};

const TRUST_ITEMS: { icon: typeof Shield; title: string; sub: string; tint: Tint }[] = [
  { icon: Shield, title: "1-year warranty", sub: "faulty units replaced, not repaired", tint: "accent" },
  { icon: Truck, title: "Free delivery", sub: "within Lagos", tint: "success" },
  { icon: Wrench, title: "Installation available", sub: "ask on WhatsApp for a quote", tint: "primary" },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState<Tab>("description");
  const [qty, setQty] = useState(1);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setImgError(false);
    setActiveImage(0);
    setTab("description");
    setQty(1);
    setDescExpanded(false);
    Promise.all([fetchProduct(id), fetchProducts().catch(() => [])]).then(([p, all]) => {
      setProduct(p);
      setAllProducts(all);
      setLoading(false);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
      if (p) {
        const eventId = generateEventId();
        const customData = { content_ids: [p.id], content_name: p.name, content_type: "product", value: p.price, currency: "NGN" };
        fbTrack("ViewContent", customData, eventId);
        sendCapiEvent("ViewContent", eventId, customData);
      }
    });
  }, [id]);

  const relatedAll = useMemo(() => {
    if (!product) return [];
    return allProducts.filter((p) => p.category === product.category && p.id !== product.id);
  }, [product, allProducts]);
  const related = relatedAll.slice(0, DESKTOP_RELATED);

  if (loading) {
    return <LogoLoader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Seo title="Product not found — Emax Solar Store" description="This product could not be found." noindex />
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/shop" className="text-accent underline">Back to shop</Link>
      </div>
    );
  }

  const discount = discountPercent(product.price, product.bonusPrice);
  const hasBonus = discount > 0;
  const savings = hasBonus ? product.bonusPrice! - product.price : 0;

  const handleAdd = (quantity: number) => {
    cart.addQty(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const buyNow = () => {
    cart.addQty(product, qty);
    navigate("/checkout");
  };

  const whatsappHref = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    return buildWhatsAppLink(productShareMessage(product, url));
  };

  const renderThumb = (img: string, i: number) => (
    <button
      key={i}
      onClick={() => { setActiveImage(i); setImgError(false); }}
      className={`aspect-square rounded-xl overflow-hidden bg-muted ring-2 transition-all ${
        i === activeImage ? "ring-accent-strong" : "ring-transparent hover:ring-border"
      }`}
      aria-label={`View image ${i + 1}`}
    >
      <OptimizedImage src={img} alt="" width={120} height={120} sizes="100px" className="w-full h-full object-cover" />
    </button>
  );

  const specsList = product.specifications.length > 0 && (
    <div className="grid sm:grid-cols-2 gap-3">
      {product.specifications.map((s, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-3 rounded-xl bg-secondary/50 border border-border/60 px-4 py-3 text-sm"
        >
          <span className="text-muted-foreground">{s.label}</span>
          <span className="font-bold text-accent-strong text-right">{s.value}</span>
        </div>
      ))}
    </div>
  );

  const runsOnCard = product.runsOn.length > 0 && (
    <div className="rounded-2xl border border-border border-l-4 border-l-accent-strong bg-card p-4 sm:p-5">
      <h3 className="font-display font-bold text-sm sm:text-base">What this actually runs</h3>
      <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2">
        {product.runsOn.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-success shrink-0" /> {item}
          </li>
        ))}
      </ul>
      {product.runsOnNote && (
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{product.runsOnNote}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${product.name} — Emax Solar Store`}
        description={product.description.slice(0, 160)}
        path={`/product/${product.id}`}
        image={product.image}
        type="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.images.length > 0 ? product.images : [product.image],
          category: product.category,
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/product/${product.id}`,
            priceCurrency: "NGN",
            price: product.price,
            availability: "https://schema.org/InStock",
          },
        }}
      />
      <TopBar />
      <div className="hidden lg:block">
        <Header />
      </div>
      <div className="lg:hidden border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-12 flex items-center">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-5 lg:py-10 pb-44 lg:pb-10">
        <nav className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/category/${categoryToSlug(product.category)}`} className="hover:text-foreground transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div className="lg:flex lg:gap-4">
            <div className="hidden lg:flex lg:flex-col gap-3 lg:order-1 lg:w-20 shrink-0">
              {product.images.map((img, i) => renderThumb(img, i))}
            </div>
            <div className="lg:order-2 lg:flex-1 min-w-0">
              <div className="relative aspect-square rounded-2xl lg:rounded-3xl overflow-hidden bg-muted shadow-card">
                {!imgError ? (
                  <OptimizedImage
                    src={product.images[activeImage] ?? product.image}
                    alt={product.name}
                    width={800}
                    height={800}
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                    <span className="text-6xl">☀️</span>
                  </div>
                )}
                {hasBonus && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full bg-accent-strong text-white shadow-soft">
                    −{discount}% · Save {formatNaira(savings)}
                  </span>
                )}
                {product.images.length > 1 && (
                  <span className="lg:hidden absolute bottom-3 right-3 text-xs font-semibold px-2 py-1 rounded-md bg-primary/90 text-primary-foreground">
                    {activeImage + 1} / {product.images.length}
                  </span>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="lg:hidden mt-3">
                  <div className="grid grid-cols-4 gap-2.5">
                    {product.images.map((img, i) => renderThumb(img, i))}
                  </div>
                  <p className="mt-2 text-xs text-center text-muted-foreground">Tap a thumbnail to see that view</p>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="mt-5 lg:mt-0 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">{product.category}</span>
            <h1 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight">{product.name}</h1>

            <div className="mt-4 flex items-baseline gap-3 flex-wrap">
              <p className="font-display font-extrabold text-3xl sm:text-4xl">{formatNaira(product.price)}</p>
              {hasBonus && (
                <p className="text-lg font-medium text-muted-foreground line-through">
                  {formatNaira(product.bonusPrice!)}
                </p>
              )}
              {hasBonus && (
                <span className="text-xs font-bold px-2 py-1 rounded-md bg-accent/10 text-accent">
                  You save {formatNaira(savings)}
                </span>
              )}
            </div>

            {/* Mobile-only: quantity stepper */}
            <div className="lg:hidden mt-4">
              <div className="inline-flex items-center border border-border rounded-xl h-11">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-full flex items-center justify-center hover:bg-secondary rounded-l-xl transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-full flex items-center justify-center hover:bg-secondary rounded-r-xl transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop-only: description, runs-on card, quantity + CTAs, trust list */}
            <div className="hidden lg:block">
              {product.description && (
                <div className="mt-5">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {descExpanded ? product.description : truncateText(product.description, DESKTOP_DESCRIPTION_MAX_LENGTH)}
                  </p>
                  {product.description.length > DESKTOP_DESCRIPTION_MAX_LENGTH && (
                    <button
                      onClick={() => setDescExpanded((v) => !v)}
                      className="mt-1.5 text-sm font-semibold text-accent hover:text-accent-strong transition-colors"
                    >
                      {descExpanded ? "See less" : "See more"}
                    </button>
                  )}
                </div>
              )}

              {runsOnCard && <div className="mt-6">{runsOnCard}</div>}

              <div className="mt-6 flex items-center gap-4">
                <div className="inline-flex items-center border border-border rounded-xl h-12">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center hover:bg-secondary rounded-l-xl transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-semibold text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-full flex items-center justify-center hover:bg-secondary rounded-r-xl transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-success font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" /> In stock · ships in 24 hrs
                </span>
              </div>

              <button
                onClick={() => handleAdd(qty)}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                {added ? "Added to Cart" : "Add to cart"}
              </button>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  onClick={buyNow}
                  className="h-12 rounded-xl border border-border font-semibold text-sm hover:bg-secondary transition-colors"
                >
                  Buy now — pay on delivery
                </button>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-12 rounded-xl border border-success text-success font-semibold hover:bg-success/5 transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
                </a>
              </div>

              <ul className="mt-6 pt-6 border-t border-border space-y-2.5">
                {TRUST_ITEMS.map(({ icon: Icon, title, sub, tint }) => (
                  <li key={title} className="flex items-center gap-3 rounded-xl bg-card border border-border/60 px-3.5 py-3 text-sm">
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${TINT_CLASSES[tint]}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span>
                      <span className="font-semibold text-foreground">{title}</span>{" "}
                      <span className="text-muted-foreground">— {sub}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile-only: tabs */}
            <div className="lg:hidden mt-6">
              <div className="flex items-center gap-6 border-b border-border">
                {(["description", "features", "specifications"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`pb-3 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${
                      tab === t ? "text-foreground border-accent-strong" : "text-muted-foreground border-transparent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="pt-5">
                {tab === "description" && (
                  <>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {descExpanded ? product.description : truncateText(product.description, MOBILE_DESCRIPTION_MAX_LENGTH)}
                    </p>
                    {product.description.length > MOBILE_DESCRIPTION_MAX_LENGTH && (
                      <button
                        onClick={() => setDescExpanded((v) => !v)}
                        className="mt-1.5 text-sm font-semibold text-accent hover:text-accent-strong transition-colors"
                      >
                        {descExpanded ? "See less" : "See more"}
                      </button>
                    )}
                
                  </>
                )}

                {tab === "features" && (
                  <>
                    {product.features.length > 0 ? (
                      <ul className="space-y-2.5">
                        {product.features.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 rounded-xl bg-success/5 border border-success/15 px-3.5 py-2.5 text-sm"
                          >
                            <span className="w-6 h-6 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No feature highlights added yet.</p>
                    )}
                    {runsOnCard && <div className="mt-5">{runsOnCard}</div>}
                  </>
                )}

                {tab === "specifications" && (
                  specsList || <p className="text-sm text-muted-foreground">No specifications added yet.</p>
                )}

                <div className="mt-5 space-y-2.5">
                      {TRUST_ITEMS.map(({ icon: Icon, title, sub, tint }) => (
                        <div key={title} className="flex items-center gap-3 rounded-xl bg-card border border-border/60 px-3.5 py-3">
                          <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${TINT_CLASSES[tint]}`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          <p className="text-sm">
                            <span className="font-semibold">{title}</span>{" "}
                            <span className="text-muted-foreground">— {sub}</span>
                          </p>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {specsList && (
          <section className="hidden lg:block mt-14 lg:mt-16">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl mb-5">Specifications</h2>
            {specsList}
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-14 lg:mt-16">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl">Related products</h2>
              {relatedAll.length > MOBILE_RELATED && (
                <Link
                  to={`/category/${categoryToSlug(product.category)}`}
                  className={`text-sm font-semibold text-foreground hover:text-accent transition-colors shrink-0 ${
                    relatedAll.length > DESKTOP_RELATED ? "" : "lg:hidden"
                  }`}
                >
                  See all
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {related.map((p, i) => (
                <div key={p.id} className={`h-full ${i >= MOBILE_RELATED ? "hidden lg:block" : ""}`}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />

      {/* Sticky mobile action bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.06)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs text-muted-foreground">Pay on delivery</span>
          <span className="font-display font-extrabold text-lg">{formatNaira(product.price)}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleAdd(qty)}
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-semibold active:scale-[0.98] transition-all text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            {added ? "Added!" : "Add to cart"}
          </button>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask on WhatsApp"
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-success text-success active:scale-[0.98] transition-all shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
        <button
          onClick={buyNow}
          className="mt-2 w-full h-12 rounded-xl border border-border font-semibold text-sm hover:bg-secondary active:scale-[0.98] transition-all"
        >
          Buy now — pay on delivery
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
