import { useNavigate } from "react-router-dom";
import { AdminNav } from "@/components/AdminNav";
import { ProductForm } from "@/components/ProductForm";
import { createProduct, uploadProductImage } from "@/lib/products";
import { Seo } from "@/components/Seo";

const AdminAddProduct = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary/40">
      <Seo title="Add Product — Admin — Emax Solar Store" description="Admin" noindex />
      <AdminNav />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
        <h1 className="font-display font-bold text-2xl">Add a new product</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details below.</p>

        <div className="mt-6">
          <ProductForm
            submitLabel="Save Product"
            imageRequired
            onCancel={() => navigate("/admin/dashboard")}
            onSubmit={async (form, file, extraFiles) => {
              if (!file) throw new Error("Image is required");
              const imageUrl = await uploadProductImage(file);
              const [extra1, extra2] = await Promise.all(
                extraFiles.map((f) => (f ? uploadProductImage(f) : Promise.resolve(null))),
              );
              await createProduct({
                name: form.name.trim(),
                price: parseInt(form.price, 10),
                bonus_price: form.bonusPrice ? parseInt(form.bonusPrice, 10) : null,
                category: form.category,
                description: form.description.trim(),
                image_url: imageUrl,
                image_url_2: extra1,
                image_url_3: extra2,
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
