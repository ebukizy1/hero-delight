const ITEMS = ["Pay on delivery", "Free delivery nationwide", "1-year warranty"];

export function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 h-8 flex items-center justify-center gap-2 text-[11px] sm:text-xs font-medium text-primary-foreground/75 overflow-x-auto scrollbar-hide">
        {ITEMS.map((label, i) => (
          <span key={label} className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            {i > 0 && <span className="text-primary-foreground/25">|</span>}
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
