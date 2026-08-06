/**
 * AI Agent foundation (no real AI yet).
 *
 * Public API for the rest of the app.
 */

export type {
  AnalyzeUserIntentOptions,
  IntentAnalysis,
  IntentSignal,
  KeywordRule,
  Scenario,
  ScenarioDefinition,
} from "./types";

export { SCENARIOS } from "./types";
export {
  SCENARIO_DEFINITIONS,
  getScenarioLabel,
  isScenario,
} from "./scenarios";
export { INTENT_RULES } from "./rules";
export {
  analyzeUserIntent,
  resolveScenario,
} from "./intent-analyzer";
