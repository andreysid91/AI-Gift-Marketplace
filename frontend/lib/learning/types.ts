/**
 * Learning Engine — product analytics without AI (TASK-058).
 * See docs/25_Learning_Engine.md
 */

export const LEARNING_EVENTS_STORAGE_KEY = "ai-gift-learning-events";
export const LEARNING_SEEDED_KEY = "ai-gift-learning-seeded";
export const LEARNING_CHANGE_EVENT = "ai-gift-learning-change";

export type LearningEventType =
  | "search"
  | "filter"
  | "scenario"
  | "product_open"
  | "cart_add"
  | "bundle"
  | "purchase";

export type SearchPayload = { query: string };
export type FilterPayload = { dimension: string; value: string };
export type ScenarioPayload = { scenario: string };
export type ProductPayload = { productId: string };
export type BundlePayload = { productIds: string[] };
export type PurchasePayload = { productIds: string[]; orderKey?: string };

export type LearningPayload =
  | SearchPayload
  | FilterPayload
  | ScenarioPayload
  | ProductPayload
  | BundlePayload
  | PurchasePayload;

export type LearningEvent = {
  id: string;
  type: LearningEventType;
  at: string;
  payload: LearningPayload;
  sessionKey?: string;
};

export type CountRow = {
  key: string;
  label: string;
  count: number;
};

export type BundleRow = {
  key: string;
  a: string;
  b: string;
  label: string;
  count: number;
};

export type LearningInsights = {
  eventCount: number;
  topSearches: CountRow[];
  topPurchases: CountRow[];
  topBundles: BundleRow[];
  topScenarios: CountRow[];
  topFilters: CountRow[];
  repeatPurchases: CountRow[];
  coldProducts: CountRow[];
};

/** Signals for future recommendation ranking (not wired into KB yet). */
export type LearningSignals = {
  /** Additive boost candidates for product score */
  productBoost: Record<string, number>;
  /** Co-purchase affinity: productId → related ids by strength */
  pairAffinity: Record<string, Array<{ id: string; weight: number }>>;
  /** Soft penalty for rarely opened catalog items */
  coldPenalty: Record<string, number>;
  /** Normalized frequent search phrases */
  queryHints: string[];
};
