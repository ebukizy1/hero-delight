import { useRef, useState, type ChangeEvent, type FormEvent, type RefObject } from "react";
import { ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export interface ComparisonFormValue {
  title: string;
  productATitle: string;
  productADetails: string;
  productBTitle: string;
  productBDetails: string;
  comparisonContent: string;
  conclusion: string;
  slug: string;
  published: boolean;
  publishedDate: string;
  salesPageUrl: string;
}

interface Props {
  initialValue?: ComparisonFormValue;
  initialBannerPreview?: string | null;
  initialProductAPreview?: string | null;
  initialProductBPreview?: string | null;
  submitLabel: string;
  onSubmit: (value: ComparisonFormValue, bannerFile: File | null, productAFile: File | null, productBFile: File | null) => Promise<void>;
  onCancel?: () => void;
  imageRequired?: boolean;
}

export function ComparisonForm({
  initialValue,
  initialBannerPreview = null,
  initialProductAPreview = null,
  initialProductBPreview = null,
  submitLabel,
  onSubmit,
  onCancel,
  imageRequired = false,
}: Props) {
  const bannerRef = useRef<HTMLInputElement>(null);
  const productARef = useRef<HTMLInputElement>(null);
  const productBRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialBannerPreview);
  const [productAPreview, setProductAPreview] = useState<string | null>(initialProductAPreview);
  const [productBPreview, setProductBPreview] = useState<string | null>(initialProductBPreview);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [productAFile, setProductAFile] = useState<File | null>(null);
  const [productBFile, setProductBFile] = useState<File | null>(null);

  const [form, setForm] = useState<ComparisonFormValue>(
    initialValue ?? {
      title: "",
      productATitle: "",
      productADetails: "",
      productBTitle: "",
      productBDetails: "",
      comparisonContent: "",
      conclusion: "",
      slug: "",
      published: false,
      publishedDate: new Date().toISOString().split("T")[0],
      salesPageUrl: "",
    }
  );

  const set = <K extends keyof ComparisonFormValue>(k: K, v: ComparisonFormValue[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleBannerImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleProductAImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProductAFile(file);
    setProductAPreview(URL.createObjectURL(file));
  };

  const handleProductBImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProductBFile(file);
    setProductBPreview(URL.createObjectURL(file));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (imageRequired) {
      if (!bannerFile && !initialBannerPreview) {
        setError("Please upload a banner image");
        return;
      }
      if (!productAFile && !initialProductAPreview) {
        setError("Please upload Product A image");
        return;
      }
      if (!productBFile && !initialProductBPreview) {
        setError("Please upload Product B image");
        return;
      }
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit(form, bannerFile, productAFile, productBFile);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save comparison");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5 shadow-soft">
      <ImageUpload
        label="Banner Image"
        preview={bannerPreview}
        onUpload={handleBannerImage}
        inputRef={bannerRef}
        required={imageRequired}
      />
      <Field label="Title *" value={form.title} onChange={(v: string) => set("title", v)} placeholder="Enter comparison title (e.g., 100W vs 200W Solar Streetlight" />
      <Field label="Slug *" value={form.slug} onChange={(v: string) => set("slug", v)} placeholder="e.g., 100w-vs-200w-solar-streetlight" />

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Product A</h3>
          <ImageUpload
            label="Product A Image"
            preview={productAPreview}
            onUpload={handleProductAImage}
            inputRef={productARef}
            required={imageRequired}
          />
          <Field
            label="Product A Title"
            value={form.productATitle}
            onChange={(v: string) => set("productATitle", v)}
            placeholder="e.g., 100W Solar Streetlight"
          />
          <div>
            <label className="text-sm font-medium block mb-1.5">Product A Details</label>
            <textarea
              rows={4}
              required
              value={form.productADetails}
              onChange={(e) => set("productADetails", e.target.value)}
              placeholder="Describe Product A..."
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Product B</h3>
          <ImageUpload
            label="Product B Image"
            preview={productBPreview}
            onUpload={handleProductBImage}
            inputRef={productBRef}
            required={imageRequired}
          />
          <Field
            label="Product B Title"
            value={form.productBTitle}
            onChange={(v: string) => set("productBTitle", v)}
            placeholder="e.g., 200W Solar Streetlight"
          />
          <div>
            <label className="text-sm font-medium block mb-1.5">Product B Details</label>
            <textarea
              rows={4}
              required
              value={form.productBDetails}
              onChange={(e) => set("productBDetails", e.target.value)}
              placeholder="Describe Product B..."
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Comparison Content</label>
        <textarea
          rows={8}
          required
          value={form.comparisonContent}
          onChange={(e) => set("comparisonContent", e.target.value)}
          placeholder="Write your detailed comparison..."
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Conclusion</label>
        <textarea
          rows={4}
          required
          value={form.conclusion}
          onChange={(e) => set("conclusion", e.target.value)}
          placeholder="Write your conclusion..."
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
        />
      </div>

      <Field label="Sales Page URL" value={form.salesPageUrl} onChange={(v: string) => set("salesPageUrl", v)} placeholder="https://example.com/sales-page" required={false} />
      <Field label="Published Date" type="date" value={form.publishedDate} onChange={(v: string) => set("publishedDate", v)} />

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
            Toggle on to make this comparison visible
          </p>
        </div>
      </label>

      {error && (
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
        </div>
      )}
      {done && (
        <div className="flex items-center gap-2 text-sm text-success bg-success/10 rounded-xl px-3 py-2">
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

function ImageUpload({
  label,
  preview,
  onUpload,
  inputRef,
  required,
}: {
  label: string;
  preview: string | null;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
  required: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">
        {label}{required ? " *" : ""}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors overflow-hidden"
        style={{ minHeight: preview ? "auto" : "6rem" }}
      >
        {preview ? (
          <img src={preview} alt={`${label} preview`} className="w-full max-h-40 object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 py-6">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click to upload</span>
          </div>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
      {preview && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-xs text-muted-foreground underline hover:text-foreground"
        >
          Change image
        </button>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, hint, required = true }: {
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
        min={type === "number" ? "0" : undefined}
        className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
      />
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
