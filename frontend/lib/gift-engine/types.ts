/**
 * Gift Engine v1 — central gift selection module (TASK-059).
 * Knowledge-first. AI plugs in later via enricher — no engine rewrite.
 */

import type { Scenario } from "../agent/types";
import type {
  GiftRecommendation,
  ParsedGiftSignals,
  RankedProduct,
  ReadyRecommendationSet,
} from "../knowledge/recommend";
import type { KnowledgeEntity } from "../knowledge";

export type OrderType = Scenario;

export type UrgencyLevel = "normal" | "soon" | "urgent";

export type GiftEngineConfidence = "high" | "medium" | "low" | "none";

export type GiftEngineSource = "knowledge" | "none" | "ai";

/** Structured params extracted from the user request. */
export type GiftEngineParams = {
  rawQuery: string;
  /** Display label, e.g. «Мама» */
  recipient: string | null;
  recipientIds: string[];
  occasion: string | null;
  occasionIds: string[];
  budgetMax: number | null;
  quantity: number | null;
  urgency: UrgencyLevel;
  hasPhoto: boolean;
  orderType: OrderType;
  city: string | null;
  hobbies: string[];
  hobbyIds: string[];
  professions: string[];
  professionIds: string[];
  styles: string[];
  styleIds: string[];
  mentionedProductIds: string[];
};

export type GiftEngineItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  constructorId: string | null;
  emoji?: string;
  score: number;
  reasons: string[];
  productionTimeHours: number | null;
};

export type GiftEngineSet = {
  id: string;
  title: string;
  subtitle: string;
  itemIds: string[];
  productIds: string[];
  addonIds: string[];
  total: number;
  reasons: string[];
};

export type GiftEngineResult = {
  params: GiftEngineParams;
  /** Best matching products */
  products: GiftEngineItem[];
  /** Best gift sets / bundles */
  sets: GiftEngineSet[];
  /** Best add-ons */
  addons: GiftEngineItem[];
  /** Max production hours across primary set */
  leadTimeHours: number | null;
  leadTimeLabel: string;
  /** Approximate total for primary recommendation */
  estimatedCost: number;
  estimatedCostLabel: string;
  /** Why these options fit */
  why: string[];
  confidence: GiftEngineConfidence;
  source: GiftEngineSource;
  /**
   * True when KB could not confidently answer.
   * Async resolve may call a registered enricher (AI later).
   */
  needsEnrichment: boolean;
  /** Internal: KB signals for adapters / enrichers */
  _signals: ParsedGiftSignals;
  _chain: string[];
  /** Full KB recommendation for lossless UI adapters */
  _recommendation: GiftRecommendation;
};

export type GiftEngineInput = {
  query: string;
  hasPhoto?: boolean;
  city?: string | null;
  forceOrderType?: OrderType | string;
  recipientProfile?: string | null;
  excludeItemIds?: string[] | null;
};

/**
 * Optional AI (or other) enricher. Register without changing runGiftEngine core.
 */
export type GiftEngineEnricher = {
  id: string;
  enrich(
    input: GiftEngineInput,
    knowledgeResult: GiftEngineResult,
  ): Promise<GiftEngineResult>;
};

export type {
  GiftRecommendation,
  ParsedGiftSignals,
  RankedProduct,
  ReadyRecommendationSet,
  KnowledgeEntity,
};
