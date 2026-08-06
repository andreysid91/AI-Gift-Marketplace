"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  calculateConfigurationPrice,
  defaultSelections,
  type PricedConfiguration,
  type ProductSelections,
} from "../lib/product-configurator";
import {
  formatRub,
  resolveUniversalProductCard,
  type UniversalProductCardModel,
} from "../lib/universal-product-card";

export type UniversalProductCardProps = {
  /** Catalog / constructor / KB product id */
  productId: string;
  /** Or pass a pre-resolved model */
  model?: UniversalProductCardModel;
  /** Expand options by default */
  defaultOpenOptions?: boolean;
  onAdd?: (priced: PricedConfiguration) => void;
  onDetails?: (productId: string) => void;
  className?: string;
};

export function UniversalProductCard({
  productId,
  model: modelProp,
  defaultOpenOptions = false,
  onAdd,
  onDetails,
  className = "",
}: UniversalProductCardProps) {
  const model = useMemo(
    () => modelProp ?? resolveUniversalProductCard(productId),
    [modelProp, productId],
  );

  const [selections, setSelections] = useState<ProductSelections>(() =>
    model ? defaultSelections(model.schema) : {},
  );
  const [optionsOpen, setOptionsOpen] = useState(defaultOpenOptions);
  const [addedFlash, setAddedFlash] = useState(false);

  useEffect(() => {
    if (!model) return;
    setSelections(defaultSelections(model.schema));
  }, [model]);

  const priced = useMemo(() => {
    if (!model) return null;
    return calculateConfigurationPrice(model.schema, selections);
  }, [model, selections]);

  if (!model || !priced) {
    return (
      <div
        className={`rounded-[32px] bg-white p-6 text-base font-bold text-[var(--muted)] shadow-[var(--shadow-soft)] ${className}`}
      >
        Товар не найден
      </div>
    );
  }

  function update(paramId: string, next: string | number) {
    setSelections((prev) => ({ ...prev, [paramId]: next }));
  }

  function handleAdd() {
    if (!priced) return;
    onAdd?.(priced);
    setAddedFlash(true);
    window.setTimeout(() => setAddedFlash(false), 1400);
  }

  const schema = model.schema;

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-[32px] bg-white shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow)] ${className}`}
    >
      {/* Large image */}
      <div
        className={`relative flex min-h-[200px] items-center justify-center bg-gradient-to-br ${model.tone} sm:min-h-[240px]`}
      >
        <span
          className="text-8xl drop-shadow-sm transition duration-300 sm:text-9xl"
          aria-hidden
        >
          {model.emoji}
        </span>
        <span className="absolute left-4 top-4 rounded-[14px] bg-white/95 px-3 py-1.5 text-sm font-extrabold text-[var(--foreground)]">
          от {formatRub(model.priceFrom)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold leading-tight sm:text-3xl">
          {model.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-base font-bold leading-snug text-[var(--muted)]">
          {model.description}
        </p>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-[var(--muted)]">Цена</p>
            <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--accent)] sm:text-3xl">
              {formatRub(priced.lineTotal)}
            </p>
            {priced.qty > 1 ? (
              <p className="text-sm font-bold text-[var(--muted)]">
                {formatRub(priced.unitPrice)} × {priced.qty}
              </p>
            ) : null}
          </div>
          <div className="text-right">
            <p className="text-sm font-extrabold text-[var(--muted)]">Срок</p>
            <p className="text-base font-extrabold">{model.leadTimeLabel}</p>
          </div>
        </div>

        {priced.summary ? (
          <p className="mt-2 text-sm font-bold text-[var(--muted)]">
            {priced.summary}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => setOptionsOpen((v) => !v)}
          className="mt-4 self-start text-sm font-extrabold text-[var(--accent)] hover:underline"
        >
          {optionsOpen ? "Скрыть параметры" : "Параметры · размер, цвет…"}
        </button>

        {optionsOpen ? (
          <div className="mt-4 space-y-4 border-t border-[var(--line)] pt-4">
            {schema.params.map((param) => {
              if (param.kind === "quantity") {
                const qty = Number(
                  selections[param.id] ?? param.defaultQty ?? 1,
                );
                return (
                  <div key={param.id}>
                    <p className="text-sm font-extrabold">{param.label}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Меньше"
                        disabled={qty <= (param.min ?? 1)}
                        onClick={() => update(param.id, qty - 1)}
                        className="flex size-10 items-center justify-center rounded-[14px] border-2 border-[var(--line)] text-lg font-extrabold disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="min-w-[2.5rem] text-center text-lg font-extrabold">
                        {qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Больше"
                        disabled={qty >= (param.max ?? 99)}
                        onClick={() => update(param.id, qty + 1)}
                        className="flex size-10 items-center justify-center rounded-[14px] border-2 border-[var(--line)] text-lg font-extrabold disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              }

              const selected = String(
                selections[param.id] ?? param.defaultOptionId ?? "",
              );
              return (
                <div key={param.id}>
                  <p className="text-sm font-extrabold">{param.label}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(param.options ?? []).map((option) => {
                      const on = selected === option.id;
                      const delta = option.priceDelta ?? 0;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => update(param.id, option.id)}
                          className={`rounded-[14px] border-2 px-3 py-2 text-sm font-extrabold transition ${
                            on
                              ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                              : "border-[var(--line)] bg-[var(--surface-warm)] hover:border-[var(--accent)]"
                          }`}
                        >
                          {option.label}
                          {delta !== 0 ? (
                            <span className="ml-1 opacity-80">
                              {delta > 0 ? "+" : ""}
                              {formatRub(delta)}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
          {onDetails ? (
            <button
              type="button"
              onClick={() => onDetails(model.id)}
              className="flex-1 rounded-[20px] border-2 border-[var(--line)] px-4 py-3.5 text-base font-extrabold transition hover:border-[var(--accent)]"
            >
              Подробнее
            </button>
          ) : (
            <Link
              href={model.detailHref}
              className="flex flex-1 items-center justify-center rounded-[20px] border-2 border-[var(--line)] px-4 py-3.5 text-base font-extrabold transition hover:border-[var(--accent)]"
            >
              Подробнее
            </Link>
          )}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 rounded-[20px] bg-[var(--accent)] px-4 py-3.5 text-base font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
          >
            {addedFlash ? "Добавлено" : "Добавить"}
          </button>
        </div>
      </div>
    </article>
  );
}
