"use client";

import { useMemo } from "react";
import {
  PURCHASE_STATUS_TONE,
  getPurchaseList,
  purchaseSummary,
  receivePurchase,
  setPurchaseStatus,
  type PurchaseItem,
  type PurchaseStatus,
} from "../lib/purchases";
import type { WarehouseItem } from "../lib/warehouse";

type PurchasesPanelProps = {
  warehouse: WarehouseItem[];
  onWarehouseChange: (next: WarehouseItem[]) => void;
};

export function PurchasesPanel({
  warehouse,
  onWarehouseChange,
}: PurchasesPanelProps) {
  const items = useMemo(() => getPurchaseList(warehouse), [warehouse]);
  const summary = purchaseSummary(items);

  function updateStatus(item: PurchaseItem, status: PurchaseStatus) {
    if (status === "Получено") {
      const nextWarehouse = receivePurchase(
        warehouse,
        item.warehouseId,
        item.qtyToBuy,
      );
      onWarehouseChange(nextWarehouse);
      setPurchaseStatus(item.warehouseId, "Получено", items);
      return;
    }
    setPurchaseStatus(item.warehouseId, status, items);
    // Force refresh via warehouse touch (same ref would not recompute overrides alone)
    onWarehouseChange([...warehouse]);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Позиций в закупках" value={String(summary.total)} />
        <SummaryCard label="К закупке" value={String(summary.toOrder)} />
        <SummaryCard label="Единиц купить" value={String(summary.units)} />
      </div>

      <div className="rounded-[24px] bg-[var(--accent-soft)] p-5 text-[var(--accent)]">
        <p className="text-xs font-extrabold uppercase tracking-wide">
          Автозаполнение
        </p>
        <p className="mt-2 text-base font-extrabold">
          Если на складе осталось меньше минимума — позиция сразу попадает в
          список закупок (коробки, лента, чай, кофе, шоколад, свечи, пакеты и
          др.).
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[28px] bg-white px-6 py-12 text-center shadow-[var(--shadow-soft)]">
          <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Закупать пока нечего
          </p>
          <p className="mt-2 font-bold text-[var(--muted)]">
            Все остатки выше минимума
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]">
          <div className="hidden grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr_1fr] gap-3 border-b border-[var(--line)] px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-[var(--muted)] sm:grid">
            <span>Товар</span>
            <span>На складе</span>
            <span>Минимум</span>
            <span>Купить</span>
            <span>Статус</span>
          </div>

          {items.map((item) => (
            <article
              key={item.id}
              className="grid gap-3 border-b border-[var(--line)] px-5 py-4 last:border-0 sm:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr_1fr] sm:items-center"
            >
              <div>
                <p className="font-extrabold">{item.name}</p>
                <p className="text-xs font-bold text-[var(--muted)]">
                  {item.sku} · {item.reason}
                  {item.hint ? ` · ${item.hint}` : ""}
                </p>
              </div>
              <p className="font-extrabold">
                {item.onHand} {item.unit}
              </p>
              <p className="font-extrabold text-[var(--muted)]">
                {item.minStock} {item.unit}
              </p>
              <p className="font-extrabold text-[var(--accent)]">
                {item.qtyToBuy} {item.unit}
              </p>
              <select
                value={item.status}
                onChange={(event) =>
                  updateStatus(
                    item,
                    event.target.value as PurchaseStatus,
                  )
                }
                className={`rounded-[14px] border-2 border-[var(--line)] px-3 py-2 text-sm font-extrabold outline-none focus:border-[var(--accent)] ${PURCHASE_STATUS_TONE[item.status]}`}
              >
                <option value="К закупке">К закупке</option>
                <option value="Заказано">Заказано</option>
                <option value="Получено">Получено</option>
              </select>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-white px-4 py-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}
