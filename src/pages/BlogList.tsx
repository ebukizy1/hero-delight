import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Newspaper, BookOpen, Scale } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Pagination } from "@/pages/Index";
import { fetchArticles, type Article, type ArticleType } from "@/lib/articles";
import { Seo } from "@/components/Seo";

const PAGE_SIZE = 9;

const TABS: { label: string; value: ArticleType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Guides", value: "guide" },
  { label: "Comparisons", value: "comparison" },
];

const BlogList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<ArticleType | "all">("all");

  useEffect(() => {
    fetchArticles({ publishedOnly: true })
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false));
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

  useEffect(() => { setPage(1); }, [tab]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Solar Insights — Buying Guides & Product Comparisons — Emax Solar Store"
        description="Solar buying guides and side-by-side product comparisons to help you choose the right solar street light, inverter, power station or camera."
        path="/insights"
      />
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-hero-glow border-b border-border/60 text-white">
          <div className="container mx-auto px-4 sm:px-6 py-10 lg:py-14">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-5 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent animate-fade-up">
              <Newspaper className="w-3.5 h-3.5" /> Solar Insights
            </div>
            <h1 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight animate-fade-up delay-100">
              Solar tips &amp; product comparisons
            </h1>
            <p className="mt-3 text-white/70 text-sm sm:text-base max-w-xl animate-fade-up delay-200">
              Buying guides, side-by-side product comparisons, and everything you need to know about going solar.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <div className="flex gap-2 mb-8">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`inline-flex items-center h-9 px-4 rounded-full text-sm font-semibold border transition-colors ${
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {pageItems.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
              <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

function ArticleCard({ article }: { article: Article }) {
  const date = article.published_date
    ? new Date(article.published_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : null;
  const isComparison = article.article_type === "comparison";

  return (
    <Link
      to={`/insights/${article.slug}`}
      className="group flex flex-col rounded-2xl bg-card overflow-hidden border border-border/60 hover:-translate-y-1 hover:shadow-card transition-all duration-300 shadow-soft"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {article.featured_image ? (
          <img
            src={article.featured_image}
            alt={article.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
            <Newspaper className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md ${
            isComparison ? "bg-blue-600 text-white" : "bg-accent text-accent-foreground"
          }`}
        >
          {isComparison ? <Scale className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
          {isComparison ? "Comparison" : "Guide"}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-2">
        {date && <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{date}</p>}
        <h3 className="font-display font-bold text-base leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        {article.meta_description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{article.meta_description}</p>
        )}
        <span className="mt-auto pt-1 inline-flex items-center gap-1 text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
          Read article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export default BlogList;
