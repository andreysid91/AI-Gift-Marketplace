"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UniversalProductCard } from "./universal-product-card";
import {
  listConfigurableProductIds,
  type PricedConfiguration,
} from "../lib/product-configurator";
import { loadDesignPick, type DesignPickPayload } from "../lib/design-studio";
import { formatRub } from "../lib/scenario-catalog";
import { saveGiftOrder } from "../lib/gift-order";

type ConfigureDemoProps = {
  initialProductId?: string;
};

const PRODUCT_LABELS: Record<string, string> = {
  tee: "Футболка",
  mug: "Кружка",
  canvas: "Холст",
  puzzle: "Пазл",
  magnet: "Магнит",
  candle: "Свеча",
  box: "Коробка",
};

const DEMO_IDS = [
  ...listConfigurableProductIds(),
  "magnet",
  "candle",
  "box",
];

export function ConfigureDemo({ initialProductId = "tee" }: ConfigureDemoProps) {
  const router = useRouter();
  const [design, setDesign] = useState<DesignPickPayload | null>(null);
  const [cart, setCart] = useState<PricedConfiguration[]>([]);
  const [focusId, setFocusId] = useState(initialProductId);

  useEffect(() => {
    setDesign(loadDesignPick());
  }, []);

  const total = cart.reduce((sum, line) => sum + line.lineTotal, 0);
  const ids = [...new Set(DEMO_IDS)];

  function checkout() {
    if (cart.length === 0) return;
    saveGiftOrder({
      query: cart.map((c) => c.title).join(" + "),
      items: cart.map((line) => ({
        id: line.productId,
        title: line.title,
        price: line.lineTotal,
        emoji: line.emoji,
        kind: "product" as const,
        qty: line.qty,
        unitPrice: line.unitPrice,
        configSummary: line.summary,
        selections: line.selections,
      })),
      total,
      createdAt: new Date().toISOString(),
    });
    const params = new URLSearchParams({
      from: "gift",
      id: cart[0].productId,
      q: cart[0].title,
    });
    router.push(`/checkout?${params.toString()}`);
  }

  return (
    <div className="space-y-8">
      {design ? (
        <div
          className={`flex items-center gap-4 overflow-hidden rounded-[24px] bg-gradient-to-br ${design.variant.gradient} p-4 text-white`}
        >
          <span className="text-4xl" aria-hidden>
            {design.variant.emoji}
          </span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-white/80">
              Дизайн из студии
            </p>
            <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold">
              {design.variant.title}
            </p>
          </div>
        </div>
      ) : null}

      <div>
        <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Параметры изделия
        </h2>
        <p className="mt-1 text-base font-bold text-[var(--muted)]">
          Выберите товар · цена сразу
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ids.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setFocusId(id)}
            className={`rounded-[16px] border-2 px-3 py-2 text-sm font-extrabold ${
              focusId === id
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--line)] bg-white"
            }`}
          >
            {PRODUCT_LABELS[id] ?? id}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-md">
        <UniversalProductCard
          key={focusId}
          productId={focusId}
          defaultOpenOptions
          onAdd={(priced) => setCart((prev) => [...prev, priced])}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {ids
          .filter((id) => id !== focusId)
          .slice(0, 4)
          .map((id) => (
            <UniversalProductCard
              key={id}
              productId={id}
              onAdd={(priced) => setCart((prev) => [...prev, priced])}
            />
          ))}
      </div>

      {cart.length > 0 ? (
        <div className="rounded-[24px] bg-[var(--foreground)] px-6 py-5 text-white">
          <p className="text-sm font-extrabold uppercase tracking-wide text-white/70">
            В заказе · {cart.length}
          </p>
          <ul className="mt-3 space-y-1 text-sm font-bold text-white/90">
            {cart.map((line, i) => (
              <li key={`${line.productId}-${i}`}>
                {line.emoji} {line.title} — {formatRub(line.lineTotal)}
                {line.summary ? ` · ${line.summary}` : ""}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
            {formatRub(total)}
          </p>
          <button
            type="button"
            onClick={checkout}
            className="mt-5 w-full rounded-[20px] bg-[var(--accent)] px-6 py-4 text-lg font-extrabold text-white"
          >
            Оформить заказ
          </button>
        </div>
      ) : null}
    </div>
  );
}
