import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { ArticleForm } from "@/components/ArticleForm";
import { fetchArticleBySlug, updateArticle, type Article } from "@/lib/articles";

const AdminEditArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetchArticleBySlug(slug).then((a) => {
      if (!a) setError("Article not found");
      setArticle(a);
      setLoading(false);
    });
  }, [slug]);

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-3xl">
        <h1 className="font-display font-bold text-2xl">Edit Article</h1>
        <p className="text-sm text-muted-foreground mt-1">Update article details.</p>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error || !article ? (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4" /> {error || "Article not found"}
            </div>
          ) : (
            <ArticleForm
              submitLabel="Update Article"
              initialPreview={article.featuredImage}
              initialCenterPreview={article.centerImage}
              initialValue={{
                title: article.title,
                content: article.content,
                slug: article.slug,
                published: article.published,
                publishedDate: article.publishedDate,
                salesPageUrl: article.salesPageUrl || "",
              }}
              onCancel={() => navigate("/admin/dashboard")}
              onSubmit={async (form, file, centerFile) => {
                await updateArticle(article.id, {
                  title: form.title.trim(),
                  content: form.content.trim(),
                  slug: form.slug.trim(),
                  published: form.published,
                  publishedDate: form.publishedDate,
                  salesPageUrl: form.salesPageUrl.trim() || null,
                }, file, centerFile);
                setTimeout(() => navigate("/admin/dashboard"), 1200);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminEditArticle;
