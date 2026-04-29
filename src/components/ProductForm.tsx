import { useRef, useState, type FormEvent } from "react";
import { ImageIcon, Loader2, CheckCircle, AlertCircle, Tag, Star } from "lucide-react";
import { CATEGORIES, formatNaira, discountPercent } from "@/lib/products";

export interface ProductFormValue {
  name: string;
  price: string;
  bonusPrice: string;
  category: string;
  description: string;
  featured: boolean;
}

interface Props {
  initialValue?: ProductFormValue;
  initialPreview?: string | null;
  submitLabel: string;
  onSubmit: (value: ProductFormValue, imageFile: File | null) => Promise<void>;
  onCancel?: () => void;
  imageRequired?: boolean;
}

export function ProductForm({
  initialValue,
  initialPreview = null,
  submitLabel,
  onSubmit,
  onCancel,
  imageRequired = false,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState<ProductFormValue>(
    initialValue ?? { name: "", price: "", bonusPrice: "", category: "", description: "", featured: false }
  );

  const set = <K extends keyof ProductFormValue>(k: K, v: ProductFormValue[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (imageRequired && !imageFile && !initialPreview) {
      setError("Please upload a product image");
      return;
    }
    const priceNum = parseInt(form.price, 10);
    const bonusNum = form.bonusPrice ? parseInt(form.bonusPrice, 10) : 0;
    if (bonusNum && bonusNum <= priceNum) {
      setError("Original price must be higher than the sale price");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit(form, imageFile);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const priceNum = parseInt(form.price, 10) || 0;
  const bonusNum = parseInt(form.bonusPrice, 10) || 0;
  const discount = discountPercent(priceNum, bonusNum);

  return (
    <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5 shadow-soft">
      {/* Image */}
      <div>
        <label className="text-sm font-medium block mb-1.5">
          Product image{imageRequired ? " *" : ""}
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors overflow-hidden"
          style={{ minHeight: preview ? "auto" : "8rem" }}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full max-h-56 object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-8">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload image</span>
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

      <Field label="Product name *" value={form.name} onChange={(v) => set("name", v)} placeholder="e.g. Solar Streetlight 60W" />

      {/* Pricing */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Normal price (₦)"
          value={form.bonusPrice}
          onChange={(v) => set("bonusPrice", v)}
          type="number"
          placeholder="85000"
          required={false}
          hint="Original price — shown struck-through. Leave blank if no discount."
        />
        <Field
          label="Selling / bonus price (₦) *"
          value={form.price}
          onChange={(v) => set("price", v)}
          type="number"
          placeholder="65000"
          hint="What customers actually pay (the discounted price)."
        />
      </div>

      {discount > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-success/10 border border-success/20 px-4 py-2.5 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold text-success">
            <Tag className="w-4 h-4" /> -{discount}% sale
          </span>
          <span className="text-muted-foreground text-xs">
            Customers see <b className="text-foreground">{formatNaira(priceNum)}</b>{" "}
            <s className="ml-1">{formatNaira(bonusNum)}</s>
          </span>
        </div>
      )}

      <div>
        <label className="text-sm font-medium block mb-1.5">Category *</label>
        <select
          required
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          className="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Description *</label>
        <textarea
          rows={4}
          required
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe the product features, specifications, and use cases…"
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
        />
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

function Field({
  label, value, onChange, type = "text", placeholder, hint, required = true,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; hint?: string; required?: boolean;
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
        min={type === "number" ? "0" : undefined}
        className="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
      />
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
