export const GIFT_ORDER_STORAGE_KEY = "ai-gift-order";

export type GiftOrderLine = {
  id: string;
  title: string;
  /** Line total (unit × qty with options) */
  price: number;
  emoji: string;
  kind: "product" | "addon";
  qty?: number;
  /** e.g. «M · Чёрный · Soft cotton ×2» */
  configSummary?: string;
  unitPrice?: number;
  selections?: Record<string, string | number>;
};

export type GiftOrderPayload = {
  query: string;
  items: GiftOrderLine[];
  total: number;
  createdAt: string;
};

export function saveGiftOrder(payload: GiftOrderPayload) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(GIFT_ORDER_STORAGE_KEY, JSON.stringify(payload));
}

export function loadGiftOrder(): GiftOrderPayload | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(GIFT_ORDER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GiftOrderPayload;
  } catch {
    return null;
  }
}

export function clearGiftOrder() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(GIFT_ORDER_STORAGE_KEY);
}
