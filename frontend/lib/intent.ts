/**
 * @deprecated Prefer `lib/agent`.
 * Thin compatibility layer over the AI Agent foundation.
 */

export type { Scenario, IntentAnalysis } from "./agent";
export {
  analyzeUserIntent,
  resolveScenario,
  getScenarioLabel,
  isScenario,
  SCENARIOS,
  SCENARIO_DEFINITIONS,
} from "./agent";

import {
  getScenarioLabel,
  resolveScenario,
  type AnalyzeUserIntentOptions,
  type Scenario,
} from "./agent";

/** @deprecated Use resolveScenario / analyzeUserIntent from lib/agent */
export function detectScenario(
  query: string,
  options?: AnalyzeUserIntentOptions,
): Scenario {
  return resolveScenario(query, options);
}

/** @deprecated Use getScenarioLabel from lib/agent */
export function scenarioLabel(scenario: Scenario): string {
  return getScenarioLabel(scenario);
}
