import {
  getGiftEngineEnricher,
  registerGiftEngineEnricher,
  resolveGiftEngine,
  runGiftEngine,
  toGiftRecommendation,
} from "../gift-engine";
import { openAiGiftEngineEnricher } from "../gift-engine/ai-enricher";
import type { GiftRecommendation } from "./recommend";

type RecommendOptions = {
  recipientProfile?: string | null;
  excludeItemIds?: string[] | null;
};

let enricherReady = false;

function ensureServerEnricher() {
  if (enricherReady) return;
  // Server-only AI slot. Sync Gift Engine stays knowledge-only.
  if (!getGiftEngineEnricher()) {
    registerGiftEngineEnricher(openAiGiftEngineEnricher);
  }
  enricherReady = true;
}

/**
 * @deprecated Prefer resolveGiftEngine from lib/gift-engine.
 * Delegates to Gift Engine (+ optional AI enricher on server).
 */
export async function resolveGiftRecommendation(
  query: string,
  options?: RecommendOptions,
): Promise<GiftRecommendation> {
  ensureServerEnricher();
  const result = await resolveGiftEngine({
    query,
    recipientProfile: options?.recipientProfile,
    excludeItemIds: options?.excludeItemIds,
  });
  return toGiftRecommendation(result);
}

/** Sync knowledge-only preview via Gift Engine. */
export function previewGiftRecommendation(
  query: string,
  options?: RecommendOptions,
): GiftRecommendation {
  return toGiftRecommendation(
    runGiftEngine({
      query,
      recipientProfile: options?.recipientProfile,
      excludeItemIds: options?.excludeItemIds,
    }),
  );
}
