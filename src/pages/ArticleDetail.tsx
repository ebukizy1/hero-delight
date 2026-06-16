import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { fetchArticleBySlug, fetchArticles, type Article } from "@/lib/articles";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      fetchArticleBySlug(slug),
      fetchArticles().catch(() => []),
    ])
      .then(([currentArticle, articles]) => {
        setArticle(currentArticle);
        setAllArticles(articles.filter((item) => item.published));
        if (currentArticle) {
          document.title = `${currentArticle.title} - E-maxsolarstore`;
        }
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return allArticles
      .filter((item) => item.id !== article.id)
      .slice(0, 3);
  }, [allArticles, article]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-900 px-4 text-center">
        <h1 className="font-display text-3xl font-bold text-white">Article not found</h1>
        <Link to="/" className="text-amber-400 underline">
          Back to home
        </Link>
      </div>
    );
  }

  const shopHref = article.salesPageUrl || "/#products";
  const sections = splitContent(article.content);
  const lead = sections[0] ?? "";
  const bodySections = sections.slice(1);
  const readingTime = Math.max(2, Math.ceil(article.content.split(/\s+/).length / 180));

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <article className="mt-6">
          <div className="overflow-hidden rounded-3xl bg-slate-800 shadow-2xl">
            <img
              src={article.featuredImage}
              alt={article.title}
              loading="eager"
              className="h-56 w-full object-cover sm:h-72 lg:h-96"
            />
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {formatDate(article.publishedDate)}
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">
                  {readingTime} min read
                </span>
              </div>
              <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              {article.metaDescription && (
                <p className="mt-4 text-lg leading-7 text-slate-400">
                  {article.metaDescription}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {lead && (
              <div className="rounded-3xl bg-slate-800 p-6 shadow-xl sm:p-8">
                <div className="text-lg leading-8 text-slate-300 sm:text-xl sm:leading-9">
                  <ReactMarkdown>{lead}</ReactMarkdown>
                </div>
              </div>
            )}

            {article.centerImage && (
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src={article.centerImage}
                  alt={article.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {bodySections.map((paragraph, index) => (
              <div key={index} className="rounded-3xl bg-slate-800 p-6 shadow-xl sm:p-8">
                <div className="text-base leading-8 text-slate-300 sm:text-lg sm:leading-9">
                  <ReactMarkdown>{paragraph}</ReactMarkdown>
                </div>
              </div>
            ))}

            <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-slate-900 shadow-xl sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-800">Ready to shop</p>
              <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Get the right product</h3>
              <p className="mt-4 text-sm leading-7 text-slate-800 sm:text-base">
                Take what you learned and find the perfect match.
              </p>
              <a
                href={shopHref}
                target={article.salesPageUrl ? "_blank" : undefined}
                rel={article.salesPageUrl ? "noopener noreferrer" : undefined}
                className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 px-6 font-bold text-amber-400 transition-transform hover:scale-105"
              >
                Shop Now
              </a>
            </div>
          </div>
        </article>

        {relatedArticles.length > 0 && (
          <section className="mt-12 lg:mt-16">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">Keep Reading</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-white">Related Articles</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  to={`/article/${item.slug}`}
                  className="group rounded-3xl bg-slate-800 p-4 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    loading="lazy"
                    className="h-40 w-full rounded-2xl object-cover sm:h-48"
                  />
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
                      {formatDate(item.publishedDate)}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-3">
                      {item.metaDescription || item.content}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

function splitContent(value: string) {
  return value
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default ArticleDetail;
