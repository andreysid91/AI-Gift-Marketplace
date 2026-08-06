import {
  giftKnowledgeBase,
  type KnowledgeEntity,
} from "./index";
import {
  parseGiftQuery,
  type GiftRecommendation,
  type ParsedGiftSignals,
  type RankedProduct,
  type ReadyRecommendationSet,
} from "./recommend";

export type AiRecommendResult = {
  source: "ai";
  chain: string[];
  productIds: string[];
  addonIds: string[];
  itemIds: string[];
  title: string;
  subtitle: string;
  total: number;
  explanation: string;
};

const CONSTRUCTOR_IDS = new Set(
  giftKnowledgeBase.products
    .map((p) => p.constructorId)
    .filter((id): id is string => Boolean(id))
    .concat(
      giftKnowledgeBase.addons
        .map((a) => a.constructorId)
        .filter((id): id is string => Boolean(id)),
    ),
);

function priceOf(id: string): number {
  const product = giftKnowledgeBase.products.find(
    (item) => item.id === id || item.constructorId === id,
  );
  if (product) return product.averagePrice;
  const addon = giftKnowledgeBase.addons.find(
    (item) => item.id === id || item.constructorId === id,
  );
  return addon?.averagePrice ?? 0;
}

function toConstructorIds(ids: string[]): string[] {
  const result: string[] = [];
  for (const id of ids) {
    const product = giftKnowledgeBase.products.find(
      (item) => item.id === id || item.constructorId === id,
    );
    const addon = giftKnowledgeBase.addons.find(
      (item) => item.id === id || item.constructorId === id,
    );
    const constructorId =
      product?.constructorId ?? addon?.constructorId ?? null;
    if (constructorId && CONSTRUCTOR_IDS.has(constructorId)) {
      if (!result.includes(constructorId)) result.push(constructorId);
    }
  }
  return result;
}

function catalogDigest() {
  return {
    products: giftKnowledgeBase.products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.averagePrice,
      constructorId: p.constructorId ?? null,
    })),
    addons: giftKnowledgeBase.addons.map((a) => ({
      id: a.id,
      name: a.name,
      price: a.averagePrice,
      constructorId: a.constructorId ?? null,
    })),
  };
}

function buildAiReadySet(
  query: string,
  productIds: string[],
  addonIds: string[],
  chain: string[],
  explanation: string,
): AiRecommendResult {
  const products = productIds
    .map((id) =>
      giftKnowledgeBase.products.find(
        (item) => item.id === id || item.constructorId === id,
      ),
    )
    .filter((item): item is KnowledgeEntity => Boolean(item));
  const addons = addonIds
    .map((id) =>
      giftKnowledgeBase.addons.find(
        (item) => item.id === id || item.constructorId === id,
      ),
    )
    .filter((item): item is KnowledgeEntity => Boolean(item));

  const itemIds = toConstructorIds([
    ...products.map((p) => p.id),
    ...addons.map((a) => a.id),
  ]);
  const safeItemIds =
    itemIds.length > 0 ? itemIds : ["mug", "box", "card"];

  const total = [...products, ...addons].reduce(
    (sum, item) => sum + item.averagePrice,
    0,
  );

  return {
    source: "ai",
    chain: chain.length > 0 ? chain : ["AI-подбор"],
    productIds: products.map((p) => p.id),
    addonIds: addons.map((a) => a.id),
    itemIds: safeItemIds,
    title: "AI-набор",
    subtitle: chain.join(" · ") || explanation || "Подобрано с помощью AI",
    total:
      total > 0
        ? total
        : safeItemIds.reduce((sum, id) => sum + priceOf(id), 0),
    explanation,
  };
}

/**
 * Soft local fallback when no API key — still "AI path", but catalog-constrained heuristics.
 * Used only after knowledge miss.
 */
