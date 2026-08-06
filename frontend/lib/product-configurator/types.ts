/**
 * Universal Product Configurator — each product defines its own parameters.
 * All parameters feed into automatic price calculation.
 */

export type ParamOption = {
  id: string;
  label: string;
  /** Added to unit price after base */
  priceDelta?: number;
  /** Multiplies (base + deltas so far); default 1 */
  priceMultiplier?: number;
};

export type ConfigParamKind = "select" | "quantity";

export type ConfigParam = {
  id: string;
  label: string;
  kind: ConfigParamKind;
  /** For select */
  options?: ParamOption[];
  defaultOptionId?: string;
  /** For quantity */
  min?: number;
  max?: number;
  defaultQty?: number;
  /** Extra rubles per unit beyond 1 (rare); usually qty only multiplies */
  pricePerExtraUnit?: number;
};

export type ProductConfigSchema = {
  productId: string;
  title: string;
  emoji: string;
  basePrice: number;
  params: ConfigParam[];
};

/** Current user selections: option id or qty number */
export type ProductSelections = Record<string, string | number>;

export type PricedConfiguration = {
  productId: string;
  title: string;
  emoji: string;
  basePrice: number;
  unitPrice: number;
  qty: number;
  lineTotal: number;
  selections: ProductSelections;
  /** Human-readable: «M · Чёрный · Хлопок ×2» */
  summary: string;
  /** Breakdown for UI */
  breakdown: Array<{ label: string; amount: number }>;
};
