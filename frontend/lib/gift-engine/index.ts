/**
 * Gift Engine v1 — public API.
 * Prefer importing from `lib/gift-engine` instead of knowledge/recommend directly.
 */

export type {
  GiftEngineConfidence,
  GiftEngineEnricher,
  GiftEngineInput,
  GiftEngineItem,
  GiftEngineParams,
  GiftEngineResult,
  GiftEngineSet,
  GiftEngineSource,
  OrderType,
  UrgencyLevel,
} from "./types";

export { parseGiftEngineParams } from "./parse";
export { parseBudgetFromQuery } from "./budget";
export {
  formatCostLabel,
  formatLeadTimeLabel,
  buildWhy,
} from "./result";
export {
  registerGiftEngineEnricher,
  getGiftEngineEnricher,
} from "./providers";
export { toGiftRecommendation } from "./adapters";
export {
  runGiftEngine,
  resolveGiftEngine,
  runGiftEngineAsRecommendation,
  resolveGiftEngineAsRecommendation,
  getGiftEngineConstructorIds,
} from "./run";

// AI enricher: import from `lib/gift-engine/ai-enricher` on the server only.

