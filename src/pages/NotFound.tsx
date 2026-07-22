import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Sun } from "lucide-react";
import { Logo } from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Page not found — Emax Solar Store";
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-hero-glow text-white px-4 py-16 text-center">
      <div className="mb-8">
        <Logo variant="light" size="lg" />
      </div>
      <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-sun items-center justify-center shadow-glow animate-float-slow mb-5">
        <Sun className="w-6 h-6 text-primary-foreground animate-sun-rotate" />
      </div>
      <h1 className="font-display font-extrabold text-5xl sm:text-6xl tracking-tight">404</h1>
      <p className="mt-3 text-white/70 text-base">This page has gone off-grid. Let's get you back on track.</p>
      <Link
        to="/"
        className="mt-7 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-accent text-accent-foreground font-bold hover:brightness-110 transition-all hover:-translate-y-0.5 shadow-glow"
      >
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>
    </div>
  );
};

export default NotFound;
