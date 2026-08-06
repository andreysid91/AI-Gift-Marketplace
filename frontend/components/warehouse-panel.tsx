"use client";

import { useMemo, useState } from "react";
import {
  STOCK_STATUS_TONE,
  getWarehouseAlerts,
  updateWarehouseMinStock,
  updateWarehouseQuantity,
  withStockStatus,
  type StockStatus,
  type WarehouseItem,
} from "../lib/warehouse";

type WarehousePanelProps = {
  items: WarehouseItem[];
  onChange: (next: WarehouseItem[]) => void;
};

const FILTERS: Array<{ id: "all" | StockStatus | "buy"; label: string }> = [
  { id: "all", label: "Все" },
  { id: "Заканчивается", label: "Заканчивается" },
  { id: "Закончилось", label: "Закончилось" },
  { id: "Нужно купить", label: "Нужно купить" },
  { id: "В норме", label: "В норме" },
];

export function WarehousePanel({ items, onChange }: WarehousePanelProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const alerts = useMemo(() => getWarehouseAlerts(items), [items]);
  const views = useMemo(() => {
    const all = items.map(withStockStatus);
    if (filter === "all") return all;
    if (filter === "buy") {
      return all.filter((item) => item.toBuy > 0);
    }
    return all.filter((item) => item.status === filter);
  }, [items, filter]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AlertStat
          label="Заканчивается"
          value={alerts.ending.length}
          tone="bg-[var(--secondary-soft)] text-[#c56a12]"
        />
        <AlertStat
          label="Закончилось"
          value={alerts.empty.length}
          tone="bg-[var(--berry-soft)] text-[var(--berry)]"
        />
        <AlertStat
          label="Нужно купить"
          value={alerts.needBuy.length}
          tone="bg-[var(--accent-soft)] text-[var(--accent)]"
        />
        <AlertStat
          label="В норме"
          value={alerts.ok.length}
          tone="bg-[var(--mint-soft)] text-[var(--mint)]"
        />
      </div>

      {alerts.needBuy.length > 0 ? (
        <div className="rounded-[24px] border-2 border-[var(--accent)]/20 bg-[var(--accent-soft)] p-5">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--accent)]">
            Автоматически · нужно купить
          </p>
          <ul className="mt-3 space-y-2">
            {alerts.needBuy.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 font-extrabold text-[var(--accent)]"
              >
                <span>
                  {item.name}{" "}
                  <span className="font-bold opacity-80">
                    ({item.quantity} / мин. {item.minStock} {item.unit})
                  </span>
                </span>
                <span>
                  купить {item.toBuy} {item.unit}
                  {item.buyHint ? ` · ${item.buyHint}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
              filter === item.id
                ? "bg-[var(--foreground)] text-white"
                : "bg-white text-[var(--foreground)] shadow-[var(--shadow-soft)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]">
        <div className="hidden grid-cols-[1.2fr_0.7fr_0.6fr_0.6fr_0.9fr] gap-3 border-b border-[var(--line)] px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-[var(--muted)] sm:grid">
          <span>Товар</span>
          <span>Количество</span>
          <span>Мин. остаток</span>
          <span>Купить</span>
          <span>Статус</span>
        </div>

        {views.map((item) => (
          <div
            key={item.id}
            className="grid gap-3 border-b border-[var(--line)] px-5 py-4 last:border-0 sm:grid-cols-[1.2fr_0.7fr_0.6fr_0.6fr_0.9fr] sm:items-center"
          >
            <div>
              <p className="font-extrabold">{item.name}</p>
              <p className="text-xs font-bold text-[var(--muted)]">
                {item.sku} · {item.unit}
              </p>
            </div>

            <label className="block sm:contents">
              <span className="text-xs font-extrabold uppercase text-[var(--muted)] sm:hidden">
                Количество
              </span>
              <input
                type="number"
                min={0}
                value={item.quantity}
                onChange={(event) =>
                  onChange(
                    updateWarehouseQuantity(
                      items,
                      item.id,
                      Number(event.target.value),
                    ),
                  )
                }
                className="w-full max-w-[120px] rounded-[12px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-3 py-2 font-extrabold outline-none focus:border-[var(--accent)]"
              />
            </label>

            <label className="block sm:contents">
              <span className="text-xs font-extrabold uppercase text-[var(--muted)] sm:hidden">
                Мин. остаток
              </span>
              <input
                type="number"
                min={0}
                value={item.minStock}
                onChange={(event) =>
                  onChange(
                    updateWarehouseMinStock(
                      items,
                      item.id,
                      Number(event.target.value),
                    ),
                  )
                }
                className="w-full max-w-[120px] rounded-[12px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-3 py-2 font-extrabold outline-none focus:border-[var(--accent)]"
              />
            </label>

            <p className="font-extrabold text-[var(--accent)]">
              {item.toBuy > 0 ? `${item.toBuy} ${item.unit}` : "—"}
            </p>

            <span
              className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-extrabold ${STOCK_STATUS_TONE[item.status]}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className={`rounded-[22px] px-4 py-5 ${tone}`}>
      <p className="text-xs font-extrabold uppercase tracking-wide opacity-90">
        {label}
      </p>
      <p className="mt-2 font-[family-name:var(--font-unbounded)] text-4xl font-semibold">
        {value}
      </p>
    </div>
  );
}
