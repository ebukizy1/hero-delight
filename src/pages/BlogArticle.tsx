import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Newspaper, ShoppingBag, BookOpen, Scale } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { fetchArticleBySlug, fetchArticles, type Article } from "@/lib/articles";
import { renderMarkdown } from "@/lib/markdown";
import { Seo, SITE_URL } from "@/components/Seo";

const BlogArticle = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [others, setOthers] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    Promise.all([fetchArticleBySlug(slug), fetchArticles({ publishedOnly: true }).catch(() => [])]).then(
      ([a, all]) => {
        if (!active) return;
        if (!a) {
          setNotFound(true);
        } else {
          setArticle(a);
          setOthers(all.filter((x) => x.id !== a.id).slice(0, 3));
        }
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "auto" });
      },
    );
    return () => { active = false; };
  }, [slug]);

  const html = useMemo(() => (article ? renderMarkdown(article.content) : ""), [article]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Seo title="Article not found — Emax Solar Store" description="This article could not be found." noindex />
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link to="/insights" className="text-accent underline">Back to Solar Insights</Link>
      </div>
    );
  }

  const date = article.published_date
    ? new Date(article.published_date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const isComparison = article.article_type === "comparison";

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${article.title} — Emax Solar Store`}
        description={article.meta_description || article.content.replace(/[#*_>`\n]/g, " ").slice(0, 160)}
        path={`/insights/${article.slug}`}
        image={article.featured_image ?? undefined}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.meta_description ?? undefined,
          image: article.featured_image ?? undefined,
          datePublished: article.published_date ?? article.created_at,
          dateModified: article.created_at,
          author: { "@type": "Organization", name: "Emax Solar Store" },
          publisher: {
            "@type": "Organization",
            name: "Emax Solar Store",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
          },
          mainEntityOfPage: `${SITE_URL}/insights/${article.slug}`,
        }}
      />
      <Header />
      <main>
        <article className="container mx-auto px-4 sm:px-6 py-6 lg:py-10 max-w-3xl">
          <Link to="/insights" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Solar Insights
          </Link>

          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              isComparison ? "bg-blue-500/15 text-blue-600" : "bg-accent/15 text-accent"
            }`}
          >
            {isComparison ? <Scale className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
            {isComparison ? "Comparison" : "Guide"}
          </span>

          {date && <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-accent">{date}</p>}
          <h1 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
            {article.title}
          </h1>

          {article.featured_image && (
            <div className="mt-6 rounded-2xl overflow-hidden bg-muted aspect-video shadow-card">
              <img
                src={article.featured_image}
                alt={article.title}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-slate max-w-none mt-8 prose-headings:font-display prose-headings:font-extrabold prose-a:text-accent prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {article.center_image && (
            <div className="mt-8 rounded-2xl overflow-hidden bg-muted shadow-card">
              <img src={article.center_image} alt="" loading="lazy" decoding="async" className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="mt-12 rounded-2xl bg-secondary/50 border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-lg">{article.sales_page_url ? "Ready to buy?" : "Ready to shop?"}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {article.sales_page_url
                  ? "Head to the product page to grab this deal."
                  : "Browse our full solar catalogue with nationwide delivery."}
              </p>
            </div>
            {article.sales_page_url ? (
              <a
                href={article.sales_page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-sm shrink-0"
              >
                <ShoppingBag className="w-4 h-4" /> Shop this deal
              </a>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-sm shrink-0"
              >
                <ShoppingBag className="w-4 h-4" /> Shop now
              </Link>
            )}
          </div>
        </article>

        {others.length > 0 && (
          <section className="border-t border-border bg-secondary/30 py-12 lg:py-16">
            <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl mb-6">More Solar Insights</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {others.map((a) => (
                  <Link
                    key={a.id}
                    to={`/insights/${a.slug}`}
                    className="group flex flex-col rounded-2xl bg-card overflow-hidden border border-border/60 hover:-translate-y-1 hover:shadow-card transition-all duration-300 shadow-soft"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {a.featured_image ? (
                        <img
                          src={a.featured_image}
                          alt={a.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                          <Newspaper className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                        {a.title}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-accent transition-colors">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogArticle;
