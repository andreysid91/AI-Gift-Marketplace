/**
 * Universal Product Card — one card model for any product (TASK-064).
 */

import { giftKnowledgeBase } from "./knowledge";
import {
  GIFT_CONSTRUCTOR_ITEMS,
  formatRub,
} from "./scenario-catalog";
import {
  getProductSchema,
  type ProductConfigSchema,
} from "./product-configurator";
import { formatLeadTimeLabel } from "./gift-engine";

export type UniversalProductCardModel = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** Gradient for large visual */
  tone: string;
  /** Base / "from" price before options */
  priceFrom: number;
  leadTimeHours: number | null;
  leadTimeLabel: string;
  /** Configurator schema (always present — fallback qty-only if needed) */
  schema: ProductConfigSchema;
  detailHref: string;
};

const TONES: Record<string, string> = {
  mug: "from-[#ffb4a2] to-[#ff6b4a]",
  tee: "from-[#ffd59a] to-[#ff9f43]",
  canvas: "from-[#f7b6c8] to-[#e84d6f]",
  puzzle: "from-[#9de7c8] to-[#3db88a]",
  magnet: "from-[#ffe0b8] to-[#e8a04a]",
  card: "from-[#ffd0dc] to-[#e86a8a]",
  box: "from-[#ffc9a0] to-[#e07a3a]",
  frame: "from-[#ffc4b0] to-[#d96b4c]",
  chocolate: "from-[#e8c4a8] to-[#a67c52]",
  tea: "from-[#c8e8c4] to-[#6aab5c]",
  coffee: "from-[#e8d4c4] to-[#8b6914]",
  candle: "from-[#ffe8c8] to-[#ff9f43]",
};

function fallbackSchema(
  id: string,
  title: string,
  emoji: string,
  basePrice: number,
): ProductConfigSchema {
  return {
    productId: id,
    title,
    emoji,
    basePrice,
    params: [
      {
        id: "qty",
        label: "Количество",
        kind: "quantity",
        min: 1,
        max: 100,
        defaultQty: 1,
      },
    ],
  };
}

/** Resolve any product id into a card model (KB + configurator + catalog). */
export function resolveUniversalProductCard(
  productId: string,
): UniversalProductCardModel | null {
  const id = productId.trim();
  if (!id) return null;

  const kb =
    giftKnowledgeBase.products.find(
      (p) => p.id === id || p.constructorId === id,
    ) ??
    giftKnowledgeBase.addons.find(
      (p) => p.id === id || p.constructorId === id,
    );

  const catalog = GIFT_CONSTRUCTOR_ITEMS.find((item) => item.id === id);
  const schemaFromConfig = getProductSchema(id);

  const title = schemaFromConfig?.title ?? kb?.name ?? catalog?.title ?? id;
  const emoji =
    schemaFromConfig?.emoji ?? kb?.emoji ?? catalog?.emoji ?? "🎁";
  const basePrice =
    schemaFromConfig?.basePrice ??
    kb?.averagePrice ??
    catalog?.price ??
    990;
  const description =
    kb?.description?.trim() ||
    `${title} — персональное изготовление под ваш запрос.`;
  const leadTimeHours = kb?.productionTimeHours ?? null;

  const schema =
    schemaFromConfig ?? fallbackSchema(id, title, emoji, basePrice);

  return {
    id,
    title,
    description,
    emoji,
    tone: TONES[id] ?? "from-[#ffb4a2] to-[#ff5a3c]",
    priceFrom: basePrice,
    leadTimeHours,
    leadTimeLabel: formatLeadTimeLabel(leadTimeHours),
    schema,
    detailHref: `/configure?product=${encodeURIComponent(id)}`,
  };
}

export function listUniversalProductIds(): string[] {
  const ids = new Set<string>();
  for (const item of GIFT_CONSTRUCTOR_ITEMS) ids.add(item.id);
  for (const p of giftKnowledgeBase.products) {
    ids.add(p.constructorId ?? p.id);
  }
  return [...ids];
}

export { formatRub };
