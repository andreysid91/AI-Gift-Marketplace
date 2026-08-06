import { appendLearningEvent, ensureLearningSeeded } from "./store";

function sessionKey() {
  if (typeof window === "undefined") return undefined;
  const key = "ai-gift-learning-session";
  try {
    let value = window.sessionStorage.getItem(key);
    if (!value) {
      value = `s_${Math.random().toString(36).slice(2, 10)}`;
      window.sessionStorage.setItem(key, value);
    }
    return value;
  } catch {
    return undefined;
  }
}

/** Fire-and-forget trackers for UI. Safe on SSR (no-op). */
export function trackSearch(query: string) {
  const q = query.trim();
  if (!q || typeof window === "undefined") return;
  ensureLearningSeeded();
  appendLearningEvent("search", { query: q }, sessionKey());
}

export function trackFilter(dimension: string, value: string) {
  if (!dimension || !value || typeof window === "undefined") return;
  ensureLearningSeeded();
  appendLearningEvent("filter", { dimension, value }, sessionKey());
}

export function trackScenario(scenario: string) {
  if (!scenario || typeof window === "undefined") return;
  ensureLearningSeeded();
  appendLearningEvent("scenario", { scenario }, sessionKey());
}

export function trackProductOpen(productId: string) {
  if (!productId || typeof window === "undefined") return;
  ensureLearningSeeded();
  appendLearningEvent("product_open", { productId }, sessionKey());
}

export function trackCartAdd(productId: string) {
  if (!productId || typeof window === "undefined") return;
  ensureLearningSeeded();
  appendLearningEvent("cart_add", { productId }, sessionKey());
}

export function trackBundle(productIds: string[]) {
  const ids = [...new Set(productIds.filter(Boolean))];
  if (ids.length < 2 || typeof window === "undefined") return;
  ensureLearningSeeded();
  appendLearningEvent("bundle", { productIds: ids }, sessionKey());
}

export function trackPurchase(productIds: string[], orderKey?: string) {
  const ids = [...new Set(productIds.filter(Boolean))];
  if (ids.length === 0 || typeof window === "undefined") return;
  ensureLearningSeeded();
  appendLearningEvent(
    "purchase",
    { productIds: ids, orderKey },
    sessionKey(),
  );
}
