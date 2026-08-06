import type { KnowledgeEntity } from "../knowledge";
import type { GiftRecommendation, RankedProduct } from "../knowledge/recommend";
import type {
  GiftEngineItem,
  GiftEngineParams,
  GiftEngineResult,
  GiftEngineSet,
} from "./types";

export function formatLeadTimeLabel(hours: number | null): string {
  if (hours == null || hours <= 0) return "Уточним срок";
  if (hours <= 24) return "1 день";
  if (hours <= 48) return "1–2 дня";
  if (hours <= 72) return "2–3 дня";
  const days = Math.ceil(hours / 24);
  return `${days - 1}–${days} дня`;
}

export function formatCostLabel(total: number): string {
  if (total <= 0) return "Стоимость уточняется";
  return `≈ ${total.toLocaleString("ru-RU")} ₽`;
}

export function entityToItem(
  entity: KnowledgeEntity,
  score = 0,
  reasons: string[] = [],
): GiftEngineItem {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    price: entity.averagePrice,
    constructorId: entity.constructorId ?? null,
    emoji: entity.emoji,
    score,
    reasons,
    productionTimeHours: entity.productionTimeHours,
  };
}

export function rankedToItem(row: RankedProduct): GiftEngineItem {
  return entityToItem(row.product, row.score, row.reasons);
}

function hoursOf(items: GiftEngineItem[]): number | null {
  const hours = items
    .map((item) => item.productionTimeHours)
    .filter((h): h is number => h != null && h > 0);
  if (hours.length === 0) return null;
  return Math.max(...hours);
}

export function buildWhy(
  params: GiftEngineParams,
  products: GiftEngineItem[],
  addons: GiftEngineItem[],
  chain: string[],
): string[] {
  const why: string[] = [];

  if (params.recipient) {
    why.push(`Получатель: ${params.recipient}`);
  }
  if (params.occasion) {
    why.push(`Повод: ${params.occasion}`);
  }
  if (params.budgetMax != null) {
    why.push(
      `Бюджет до ${params.budgetMax.toLocaleString("ru-RU")} ₽ — позиции укладываются в лимит`,
    );
  }
  if (params.quantity != null) {
    why.push(`Количество: ${params.quantity} шт.`);
  }
  if (params.urgency === "urgent") {
    why.push("Учтена срочность — приоритет быстрым срокам");
  } else if (params.urgency === "soon") {
    why.push("Нужно побыстрее — выбраны варианты с коротким производством");
  }
  if (params.hasPhoto) {
    why.push("Есть фото — подойдут изделия с персональной печатью");
  }
  if (params.orderType === "business") {
    why.push("Тип заказа: корпоративный / тираж");
  } else if (params.orderType === "photo") {
    why.push("Тип заказа: фотопечать");
  }
  if (params.city) {
    why.push(`Город: ${params.city}`);
  }
  for (const hobby of params.hobbies.slice(0, 2)) {
    why.push(`Тема «${hobby}» из запроса`);
  }

  for (const product of products.slice(0, 3)) {
    for (const reason of product.reasons.slice(0, 2)) {
      why.push(`${product.name}: ${reason}`);
    }
  }
  if (addons.length > 0) {
    why.push(
      `Дополнения: ${addons.map((a) => a.name).join(", ")} — завершают подарок`,
    );
  }
  if (chain.length > 0 && why.length < 3) {
    why.push(`Цепочка смысла: ${chain.join(" → ")}`);
  }

  return [...new Set(why)].slice(0, 10);
}

export function buildSetsFromRecommendation(
  recommendation: GiftRecommendation,
  params: GiftEngineParams,
): GiftEngineSet[] {
  const sets: GiftEngineSet[] = [];
  const primary = recommendation.readySet;
  if (primary.itemIds.length > 0) {
    sets.push({
      id: "primary",
      title: primary.title,
      subtitle: primary.subtitle,
      itemIds: primary.itemIds,
      productIds: primary.productIds,
      addonIds: primary.addonIds,
      total: primary.total,
      reasons: [
        primary.subtitle,
        params.budgetMax != null
          ? `В бюджете до ${params.budgetMax.toLocaleString("ru-RU")} ₽`
          : "Подобрано по смыслу запроса",
      ].filter(Boolean),
    });
  }

  // Alternate: hero product + card + box
  const hero = recommendation.products[0]?.product;
  if (hero) {
    const card = recommendation.addons.find((a) => a.id === "card");
    const box = recommendation.addons.find((a) => a.id === "box");
    const extra = [card, box].filter(Boolean) as KnowledgeEntity[];
    const productIds = [hero.id];
    const addonIds = extra.map((a) => a.id);
    const itemIds = [hero.constructorId, ...extra.map((a) => a.constructorId)]
      .filter(Boolean) as string[];
    const total =
      hero.averagePrice +
      extra.reduce((sum, a) => sum + a.averagePrice, 0);
    if (
      itemIds.length > 0 &&
      !sets.some((s) => s.productIds.join() === productIds.join())
    ) {
      sets.push({
        id: "hero-focus",
        title: `Фокус: ${hero.name}`,
        subtitle: "Главный товар + оформление",
        itemIds: [...new Set(itemIds)],
        productIds,
        addonIds,
        total,
        reasons: [
          recommendation.products[0]?.reasons[0] ?? "Лучший матч по запросу",
        ],
      });
    }
  }

  // Second product path
  const second = recommendation.products[1]?.product;
  if (second && second.id !== hero?.id) {
    const total = second.averagePrice;
    const cid = second.constructorId;
    if (cid) {
      sets.push({
        id: "alt-product",
        title: `Альтернатива: ${second.name}`,
        subtitle: recommendation.products[1]?.reasons[0] ?? "Другой сильный матч",
        itemIds: [cid],
        productIds: [second.id],
        addonIds: [],
        total,
        reasons: recommendation.products[1]?.reasons.slice(0, 2) ?? [],
      });
    }
  }

  return sets.slice(0, 4);
}

export function finalizeResult(
  params: GiftEngineParams,
  recommendation: GiftRecommendation,
): GiftEngineResult {
  const products = recommendation.products.map(rankedToItem);
  const addons = recommendation.addons.map((addon) =>
    entityToItem(addon, 0, ["Рекомендовано базой знаний"]),
  );
  const sets = buildSetsFromRecommendation(recommendation, params);
  const primaryItems = [
    ...products.filter((p) =>
      (sets[0]?.productIds ?? []).includes(p.id),
    ),
    ...addons.filter((a) => (sets[0]?.addonIds ?? []).includes(a.id)),
  ];
  const leadTimeHours =
    hoursOf(primaryItems.length > 0 ? primaryItems : products.slice(0, 3));
  const estimatedCost =
    sets[0]?.total ??
    products.slice(0, 1).reduce((s, p) => s + p.price, 0) +
      addons.slice(0, 2).reduce((s, a) => s + a.price, 0);

  const why = buildWhy(params, products, addons, recommendation.chain);

  return {
    params,
    products,
    sets,
    addons,
    leadTimeHours,
    leadTimeLabel: formatLeadTimeLabel(leadTimeHours),
    estimatedCost,
    estimatedCostLabel: formatCostLabel(estimatedCost),
    why,
    confidence: recommendation.confidence,
    source: recommendation.source,
    needsEnrichment: recommendation.needsAi,
    _signals: recommendation.signals,
    _chain: recommendation.chain,
    _recommendation: recommendation,
  };
}
