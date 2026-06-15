import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/ProductForm";
import { createProduct, uploadProductImage } from "@/lib/products";

const AdminAddProduct = () => {
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

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
        <h1 className="font-display font-bold text-2xl">Add a new product</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details below.</p>

        <div className="mt-6">
          <ProductForm
            submitLabel="Save Product"
            imageRequired
            onCancel={() => navigate("/admin/dashboard")}
            onSubmit={async (form, file1, file2, file3) => {
              if (!file1) throw new Error("Image 1 is required");
              const imageUrl = await uploadProductImage(file1);
              let imageUrl2: string | null = null;
              let imageUrl3: string | null = null;
              if (file2) imageUrl2 = await uploadProductImage(file2);
              if (file3) imageUrl3 = await uploadProductImage(file3);
              await createProduct({
                name: form.name.trim(),
                price: parseInt(form.price, 10),
                bonus_price: form.bonusPrice ? parseInt(form.bonusPrice, 10) : null,
                category: form.category,
                description: form.description.trim(),
                image_url: imageUrl,
                image_url_2: imageUrl2,
                image_url_3: imageUrl3,
                featured: form.featured,
                specifications: form.specifications
                  .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
                  .filter((s) => s.label && s.value),
              });
              setTimeout(() => navigate("/admin/dashboard"), 1200);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminAddProduct;
