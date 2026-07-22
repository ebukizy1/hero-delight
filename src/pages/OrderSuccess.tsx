import { useLocation, useParams, Link } from "react-router-dom";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatNaira } from "@/lib/products";
import { buildWhatsAppLink, checkoutOrderMessage } from "@/lib/cart";
import type { DbOrder } from "@/lib/orders";

const OrderSuccess = () => {
  const { id = "" } = useParams<{ id: string }>();
  const location = useLocation();
  const order = (location.state as { order?: DbOrder } | null)?.order;
  const shortId = id.slice(0, 8).toUpperCase();

  const whatsappHref = order
    ? buildWhatsAppLink(
        checkoutOrderMessage({
          id: order.id,
          items: order.items,
          total: order.total,
          paymentMethod: order.payment_method,
          customerName: order.customer_name,
          address: order.address,
        }),
      )
    : buildWhatsAppLink(`Hello! I just placed order #${shortId} on Emax Solar Store. Please confirm it for me. Thank you!`);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-success/15 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">Order placed!</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Order <span className="font-semibold text-foreground">#{shortId}</span> has been received.
            {order?.payment_method === "card" ? " Your payment was successful." : " Pay in cash when it arrives."}
          </p>

          {order && (
            <div className="mt-6 bg-card border border-border rounded-2xl p-5 text-left shadow-soft">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display font-extrabold text-lg">{formatNaira(order.total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Delivery to</span>
                <span className="font-medium text-right">{order.address}</span>
              </div>
            </div>
          )}

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-whatsapp text-whatsapp-foreground font-semibold hover:opacity-90 transition-opacity text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Confirm order on WhatsApp
          </a>

          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue shopping <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
