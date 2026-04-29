import { useSyncExternalStore } from "react";
import { formatNaira } from "./products";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

const WHATSAPP_NUMBER = "2348141221934";
const KEY = "onlinesolarstore.cart";
const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();

let cache: CartItem[] = EMPTY;
let hydrated = false;

const readFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
};

const ensureHydrated = () => {
  if (hydrated || typeof window === "undefined") return;
  cache = readFromStorage();
  hydrated = true;
};

const commit = (next: CartItem[]) => {
  cache = next;
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
};

const getSnapshot = () => {
  ensureHydrated();
  return cache;
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => { listeners.delete(l); };
};

export const cart = {
  subscribe,
  getSnapshot,
  add(p: { id: string; name: string; price: number; image: string }) {
    ensureHydrated();
    const existing = cache.find((i) => i.id === p.id);
    const next = existing
      ? cache.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
      : [...cache, { ...p, qty: 1 }];
    commit(next);
  },
  remove(id: string) {
    ensureHydrated();
    commit(cache.filter((i) => i.id !== id));
  },
  setQty(id: string, qty: number) {
    ensureHydrated();
    commit(cache.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  },
  clear() { commit([]); },
};

const getServerSnapshot = () => EMPTY;

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const buildWhatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const productShareMessage = (p: { name: string; price: number }, url: string) =>
  `Hello! I'm interested in ordering this product from OnlineSolarStore:\n\n*${p.name}*\nPrice: ${formatNaira(p.price)}\n\nLink: ${url}\n\nPlease let me know if it's available. Thank you!`;

export const cartOrderMessage = (items: CartItem[]) => {
  const lines = items
    .map((i) => `• ${i.name} x${i.qty} — ${formatNaira(i.price * i.qty)}`)
    .join("\n");
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return `Hello! I'd like to order the following from OnlineSolarStore:\n\n${lines}\n\n*Total: ${formatNaira(total)}*\n\nPlease confirm availability and delivery details. Thank you!`;
};
