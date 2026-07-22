const PAYSTACK_SCRIPT_URL = "https://js.paystack.co/v1/inline.js";
const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;

export const isCardPaymentEnabled = () => Boolean(PUBLIC_KEY);

interface PaystackHandler {
  openIframe: () => void;
}

interface PaystackPop {
  setup: (options: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    onClose: () => void;
    callback: (response: { reference: string }) => void;
  }) => PaystackHandler;
}

declare global {
  interface Window {
    PaystackPop?: PaystackPop;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.PaystackPop) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PAYSTACK_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack"));
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export interface PayWithPaystackInput {
  email: string;
  amountNaira: number;
  reference: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export async function payWithPaystack(input: PayWithPaystackInput): Promise<void> {
  if (!PUBLIC_KEY) {
    throw new Error("Card payments aren't configured yet. Please choose Cash on Delivery.");
  }
  await loadPaystackScript();
  if (!window.PaystackPop) throw new Error("Paystack failed to load. Check your connection and try again.");

  const handler = window.PaystackPop.setup({
    key: PUBLIC_KEY,
    email: input.email,
    amount: Math.round(input.amountNaira * 100),
    currency: "NGN",
    ref: input.reference,
    onClose: input.onClose,
    callback: (response) => input.onSuccess(response.reference),
  });
  handler.openIframe();
}
