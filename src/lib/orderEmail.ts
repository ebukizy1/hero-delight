import { supabase } from "./supabase";
import type { DbOrder } from "./orders";

/**
 * Sends an order confirmation email via the `send-order-email` Supabase Edge Function
 * (see supabase/functions/send-order-email), which forwards to the Resend API.
 * Best-effort only — the order is already saved by this point, so a failure here
 * (missing email, Resend not configured, network error) must never block checkout.
 */
export async function sendOrderConfirmationEmail(order: DbOrder): Promise<void> {
  if (!order.email) return;
  try {
    await supabase.functions.invoke("send-order-email", {
      body: {
        order_id: order.id,
        customer_name: order.customer_name,
        email: order.email,
        phone: order.phone,
        address: order.address,
        city: order.city,
        items: order.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
        total: order.total,
        payment_method: order.payment_method,
      },
    });
  } catch {
    // Best-effort only — never block the checkout flow on email delivery.
  }
}
