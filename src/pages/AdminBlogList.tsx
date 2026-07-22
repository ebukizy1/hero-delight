import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Newspaper, Pencil, Trash2, AlertCircle, Eye, EyeOff, BookOpen, Scale } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { fetchArticles, deleteArticle, updateArticle, type Article } from "@/lib/articles";
import { Seo } from "@/components/Seo";

const AdminBlogList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setArticles(await fetchArticles());
    } catch {
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete article");
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublished = async (a: Article) => {
    const next = !a.published;
    setArticles((prev) => prev.map((x) => (x.id === a.id ? { ...x, published: next } : x)));
    try {
      await updateArticle(a.id, { published: next });
    } catch {
      setArticles((prev) => prev.map((x) => (x.id === a.id ? { ...x, published: !next } : x)));
      alert("Failed to update published status");
    }
  };

  return (
    <div className="min-h-screen bg-secondary/40">
      <Seo title="Solar Insights — Admin — Emax Solar Store" description="Admin" noindex />
      <AdminNav />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl">Solar Insights</h1>
            <p className="text-sm text-muted-foreground">Manage buying guides and comparison articles</p>
          </div>
          <Link
            to="/admin/insights/add"
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4" /> New Article
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          <div className="p-4 sm:p-5 border-b border-border flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold">All Articles</h2>
          </div>

          {error && (
            <div className="flex items-center gap-2 m-4 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {loading ? (
            <div className="p-10 text-center text-muted-foreground text-sm">Loading articles…</div>
          ) : articles.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-sm">
              No articles yet.{" "}
              <Link to="/admin/insights/add" className="text-foreground underline font-medium">Write your first article</Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {articles.map((a) => (
                <li key={a.id} className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-secondary/40 transition-colors">
                  <img
                    src={a.featured_image || "/placeholder.svg"}
                    alt={a.title}
                    loading="lazy"
                    decoding="async"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover bg-muted shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm truncate">{a.title}</p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
                          a.article_type === "comparison" ? "bg-blue-500/15 text-blue-600" : "bg-accent/15 text-accent"
                        }`}
                      >
                        {a.article_type === "comparison" ? <Scale className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                        {a.article_type === "comparison" ? "Comparison" : "Guide"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">/insights/{a.slug}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => togglePublished(a)}
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                        a.published ? "text-success bg-success/10 hover:bg-success/20" : "text-muted-foreground hover:bg-secondary"
                      }`}
                      aria-label={a.published ? "Unpublish" : "Publish"}
                      title={a.published ? "Published" : "Draft"}
                    >
                      {a.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <Link
                      to={`/admin/insights/edit/${a.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(a.id, a.title)}
                      disabled={deletingId === a.id}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminBlogList;
