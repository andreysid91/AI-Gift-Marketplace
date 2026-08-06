import {
  qtyToBuy,
  withStockStatus,
  type WarehouseItem,
} from "./warehouse";

export const PURCHASES_STORAGE_KEY = "ai-gift-purchases";

export type PurchaseStatus = "К закупке" | "Заказано" | "Получено";

export type PurchaseItem = {
  id: string;
  warehouseId: string;
  name: string;
  sku: string;
  unit: string;
  onHand: number;
  minStock: number;
  qtyToBuy: number;
  reason: "Заканчивается" | "Закончилось" | "Ниже минимума";
  hint?: string;
  status: PurchaseStatus;
  addedAt: string;
};

export const PURCHASE_STATUS_TONE: Record<PurchaseStatus, string> = {
  "К закупке": "bg-[var(--accent-soft)] text-[var(--accent)]",
  Заказано: "bg-[var(--secondary-soft)] text-[#c56a12]",
  Получено: "bg-[var(--mint-soft)] text-[var(--mint)]",
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function reasonFor(item: WarehouseItem): PurchaseItem["reason"] {
  if (item.quantity <= 0) return "Закончилось";
  if (item.quantity <= Math.ceil(item.minStock * 0.35)) return "Ниже минимума";
  return "Заканчивается";
}

/** Build purchase rows from warehouse items below minimum. */
export function buildPurchasesFromWarehouse(
  warehouse: WarehouseItem[],
): PurchaseItem[] {
  return warehouse
    .filter((item) => item.quantity < item.minStock)
    .map((item) => {
      const view = withStockStatus(item);
      return {
        id: `BUY-${item.id}`,
        warehouseId: item.id,
        name: item.name,
        sku: item.sku,
        unit: item.unit,
        onHand: item.quantity,
        minStock: item.minStock,
        qtyToBuy: view.toBuy || qtyToBuy(item),
        reason: reasonFor(item),
        hint: item.buyHint,
        status: "К закупке" as const,
        addedAt: today(),
      };
    })
    .sort((a, b) => b.qtyToBuy - a.qtyToBuy || a.name.localeCompare(b.name));
}

/**
 * Merge auto list with saved purchase statuses (Заказано / Получено).
 * Items back above min are removed unless still marked Заказано.
 */
export function syncPurchases(
  warehouse: WarehouseItem[],
  previous: PurchaseItem[] = [],
): PurchaseItem[] {
  const auto = buildPurchasesFromWarehouse(warehouse);
  const prevByWh = new Map(previous.map((item) => [item.warehouseId, item]));
  const next: PurchaseItem[] = auto.map((item) => {
    const prev = prevByWh.get(item.warehouseId);
    if (!prev) return item;
    return {
      ...item,
      status: prev.status === "Получено" ? "К закупке" : prev.status,
      addedAt: prev.addedAt || item.addedAt,
    };
  });

  // Keep "Заказано" even if somehow filtered — already in auto when below min
  return next;
}

export function loadPurchaseOverrides(): Record<
  string,
  { status: PurchaseStatus; addedAt?: string }
> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PURCHASES_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<
      string,
      { status: PurchaseStatus; addedAt?: string }
    >;
  } catch {
    return {};
  }
}

export function savePurchaseOverrides(
  map: Record<string, { status: PurchaseStatus; addedAt?: string }>,
) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(map));
}

export function getPurchaseList(warehouse: WarehouseItem[]): PurchaseItem[] {
  const overrides = loadPurchaseOverrides();
  return buildPurchasesFromWarehouse(warehouse).map((item) => {
    const override = overrides[item.warehouseId];
    if (!override) return item;
    return {
      ...item,
      status: override.status,
      addedAt: override.addedAt ?? item.addedAt,
    };
  });
}

export function setPurchaseStatus(
  warehouseId: string,
  status: PurchaseStatus,
  current: PurchaseItem[],
): PurchaseItem[] {
  const overrides = loadPurchaseOverrides();
  overrides[warehouseId] = {
    status,
    addedAt:
      current.find((item) => item.warehouseId === warehouseId)?.addedAt ??
      today(),
  };
  savePurchaseOverrides(overrides);
  return current.map((item) =>
    item.warehouseId === warehouseId ? { ...item, status } : item,
  );
}

/** When purchase received — restock warehouse to at least minStock. */
export function receivePurchase(
  warehouse: WarehouseItem[],
  warehouseId: string,
  qtyBought?: number,
): WarehouseItem[] {
  return warehouse.map((item) => {
    if (item.id !== warehouseId) return item;
    const add = qtyBought ?? Math.max(item.minStock - item.quantity, 0);
    return { ...item, quantity: item.quantity + add };
  });
}

export function purchaseSummary(items: PurchaseItem[]) {
  return {
    total: items.length,
    toOrder: items.filter((item) => item.status === "К закупке").length,
    ordered: items.filter((item) => item.status === "Заказано").length,
    units: items.reduce((sum, item) => sum + item.qtyToBuy, 0),
  };
}
