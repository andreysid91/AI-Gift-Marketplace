import { TRUST_SNAPSHOT_SEED } from "./seed";
import type { TrustSnapshot } from "./types";

/**
 * Public entry for Trust System.
 * Today: sync seed. Tomorrow: `await fetch('/api/trust').then(r => r.json())`.
 */
export function getTrustSnapshot(): TrustSnapshot {
  return TRUST_SNAPSHOT_SEED;
}

/** Async twin — same shape; ready for real network. */
export async function fetchTrustSnapshot(): Promise<TrustSnapshot> {
  return getTrustSnapshot();
}

export function formatOrderCount(n: number): string {
  return n.toLocaleString("ru-RU");
}

export function formatRating(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

export function formatRepeatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

export function starsLabel(rating: number): string {
  const full = Math.round(rating);
  return "★".repeat(Math.min(5, Math.max(0, full)));
}
