import type { GiftRecommendation } from "../knowledge/recommend";
import type { GiftEngineResult } from "./types";

/**
 * Adapter for existing UI / API that still expect GiftRecommendation.
 * Prefers the original KB payload; overlays Gift Engine explanations.
 */
export function toGiftRecommendation(
  result: GiftEngineResult,
): GiftRecommendation {
  const base = result._recommendation;
  const primary = result.sets[0];

  return {
    ...base,
    chain: result.why.length > 0 ? result.why : base.chain,
    readySet: primary
      ? {
          ...base.readySet,
          title: primary.title,
          subtitle: primary.subtitle,
          itemIds: primary.itemIds,
          productIds: primary.productIds,
          addonIds: primary.addonIds,
          total: primary.total,
          query: result.params.rawQuery || base.readySet.query,
        }
      : base.readySet,
    source: result.source,
    needsAi: result.needsEnrichment,
    confidence: result.confidence,
  };
}
