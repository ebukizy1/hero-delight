import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { ProductForm } from "@/components/ProductForm";
import { fetchProduct, updateProduct, uploadProductImage, type Product } from "@/lib/products";

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
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </Link>
        </div>
      </header>

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
              initialPreview1={product.image}
              initialPreview2={product.image2}
              initialPreview3={product.image3}
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
              onSubmit={async (form, file1, file2, file3) => {
                let imageUrl = product.image;
                let imageUrl2 = product.image2;
                let imageUrl3 = product.image3;
                if (file1) imageUrl = await uploadProductImage(file1);
                if (file2) imageUrl2 = await uploadProductImage(file2);
                if (file3) imageUrl3 = await uploadProductImage(file3);
                await updateProduct(product.id, {
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
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminEditProduct;
