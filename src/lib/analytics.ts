declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a GA4 page_view for client-side route changes. The gtag.js snippet in
 * index.html only fires the initial page_view automatically — React Router
 * navigations don't reload the page, so each route change needs an explicit event.
 */
export function trackPageView(path: string): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export {};
