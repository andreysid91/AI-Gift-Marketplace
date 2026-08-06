import type { GiftEngineEnricher } from "./types";

let enricher: GiftEngineEnricher | null = null;

/**
 * Plug AI (or another enricher) here later — Gift Engine core stays unchanged.
 * Example: registerGiftEngineEnricher({ id: "openai", enrich: ... })
 */
export function registerGiftEngineEnricher(
  next: GiftEngineEnricher | null,
): void {
  enricher = next;
}

export function getGiftEngineEnricher(): GiftEngineEnricher | null {
  return enricher;
}
