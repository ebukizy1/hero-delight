import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Package, ClipboardList, Newspaper, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

const TABS = [
  { prefix: "/admin/dashboard", extra: ["/admin/add-product", "/admin/edit-product"], to: "/admin/dashboard", label: "Products", icon: Package },
  { prefix: "/admin/orders", extra: [] as string[], to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { prefix: "/admin/insights", extra: [] as string[], to: "/admin/insights", label: "Solar Insights", icon: Newspaper },
];

export function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 font-display font-extrabold text-lg">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          Emax Solar Store <span className="text-muted-foreground font-medium">Admin</span>
        </Link>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
      <nav className="container mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto scrollbar-hide">
        {TABS.map(({ to, label, icon: Icon, prefix, extra }) => {
          const active = location.pathname.startsWith(prefix) || extra.some((p) => location.pathname.startsWith(p));
          return (
            <Link
              key={to}
              to={to}
              className={`inline-flex items-center gap-2 px-4 h-11 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                active
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
