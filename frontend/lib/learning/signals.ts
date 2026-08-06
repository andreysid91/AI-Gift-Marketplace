import { aggregateLearningInsights } from "./aggregate";
import { ensureLearningSeeded, loadLearningEvents } from "./store";
import type { LearningInsights, LearningSignals } from "./types";

/**
 * Convert insights into ranking signals for a future recommend boost.
 * Not applied to Knowledge Engine yet — consumers opt in later.
 */
export function buildLearningSignals(
  insights: LearningInsights,
): LearningSignals {
  const productBoost: Record<string, number> = {};
  for (const row of insights.topPurchases) {
    productBoost[row.key] = Math.min(12, row.count * 1.5);
  }
  for (const row of insights.repeatPurchases) {
    productBoost[row.key] = (productBoost[row.key] ?? 0) + Math.min(8, row.count);
  }

  const pairAffinity: LearningSignals["pairAffinity"] = {};
  for (const row of insights.topBundles) {
    const weight = Math.min(10, row.count);
    pairAffinity[row.a] = [
      ...(pairAffinity[row.a] ?? []),
      { id: row.b, weight },
    ];
    pairAffinity[row.b] = [
      ...(pairAffinity[row.b] ?? []),
      { id: row.a, weight },
    ];
  }
  for (const key of Object.keys(pairAffinity)) {
    pairAffinity[key].sort((a, b) => b.weight - a.weight);
  }

  const coldPenalty: Record<string, number> = {};
  for (const row of insights.coldProducts) {
    coldPenalty[row.key] = row.count === 0 ? 4 : 2;
  }

  return {
    productBoost,
    pairAffinity,
    coldPenalty,
    queryHints: insights.topSearches.slice(0, 10).map((row) => row.key),
  };
}

export function getLearningInsights(): LearningInsights {
  const events = ensureLearningSeeded();
  return aggregateLearningInsights(events.length ? events : loadLearningEvents());
}

export function getLearningSignals(): LearningSignals {
  return buildLearningSignals(getLearningInsights());
}
