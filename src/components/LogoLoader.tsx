interface Props {
  /** Optional caption shown under the mark, e.g. "Loading products…" */
  label?: string;
  size?: "sm" | "md" | "lg";
  /** Centers itself in a min-h-screen wrapper. Set false to drop inline into existing content. */
  fullScreen?: boolean;
}

const SIZES = { sm: "w-10 h-10", md: "w-14 h-14", lg: "w-20 h-20" };

export function LogoLoader({ label, size = "md", fullScreen = true }: Props) {
  const mark = SIZES[size];

  const content = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center w-20 h-20">
        <span className={`absolute rounded-full bg-accent/25 animate-pulse-ring ${mark}`} aria-hidden />
        <span
          className={`absolute rounded-full bg-accent/20 animate-pulse-ring ${mark}`}
          style={{ animationDelay: "0.7s" }}
          aria-hidden
        />
        <img src="/logo.png" alt="" className={`${mark} object-contain rounded-xl relative animate-logo-breathe`} />
      </div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" role="status" aria-label={label ?? "Loading"}>
      {content}
    </div>
  );
}
