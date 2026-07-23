import { supabase } from "./supabase";
import { fbBrowserIds } from "./metaPixel";

interface CapiUserData {
  email?: string;
  phone?: string;
}

/**
 * Mirrors a browser pixel event to Meta's Conversions API via the `capi-event` Supabase
 * Edge Function (see supabase/functions/capi-event) — server-side delivery that survives
 * ad blockers / iOS tracking prevention. Pass the same eventId used in the fbq() call so
 * Meta deduplicates the two into a single event.
 */
export async function sendCapiEvent(
  eventName: string,
  eventId: string,
  customData?: Record<string, unknown>,
  userData?: CapiUserData,
): Promise<void> {
  try {
    const { fbp, fbc } = fbBrowserIds();
    await supabase.functions.invoke("capi-event", {
      body: {
        event_name: eventName,
        event_id: eventId,
        event_source_url: typeof window !== "undefined" ? window.location.href : undefined,
        user_data: { ...userData, fbp, fbc },
        custom_data: customData ?? {},
      },
    });
  } catch {
    // Best-effort only — never block the shopping flow on analytics delivery.
  }
}
