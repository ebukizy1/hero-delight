import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/Logo";
import { Seo } from "@/components/Seo";

// Supabase Auth identifies users by email, so a plain username (no "@") is mapped to
// <username>@<this domain>. Create that email as the user in Supabase Dashboard → Authentication.
const USERNAME_EMAIL_DOMAIN = "onlinesolarstore.store";

const loginToEmail = (login: string) => {
  const v = login.trim().toLowerCase();
  return v.includes("@") ? v : `${v}@${USERNAME_EMAIL_DOMAIN}`;
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin/dashboard", { replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginToEmail(login),
        password,
      });
      if (authError) throw authError;
      if (data.session) navigate("/admin/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setError(/invalid login credentials/i.test(msg) || !msg ? "Wrong username/email or password" : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-glow px-4 py-10">
      <Seo title="Admin Sign In — Emax Solar Store" description="Admin" noindex />
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <h1 className="font-display font-bold text-xl">Admin Sign In</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage products and inventory</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5" htmlFor="login">Username or email</label>
              <input
                id="login" type="text" value={login} onChange={(e) => setLogin(e.target.value)} required
                autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false}
                className="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                placeholder="Username or admin@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" htmlFor="password">Password</label>
              <input
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                className="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors underline">← Back to shop</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
