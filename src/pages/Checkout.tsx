import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, Truck, CreditCard, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart, cart } from "@/lib/cart";
import { formatNaira } from "@/lib/products";
import { createOrder, markOrderPaid } from "@/lib/orders";
import { isCardPaymentEnabled, payWithPaystack } from "@/lib/payments";
import { getErrorMessage } from "@/lib/utils";
import { Seo } from "@/components/Seo";
import type { PaymentMethod } from "@/lib/orders";

const Checkout = () => {
  const items = useCart();
  const navigate = useNavigate();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const cardEnabled = isCardPaymentEnabled();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const emailRequired = method === "card";

  const canSubmit = useMemo(
    () => name.trim() && phone.trim() && address.trim() && (!emailRequired || email.trim()),
    [name, phone, address, email, emailRequired],
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Seo title="Checkout — Emax Solar Store" description="Complete your order." noindex />
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 gap-3">
          <div className="text-5xl">🛒</div>
          <h1 className="font-display font-bold text-xl">Your cart is empty</h1>
          <p className="text-sm text-muted-foreground">Add a few products before checking out.</p>
          <Link to="/" className="mt-3 inline-flex h-11 px-6 items-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            Browse products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setError("");
    setSubmitting(true);

    const orderInput = {
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim(),
      city: city.trim() || undefined,
      notes: notes.trim() || undefined,
      items,
      subtotal: total,
      total,
    };

    try {
      if (method === "cod") {
        const order = await createOrder({ ...orderInput, paymentMethod: "cod" });
        cart.clear();
        navigate(`/order-success/${order.id}`, { state: { order } });
        return;
      }

      const reference = `EMAX-${Date.now()}`;
      await payWithPaystack({
        email: email.trim(),
        amountNaira: total,
        reference,
        onSuccess: async (ref) => {
          try {
            const order = await createOrder({ ...orderInput, paymentMethod: "card" });
            await markOrderPaid(order.id, ref);
            cart.clear();
            navigate(`/order-success/${order.id}`, {
              state: { order: { ...order, payment_status: "paid", payment_reference: ref } },
            });
          } catch (err) {
            setError(
              `Payment succeeded but we couldn't save your order (${getErrorMessage(err)}). Please contact us on WhatsApp with your payment reference.`,
            );
            setSubmitting(false);
          }
        },
        onClose: () => setSubmitting(false),
      });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo title="Checkout — Emax Solar Store" description="Complete your order." noindex />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 py-6 lg:py-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to shop
          </Link>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-6">Checkout</h1>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-soft">
                <h2 className="font-display font-bold text-base">Delivery details</h2>
                <Field label="Full name *" value={name} onChange={setName} placeholder="e.g. Adaeze Okafor" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Phone number *" value={phone} onChange={setPhone} type="tel" placeholder="080X XXX XXXX" />
                  <Field
                    label={`Email${emailRequired ? " *" : " (optional)"}`}
                    value={email}
                    onChange={setEmail}
                    type="email"
                    placeholder="you@example.com"
                    required={emailRequired}
                  />
                </div>
                <Field label="Delivery address *" value={address} onChange={setAddress} placeholder="Street, house number, landmark" />
                <Field label="City / State" value={city} onChange={setCity} placeholder="e.g. Lagos" required={false} />
                <div>
                  <label className="text-sm font-medium block mb-1.5">Order notes (optional)</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything we should know about your delivery?"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
                  />
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-3 shadow-soft">
                <h2 className="font-display font-bold text-base">Payment method</h2>

                <PaymentOption
                  active={method === "cod"}
                  onClick={() => setMethod("cod")}
                  icon={<Truck className="w-4 h-4" />}
                  title="Cash on Delivery"
                  sub="Pay in cash when your order arrives"
                />
                <PaymentOption
                  active={method === "card"}
                  onClick={() => cardEnabled && setMethod("card")}
                  icon={<CreditCard className="w-4 h-4" />}
                  title="Pay with Card"
                  sub={cardEnabled ? "Secure payment via Paystack" : "Coming soon — use Cash on Delivery for now"}
                  disabled={!cardEnabled}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Placing order…" : method === "cod" ? "Place order" : `Pay ${formatNaira(total)}`}
              </button>
              <p className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5" /> Your details are only used to fulfil this order.
              </p>
            </form>

            {/* Order summary */}
            <div className="lg:col-span-5">
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-soft lg:sticky lg:top-24">
                <h2 className="font-display font-bold text-base mb-4">Order summary</h2>
                <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {items.map((i) => (
                    <li key={i.id} className="flex gap-3">
                      <img src={i.image} alt={i.name} loading="lazy" decoding="async" className="w-14 h-14 rounded-lg object-cover bg-muted shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{i.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Qty {i.qty}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">{formatNaira(i.price * i.qty)}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-display font-extrabold text-xl">{formatNaira(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

function Field({
  label, value, onChange, type = "text", placeholder, required = true,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
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
        className="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
      />
    </div>
  );
}

function PaymentOption({
  active, onClick, icon, title, sub, disabled,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
        active ? "border-accent bg-accent/10" : "border-border hover:bg-secondary/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"}`}>
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-sm">{title}</span>
        <span className="block text-xs text-muted-foreground">{sub}</span>
      </span>
      <span className={`w-4 h-4 rounded-full border-2 shrink-0 ${active ? "border-accent bg-accent" : "border-border"}`} />
    </button>
  );
}

export default Checkout;
