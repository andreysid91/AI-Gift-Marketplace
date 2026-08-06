import {
  giftKnowledgeBase,
  matchEntitiesByAliases,
  type KnowledgeEntity,
} from "./index";

export type ParsedGiftSignals = {
  query: string;
  budgetMax: number | null;
  relationships: KnowledgeEntity[];
  hobbies: KnowledgeEntity[];
  professions: KnowledgeEntity[];
  occasions: KnowledgeEntity[];
  styles: KnowledgeEntity[];
  mentionedProducts: KnowledgeEntity[];
};

export type RankedProduct = {
  product: KnowledgeEntity;
  score: number;
  reasons: string[];
};

export type ReadyRecommendationSet = {
  title: string;
  subtitle: string;
  itemIds: string[];
  productIds: string[];
  addonIds: string[];
  total: number;
  query: string;
};

export type GiftRecommendation = {
  signals: ParsedGiftSignals;
  chain: string[];
  products: RankedProduct[];
  addons: KnowledgeEntity[];
  readySet: ReadyRecommendationSet;
  /** knowledge = KB hit; none = miss (call AI); ai = filled by AI layer */
  source: "knowledge" | "none" | "ai";
  needsAi: boolean;
  confidence: "high" | "medium" | "low" | "none";
};

const BUDGET_PATTERNS: { re: RegExp; max: number }[] = [
  { re: /до\s*(\d[\d\s]*)\s*(₽|руб|р\.?)?/i, max: 0 },
  { re: /бюджет\s*(\d[\d\s]*)/i, max: 0 },
  { re: /не\s*дороже\s*(\d[\d\s]*)/i, max: 0 },
  { re: /макс(?:имум)?\s*(\d[\d\s]*)/i, max: 0 },
];

function parseBudget(query: string): number | null {
  for (const pattern of BUDGET_PATTERNS) {
    const match = query.match(pattern.re);
    if (!match?.[1]) continue;
    const value = Number(match[1].replace(/\s/g, ""));
    if (Number.isFinite(value) && value > 0) return value;
  }
  if (/без\s*лимита|wow|вау/i.test(query)) return null;
  return null;
}

