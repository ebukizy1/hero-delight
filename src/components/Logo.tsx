import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  className?: string;
}

const SIZES = {
  sm: { box: "w-8 h-8", text: "text-base" },
  md: { box: "w-9 h-9", text: "text-lg" },
  lg: { box: "w-11 h-11", text: "text-xl" },
};

export function Logo({ size = "md", withText = true, className = "" }: LogoProps) {
  const s = SIZES[size];
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <span className={`relative ${s.box} rounded-xl bg-gradient-sun shadow-soft flex items-center justify-center overflow-hidden group-hover:shadow-glow transition-shadow`}>
        {/* Sun mark — clean SVG */}
        <svg viewBox="0 0 32 32" className="w-[60%] h-[60%] text-primary-foreground" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <circle cx="16" cy="16" r="5" fill="currentColor" stroke="none" />
          <g className="origin-center animate-sun-rotate">
            <path d="M16 3v3" />
            <path d="M16 26v3" />
            <path d="M3 16h3" />
            <path d="M26 16h3" />
            <path d="M6.7 6.7l2.1 2.1" />
            <path d="M23.2 23.2l2.1 2.1" />
            <path d="M6.7 25.3l2.1-2.1" />
            <path d="M23.2 8.8l2.1-2.1" />
          </g>
        </svg>
      </span>
      {withText && (
        <span className={`font-display font-extrabold ${s.text} tracking-tight leading-none`}>
          Solar<span className="text-gradient-sun">Hub</span>
        </span>
      )}
    </Link>
  );
}
