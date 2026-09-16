import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Newspaper, BookOpen, Scale, Zap, MessageCircle } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { Pagination } from "@/pages/Index";
import { fetchArticles, type Article, type ArticleType } from "@/lib/articles";
import { fetchProducts, formatNaira, type Product } from "@/lib/products";
import { buildWhatsAppLink } from "@/lib/cart";
import { Seo } from "@/components/Seo";
import { OptimizedImage } from "@/components/OptimizedImage";

const PAGE_SIZE = 9;

const TABS: { label: string; value: ArticleType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Buying guides", value: "guide" },
  { label: "Comparisons", value: "comparison" },
];

const SIZE_SYSTEM_WHATSAPP_LINK = buildWhatsAppLink(
  "Hello! I'd like help sizing a solar system — here's what I need to run:",
);
const ASK_ENGINEER_WHATSAPP_LINK = buildWhatsAppLink(
  "Hello! I'd like to speak to an engineer about a solar setup for my home/shop.",
);

function readMinutesFor(article: Article): number {
  return Math.max(1, Math.round(article.content.trim().split(/\s+/).length / 200));
}

function formatDate(article: Article): string | null {
  return article.published_date
    ? new Date(article.published_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : null;
}

const BlogList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<ArticleType | "all">("all");

  useEffect(() => {
    fetchArticles({ publishedOnly: true })
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const filtered = useMemo(
    () => (tab === "all" ? articles : articles.filter((a) => a.article_type === tab)),
    [articles, tab],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage],
  );
  const [featured, ...rest] = pageItems;

  const popularProducts = useMemo(() => products.filter((p) => p.featured).slice(0, 4), [products]);

  useEffect(() => { setPage(1); }, [tab]);

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <Seo
        title="Solar Insights — Buying Guides & Product Comparisons — Emax Solar Store"
        description="Solar buying guides and side-by-side product comparisons to help you choose the right solar street light, inverter, power station or camera."
        path="/insights"
      />
      <TopBar />
      <Header />

      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <p className="text-xs font-bold uppercase tracking-widest text-accent-light">Solar Insights</p>
          <h1 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight max-w-2xl">
            Work out what you need before anyone sells you anything
          </h1>
          <p className="mt-3 text-primary-foreground/70 text-sm sm:text-base max-w-xl leading-relaxed">
            Sizing walkthroughs, side-by-side comparisons and the maintenance nobody mentions at the point of sale. Written by the people who install this kit.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <div className="flex gap-2 mb-6 lg:mb-8 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`shrink-0 inline-flex items-center h-9 px-4 rounded-full text-sm font-semibold border transition-colors ${
                tab === t.value
                  ? "bg-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading articles…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No articles published yet — check back soon.</p>
          </div>
        ) : (
          <>
            {/* Mobile — flat list */}
            <div className="lg:hidden space-y-4">
              {pageItems.map((a) => (
                <MobileArticleRow key={a.id} article={a} />
              ))}
              <AskEngineerCard variant="light" />
              <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
            </div>

            {/* Desktop — featured card + grid + sidebar */}
            <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-8">
                {featured && <FeaturedCard article={featured} />}
                {rest.length > 0 && (
                  <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((a) => (
                      <ArticleCard key={a.id} article={a} />
                    ))}
                  </div>
                )}
                <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
              </div>

              <aside className="lg:col-span-4 space-y-5">
                <div className="rounded-2xl border border-border border-l-4 border-l-accent-strong bg-card p-5">
                  <h3 className="font-display font-bold text-base">Skip the reading</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    Three questions about your appliances and we shortlist the kit that carries them.
                  </p>
                  <a
                    href={SIZE_SYSTEM_WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-sm"
                  >
                    <Zap className="w-4 h-4" /> Size my system
                  </a>
                </div>

                {popularProducts.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Products in these guides
                    </h3>
                    <ul className="space-y-3">
                      {popularProducts.map((p) => (
                        <li key={p.id}>
                          <Link to={`/product/${p.id}`} className="flex items-center gap-3 group">
                            <OptimizedImage
                              src={p.image}
                              alt={p.name}
                              width={56}
                              height={56}
                              sizes="56px"
                              className="w-12 h-12 rounded-lg object-cover bg-muted shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                                {p.name}
                              </p>
                              <p className="text-sm font-bold mt-0.5">{formatNaira(p.price)}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <AskEngineerCard variant="dark" />
              </aside>
            </div>
          </>
        )}
      </div>

      <Footer />
      <MobileTabBar />
    </div>
  );
};

function AskEngineerCard({ variant }: { variant: "light" | "dark" }) {
  if (variant === "dark") {
    return (
      <div className="rounded-2xl bg-primary text-primary-foreground p-5">
        <h3 className="font-display font-bold text-base">Ask a real person</h3>
        <p className="mt-1.5 text-sm text-primary-foreground/70 leading-relaxed">
          Send us your appliance list on WhatsApp. We reply with a sized kit and a price, usually within five minutes.
        </p>
        <a
          href={ASK_ENGINEER_WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-success text-success-foreground font-semibold hover:opacity-90 transition-opacity text-sm"
        >
          <MessageCircle className="w-4 h-4" /> Chat with an engineer
        </a>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-border border-l-4 border-l-accent-strong bg-card p-5">
      <h3 className="font-display font-bold text-base">Skip the reading</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
        Send your appliance list on WhatsApp and we reply with a sized kit and a price.
      </p>
      <a
        href={ASK_ENGINEER_WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-success text-success-foreground font-semibold hover:opacity-90 transition-opacity text-sm"
      >
        <MessageCircle className="w-4 h-4" /> Chat with an engineer
      </a>
    </div>
  );
}

function TypeBadge({ article, className = "" }: { article: Article; className?: string }) {
  const isComparison = article.article_type === "comparison";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
        isComparison ? "bg-primary text-primary-foreground" : "bg-accent/15 text-accent-strong"
      } ${className}`}
    >
      {isComparison ? <Scale className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
      {isComparison ? "Comparison" : "Guide"}
    </span>
  );
}

function MobileArticleRow({ article }: { article: Article }) {
  const date = formatDate(article);
  return (
    <Link
      to={`/insights/${article.slug}`}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-accent/40 transition-colors"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 self-center">
        {article.featured_image ? (
          <OptimizedImage
            src={article.featured_image}
            alt={article.title}
            width={160}
            height={160}
            sizes="80px"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
            <Newspaper className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <TypeBadge article={article} />
        <h3 className="mt-1.5 font-display font-bold text-sm leading-snug line-clamp-2">{article.title}</h3>
        {article.meta_description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1 leading-relaxed">{article.meta_description}</p>
        )}
        <p className="mt-1.5 text-xs text-muted-foreground">
          {date && `${date} · `}{readMinutesFor(article)} min read
        </p>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const date = formatDate(article);
  return (
    <Link
      to={`/insights/${article.slug}`}
      className="group flex flex-col rounded-2xl bg-card overflow-hidden border border-border/60 hover:-translate-y-1 hover:shadow-card transition-all duration-300 shadow-soft"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {article.featured_image ? (
          <OptimizedImage
            src={article.featured_image}
            alt={article.title}
            width={640}
            height={360}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
            <Newspaper className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        <TypeBadge article={article} className="absolute top-3 left-3 shadow-md" />
      </div>
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-2">
        <h3 className="font-display font-bold text-base leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        {article.meta_description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{article.meta_description}</p>
        )}
        <p className="mt-auto pt-1 text-xs text-muted-foreground">
          {date && `${date} · `}{readMinutesFor(article)} min read
        </p>
      </div>
    </Link>
  );
}

function FeaturedCard({ article }: { article: Article }) {
  const date = formatDate(article);
  return (
    <Link
      to={`/insights/${article.slug}`}
      className="group flex flex-col sm:flex-row gap-6 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden p-3 sm:p-4"
    >
      <div className="sm:w-2/5 shrink-0 rounded-xl overflow-hidden bg-muted aspect-video sm:aspect-square">
        {article.featured_image ? (
          <OptimizedImage
            src={article.featured_image}
            alt={article.title}
            width={480}
            height={480}
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
            <Newspaper className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center py-1 sm:py-2">
        <span className="inline-flex w-fit items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent-strong text-white">
          Most read
        </span>
        <h2 className="mt-3 font-display font-extrabold text-xl sm:text-2xl leading-tight group-hover:text-accent transition-colors">
          {article.title}
        </h2>
        {article.meta_description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{article.meta_description}</p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          {date && `${date} · `}{readMinutesFor(article)} min read
        </p>
        <span className="mt-5 inline-flex items-center gap-2 w-fit h-11 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
          Read the walkthrough <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

export default BlogList;