function uniqueById(items: KnowledgeEntity[]): KnowledgeEntity[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

/** Rule-based parse: relationship → hobby → budget (no GPT). */
export function parseGiftQuery(query: string): ParsedGiftSignals {
  const q = query.trim().toLowerCase();
  const kb = giftKnowledgeBase;

  return {
    query: query.trim(),
    budgetMax: parseBudget(q),
    relationships: uniqueById(matchEntitiesByAliases(kb.relationships, q)),
    hobbies: uniqueById(matchEntitiesByAliases(kb.hobbies, q)),
    professions: uniqueById(matchEntitiesByAliases(kb.professions, q)),
    occasions: uniqueById(matchEntitiesByAliases(kb.occasions, q)),
    styles: uniqueById(matchEntitiesByAliases(kb.styles, q)),
    mentionedProducts: uniqueById(matchEntitiesByAliases(kb.products, q)),
  };
}

function scoreProduct(
  product: KnowledgeEntity,
  signals: ParsedGiftSignals,
): RankedProduct | null {
  let score = 0;
  const reasons: string[] = [];
  const budget = signals.budgetMax;

  if (budget != null && product.averagePrice > budget) {
    return null;
  }

  if (signals.mentionedProducts.some((item) => item.id === product.id)) {
    score += 50;
    reasons.push(`Упомянут в запросе: ${product.name}`);
  }

  for (const rel of signals.relationships) {
    if (product.suitableFor.includes(rel.id)) {
      score += 25;
      reasons.push(`Подходит для: ${rel.name}`);
    }
  }

  for (const hobby of signals.hobbies) {
    if (hobby.preferredProducts?.includes(product.id)) {
      score += 35;
      reasons.push(`Тема «${hobby.name}»`);
    }
    if (
      hobby.technologies.some((tech) => product.technologies.includes(tech))
    ) {
      score += 8;
    }
  }

  for (const prof of signals.professions) {
    if (prof.preferredProducts?.includes(product.id)) {
      score += 30;
      reasons.push(`Профессия «${prof.name}»`);
    }
  }

  for (const occasion of signals.occasions) {
    if (product.occasions.includes(occasion.id)) {
      score += 18;
      reasons.push(`Повод: ${occasion.name}`);
    }
  }

  for (const style of signals.styles) {
    if (
      style.technologies.some((tech) => product.technologies.includes(tech))
    ) {
      score += 10;
      reasons.push(`Стиль: ${style.name}`);
    }
  }

  // Prefer faster production when urgent words present
  if (/срочно|сегодня|быстр/i.test(signals.query)) {
    const hours = product.productionTimeHours ?? 99;
    if (hours <= 24) {
      score += 12;
      reasons.push("Быстрое изготовление");
    } else if (hours <= 48) {
      score += 5;
    }
  }

  // Soft preference for mid-range within budget (only with real signals)
  if (budget != null && reasons.length > 0) {
    const ratio = product.averagePrice / budget;
    if (ratio >= 0.25 && ratio <= 0.7) score += 6;
  }

  if (score <= 0) return null;

  return { product, score, reasons: [...new Set(reasons)] };
}

function pickAddons(
  signals: ParsedGiftSignals,
  products: KnowledgeEntity[],
  remainingBudget: number | null,
): KnowledgeEntity[] {
  const kb = giftKnowledgeBase;
  const votes = new Map<string, number>();

  function vote(id: string, weight: number) {
    votes.set(id, (votes.get(id) ?? 0) + weight);
  }

  for (const rel of signals.relationships) {
    for (const id of rel.recommendedAddons) vote(id, 3);
  }
  for (const hobby of signals.hobbies) {
    for (const id of hobby.recommendedAddons) vote(id, 3);
  }
  for (const occasion of signals.occasions) {
    for (const id of occasion.recommendedAddons) vote(id, 2);
  }
  for (const product of products) {
    for (const id of product.recommendedAddons) vote(id, 2);
  }

  // Always bias toward card + box for a complete set
  vote("card", 2);
  vote("box", 2);

  const ranked = [...votes.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => kb.addons.find((addon) => addon.id === id))
    .filter((item): item is KnowledgeEntity => Boolean(item));

  const picked: KnowledgeEntity[] = [];
  let spent = 0;
  for (const addon of ranked) {
    if (picked.length >= 3) break;
    if (remainingBudget != null && spent + addon.averagePrice > remainingBudget) {
      continue;
    }
    picked.push(addon);
    spent += addon.averagePrice;
  }

  return picked;
}

function toConstructorId(entity: KnowledgeEntity): string | null {
  return entity.constructorId ?? null;
}

function buildChain(signals: ParsedGiftSignals): string[] {
  const chain: string[] = [];
  for (const rel of signals.relationships) chain.push(rel.name);
  for (const hobby of signals.hobbies) chain.push(hobby.name);
  for (const prof of signals.professions) chain.push(prof.name);
  for (const occasion of signals.occasions) chain.push(occasion.name);
  if (signals.budgetMax != null) {
    chain.push(`До ${signals.budgetMax.toLocaleString("ru-RU")} ₽`);
  }
  return chain;
}

function buildReadySet(
  signals: ParsedGiftSignals,
  ranked: RankedProduct[],
  addons: KnowledgeEntity[],
): ReadyRecommendationSet {
  const budget = signals.budgetMax;
  const topProducts: KnowledgeEntity[] = [];
  let spent = 0;

  for (const row of ranked) {
    if (topProducts.length >= 3) break;
    const price = row.product.averagePrice;
    if (budget != null && spent + price > budget) continue;
    topProducts.push(row.product);
    spent += price;
  }

  // Guarantee at least one product if possible
  if (topProducts.length === 0 && ranked[0]) {
    const first = ranked.find(
      (row) => budget == null || row.product.averagePrice <= budget,
    );
    if (first) {
      topProducts.push(first.product);
      spent = first.product.averagePrice;
    }
  }

  const remaining =
    budget == null ? null : Math.max(0, budget - spent);
  const finalAddons =
    addons.length > 0
      ? addons
      : pickAddons(signals, topProducts, remaining);

  let addonSpent = 0;
  const fittedAddons: KnowledgeEntity[] = [];
  for (const addon of finalAddons) {
    if (budget != null && spent + addonSpent + addon.averagePrice > budget) {
      continue;
    }
    fittedAddons.push(addon);
    addonSpent += addon.averagePrice;
  }

  const constructorIds = [...topProducts, ...fittedAddons]
    .map(toConstructorId)
    .filter((id): id is string => Boolean(id));

  // Fallback constructor ids if knowledge products aren't in constructor catalog
  const itemIds =
    constructorIds.length > 0
      ? [...new Set(constructorIds)]
      : ["mug", "box", "card"];

  const who = signals.relationships[0]?.name ?? "получателя";
  const hobby = signals.hobbies[0]?.name;
  const title = hobby ? `Набор «${hobby}»` : `Набор для: ${who}`;
  const subtitle = buildChain(signals).join(" · ") || "Подобрано по запросу";

  const total =
    topProducts.reduce((sum, item) => sum + item.averagePrice, 0) +
    fittedAddons.reduce((sum, item) => sum + item.averagePrice, 0);

  return {
    title,
    subtitle,
    itemIds,
    productIds: topProducts.map((item) => item.id),
    addonIds: fittedAddons.map((item) => item.id),
    total,
    query: signals.query || title,
  };
}

const MIN_SCORE_FOR_KNOWLEDGE = 18;

function hasKnowledgeSignals(signals: ParsedGiftSignals): boolean {
  return (
    signals.relationships.length > 0 ||
    signals.hobbies.length > 0 ||
    signals.professions.length > 0 ||
    signals.occasions.length > 0 ||
    signals.styles.length > 0 ||
    signals.mentionedProducts.length > 0
  );
}

function emptyReadySet(query: string): ReadyRecommendationSet {
  return {
    title: "Нужен AI-подбор",
    subtitle: "База знаний не нашла точный матч",
    itemIds: [],
    productIds: [],
    addonIds: [],
    total: 0,
    query: query.trim(),
  };
}

/**
 * Knowledge matcher used by Gift Engine (internal).
 * UI and features must call `lib/gift-engine` (`runGiftEngine`), not this file.
 *
 * Future (TASK-058): optional boost from `getLearningSignals()`.
 */
export function recommendGifts(
  query: string,
  options?: {
    recipientProfile?: string | null;
    /** Constructor / product ids to never suggest again */
    excludeItemIds?: string[] | null;
  },
): GiftRecommendation {
  const profile = options?.recipientProfile?.trim();
  const fullQuery = [query.trim(), profile].filter(Boolean).join(". ");
  const signals = parseGiftQuery(fullQuery || query);
  const exclude = new Set(options?.excludeItemIds ?? []);

  const ranked = giftKnowledgeBase.products
    .filter((product) => !exclude.has(product.id))
    .map((product) => scoreProduct(product, signals))
    .filter((row): row is RankedProduct => row != null)
    .sort((a, b) => b.score - a.score);

  const topScore = ranked[0]?.score ?? 0;
  const knowledgeOk =
    hasKnowledgeSignals(signals) && topScore >= MIN_SCORE_FOR_KNOWLEDGE;

  if (!knowledgeOk) {
    return {
      signals,
      chain: buildChain(signals),
      products: [],
      addons: [],
      readySet: emptyReadySet(query),
      source: "none",
      needsAi: true,
      confidence: "none",
    };
  }

  const products = ranked;
  const topForAddons = products.slice(0, 3).map((row) => row.product);
  const spent = topForAddons.reduce((sum, item) => sum + item.averagePrice, 0);
  const remaining =
    signals.budgetMax == null ? null : Math.max(0, signals.budgetMax - spent);
  let addons = pickAddons(signals, topForAddons, remaining);
  if (exclude.size > 0) {
    addons = addons.filter((a) => !exclude.has(a.id));
  }
  const readySet = buildReadySet(signals, products, addons);
  if (exclude.size > 0) {
    readySet.itemIds = readySet.itemIds.filter((id) => !exclude.has(id));
    readySet.productIds = readySet.productIds.filter((id) => !exclude.has(id));
    readySet.addonIds = readySet.addonIds.filter((id) => !exclude.has(id));
  }

  return {
    signals,
    chain: buildChain(signals),
    products: products.slice(0, 8),
    addons,
    readySet,
    source: "knowledge",
    needsAi: false,
    confidence: topScore >= 40 ? "high" : "medium",
  };
}

/** Constructor defaults from Knowledge Engine. Empty when AI is required. */
export function getRecommendedConstructorIds(
  query: string,
  options?: {
    recipientProfile?: string | null;
    excludeItemIds?: string[] | null;
  },
): string[] {
  if (!query.trim() && !options?.recipientProfile?.trim()) {
    return ["mug", "box", "card", "chocolate"].filter(
      (id) => !(options?.excludeItemIds ?? []).includes(id),
    );
  }
  const result = recommendGifts(query, options);
  if (result.needsAi) return [];
  return result.readySet.itemIds;
}
