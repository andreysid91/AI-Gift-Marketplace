/**
 * Optional AI enricher for Gift Engine.
 * Not used by sync runGiftEngine. Register on the server for resolveGiftEngine.
 */

import {
  aiRecommendFallback,
  aiResultToRecommendation,
} from "../knowledge/ai-fallback";
import { finalizeResult } from "./result";
import type { GiftEngineEnricher } from "./types";

export const openAiGiftEngineEnricher: GiftEngineEnricher = {
  id: "openai",
  async enrich(input, knowledgeResult) {
    const profile = input.recipientProfile?.trim();
    const query =
      [input.query.trim(), profile].filter(Boolean).join(". ") || "Подарок";
    const ai = await aiRecommendFallback(query);
    const recommendation = aiResultToRecommendation(
      query,
      ai,
      knowledgeResult._signals,
    );

    const exclude = new Set(input.excludeItemIds ?? []);
    let filtered = recommendation;
    if (exclude.size > 0) {
      filtered = {
        ...recommendation,
        products: recommendation.products.filter(
          (p) => !exclude.has(p.product.id),
        ),
        addons: recommendation.addons.filter((a) => !exclude.has(a.id)),
        readySet: {
          ...recommendation.readySet,
          itemIds: recommendation.readySet.itemIds.filter(
            (id) => !exclude.has(id),
          ),
          productIds: recommendation.readySet.productIds.filter(
            (id) => !exclude.has(id),
          ),
          addonIds: recommendation.readySet.addonIds.filter(
            (id) => !exclude.has(id),
          ),
        },
      };
    }

    return finalizeResult(knowledgeResult.params, filtered);
  },
};
