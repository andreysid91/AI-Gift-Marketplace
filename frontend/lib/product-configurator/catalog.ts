import type { ProductConfigSchema } from "./types";

/**
 * Product-specific parameter schemas.
 * Add a new product → add a schema; the Universal Configurator picks it up.
 */
export const PRODUCT_CONFIG_SCHEMAS: Record<string, ProductConfigSchema> = {
  tee: {
    productId: "tee",
    title: "Футболка",
    emoji: "👕",
    basePrice: 1690,
    params: [
      {
        id: "size",
        label: "Размер",
        kind: "select",
        defaultOptionId: "m",
        options: [
          { id: "s", label: "S", priceDelta: 0 },
          { id: "m", label: "M", priceDelta: 0 },
          { id: "l", label: "L", priceDelta: 0 },
          { id: "xl", label: "XL", priceDelta: 150 },
          { id: "xxl", label: "XXL", priceDelta: 250 },
        ],
      },
      {
        id: "color",
        label: "Цвет",
        kind: "select",
        defaultOptionId: "white",
        options: [
          { id: "white", label: "Белый", priceDelta: 0 },
          { id: "black", label: "Чёрный", priceDelta: 0 },
          { id: "navy", label: "Тёмно-синий", priceDelta: 50 },
          { id: "custom", label: "Свой цвет", priceDelta: 200 },
        ],
      },
      {
        id: "material",
        label: "Материал",
        kind: "select",
        defaultOptionId: "cotton",
        options: [
          { id: "cotton", label: "Хлопок 160 г", priceDelta: 0 },
          { id: "cotton-soft", label: "Soft cotton 180 г", priceDelta: 300 },
          { id: "premium", label: "Premium 220 г", priceDelta: 550 },
        ],
      },
      {
        id: "qty",
        label: "Количество",
        kind: "quantity",
        min: 1,
        max: 50,
        defaultQty: 1,
      },
      {
        id: "extras",
        label: "Дополнительно",
        kind: "select",
        defaultOptionId: "none",
        options: [
          { id: "none", label: "Без опций", priceDelta: 0 },
          { id: "gift-wrap", label: "Подарочная упаковка", priceDelta: 350 },
          { id: "card", label: "Открытка", priceDelta: 250 },
          { id: "rush", label: "Срочное изготовление", priceDelta: 500 },
        ],
      },
    ],
  },

  mug: {
    productId: "mug",
    title: "Кружка",
    emoji: "☕",
    basePrice: 990,
    params: [
      {
        id: "type",
        label: "Тип",
        kind: "select",
        defaultOptionId: "classic",
        options: [
          { id: "classic", label: "Классическая", priceDelta: 0 },
          { id: "enamel", label: "Эмалированная", priceDelta: 250 },
          { id: "thermo", label: "Термокружка", priceDelta: 600 },
          { id: "glass", label: "Стеклянная", priceDelta: 350 },
        ],
      },
      {
        id: "color",
        label: "Цвет",
        kind: "select",
        defaultOptionId: "white",
        options: [
          { id: "white", label: "Белый", priceDelta: 0 },
          { id: "black", label: "Чёрный", priceDelta: 50 },
          { id: "color", label: "Цветная", priceDelta: 120 },
        ],
      },
      {
        id: "qty",
        label: "Количество",
        kind: "quantity",
        min: 1,
        max: 100,
        defaultQty: 1,
      },
      {
        id: "extras",
        label: "Дополнительно",
        kind: "select",
        defaultOptionId: "none",
        options: [
          { id: "none", label: "Без опций", priceDelta: 0 },
          { id: "box", label: "Коробка", priceDelta: 450 },
          { id: "card", label: "Открытка", priceDelta: 250 },
          { id: "rush", label: "Срочно", priceDelta: 400 },
        ],
      },
    ],
  },

  canvas: {
    productId: "canvas",
    title: "Холст",
    emoji: "🖼️",
    basePrice: 2490,
    params: [
      {
        id: "size",
        label: "Размер",
        kind: "select",
        defaultOptionId: "30x40",
        options: [
          { id: "20x30", label: "20×30 см", priceDelta: -400 },
          { id: "30x40", label: "30×40 см", priceDelta: 0 },
          { id: "40x50", label: "40×50 см", priceDelta: 700 },
          { id: "50x70", label: "50×70 см", priceDelta: 1500 },
          { id: "60x90", label: "60×90 см", priceDelta: 2800 },
        ],
      },
      {
        id: "material",
        label: "Материал",
        kind: "select",
        defaultOptionId: "cotton",
        options: [
          { id: "cotton", label: "Хлопковый холст", priceDelta: 0 },
          { id: "linen", label: "Льняной", priceDelta: 450 },
          { id: "gallery", label: "Gallery wrap", priceDelta: 650 },
        ],
      },
      {
        id: "qty",
        label: "Количество",
        kind: "quantity",
        min: 1,
        max: 20,
        defaultQty: 1,
      },
      {
        id: "extras",
        label: "Дополнительно",
        kind: "select",
        defaultOptionId: "none",
        options: [
          { id: "none", label: "Без опций", priceDelta: 0 },
          { id: "frame", label: "Рама", priceDelta: 890 },
          { id: "gift-wrap", label: "Упаковка", priceDelta: 350 },
          { id: "rush", label: "Срочно", priceDelta: 600 },
        ],
      },
    ],
  },

  puzzle: {
    productId: "puzzle",
    title: "Пазл",
    emoji: "🧩",
    basePrice: 1500,
    params: [
      {
        id: "pieces",
        label: "Количество деталей",
        kind: "select",
        defaultOptionId: "120",
        options: [
          { id: "60", label: "60 деталей", priceDelta: -200 },
          { id: "120", label: "120 деталей", priceDelta: 0 },
          { id: "500", label: "500 деталей", priceDelta: 500 },
          { id: "1000", label: "1000 деталей", priceDelta: 1100 },
        ],
      },
      {
        id: "size",
        label: "Размер",
        kind: "select",
        defaultOptionId: "a4",
        options: [
          { id: "a5", label: "A5", priceDelta: -150 },
          { id: "a4", label: "A4", priceDelta: 0 },
          { id: "a3", label: "A3", priceDelta: 400 },
          { id: "a2", label: "A2", priceDelta: 900 },
        ],
      },
      {
        id: "qty",
        label: "Количество",
        kind: "quantity",
        min: 1,
        max: 30,
        defaultQty: 1,
      },
      {
        id: "extras",
        label: "Дополнительно",
        kind: "select",
        defaultOptionId: "none",
        options: [
          { id: "none", label: "Без опций", priceDelta: 0 },
          { id: "box", label: "Коробка", priceDelta: 450 },
          { id: "card", label: "Открытка", priceDelta: 250 },
        ],
      },
    ],
  },
};

/** Products that have a rich configurator (not just flat catalog price) */
export function hasProductConfigurator(productId: string): boolean {
  return Boolean(PRODUCT_CONFIG_SCHEMAS[productId]);
}

export function getProductSchema(
  productId: string,
): ProductConfigSchema | null {
  return PRODUCT_CONFIG_SCHEMAS[productId] ?? null;
}

export function listConfigurableProductIds(): string[] {
  return Object.keys(PRODUCT_CONFIG_SCHEMAS);
}
