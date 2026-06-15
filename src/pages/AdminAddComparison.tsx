import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ComparisonForm } from "@/components/ComparisonForm";
import { createComparisonArticle } from "@/lib/articles";

const AdminAddComparison = () => {
  const navigate = useNavigate();

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
        <h1 className="font-display font-bold text-2xl">Add a New Comparison Article</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details below.</p>

        <div className="mt-6">
          <ComparisonForm
            submitLabel="Save Comparison"
            imageRequired
            onCancel={() => navigate("/admin/dashboard")}
            onSubmit={async (form, bannerFile, productAFile, productBFile) => {
              if (!bannerFile || !productAFile || !productBFile) {
                throw new Error("All images are required");
              }
              await createComparisonArticle({
                title: form.title.trim(),
                bannerImage: "",
                productATitle: form.productATitle.trim(),
                productAImage: "",
                productADetails: form.productADetails.trim(),
                productBTitle: form.productBTitle.trim(),
                productBImage: "",
                productBDetails: form.productBDetails.trim(),
                comparisonContent: form.comparisonContent.trim(),
                conclusion: form.conclusion.trim(),
                slug: form.slug.trim(),
                published: form.published,
                publishedDate: form.publishedDate,
                salesPageUrl: form.salesPageUrl.trim() || null,
              }, bannerFile, productAFile, productBFile);
              setTimeout(() => navigate("/admin/dashboard"), 1200);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminAddComparison;
