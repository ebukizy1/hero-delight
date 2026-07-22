import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { ProductForm } from "@/components/ProductForm";
import { fetchProduct, updateProduct, uploadProductImage, type Product } from "@/lib/products";
import { Seo } from "@/components/Seo";

const AdminEditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchProduct(id).then((p) => {
      if (!p) setError("Product not found");
      setProduct(p);
      setLoading(false);
    });
  }, [id]);

  return (
    <div className="min-h-screen bg-secondary/40">
      <Seo title="Edit Product — Admin — Emax Solar Store" description="Admin" noindex />
      <AdminNav />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
        <h1 className="font-display font-bold text-2xl">Edit product</h1>
        <p className="text-sm text-muted-foreground mt-1">Update product details.</p>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error || !product ? (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4" /> {error || "Product not found"}
            </div>
          ) : (
            <ProductForm
              submitLabel="Update Product"
              initialPreview={product.image}
              initialExtraPreviews={[product.images[1] ?? null, product.images[2] ?? null]}
              initialValue={{
                name: product.name,
                price: product.price.toString(),
                bonusPrice: product.bonusPrice ? product.bonusPrice.toString() : "",
                category: product.category,
                description: product.description,
                featured: product.featured,
                specifications: product.specifications,
              }}
              onCancel={() => navigate("/admin/dashboard")}
              onSubmit={async (form, file, extraFiles) => {
                let imageUrl = product.image;
                if (file) imageUrl = await uploadProductImage(file);
                const [existingExtra1, existingExtra2] = [product.images[1] ?? null, product.images[2] ?? null];
                const [extra1, extra2] = await Promise.all([
                  extraFiles[0] ? uploadProductImage(extraFiles[0]) : Promise.resolve(existingExtra1),
                  extraFiles[1] ? uploadProductImage(extraFiles[1]) : Promise.resolve(existingExtra2),
                ]);
                await updateProduct(product.id, {
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
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminEditProduct;
