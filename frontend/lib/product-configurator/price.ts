import { getProductSchema } from "./catalog";
import type {
  PricedConfiguration,
  ProductConfigSchema,
  ProductSelections,
} from "./types";

export function defaultSelections(
  schema: ProductConfigSchema,
): ProductSelections {
  const selections: ProductSelections = {};
  for (const param of schema.params) {
    if (param.kind === "select") {
      selections[param.id] =
        param.defaultOptionId ?? param.options?.[0]?.id ?? "";
    } else {
      selections[param.id] = param.defaultQty ?? param.min ?? 1;
    }
  }
  return selections;
}

/**
 * Universal price engine:
 * unit = (base + Σ deltas) × Π multipliers
 * line = unit × qty
 */
export function calculateConfigurationPrice(
  schema: ProductConfigSchema,
  selections: ProductSelections,
): PricedConfiguration {
  let unit = schema.basePrice;
  const breakdown: PricedConfiguration["breakdown"] = [
    { label: "Базовая цена", amount: schema.basePrice },
  ];
  const summaryParts: string[] = [];
  let qty = 1;

  for (const param of schema.params) {
    if (param.kind === "quantity") {
      const raw = Number(selections[param.id] ?? param.defaultQty ?? 1);
      const min = param.min ?? 1;
      const max = param.max ?? 99;
      qty = Math.min(max, Math.max(min, Number.isFinite(raw) ? raw : min));
      summaryParts.push(`×${qty}`);
      continue;
    }

    const optionId = String(selections[param.id] ?? param.defaultOptionId ?? "");
    const option = param.options?.find((o) => o.id === optionId);
    if (!option) continue;

    summaryParts.push(option.label);

    if (option.priceDelta) {
      unit += option.priceDelta;
      breakdown.push({
        label: `${param.label}: ${option.label}`,
        amount: option.priceDelta,
      });
    }
    if (option.priceMultiplier && option.priceMultiplier !== 1) {
      const before = unit;
      unit = Math.round(unit * option.priceMultiplier);
      breakdown.push({
        label: `${param.label}: ×${option.priceMultiplier}`,
        amount: unit - before,
      });
    } else if (!option.priceDelta) {
      // zero-delta option still shown in summary only
    }
  }

  unit = Math.max(0, Math.round(unit));
  const lineTotal = unit * qty;

  if (qty > 1) {
    breakdown.push({ label: `Количество ×${qty}`, amount: unit * (qty - 1) });
  }

  return {
    productId: schema.productId,
    title: schema.title,
    emoji: schema.emoji,
    basePrice: schema.basePrice,
    unitPrice: unit,
    qty,
    lineTotal,
    selections: { ...selections, qty },
    summary: summaryParts.join(" · "),
    breakdown,
  };
}

export function priceProduct(
  productId: string,
  selections?: ProductSelections | null,
): PricedConfiguration | null {
  const schema = getProductSchema(productId);
  if (!schema) return null;
  const sel = selections ?? defaultSelections(schema);
  return calculateConfigurationPrice(schema, sel);
}

/** Flat catalog fallback when no schema */
export function priceSimpleLine(
  productId: string,
  title: string,
  emoji: string,
  basePrice: number,
  qty = 1,
): PricedConfiguration {
  const q = Math.max(1, qty);
  return {
    productId,
    title,
    emoji,
    basePrice,
    unitPrice: basePrice,
    qty: q,
    lineTotal: basePrice * q,
    selections: { qty: q },
    summary: q > 1 ? `×${q}` : "Стандарт",
    breakdown: [
      { label: "Базовая цена", amount: basePrice },
      ...(q > 1
        ? [{ label: `Количество ×${q}`, amount: basePrice * (q - 1) }]
        : []),
    ],
  };
}
