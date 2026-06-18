import React, { useRef, useState, type FormEvent } from "react";
import { ImageIcon, Loader2, CheckCircle, AlertCircle, Tag, Star, Plus, Trash2 } from "lucide-react";
import { CATEGORIES, formatNaira, discountPercent } from "@/lib/products";

export interface ProductFormValue {
  name: string;
  price: string;
  bonusPrice: string;
  category: string;
  description: string;
  featured: boolean;
  specifications: Array<{ label: string; value: string }>;
}

interface Props {
  initialValue?: ProductFormValue;
  initialPreview1?: string | null;
  initialPreview2?: string | null;
  initialPreview3?: string | null;
  submitLabel: string;
  onSubmit: (value: ProductFormValue, imageFile1: File | null, imageFile2: File | null, imageFile3: File | null) => Promise<void>;
  onCancel?: () => void;
  imageRequired?: boolean;
}

const ImageUpload = React.forwardRef<HTMLInputElement, {
  label: string;
  preview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}>(({ label, preview, onUpload, required }, ref) => {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">
        {label}{required ? " *" : ""}
      </label>
      <div
        onClick={() => (ref as React.RefObject<HTMLInputElement>).current?.click()}
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors overflow-hidden"
        style={{ minHeight: preview ? "auto" : "6rem" }}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full max-h-40 object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 py-6">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click to upload</span>
          </div>
        )}
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onUpload} />
      </div>
      {preview && (
        <button
          type="button"
          onClick={() => (ref as React.RefObject<HTMLInputElement>).current?.click()}
          className="mt-2 text-xs text-muted-foreground underline hover:text-foreground"
        >
          Change image
        </button>
      )}
    </div>
  );
});
ImageUpload.displayName = "ImageUpload";

export function ProductForm({
  initialValue,
  initialPreview1 = null,
  initialPreview2 = null,
  initialPreview3 = null,
  submitLabel,
  onSubmit,
  onCancel,
  imageRequired = false,
}: Props) {
  const file1Ref = useRef<HTMLInputElement>(null);
  const file2Ref = useRef<HTMLInputElement>(null);
  const file3Ref = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [preview1, setPreview1] = useState<string | null>(initialPreview1);
  const [preview2, setPreview2] = useState<string | null>(initialPreview2);
  const [preview3, setPreview3] = useState<string | null>(initialPreview3);
  const [imageFile1, setImageFile1] = useState<File | null>(null);
  const [imageFile2, setImageFile2] = useState<File | null>(null);
  const [imageFile3, setImageFile3] = useState<File | null>(null);

  const [form, setForm] = useState<ProductFormValue>(
    initialValue ?? { name: "", price: "", bonusPrice: "", category: "", description: "", featured: false, specifications: [] }
  );

  const set = <K extends keyof ProductFormValue>(k: K, v: ProductFormValue[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const addSpec = () => set("specifications", [...form.specifications, { label: "", value: "" }]);
  const updateSpec = (i: number, key: "label" | "value", v: string) =>
    set("specifications", form.specifications.map((s, idx) => (idx === i ? { ...s, [key]: v } : s)));
  const removeSpec = (i: number) => set("specifications", form.specifications.filter((_, idx) => idx !== i));

  const handleImage1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile1(file);
    setPreview1(URL.createObjectURL(file));
  };
  const handleImage2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile2(file);
    setPreview2(URL.createObjectURL(file));
  };
  const handleImage3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile3(file);
    setPreview3(URL.createObjectURL(file));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (imageRequired && !imageFile1 && !initialPreview1) {
      setError("Please upload at least product image 1");
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
      await onSubmit(form, imageFile1, imageFile2, imageFile3);
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
      {/* Images */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ImageUpload
          label="Product image 1"
          preview={preview1}
          onUpload={handleImage1}
          required={imageRequired}
          ref={file1Ref}
        />
        <ImageUpload
          label="Product image 2"
          preview={preview2}
          onUpload={handleImage2}
          ref={file2Ref}
        />
        <ImageUpload
          label="Product image 3"
          preview={preview3}
          onUpload={handleImage3}
          ref={file3Ref}
        />
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

      {/* Specifications */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium">Technical specifications</label>
          <button
            type="button"
            onClick={addSpec}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add row
          </button>
        </div>
        {form.specifications.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2">
            No specs yet. Add rows like "Battery", "Power", "Waterproof Level"…
          </p>
        ) : (
          <div className="space-y-2">
            {form.specifications.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  type="text"
                  value={s.label}
                  onChange={(e) => updateSpec(i, "label", e.target.value)}
                  placeholder="Label (e.g. Battery)"
                  className="h-10 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
                <input
                  type="text"
                  value={s.value}
                  onChange={(e) => updateSpec(i, "value", e.target.value)}
                  placeholder="Value (e.g. Lithium 5000mAh)"
                  className="h-10 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(i)}
                  className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                  aria-label="Remove row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 cursor-pointer hover:bg-secondary/60 transition-colors">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => set("featured", e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-accent cursor-pointer"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Star className={`w-4 h-4 ${form.featured ? "fill-accent text-accent" : "text-muted-foreground"}`} />
            Show as Featured on homepage
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Toggle on to highlight this product in the homepage Featured carousel.
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