export function localAiFallback(query: string): AiRecommendResult {
  const signals = parseGiftQuery(query);
  const budget = signals.budgetMax;
  const q = query.toLowerCase();

  const preferred: string[] = [];
  if (/фото|портрет|картин/.test(q)) preferred.push("canvas", "photobook", "frame");
  if (/одежд|носк|футбол|худи|толстов/.test(q)) preferred.push("tee", "hoodie");
  if (/дом|уют|комнат/.test(q)) preferred.push("pillow", "mug");
  if (/офис|работ|коллег/.test(q)) preferred.push("mug", "notebook", "tote");
  if (/ребён|ребен|малыш|дет/.test(q)) preferred.push("puzzle", "magnet", "frame");
  if (preferred.length === 0) preferred.push("mug", "tee", "magnet");

  const productIds: string[] = [];
  let spent = 0;
  for (const id of preferred) {
    const product = giftKnowledgeBase.products.find((p) => p.id === id);
    if (!product) continue;
    if (budget != null && spent + product.averagePrice > budget) continue;
    productIds.push(product.id);
    spent += product.averagePrice;
    if (productIds.length >= 2) break;
  }

  if (productIds.length === 0) {
    const cheapest = [...giftKnowledgeBase.products]
      .filter((p) => budget == null || p.averagePrice <= budget)
      .sort((a, b) => a.averagePrice - b.averagePrice)[0];
    if (cheapest) productIds.push(cheapest.id);
  }

  const addonCandidates = ["card", "box", "chocolate"];
  let totalSpent = productIds.reduce((s, id) => s + priceOf(id), 0);
  const fittedAddons: string[] = [];
  for (const id of addonCandidates) {
    const addon = giftKnowledgeBase.addons.find((a) => a.id === id);
    if (!addon) continue;
    if (budget != null && totalSpent + addon.averagePrice > budget) continue;
    fittedAddons.push(id);
    totalSpent += addon.averagePrice;
    if (fittedAddons.length >= 2) break;
  }

  return buildAiReadySet(
    query,
    productIds,
    fittedAddons,
    ["AI-подбор", ...(budget != null ? [`До ${budget.toLocaleString("ru-RU")} ₽`] : [])],
    "База знаний не нашла точный матч — сработал запасной AI-подбор по каталогу.",
  );
}

type OpenAiJson = {
  chain?: string[];
  productIds?: string[];
  addonIds?: string[];
  explanation?: string;
};

async function callOpenAi(query: string): Promise<AiRecommendResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const catalog = catalogDigest();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Ты подбираешь подарки только из переданного каталога AI Gift. Верни JSON: { chain: string[], productIds: string[], addonIds: string[], explanation: string }. Используй только id из каталога. Учитывай бюджет, если он есть в запросе. 1-3 productIds и 1-2 addonIds.",
        },
        {
          role: "user",
          content: JSON.stringify({ query, catalog }),
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error("OpenAI recommend failed", await response.text());
    return null;
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) return null;

  let parsed: OpenAiJson;
  try {
    parsed = JSON.parse(raw) as OpenAiJson;
  } catch {
    return null;
  }

  const validProductIds = (parsed.productIds ?? []).filter((id) =>
    giftKnowledgeBase.products.some((p) => p.id === id),
  );
  const validAddonIds = (parsed.addonIds ?? []).filter((id) =>
    giftKnowledgeBase.addons.some((a) => a.id === id),
  );

  if (validProductIds.length === 0) return null;

  return buildAiReadySet(
    query,
    validProductIds,
    validAddonIds,
    parsed.chain ?? ["AI-подбор"],
    parsed.explanation ?? "Подобрано с помощью AI после пропуска базы знаний.",
  );
}

/** AI runs ONLY after knowledge base miss. */
export async function aiRecommendFallback(
  query: string,
): Promise<AiRecommendResult> {
  try {
    const fromApi = await callOpenAi(query);
    if (fromApi) return fromApi;
  } catch (error) {
    console.error("AI fallback error", error);
  }
  return localAiFallback(query);
}

export function aiResultToRecommendation(
  query: string,
  ai: AiRecommendResult,
  signals?: ParsedGiftSignals,
): GiftRecommendation {
  const parsed = signals ?? parseGiftQuery(query);
  const products: RankedProduct[] = ai.productIds
    .map((id) => giftKnowledgeBase.products.find((p) => p.id === id))
    .filter((item): item is KnowledgeEntity => Boolean(item))
    .map((product) => ({
      product,
      score: 40,
      reasons: ["AI-подбор"],
    }));

  const addons = ai.addonIds
    .map((id) => giftKnowledgeBase.addons.find((a) => a.id === id))
    .filter((item): item is KnowledgeEntity => Boolean(item));

  const readySet: ReadyRecommendationSet = {
    title: ai.title,
    subtitle: ai.subtitle,
    itemIds: ai.itemIds,
    productIds: ai.productIds,
    addonIds: ai.addonIds,
    total: ai.total,
    query: query.trim() || ai.title,
  };

  return {
    signals: parsed,
    chain: ai.chain,
    products,
    addons,
    readySet,
    source: "ai",
    needsAi: false,
    confidence: "medium",
  };
}
