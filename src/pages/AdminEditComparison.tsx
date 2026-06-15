import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { ComparisonForm } from "@/components/ComparisonForm";
import { fetchComparisonBySlug, updateComparisonArticle, type ComparisonArticle } from "@/lib/articles";

const AdminEditComparison = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [comparison, setComparison] = useState<ComparisonArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetchComparisonBySlug(slug).then((c) => {
      if (!c) setError("Comparison not found");
      setComparison(c);
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
        <h1 className="font-display font-bold text-2xl">Edit Comparison Article</h1>
        <p className="text-sm text-muted-foreground mt-1">Update comparison details.</p>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error || !comparison ? (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
              <AlertCircle className="w-4 h-4" /> {error || "Comparison not found"}
            </div>
          ) : (
            <ComparisonForm
              submitLabel="Update Comparison"
              initialBannerPreview={comparison.bannerImage}
              initialProductAPreview={comparison.productAImage}
              initialProductBPreview={comparison.productBImage}
              initialValue={{
                title: comparison.title,
                productATitle: comparison.productATitle,
                productADetails: comparison.productADetails,
                productBTitle: comparison.productBTitle,
                productBDetails: comparison.productBDetails,
                comparisonContent: comparison.comparisonContent,
                conclusion: comparison.conclusion,
                slug: comparison.slug,
                published: comparison.published,
                publishedDate: comparison.publishedDate,
                salesPageUrl: comparison.salesPageUrl || "",
              }}
              onCancel={() => navigate("/admin/dashboard")}
              onSubmit={async (form, bannerFile, productAFile, productBFile) => {
                await updateComparisonArticle(
                  comparison.id,
                  {
                    title: form.title.trim(),
                    productATitle: form.productATitle.trim(),
                    productADetails: form.productADetails.trim(),
                    productBTitle: form.productBTitle.trim(),
                    productBDetails: form.productBDetails.trim(),
                    comparisonContent: form.comparisonContent.trim(),
                    conclusion: form.conclusion.trim(),
                    slug: form.slug.trim(),
                    published: form.published,
                    publishedDate: form.publishedDate,
                    salesPageUrl: form.salesPageUrl.trim() || null,
                  },
                  bannerFile,
                  productAFile,
                  productBFile
                );
                setTimeout(() => navigate("/admin/dashboard"), 1200);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminEditComparison;
