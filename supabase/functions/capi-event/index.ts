// Supabase Edge Function — forwards browser pixel events to Meta's Conversions API,
// so purchases/add-to-cart/etc. still get reported server-side even when the browser
// pixel is blocked (ad blockers, iOS tracking prevention, etc.).
//
// Deploy:      supabase functions deploy capi-event
// Configure:   supabase secrets set META_PIXEL_ID=1320732783490764 META_CAPI_TOKEN=<your Conversions API access token>
// Token source: Meta Events Manager → Data Sources → your pixel → Settings → Conversions API → Generate access token
//
// Called from the client via supabase.functions.invoke("capi-event", { body: {...} }) —
// see src/lib/metaCapi.ts. Never call Meta directly from the browser: this token must
// stay server-side.

const PIXEL_ID = Deno.env.get("META_PIXEL_ID");
const ACCESS_TOKEN = Deno.env.get("META_CAPI_TOKEN");
const GRAPH_VERSION = "v21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CapiRequestBody {
  event_name: string;
  event_id: string;
  event_source_url?: string;
  user_data?: {
    email?: string;
    phone?: string;
    fbp?: string;
    fbc?: string;
  };
  custom_data?: Record<string, unknown>;
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return new Response(JSON.stringify({ error: "Meta Conversions API is not configured (missing META_PIXEL_ID / META_CAPI_TOKEN secrets)" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: CapiRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { event_name, event_id, event_source_url, user_data = {}, custom_data = {} } = body;
  if (!event_name || !event_id) {
    return new Response(JSON.stringify({ error: "event_name and event_id are required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = req.headers.get("user-agent") ?? undefined;

  const hashedUserData: Record<string, unknown> = {
    client_ip_address: ip,
    client_user_agent: userAgent,
  };
  if (user_data.email) hashedUserData.em = [await sha256Hex(user_data.email)];
  if (user_data.phone) hashedUserData.ph = [await sha256Hex(user_data.phone.replace(/[^0-9]/g, ""))];
  if (user_data.fbp) hashedUserData.fbp = user_data.fbp;
  if (user_data.fbc) hashedUserData.fbc = user_data.fbc;

  const payload = {
    data: [
      {
        event_name,
        event_id,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url,
        action_source: "website",
        user_data: hashedUserData,
        custom_data,
      },
    ],
  };

  const metaRes = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const result = await metaRes.json();

  return new Response(JSON.stringify(result), {
    status: metaRes.status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
