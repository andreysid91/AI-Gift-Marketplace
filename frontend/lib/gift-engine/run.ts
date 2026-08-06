import { recommendGifts as knowledgeRecommend } from "../knowledge/recommend";
import { parseGiftEngineParams } from "./parse";
import { getGiftEngineEnricher } from "./providers";
import { finalizeResult } from "./result";
import { toGiftRecommendation } from "./adapters";
import type { GiftEngineInput, GiftEngineResult } from "./types";

function buildKnowledgeQuery(input: GiftEngineInput): string {
  const parts = [input.query.trim()];
  if (input.recipientProfile?.trim()) {
    parts.push(input.recipientProfile.trim());
  }
  return parts.filter(Boolean).join(". ") || "Подарок";
}

/**
 * Gift Engine v1 — sync, knowledge-only (local JSON).
 * All site gift selection should go through this entry point.
 */
export function runGiftEngine(input: GiftEngineInput): GiftEngineResult {
  const params = parseGiftEngineParams(input);
  const query = buildKnowledgeQuery(input);

  const hints: string[] = [];
  if (params.hasPhoto) hints.push("фотопечать");
  if (params.orderType === "photo") hints.push("фото на изделии");
  if (params.orderType === "business" || (params.quantity ?? 0) >= 10) {
    hints.push("корпоративный тираж футболки");
  }
  if (params.urgency === "urgent") hints.push("срочно быстро");
  const enrichedQuery = [query, ...hints].join(". ");

  const recommendation = knowledgeRecommend(enrichedQuery, {
    recipientProfile: null,
    excludeItemIds: input.excludeItemIds,
  });

  const result = finalizeResult(params, recommendation);

  if (result.needsEnrichment && result.sets.length === 0) {
    return {
      ...result,
      estimatedCostLabel: "Нужно уточнение",
      leadTimeLabel: "Уточним после уточнения запроса",
      why:
        result.why.length > 0
          ? result.why
          : [
              "База знаний не нашла уверенный матч по запросу",
              "Можно уточнить получателя, повод или бюджет",
            ],
    };
  }

  return result;
}

/**
 * Async path: knowledge first, then optional enricher (AI later).
 * Does not call AI unless an enricher is registered.
 */
export async function resolveGiftEngine(
  input: GiftEngineInput,
): Promise<GiftEngineResult> {
  const knowledge = runGiftEngine(input);
  if (!knowledge.needsEnrichment) return knowledge;

  const enricher = getGiftEngineEnricher();
  if (!enricher) return knowledge;

  return enricher.enrich(input, knowledge);
}

/** Convenience: engine result shaped as legacy GiftRecommendation. */
export function runGiftEngineAsRecommendation(input: GiftEngineInput) {
  return toGiftRecommendation(runGiftEngine(input));
}

export async function resolveGiftEngineAsRecommendation(
  input: GiftEngineInput,
) {
  return toGiftRecommendation(await resolveGiftEngine(input));
}

/** Constructor item ids for gift picker defaults. */
export function getGiftEngineConstructorIds(input: GiftEngineInput): string[] {
  if (!input.query.trim() && !input.recipientProfile?.trim()) {
    return ["mug", "box", "card", "chocolate"].filter(
      (id) => !(input.excludeItemIds ?? []).includes(id),
    );
  }
  const result = runGiftEngine(input);
  if (result.needsEnrichment && result.sets.length === 0) return [];
  return result.sets[0]?.itemIds ?? [];
}
