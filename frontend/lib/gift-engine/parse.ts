import { matchEntitiesByAliases, giftKnowledgeBase } from "../knowledge";
import {
  classifyScenario,
  getScenarioDefinition,
  normalizeScenarioId,
} from "../scenario-engine";
import { parseBudgetFromQuery } from "./budget";
import type {
  GiftEngineInput,
  GiftEngineParams,
  OrderType,
  UrgencyLevel,
} from "./types";

const CITY_ALIASES: { id: string; label: string; aliases: string[] }[] = [
  {
    id: "krasnoyarsk",
    label: "Красноярск",
    aliases: ["красноярск", "красноярске", "крк"],
  },
  {
    id: "novosibirsk",
    label: "Новосибирск",
    aliases: ["новосибирск", "новосибирске", "нск"],
  },
  {
    id: "moscow",
    label: "Москва",
    aliases: ["москва", "москве", "мск"],
  },
];

const QTY_PATTERNS: RegExp[] = [
  /(\d[\d\s]*)\s*(?:шт|штук|штуки|единиц)/i,
  /(\d[\d\s]*)\s*(?:футболок|кружек|холстов|магнитов|пазлов|открыток)/i,
  /(?:тираж|количество|кол-во)\s*[:=]?\s*(\d[\d\s]*)/i,
  /(\d[\d\s]*)\s*(?:для\s+(?:компании|офиса|сотрудников|коллектива))/i,
];

function uniqueLabels(items: { id: string; name: string }[]) {
  const seen = new Set<string>();
  const out: { id: string; name: string }[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

function parseQuantity(query: string): number | null {
  for (const re of QTY_PATTERNS) {
    const match = query.match(re);
    if (!match?.[1]) continue;
    const value = Number(match[1].replace(/\s/g, ""));
    if (Number.isFinite(value) && value > 0) return value;
  }
  return null;
}

function parseUrgency(query: string): UrgencyLevel {
  if (/сегодня|срочно|прямо\s*сейчас|express/i.test(query)) return "urgent";
  if (/завтра|быстр|скоро|на\s*выходн/i.test(query)) return "soon";
  return "normal";
}

function parseCity(query: string, preferred?: string | null): string | null {
  if (preferred?.trim()) return preferred.trim();
  const q = query.toLowerCase();
  for (const city of CITY_ALIASES) {
    if (city.aliases.some((a) => q.includes(a))) return city.label;
  }
  return "Красноярск";
}

/**
 * Split a free-text request into structured Gift Engine params.
 * Rule-based only — no AI.
 */
export function parseGiftEngineParams(
  input: GiftEngineInput,
): GiftEngineParams {
  const rawQuery = input.query.trim();
  const profile = input.recipientProfile?.trim() ?? "";
  const combined = [rawQuery, profile].filter(Boolean).join(". ");
  const q = combined.toLowerCase();

  const relationships = uniqueLabels(
    matchEntitiesByAliases(giftKnowledgeBase.relationships, q),
  );
  const occasions = uniqueLabels(
    matchEntitiesByAliases(giftKnowledgeBase.occasions, q),
  );
  const hobbies = uniqueLabels(
    matchEntitiesByAliases(giftKnowledgeBase.hobbies, q),
  );
  const professions = uniqueLabels(
    matchEntitiesByAliases(giftKnowledgeBase.professions, q),
  );
  const styles = uniqueLabels(
    matchEntitiesByAliases(giftKnowledgeBase.styles, q),
  );
  const mentioned = uniqueLabels(
    matchEntitiesByAliases(giftKnowledgeBase.products, q),
  );

  const quantity = parseQuantity(combined);
  const forcedId = normalizeScenarioId(input.forceOrderType ?? null);
  const classified = classifyScenario(rawQuery || combined, {
    force: forcedId,
    hasPhoto: Boolean(input.hasPhoto),
  });
  const scenarioDef = getScenarioDefinition(classified.scenarioId);
  let orderType: OrderType = scenarioDef.orderType;

  // Large qty strongly implies corporate / bulk when not forced
  if (!forcedId && quantity != null && quantity >= 10) {
    orderType = "business";
  }

  return {
    rawQuery,
    recipient: relationships[0]?.name ?? null,
    recipientIds: relationships.map((r) => r.id),
    occasion: occasions[0]?.name ?? null,
    occasionIds: occasions.map((o) => o.id),
    budgetMax: parseBudgetFromQuery(combined),
    quantity,
    urgency: parseUrgency(combined),
    hasPhoto: Boolean(input.hasPhoto),
    orderType,
    city: parseCity(combined, input.city),
    hobbies: hobbies.map((h) => h.name),
    hobbyIds: hobbies.map((h) => h.id),
    professions: professions.map((p) => p.name),
    professionIds: professions.map((p) => p.id),
    styles: styles.map((s) => s.name),
    styleIds: styles.map((s) => s.id),
    mentionedProductIds: mentioned.map((m) => m.id),
  };
}
