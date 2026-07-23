declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Shared between the browser pixel call and its server-side Conversions API mirror, so Meta can dedupe them. */
export function generateEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function fbTrack(event: string, params?: Record<string, unknown>, eventId?: string): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, params ?? {}, eventId ? { eventID: eventId } : undefined);
}

/** Browser IDs Meta uses to match pixel + Conversions API events to the same visitor. */
export function fbBrowserIds(): { fbp?: string; fbc?: string } {
  return { fbp: getCookie("_fbp"), fbc: getCookie("_fbc") };
}
