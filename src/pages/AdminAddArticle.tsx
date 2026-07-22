import { useNavigate } from "react-router-dom";
import { AdminNav } from "@/components/AdminNav";
import { ArticleForm } from "@/components/ArticleForm";
import { createArticle, uploadArticleImage } from "@/lib/articles";

const AdminAddArticle = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary/40">
      <AdminNav />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
        <h1 className="font-display font-bold text-2xl">Write a new article</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details below.</p>

        <div className="mt-6">
          <ArticleForm
            submitLabel="Publish Article"
            featuredImageRequired
            onCancel={() => navigate("/admin/insights")}
            onSubmit={async (form, featuredFile, centerFile) => {
              if (!featuredFile) throw new Error("Featured image is required");
              const featuredUrl = await uploadArticleImage(featuredFile);
              const centerUrl = centerFile ? await uploadArticleImage(centerFile) : null;
              await createArticle({
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
        </div>
      </main>
    </div>
  );
};

export default AdminAddArticle;
