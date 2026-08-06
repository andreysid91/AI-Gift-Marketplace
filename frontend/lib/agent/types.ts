/**
 * AI Agent foundation — types only.
 * No LLM. Rule-based intent for now; swap analyzer later without UI changes.
 */

export const SCENARIOS = ["gift", "photo", "business", "custom"] as const;

export type Scenario = (typeof SCENARIOS)[number];

export type IntentSignal = {
  /** Keyword or pattern that matched */
  matched: string;
  /** Which scenario this signal votes for */
  scenario: Scenario;
  /** Relative weight (higher = stronger) */
  weight: number;
};

export type IntentAnalysis = {
  /** Winning scenario */
  scenario: Scenario;
  /** Normalized input text */
  query: string;
  /** Confidence 0–1 (rule-based heuristic) */
  confidence: number;
  /** Signals that contributed to the decision */
  signals: IntentSignal[];
  /** True when no strong match → custom fallback */
  isFallback: boolean;
};

export type AnalyzeUserIntentOptions = {
  /** Force a scenario (quick actions / deep links) */
  force?: Scenario;
  /** User attached a photo */
  hasPhoto?: boolean;
};

export type KeywordRule = {
  id: string;
  scenario: Scenario;
  /** Plain keywords (case-insensitive substring / word match) */
  keywords: string[];
  /** Optional RegExp sources (compiled at runtime) */
  patterns?: string[];
  weight: number;
  /** Optional note for maintainers */
  description?: string;
};

export type ScenarioDefinition = {
  id: Scenario;
  label: string;
  description: string;
};
