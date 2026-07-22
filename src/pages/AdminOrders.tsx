import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Package, Clock, CheckCircle2, Banknote, ChevronDown, ChevronUp } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { fetchOrders, updateOrderStatus, type DbOrder, type OrderStatus } from "@/lib/orders";
import { formatNaira } from "@/lib/products";
import { getErrorMessage } from "@/lib/utils";
import { Seo } from "@/components/Seo";

const STATUS_OPTIONS: OrderStatus[] = ["new", "processing", "delivered", "cancelled"];

const STATUS_STYLE: Record<OrderStatus, string> = {
  new: "bg-accent/15 text-accent",
  processing: "bg-blue-500/15 text-blue-600",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-destructive/15 text-destructive",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setOrders(await fetchOrders());
    } catch (err) {
      setError(
        `Failed to load orders: ${getErrorMessage(err, "unknown error")}. Make sure the 'orders' table and its policies exist (see supabase/migrations).`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === "new").length;
    const revenue = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + Number(o.total), 0);
    const codOutstanding = orders
      .filter((o) => o.payment_method === "cod" && o.status !== "delivered" && o.status !== "cancelled")
      .reduce((s, o) => s + Number(o.total), 0);
    return { pending, revenue, codOutstanding, total: orders.length };
  }, [orders]);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await updateOrderStatus(id, status);
    } catch {
      alert("Failed to update order status");
      load();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/40">
      <Seo title="Orders — Admin — Emax Solar Store" description="Admin" noindex />
      <AdminNav />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl">Orders</h1>
          <p className="text-sm text-muted-foreground">Track and fulfil customer orders</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard icon={<Package className="w-4 h-4" />} label="Total Orders" value={stats.total.toString()} />
          <StatCard icon={<Clock className="w-4 h-4" />} label="New / Pending" value={stats.pending.toString()} />
          <StatCard icon={<CheckCircle2 className="w-4 h-4" />} label="Paid Revenue" value={formatNaira(stats.revenue)} />
          <StatCard icon={<Banknote className="w-4 h-4" />} label="COD to Collect" value={formatNaira(stats.codOutstanding)} />
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          <div className="p-4 sm:p-5 border-b border-border flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold">All Orders</h2>
          </div>

          {error && (
            <div className="flex items-center gap-2 m-4 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {loading ? (
            <div className="p-10 text-center text-muted-foreground text-sm">Loading orders…</div>
          ) : orders.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-sm">No orders yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {orders.map((o) => {
                const isOpen = expanded === o.id;
                return (
                  <li key={o.id} className="hover:bg-secondary/40 transition-colors">
                    <button
                      onClick={() => setExpanded(isOpen ? null : o.id)}
                      className="w-full p-3 sm:p-4 flex items-center gap-3 sm:gap-4 text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">#{o.id.slice(0, 8).toUpperCase()}</p>
                          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_STYLE[o.status]}`}>
                            {o.status}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            {o.payment_method === "cod" ? "Cash on Delivery" : "Card"} · {o.payment_status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">{o.customer_name} · {o.phone}</p>
                      </div>
                      <p className="font-display font-extrabold text-sm sm:text-base shrink-0">{formatNaira(Number(o.total))}</p>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                    </button>

                    {isOpen && (
                      <div className="px-3 sm:px-4 pb-4 space-y-3">
                        <div className="rounded-xl bg-secondary/40 p-3 sm:p-4 text-sm space-y-1.5">
                          <p><span className="text-muted-foreground">Address:</span> {o.address}{o.city ? `, ${o.city}` : ""}</p>
                          {o.email && <p><span className="text-muted-foreground">Email:</span> {o.email}</p>}
                          {o.notes && <p><span className="text-muted-foreground">Notes:</span> {o.notes}</p>}
                          <p><span className="text-muted-foreground">Placed:</span> {new Date(o.created_at).toLocaleString("en-NG")}</p>
                        </div>
                        <ul className="space-y-1.5">
                          {o.items.map((i, idx) => (
                            <li key={idx} className="flex items-center justify-between text-sm">
                              <span>{i.name} × {i.qty}</span>
                              <span className="font-medium">{formatNaira(i.price * i.qty)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center gap-2 pt-1">
                          <label className="text-xs font-semibold text-muted-foreground">Status:</label>
                          <select
                            value={o.status}
                            disabled={updatingId === o.id}
                            onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                            className="h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
        {icon}
        {label}
      </div>
      <p className="font-display font-extrabold text-lg sm:text-xl truncate">{value}</p>
    </div>
  );
}

export default AdminOrders;
