import {
  SCENARIO_REGISTRY,
  getScenarioDefinition,
  isScenarioId,
  normalizeScenarioId,
} from "./registry";
import { SCENARIO_IDS, type ClassifyOptions, type ScenarioClassification, type ScenarioId } from "./types";

const MIN_SCORE = 3;

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

function matchKeywords(text: string, keywords: string[]): string[] {
  const hit: string[] = [];
  for (const keyword of keywords) {
    const needle = keyword.toLowerCase();
    if (needle && text.includes(needle)) hit.push(keyword);
  }
  return hit;
}

function matchPatterns(text: string, patterns?: string[]): string[] {
  if (!patterns?.length) return [];
  const hit: string[] = [];
  for (const source of patterns) {
    try {
      const re = new RegExp(source, "i");
      const found = text.match(re);
      if (found?.[0]) hit.push(found[0]);
    } catch {
      // skip bad pattern
    }
  }
  return hit;
}

/**
 * Classify a free-text request into one Scenario Engine scenario.
 * Rule-based only — independent per scenario definition.
 */
export function classifyScenario(
  rawQuery: string,
  options: ClassifyOptions = {},
): ScenarioClassification {
  const forced = normalizeScenarioId(options.force ?? null);
  if (forced) {
    const def = getScenarioDefinition(forced);
    return {
      scenarioId: forced,
      label: def.label,
      confidence: 1,
      scores: { [forced]: 100 },
      matched: [`force:${forced}`],
      isFallback: false,
    };
  }

  const query = normalizeQuery(rawQuery);
  const scores: Partial<Record<ScenarioId, number>> = {};
  const matched: string[] = [];

  if (!query && options.hasPhoto) {
    return {
      scenarioId: "photo",
      label: getScenarioDefinition("photo").label,
      confidence: 0.7,
      scores: { photo: 5 },
      matched: ["hasPhoto"],
      isFallback: false,
    };
  }

  if (!query) {
    return {
      scenarioId: "unsure",
      label: getScenarioDefinition("unsure").label,
      confidence: 0.2,
      scores: {},
      matched: [],
      isFallback: true,
    };
  }

  for (const id of SCENARIO_IDS) {
    if (id === "custom") continue;
    const def = SCENARIO_REGISTRY[id];
    const kw = matchKeywords(query, def.keywords);
    const pt = matchPatterns(query, def.patterns);
    const hits = kw.length + pt.length;
    if (hits === 0) continue;
    const score = hits * def.weight;
    scores[id] = (scores[id] ?? 0) + score;
    matched.push(...kw, ...pt);
  }

  if (options.hasPhoto) {
    scores.photo = (scores.photo ?? 0) + 3;
    matched.push("hasPhoto");
  }

  let winner: ScenarioId = "custom";
  let best = 0;
  for (const id of SCENARIO_IDS) {
    if (id === "custom") continue;
    const score = scores[id] ?? 0;
    if (score > best) {
      best = score;
      winner = id;
    }
  }

  if (best < MIN_SCORE) {
    return {
      scenarioId: "custom",
      label: getScenarioDefinition("custom").label,
      confidence: 0.2,
      scores,
      matched: [...new Set(matched)],
      isFallback: true,
    };
  }

  return {
    scenarioId: winner,
    label: getScenarioDefinition(winner).label,
    confidence: Math.min(0.95, 0.25 + best * 0.06),
    scores,
    matched: [...new Set(matched)],
    isFallback: false,
  };
}

export function resolveScenarioId(
  rawQuery: string,
  options?: ClassifyOptions,
): ScenarioId {
  return classifyScenario(rawQuery, options).scenarioId;
}

export { isScenarioId, normalizeScenarioId };
