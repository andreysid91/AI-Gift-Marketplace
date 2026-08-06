/**
 * Warehouse / stock module (mock).
 * Auto statuses: Заканчивается · Закончилось · Нужно купить
 */

export const WAREHOUSE_STORAGE_KEY = "ai-gift-warehouse";

export type StockStatus =
  | "В норме"
  | "Заканчивается"
  | "Закончилось"
  | "Нужно купить";

export type WarehouseItem = {
  id: string;
  name: string;
  sku: string;
  unit: string;
  quantity: number;
  minStock: number;
  /** Optional purchase hint */
  buyHint?: string;
};

export type WarehouseItemView = WarehouseItem & {
  status: StockStatus;
  toBuy: number;
};

export const STOCK_STATUS_TONE: Record<StockStatus, string> = {
  "В норме": "bg-[var(--mint-soft)] text-[var(--mint)]",
  Заканчивается: "bg-[var(--secondary-soft)] text-[#c56a12]",
  Закончилось: "bg-[var(--berry-soft)] text-[var(--berry)]",
  "Нужно купить": "bg-[var(--accent-soft)] text-[var(--accent)]",
};

export const INITIAL_WAREHOUSE: WarehouseItem[] = [
  {
    id: "WH-01",
    name: "Кружка белая",
    sku: "MUG-WHITE",
    unit: "шт",
    quantity: 48,
    minStock: 20,
  },
  {
    id: "WH-02",
    name: "Футболка белая M/L",
    sku: "TEE-WHT",
    unit: "шт",
    quantity: 12,
    minStock: 15,
    buyHint: "Докупить M и L",
  },
  {
    id: "WH-03",
    name: "Холст 40×50",
    sku: "CANVAS-4050",
    unit: "шт",
    quantity: 8,
    minStock: 10,
  },
  {
    id: "WH-04",
    name: "Магнит заготовка",
    sku: "MAG-BASE",
    unit: "шт",
    quantity: 0,
    minStock: 30,
    buyHint: "Срочно — ноль на складе",
  },
  {
    id: "WH-05",
    name: "Коробки",
    sku: "BOX-GIFT",
    unit: "шт",
    quantity: 5,
    minStock: 25,
    buyHint: "Пачка 50 шт",
  },
  {
    id: "WH-06",
    name: "Открытка blank",
    sku: "CARD-BLANK",
    unit: "шт",
    quantity: 120,
    minStock: 40,
  },
  {
    id: "WH-07",
    name: "Шоколад",
    sku: "CHOC-01",
    unit: "шт",
    quantity: 3,
    minStock: 20,
  },
  {
    id: "WH-08",
    name: "Чай",
    sku: "TEA-01",
    unit: "шт",
    quantity: 0,
    minStock: 15,
  },
  {
    id: "WH-09",
    name: "Кофе",
    sku: "COFFEE-01",
    unit: "шт",
    quantity: 4,
    minStock: 12,
  },
  {
    id: "WH-10",
    name: "Свечи",
    sku: "CANDLE-01",
    unit: "шт",
    quantity: 2,
    minStock: 8,
  },
  {
    id: "WH-11",
    name: "Фоторамка A4",
    sku: "FRAME-A4",
    unit: "шт",
    quantity: 14,
    minStock: 10,
  },
  {
    id: "WH-12",
    name: "Чернила / расходники печати",
    sku: "INK-SET",
    unit: "компл",
    quantity: 1,
    minStock: 3,
    buyHint: "Заказать у PrintHouse",
  },
  {
    id: "WH-14",
    name: "Лента",
    sku: "RIBBON-01",
    unit: "рул",
    quantity: 1,
    minStock: 5,
    buyHint: "Атласная лента 2 см",
  },
  {
    id: "WH-18",
    name: "Пакеты",
    sku: "BAG-01",
    unit: "шт",
    quantity: 8,
    minStock: 40,
    buyHint: "Крафт-пакеты с логотипом",
  },
];

/**
 * Automatic stock status:
 * - 0 → Закончилось (+ Нужно купить as actionable label via toBuy)
 * - >0 and <= minStock → Заканчивается / Нужно купить
 * - else → В норме
 */
export function resolveStockStatus(item: WarehouseItem): StockStatus {
  if (item.quantity <= 0) return "Закончилось";
  if (item.quantity <= item.minStock) {
    // Critical low → need to buy; still "low" visually via tone for ending
    return item.quantity <= Math.ceil(item.minStock * 0.35)
      ? "Нужно купить"
      : "Заканчивается";
  }
  return "В норме";
}

export function qtyToBuy(item: WarehouseItem): number {
  if (item.quantity >= item.minStock) return 0;
  return Math.max(item.minStock - item.quantity, 0);
}

export function withStockStatus(item: WarehouseItem): WarehouseItemView {
  return {
    ...item,
    status: resolveStockStatus(item),
    toBuy: qtyToBuy(item),
  };
}

export function loadWarehouse(): WarehouseItem[] {
  if (typeof window === "undefined") return INITIAL_WAREHOUSE;
  try {
    const raw = localStorage.getItem(WAREHOUSE_STORAGE_KEY);
    if (!raw) return INITIAL_WAREHOUSE;
    const stored = JSON.parse(raw) as WarehouseItem[];
    if (!Array.isArray(stored)) return INITIAL_WAREHOUSE;
    const byId = new Map(INITIAL_WAREHOUSE.map((item) => [item.id, item]));
    for (const item of stored) byId.set(item.id, item);
    return [...byId.values()];
  } catch {
    return INITIAL_WAREHOUSE;
  }
}

export function saveWarehouse(items: WarehouseItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify(items));
}

export function getWarehouseAlerts(items: WarehouseItem[]) {
  const views = items.map(withStockStatus);
  return {
    ending: views.filter((item) => item.status === "Заканчивается"),
    empty: views.filter((item) => item.status === "Закончилось"),
    needBuy: views.filter(
      (item) =>
        item.status === "Нужно купить" ||
        item.status === "Закончилось" ||
        item.toBuy > 0,
    ),
    ok: views.filter((item) => item.status === "В норме"),
    all: views,
  };
}

export function updateWarehouseQuantity(
  items: WarehouseItem[],
  id: string,
  quantity: number,
): WarehouseItem[] {
  return items.map((item) =>
    item.id === id
      ? { ...item, quantity: Math.max(0, Math.floor(quantity)) }
      : item,
  );
}

export function updateWarehouseMinStock(
  items: WarehouseItem[],
  id: string,
  minStock: number,
): WarehouseItem[] {
  return items.map((item) =>
    item.id === id
      ? { ...item, minStock: Math.max(0, Math.floor(minStock)) }
      : item,
  );
}
