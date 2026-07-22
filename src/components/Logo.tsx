import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  variant?: "default" | "light";
  className?: string;
}

const SIZES = {
  sm: { mark: "w-8 h-8", text: "text-base" },
  md: { mark: "w-10 h-10", text: "text-lg" },
  lg: { mark: "w-12 h-12", text: "text-xl" },
};

export function Logo({ size = "md", withText = true, variant = "default", className = "" }: LogoProps) {
  const s = SIZES[size];
  const textColor = variant === "light" ? "text-white" : "text-foreground";
  const accentColor = "text-accent";

  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <img
        src="/logo.png"
        alt="Emax Solar Store"
        width={64}
        height={64}
        fetchPriority="high"
        className={`${s.mark} object-contain rounded-md transition-transform group-hover:scale-105`}
      />
      {withText && (
        <span className={`font-display font-extrabold ${s.text} tracking-tight leading-none ${textColor}`}>
          Emax <span className={accentColor}>Solar</span> Store
        </span>
      )}
    </Link>
  );
}
