// Supabase Edge Function — sends an order confirmation email via the Resend API.
//
// Deploy:      supabase functions deploy send-order-email
// Configure:   supabase secrets set RESEND_API_KEY=<your Resend API key> STORE_FROM_EMAIL="Emax Solar Store <orders@yourverifieddomain.com>"
// Notes:       RESEND_API_KEY comes from https://resend.com/api-keys. STORE_FROM_EMAIL must use a
//              domain you've verified in Resend (Domains tab) — until then Resend only lets you
//              send from onboarding@resend.dev, which is fine for testing but will look
//              unprofessional / land in spam for real customers.
//
// Called from the client via supabase.functions.invoke("send-order-email", { body: {...} }) —
// see src/lib/orderEmail.ts. This is best-effort: the order is already saved by the time this
// runs, so a failure here must never be surfaced as a failed checkout.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("STORE_FROM_EMAIL") ?? "Emax Solar Store <onboarding@resend.dev>";
const SUPPORT_WHATSAPP = "https://wa.me/2348037477275";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailItem {
  name: string;
  qty: number;
  price: number;
}

interface OrderEmailRequestBody {
  order_id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city?: string | null;
  items: OrderEmailItem[];
  total: number;
  payment_method: "cod" | "card";
}

function formatNaira(n: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildEmailHtml(body: OrderEmailRequestBody): string {
  const shortId = body.order_id.slice(0, 8).toUpperCase();
  const rows = body.items
    .map(
      (i) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #E4E2DD;color:#0E2138;font-size:14px;">${escapeHtml(i.name)} &times;${i.qty}</td>
          <td style="padding:10px 0;border-bottom:1px solid #E4E2DD;color:#0E2138;font-size:14px;text-align:right;white-space:nowrap;">${formatNaira(i.price * i.qty)}</td>
        </tr>`,
    )
    .join("");

  const paymentLine =
    body.payment_method === "cod"
      ? "Cash on Delivery — please have the exact amount ready for the rider."
      : "Paid by card.";

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#F6F4EF;padding:24px 0;">
    <div style="max-width:520px;margin:0 auto;background:#FBFAF8;border-radius:16px;overflow:hidden;border:1px solid #E4E2DD;">
      <div style="background:#0E2138;padding:24px 28px;">
        <p style="margin:0;color:#F2A93B;font-weight:bold;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;">Emax Solar Store</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:20px;">Order confirmed — #${shortId}</h1>
      </div>
      <div style="padding:24px 28px;">
        <p style="margin:0 0 16px;color:#0E2138;font-size:15px;">Hi ${escapeHtml(body.customer_name)}, thanks for your order! Here's a summary:</p>

        <table style="width:100%;border-collapse:collapse;">
          ${rows}
          <tr>
            <td style="padding:14px 0 0;color:#0E2138;font-weight:bold;font-size:15px;">Total</td>
            <td style="padding:14px 0 0;color:#0E2138;font-weight:bold;font-size:15px;text-align:right;">${formatNaira(body.total)}</td>
          </tr>
        </table>

        <div style="margin-top:20px;padding:16px;background:#F6F4EF;border-radius:12px;">
          <p style="margin:0 0 6px;color:#0E2138;font-size:13px;"><strong>Delivery address:</strong> ${escapeHtml(body.address)}${body.city ? `, ${escapeHtml(body.city)}` : ""}</p>
          <p style="margin:0 0 6px;color:#0E2138;font-size:13px;"><strong>Phone:</strong> ${escapeHtml(body.phone)}</p>
          <p style="margin:0;color:#0E2138;font-size:13px;"><strong>Payment:</strong> ${paymentLine}</p>
        </div>

        <p style="margin:20px 0 0;color:#4B5563;font-size:13px;line-height:1.5;">
          Questions about your order? <a href="${SUPPORT_WHATSAPP}" style="color:#D97706;font-weight:bold;text-decoration:none;">Message us on WhatsApp</a> and mention order #${shortId}.
        </p>
      </div>
    </div>
  </div>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email is not configured (missing RESEND_API_KEY secret)" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: OrderEmailRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!body.email || !body.order_id || !Array.isArray(body.items)) {
    return new Response(JSON.stringify({ error: "email, order_id and items are required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const shortId = body.order_id.slice(0, 8).toUpperCase();

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [body.email],
      subject: `Order confirmed — #${shortId} — Emax Solar Store`,
      html: buildEmailHtml(body),
    }),
  });

  const result = await resendRes.json();

  return new Response(JSON.stringify(result), {
    status: resendRes.status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
