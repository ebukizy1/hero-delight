import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { ArticleForm } from "@/components/ArticleForm";
import { fetchArticle, updateArticle, uploadArticleImage, type Article } from "@/lib/articles";

const AdminEditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchArticle(id).then((a) => {
      if (!a) setError("Article not found");
      setArticle(a);
      setLoading(false);
    });
  }, [id]);

  return (
    <div className="min-h-screen bg-secondary/40">
      <AdminNav />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
        <h1 className="font-display font-bold text-2xl">Edit article</h1>
        <p className="text-sm text-muted-foreground mt-1">Update the article content.</p>

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
              initialFeaturedPreview={article.featured_image}
              initialCenterPreview={article.center_image}
              initialValue={{
                title: article.title,
                slug: article.slug,
                content: article.content,
                metaDescription: article.meta_description ?? "",
                articleType: article.article_type,
                published: article.published,
                publishedDate: article.published_date ?? new Date().toISOString().slice(0, 10),
              }}
              onCancel={() => navigate("/admin/insights")}
              onSubmit={async (form, featuredFile, centerFile) => {
                const featuredUrl = featuredFile ? await uploadArticleImage(featuredFile) : article.featured_image;
                const centerUrl = centerFile ? await uploadArticleImage(centerFile) : article.center_image;
                await updateArticle(article.id, {
                  title: form.title.trim(),
                  slug: form.slug,
                  content: form.content,
                  featured_image: featuredUrl,
                  center_image: centerUrl,
                  meta_description: form.metaDescription.trim() || null,
                  article_type: form.articleType,
                  published: form.published,
                  published_date: form.publishedDate || null,
                });
                setTimeout(() => navigate("/admin/insights"), 1200);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminEditArticle;
