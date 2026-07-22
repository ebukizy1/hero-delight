import { useRef, useState, type FormEvent } from "react";
import { ImageIcon, Loader2, CheckCircle, AlertCircle, Link2, BookOpen, Scale } from "lucide-react";
import { slugify, type ArticleType } from "@/lib/articles";

export interface ArticleFormValue {
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  articleType: ArticleType;
  published: boolean;
  publishedDate: string;
}

interface Props {
  initialValue?: ArticleFormValue;
  initialFeaturedPreview?: string | null;
  initialCenterPreview?: string | null;
  submitLabel: string;
  onSubmit: (value: ArticleFormValue, featuredImageFile: File | null, centerImageFile: File | null) => Promise<void>;
  onCancel?: () => void;
  featuredImageRequired?: boolean;
}

export function ArticleForm({
  initialValue,
  initialFeaturedPreview = null,
  initialCenterPreview = null,
  submitLabel,
  onSubmit,
  onCancel,
  featuredImageRequired = false,
}: Props) {
  const featuredRef = useRef<HTMLInputElement>(null);
  const centerRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValue?.slug));

  const [featuredPreview, setFeaturedPreview] = useState<string | null>(initialFeaturedPreview);
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [centerPreview, setCenterPreview] = useState<string | null>(initialCenterPreview);
  const [centerFile, setCenterFile] = useState<File | null>(null);

  const [form, setForm] = useState<ArticleFormValue>(
    initialValue ?? {
      title: "",
      slug: "",
      content: "",
      metaDescription: "",
      articleType: "guide",
      published: true,
      publishedDate: new Date().toISOString().slice(0, 10),
    },
  );

  const set = <K extends keyof ArticleFormValue>(k: K, v: ArticleFormValue[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleTitleChange = (v: string) => {
    set("title", v);
    if (!slugTouched) set("slug", slugify(v));
  };

  const handleFeatured = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFeaturedFile(file);
    setFeaturedPreview(URL.createObjectURL(file));
  };

  const handleCenter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCenterFile(file);
    setCenterPreview(URL.createObjectURL(file));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (featuredImageRequired && !featuredFile && !initialFeaturedPreview) {
      setError("Please upload a featured image");
      return;
    }
    if (!form.slug.trim()) {
      setError("Please provide a URL slug");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit({ ...form, slug: slugify(form.slug) }, featuredFile, centerFile);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5 shadow-soft">
      <div>
        <label className="text-sm font-medium block mb-1.5">
          Featured image{featuredImageRequired ? " *" : ""}
        </label>
        <div
          onClick={() => featuredRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors overflow-hidden"
          style={{ minHeight: featuredPreview ? "auto" : "8rem" }}
        >
          {featuredPreview ? (
            <img src={featuredPreview} alt="Preview" className="w-full max-h-56 object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-8">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload featured image</span>
              <span className="text-xs text-muted-foreground">JPG, PNG, WEBP up to 10MB</span>
            </div>
          )}
          <input ref={featuredRef} type="file" accept="image/*" className="hidden" onChange={handleFeatured} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Article type *</label>
        <div className="grid grid-cols-2 gap-3">
          <TypeOption
            active={form.articleType === "guide"}
            onClick={() => set("articleType", "guide")}
            icon={<BookOpen className="w-4 h-4" />}
            title="Guide"
            sub="Buying guide or product deep-dive"
          />
          <TypeOption
            active={form.articleType === "comparison"}
            onClick={() => set("articleType", "comparison")}
            icon={<Scale className="w-4 h-4" />}
            title="Comparison"
            sub="X vs Y product comparison"
          />
        </div>
      </div>

      <Field label="Title *" value={form.title} onChange={handleTitleChange} placeholder="e.g. 1000W Aluminum Solar Street Light Guide" />

      <div>
        <label className="text-sm font-medium block mb-1.5">URL slug *</label>
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }}
            placeholder="1000w-aluminum-solar-street-light"
            className="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">Article will be published at /insights/{form.slug || "your-slug"}</p>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Content *</label>
        <textarea
          rows={10}
          required
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          placeholder={"Write the article body. Supports markdown: **bold**, ### headings, paragraphs separated by a blank line."}
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y text-sm font-mono"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Center image (optional)</label>
        <div
          onClick={() => centerRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors overflow-hidden"
          style={{ minHeight: centerPreview ? "auto" : "6rem" }}
        >
          {centerPreview ? (
            <img src={centerPreview} alt="Preview" className="w-full max-h-40 object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-6">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload an inline image</span>
            </div>
          )}
          <input ref={centerRef} type="file" accept="image/*" className="hidden" onChange={handleCenter} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Meta description</label>
        <textarea
          rows={2}
          value={form.metaDescription}
          onChange={(e) => set("metaDescription", e.target.value)}
          placeholder="Short summary shown on the blog list page and search engines."
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Published date" value={form.publishedDate} onChange={(v) => set("publishedDate", v)} type="date" required={false} />
        <label className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 cursor-pointer hover:bg-secondary/60 transition-colors">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-accent cursor-pointer"
          />
          <div className="flex-1">
            <div className="font-semibold text-sm">Published</div>
            <p className="text-xs text-muted-foreground mt-0.5">Visible on the public blog when checked.</p>
          </div>
        </label>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
        </div>
      )}
      {done && (
        <div className="flex items-center gap-2 text-sm text-success bg-success/10 rounded-lg px-3 py-2">
          <CheckCircle className="w-4 h-4" /> Saved! Redirecting…
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || done}
          className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-11 px-5 inline-flex items-center justify-center rounded-lg border border-border font-semibold hover:bg-secondary transition-colors text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function TypeOption({
  active, onClick, icon, title, sub,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
        active ? "border-accent bg-accent/10" : "border-border hover:bg-secondary/50"
      }`}
    >
      <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"}`}>
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-sm">{title}</span>
        <span className="block text-xs text-muted-foreground">{sub}</span>
      </span>
    </button>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, required = true,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
      />
    </div>
  );
}
