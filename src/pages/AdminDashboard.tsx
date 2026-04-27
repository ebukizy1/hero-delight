import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Plus, Package, Pencil, Trash2, AlertCircle, TrendingUp, DollarSign, Tag, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchProducts, deleteProduct, formatNaira, type Product } from "@/lib/products";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setProducts(await fetchProducts());
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const totalValue = products.reduce((s, p) => s + p.price, 0);
  const onSale = products.filter((p) => p.bonusPrice && p.bonusPrice > p.price).length;
  const categories = new Set(products.map((p) => p.category)).size;

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-extrabold text-lg">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            SolarHub Admin
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your product catalog</p>
          </div>
          <Link
            to="/admin/add-product"
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard icon={<Package className="w-4 h-4" />} label="Total Products" value={products.length.toString()} />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Categories" value={categories.toString()} />
          <StatCard icon={<Tag className="w-4 h-4" />} label="On Sale" value={onSale.toString()} />
          <StatCard icon={<DollarSign className="w-4 h-4" />} label="Catalog Value" value={formatNaira(totalValue)} />
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          <div className="p-4 sm:p-5 border-b border-border flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold">All Products</h2>
          </div>

          {error && (
            <div className="flex items-center gap-2 m-4 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {loading ? (
            <div className="p-10 text-center text-muted-foreground text-sm">Loading products…</div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-sm">
              No products yet.{" "}
              <Link to="/admin/add-product" className="text-foreground underline font-medium">Add your first product</Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {products.map((p) => {
                const hasBonus = p.bonusPrice && p.bonusPrice > p.price;
                return (
                  <li key={p.id} className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-secondary/40 transition-colors">
                    <img
                      src={p.image} alt={p.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover bg-muted shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <p className="text-sm font-semibold">{formatNaira(p.price)}</p>
                        {hasBonus && (
                          <p className="text-xs text-muted-foreground line-through">{formatNaira(p.bonusPrice!)}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        to={`/admin/edit-product/${p.id}`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deletingId === p.id}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
        {icon}
        {label}
      </div>
      <p className="font-display font-extrabold text-lg sm:text-xl truncate">{value}</p>
    </div>
  );
}

export default AdminDashboard;
