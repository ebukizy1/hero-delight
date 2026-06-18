
export const trackWhatsAppClick = (eventName: string = "WhatsApp_Click", properties?: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", eventName, properties);
  }
};
