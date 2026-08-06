import type {
  AnalyzeUserIntentOptions,
  IntentAnalysis,
  Scenario,
} from "./types";
import { getScenarioLabel, isScenario } from "./scenarios";
import { INTENT_RULES } from "./rules";
import { SCENARIOS } from "./types";
import {
  classifyScenario,
  getScenarioDefinition,
} from "../scenario-engine";

/**
 * analyzeUserIntent — bridge to Scenario Engine (TASK-060).
 * Prefer `classifyScenario` from `lib/scenario-engine` in new code.
 */
export function analyzeUserIntent(
  rawQuery: string,
  options: AnalyzeUserIntentOptions = {},
): IntentAnalysis {
  const forceRaw = options.force as string | undefined;
  const forced =
    forceRaw === "business"
      ? "corporate"
      : forceRaw === "free"
        ? "custom"
        : forceRaw;

  const classified = classifyScenario(rawQuery, {
    force: forced,
    hasPhoto: options.hasPhoto,
  });
  const def = getScenarioDefinition(classified.scenarioId);
  const scenario = def.orderType as Scenario;
  const query = rawQuery.trim().toLowerCase().replace(/\s+/g, " ");

  return {
    scenario,
    query,
    confidence: classified.confidence,
    signals: classified.matched.map((matched) => ({
      matched,
      scenario,
      weight: 1,
    })),
    isFallback: classified.isFallback,
  };
}

/** Convenience: only the scenario id (legacy Gift Engine order type) */
export function resolveScenario(
  rawQuery: string,
  options?: AnalyzeUserIntentOptions,
): Scenario {
  return analyzeUserIntent(rawQuery, options).scenario;
}

export { getScenarioLabel, isScenario, INTENT_RULES, SCENARIOS };
