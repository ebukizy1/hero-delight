import { useRef, useState, type FormEvent } from "react";
import { ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export interface ArticleFormValue {
  title: string;
  content: string;
  slug: string;
  published: boolean;
  publishedDate: string;
  salesPageUrl: string;
}

interface Props {
  initialValue?: ArticleFormValue;
  initialPreview?: string | null;
  initialCenterPreview?: string | null;
  submitLabel: string;
  onSubmit: (value: ArticleFormValue, file: File | null, centerFile: File | null) => Promise<void>;
  onCancel?: () => void;
  imageRequired?: boolean;
}

export function ArticleForm({
  initialValue,
  initialPreview = null,
  initialCenterPreview = null,
  submitLabel,
  onSubmit,
  onCancel,
  imageRequired = false,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const centerFileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [centerPreview, setCenterPreview] = useState<string | null>(initialCenterPreview);
  const [centerImageFile, setCenterImageFile] = useState<File | null>(null);

  const [form, setForm] = useState<ArticleFormValue>(
    initialValue ?? {
      title: "",
      content: "",
      slug: "",
      published: false,
      publishedDate: new Date().toISOString().split("T")[0],
      salesPageUrl: "",
    }
  );

  const set = <K extends keyof ArticleFormValue>(k: K, v: ArticleFormValue[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCenterImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCenterImageFile(file);
    setCenterPreview(URL.createObjectURL(file));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (imageRequired && !imageFile && !initialPreview) {
      setError("Please upload a featured image");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit(form, imageFile, centerImageFile);
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
          Featured Image{imageRequired ? " *" : ""}
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors overflow-hidden"
          style={{ minHeight: preview ? "auto" : "8rem" }}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full max-h-64 object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-8">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload featured image</span>
              <span className="text-xs text-muted-foreground">JPG, PNG, WEBP up to 10MB</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </div>
        {preview && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-2 text-xs text-muted-foreground underline hover:text-foreground"
          >
            Change image
          </button>
        )}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">
          Center Image (Optional)
        </label>
        <div
          onClick={() => centerFileRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors overflow-hidden"
          style={{ minHeight: centerPreview ? "auto" : "8rem" }}
        >
          {centerPreview ? (
            <img src={centerPreview} alt="Center Preview" className="w-full max-h-64 object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-8">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload center image</span>
              <span className="text-xs text-muted-foreground">JPG, PNG, WEBP up to 10MB</span>
            </div>
          )}
          <input ref={centerFileRef} type="file" accept="image/*" className="hidden" onChange={handleCenterImage} />
        </div>
        {centerPreview && (
          <button
            type="button"
            onClick={() => centerFileRef.current?.click()}
            className="mt-2 text-xs text-muted-foreground underline hover:text-foreground"
          >
            Change center image
          </button>
        )}
      </div>

      <Field label="Title *" value={form.title} onChange={(v) => set("title", v)} placeholder="Enter article title" />
      <Field label="Slug *" value={form.slug} onChange={(v) => set("slug", v)} placeholder="e.g., 100w-solar-streetlight-guide" />
      <div>
                <label className="text-sm font-medium block mb-1.5">Content * (Markdown supported)</label>
                <textarea
                  rows={12}
                  required
                  value={form.content}
                  onChange={(e) => set("content", e.target.value)}
                  placeholder="Write your article here using Markdown…"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none text-base"
                />
              </div>
      <Field label="Sales Page URL" value={form.salesPageUrl} onChange={(v) => set("salesPageUrl", v)} placeholder="https://example.com/sales-page" required={false} />
      <Field label="Published Date *" type="date" value={form.publishedDate} onChange={(v) => set("publishedDate", v)} />
      <label className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 cursor-pointer hover:bg-secondary/60 transition-colors">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => set("published", e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-accent cursor-pointer"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 font-semibold text-sm">
            Published
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Toggle on to make this article visible on the website
          </p>
        </div>
      </label>

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
          className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-12 px-6 inline-flex items-center justify-center rounded-xl border border-border font-semibold hover:bg-secondary transition-colors text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
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
        className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
      />
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
