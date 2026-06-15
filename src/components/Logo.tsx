import { Link } from "react-router-dom";
import logoMark from "@/assets/logo-mark.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  variant?: "default" | "light";
  className?: string;
}

const SIZES = {
  sm: { mark: "w-7 h-7", text: "text-base" },
  md: { mark: "w-9 h-9", text: "text-lg" },
  lg: { mark: "w-11 h-11", text: "text-xl" },
};

export function Logo({ size = "md", withText = true, variant = "default", className = "" }: LogoProps) {
  const s = SIZES[size];
  const textColor = variant === "light" ? "text-white" : "text-foreground";
  const accentColor = variant === "light" ? "text-accent" : "text-accent";

  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <img
        src={logoMark}
        alt="E-maxsolarstore"
        width={64}
        height={64}
        className={`${s.mark} object-contain transition-transform group-hover:scale-105`}
      />
      {withText && (
        <span className={`font-display font-extrabold ${s.text} tracking-tight leading-none ${textColor}`}>
          E-max<span className={accentColor}>solar</span>store
        </span>
      )}
    </Link>
  );
}
