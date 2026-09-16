import { Link } from "react-router-dom";
import { ArrowRight, Newspaper, BookOpen, Scale } from "lucide-react";
import type { ArticlePreview } from "@/lib/articles";
import { OptimizedImage } from "@/components/OptimizedImage";

interface Props {
  articles: ArticlePreview[];
}

const MAX_ARTICLES = 3;

export function SolarInsightsSection({ articles }: Props) {
  const shown = articles.slice(0, MAX_ARTICLES);
  return (
    <section className="py-14 lg:py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-light">
              <Newspaper className="w-3.5 h-3.5" /> Solar Insights
            </div>
            <h2 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight">
              Straight answers, no sales pitch
            </h2>
            <p className="mt-2 text-primary-foreground/70 text-sm sm:text-base max-w-lg leading-relaxed">
              Sizing walkthroughs and comparisons, written by the people who install this kit.
            </p>
          </div>
          <Link
            to="/insights"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-accent-strong text-white font-bold hover:brightness-110 transition-all shrink-0 w-full sm:w-fit"
          >
            Read the guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {shown.length > 0 && (
          <>
            {/* Mobile — compact list rows */}
            <div className="sm:hidden space-y-3">
              {shown.map((a) => {
                const isComparison = a.article_type === "comparison";
                return (
                  <Link
                    key={a.id}
                    to={`/insights/${a.slug}`}
                    className="flex items-center gap-3 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 p-3 hover:border-primary-foreground/25 transition-colors"
                  >
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                        isComparison ? "bg-blue-600 text-white" : "bg-accent-strong text-white"
                      }`}
                    >
                      {isComparison ? <Scale className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                      {isComparison ? "Comparison" : "Guide"}
                    </span>
                    <span className="flex-1 min-w-0 text-sm font-semibold leading-snug truncate">{a.title}</span>
                    <ArrowRight className="w-4 h-4 text-primary-foreground/50 shrink-0" />
                  </Link>
                );
              })}
            </div>

            {/* sm and up — full image cards */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {shown.map((a) => {
                const isComparison = a.article_type === "comparison";
                return (
                  <Link
                    key={a.id}
                    to={`/insights/${a.slug}`}
                    className="group flex flex-col rounded-2xl bg-primary-foreground/5 overflow-hidden border border-primary-foreground/10 hover:border-primary-foreground/25 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-video overflow-hidden bg-primary-foreground/10">
                      {a.featured_image ? (
                        <OptimizedImage
                          src={a.featured_image}
                          alt={a.title}
                          width={640}
                          height={360}
                          sizes="(min-width: 1024px) 33vw, 50vw"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="w-8 h-8 text-primary-foreground/40" />
                        </div>
                      )}
                      <span
                        className={`absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md ${
                          isComparison ? "bg-blue-600 text-white" : "bg-accent-strong text-white"
                        }`}
                      >
                        {isComparison ? <Scale className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                        {isComparison ? "Comparison" : "Guide"}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 p-4 sm:p-5 gap-2">
                      <h3 className="font-display font-bold text-base leading-snug line-clamp-2 group-hover:text-accent-light transition-colors">
                        {a.title}
                      </h3>
                      {a.meta_description && (
                        <p className="text-sm text-primary-foreground/60 line-clamp-2 leading-relaxed">{a.meta_description}</p>
                      )}
                      <span className="mt-auto pt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary-foreground group-hover:text-accent-light transition-colors">
                        Read article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
