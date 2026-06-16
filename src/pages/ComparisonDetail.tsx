import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Loader2, Scale } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { fetchComparisonArticles, fetchComparisonBySlug, type ComparisonArticle } from "@/lib/articles";

const ComparisonDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [comparison, setComparison] = useState<ComparisonArticle | null>(null);
  const [allComparisons, setAllComparisons] = useState<ComparisonArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      fetchComparisonBySlug(slug),
      fetchComparisonArticles().catch(() => []),
    ])
      .then(([currentComparison, comparisons]) => {
        setComparison(currentComparison);
        setAllComparisons(comparisons.filter((item) => item.published));
        if (currentComparison) {
          document.title = `${currentComparison.title} - E-maxsolarstore`;
        }
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const relatedComparisons = useMemo(() => {
    if (!comparison) return [];
    return allComparisons
      .filter((item) => item.id !== comparison.id)
      .slice(0, 3);
  }, [allComparisons, comparison]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-900 px-4 text-center">
        <h1 className="font-display text-3xl font-bold text-white">Comparison not found</h1>
        <Link to="/" className="text-amber-400 underline">
          Back to home
        </Link>
      </div>
    );
  }

  const shopHref = comparison.salesPageUrl || "/#products";
  const productAImage = comparison.productAImage || comparison.bannerImage;
  const productBImage = comparison.productBImage || comparison.bannerImage;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <article className="mt-6">
          <div className="overflow-hidden rounded-3xl bg-slate-800 shadow-2xl">
            <img
              src={comparison.bannerImage}
              alt={comparison.title}
              loading="eager"
              className="h-56 w-full object-cover sm:h-72 lg:h-96"
            />
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(comparison.publishedDate)}
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">
                  Comparison
                </span>
              </div>
              <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {comparison.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-lg font-semibold">
                <span className="text-emerald-400">{comparison.productATitle}</span>
                <span className="text-slate-500">vs</span>
                <span className="text-sky-400">{comparison.productBTitle}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <ProductPanel
              label="Product A"
              title={comparison.productATitle}
              image={productAImage}
              details={comparison.productADetails}
              accentColor="text-emerald-400"
              accentBg="bg-emerald-500/20"
            />
            <ProductPanel
              label="Product B"
              title={comparison.productBTitle}
              image={productBImage}
              details={comparison.productBDetails}
              accentColor="text-sky-400"
              accentBg="bg-sky-500/20"
            />
          </div>

          <div className="mt-10 space-y-6">
            <div className="rounded-3xl bg-slate-800 p-6 shadow-xl sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                  <Scale className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">Comparison Review</p>
                  <h2 className="font-display text-2xl font-bold">Main Breakdown</h2>
                </div>
              </div>
              <div className="mt-6 space-y-5 text-base leading-8 text-slate-300 sm:text-lg">
                {splitContent(comparison.comparisonContent).map((paragraph, index) => (
                  <ReactMarkdown key={index}>{paragraph}</ReactMarkdown>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-amber-500/20 to-slate-800 p-6 shadow-xl sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">Final Recommendation</p>
              <h2 className="mt-2 font-display text-2xl font-bold">Which one should you choose?</h2>
              <div className="mt-4 space-y-5 text-base leading-8 text-slate-200 sm:text-lg">
                {splitContent(comparison.conclusion).map((paragraph, index) => (
                  <ReactMarkdown key={index}>{paragraph}</ReactMarkdown>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-slate-900 shadow-xl sm:p-8">
              <h3 className="font-display text-2xl font-bold sm:text-3xl">Ready to buy?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-800 sm:text-base">
                Pick the one that fits your needs.
              </p>
              <a
                href={shopHref}
                target={comparison.salesPageUrl ? "_blank" : undefined}
                rel={comparison.salesPageUrl ? "noopener noreferrer" : undefined}
                className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 px-6 font-bold text-amber-400 transition-transform hover:scale-105"
              >
                Shop Now
              </a>
            </div>
          </div>
        </article>

        {relatedComparisons.length > 0 && (
          <section className="mt-12 lg:mt-16">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">More Comparisons</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold">Continue Reading</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedComparisons.map((item) => (
                <Link
                  key={item.id}
                  to={`/comparison/${item.slug}`}
                  className="group rounded-3xl bg-slate-800 p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <img
                    src={item.bannerImage}
                    alt={item.title}
                    loading="lazy"
                    className="h-40 w-full rounded-2xl object-cover sm:h-48"
                  />
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
                      {formatDate(item.publishedDate)}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-bold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-3">
                      {item.comparisonContent}
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

function ProductPanel({
  label,
  title,
  image,
  details,
  accentColor,
  accentBg,
}: {
  label: string;
  title: string;
  image: string;
  details: string;
  accentColor: string;
  accentBg: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-slate-800 shadow-xl">
      <div className="bg-slate-900 p-3">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-56 w-full rounded-2xl object-cover sm:h-64"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 rounded-full ${accentBg} px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${accentColor}`}>
            {label}
          </span>
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        <div className="mt-4 space-y-4 text-base leading-8 text-slate-300 sm:text-lg">
          {splitContent(details).map((paragraph, index) => (
            <ReactMarkdown key={index}>{paragraph}</ReactMarkdown>
          ))}
        </div>
      </div>
    </div>
  );
}

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

export default ComparisonDetail;
