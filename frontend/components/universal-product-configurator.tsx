"use client";

import { useEffect, useMemo, useState } from "react";
import { formatRub } from "../lib/scenario-catalog";
import {
  calculateConfigurationPrice,
  defaultSelections,
  getProductSchema,
  type PricedConfiguration,
  type ProductSelections,
} from "../lib/product-configurator";

type UniversalProductConfiguratorProps = {
  productId: string;
  /** Controlled selections (optional) */
  value?: ProductSelections;
  onChange?: (
    selections: ProductSelections,
    priced: PricedConfiguration,
  ) => void;
  /** Compact card for constructor sidebar */
  compact?: boolean;
  className?: string;
};

export function UniversalProductConfigurator({
  productId,
  value,
  onChange,
  compact = false,
  className = "",
}: UniversalProductConfiguratorProps) {
  const schema = useMemo(() => getProductSchema(productId), [productId]);
  const [selections, setSelections] = useState<ProductSelections>(() => {
    if (!schema) return {};
    return value ?? defaultSelections(schema);
  });

  useEffect(() => {
    if (!schema) return;
    const next = value ?? defaultSelections(schema);
    setSelections(next);
  }, [productId, schema, value]);

  const priced = useMemo(() => {
    if (!schema) return null;
    return calculateConfigurationPrice(schema, selections);
  }, [schema, selections]);

  if (!schema || !priced) {
    return (
      <div
        className={`rounded-[22px] bg-[var(--surface-warm)] px-4 py-3 text-sm font-bold text-[var(--muted)] ${className}`}
      >
        Для этого товара нет расширенных параметров
      </div>
    );
  }

  function update(paramId: string, next: string | number) {
    setSelections((prev) => {
      const merged = { ...prev, [paramId]: next };
      if (schema && onChange) {
        const nextPriced = calculateConfigurationPrice(schema, merged);
        onChange(merged, nextPriced);
      }
      return merged;
    });
  }

  // Emit initial price once schema/value settles
  useEffect(() => {
    if (!schema || !onChange) return;
    const sel = value ?? defaultSelections(schema);
    onChange(sel, calculateConfigurationPrice(schema, sel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fieldClass =
    "mt-2 w-full rounded-[18px] border-2 border-[var(--line)] bg-white px-4 py-3 text-base font-bold outline-none focus:border-[var(--accent)]";

  return (
    <div
      className={`rounded-[28px] bg-white shadow-[var(--shadow-soft)] ${
        compact ? "p-4" : "p-5 sm:p-6"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Конфигуратор
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-unbounded)] text-xl font-semibold sm:text-2xl">
            <span aria-hidden>{schema.emoji} </span>
            {schema.title}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-xs font-extrabold text-[var(--muted)]">Итого</p>
          <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--accent)]">
            {formatRub(priced.lineTotal)}
          </p>
          {priced.qty > 1 ? (
            <p className="text-xs font-bold text-[var(--muted)]">
              {formatRub(priced.unitPrice)} × {priced.qty}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-2 text-sm font-bold text-[var(--muted)]">
        {priced.summary}
      </p>

      <div className={`mt-5 space-y-4 ${compact ? "" : "sm:space-y-5"}`}>
        {schema.params.map((param) => {
          if (param.kind === "quantity") {
            const qty = Number(selections[param.id] ?? param.defaultQty ?? 1);
            return (
              <div key={param.id}>
                <label
                  htmlFor={`${productId}-${param.id}`}
                  className="text-sm font-extrabold"
                >
                  {param.label}
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Меньше"
                    disabled={qty <= (param.min ?? 1)}
                    onClick={() => update(param.id, qty - 1)}
                    className="flex size-11 items-center justify-center rounded-[16px] border-2 border-[var(--line)] text-xl font-extrabold transition hover:border-[var(--accent)] disabled:opacity-40"
                  >
                    −
                  </button>
                  <input
                    id={`${productId}-${param.id}`}
                    type="number"
                    min={param.min ?? 1}
                    max={param.max ?? 99}
                    value={qty}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      update(param.id, Number.isFinite(n) ? n : 1);
                    }}
                    className={`${fieldClass} mt-0 max-w-[100px] text-center`}
                  />
                  <button
                    type="button"
                    aria-label="Больше"
                    disabled={qty >= (param.max ?? 99)}
                    onClick={() => update(param.id, qty + 1)}
                    className="flex size-11 items-center justify-center rounded-[16px] border-2 border-[var(--line)] text-xl font-extrabold transition hover:border-[var(--accent)] disabled:opacity-40"
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
                      className={`rounded-[16px] border-2 px-3 py-2.5 text-left text-sm font-extrabold transition ${
                        on
                          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                          : "border-[var(--line)] bg-[var(--surface-warm)] hover:border-[var(--accent)]"
                      }`}
                    >
                      <span className="block">{option.label}</span>
                      {delta !== 0 ? (
                        <span
                          className={`mt-0.5 block text-[10px] ${
                            on ? "text-[var(--accent)]" : "text-[var(--muted)]"
                          }`}
                        >
                          {delta > 0 ? "+" : ""}
                          {formatRub(delta)}
                        </span>
                      ) : (
                        <span className="mt-0.5 block text-[10px] text-[var(--muted)]">
                          в базе
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!compact ? (
        <dl className="mt-6 space-y-2 border-t border-[var(--line)] pt-4 text-sm font-bold">
          {priced.breakdown.map((row, i) => (
            <div key={`${row.label}-${i}`} className="flex justify-between gap-3">
              <dt className="text-[var(--muted)]">{row.label}</dt>
              <dd
                className={
                  row.amount < 0
                    ? "text-[var(--mint)]"
                    : row.amount > 0 && i > 0
                      ? "text-[var(--accent)]"
                      : ""
                }
              >
                {row.amount > 0 && i > 0 ? "+" : ""}
                {formatRub(row.amount)}
              </dd>
            </div>
          ))}
          <div className="flex justify-between gap-3 border-t border-[var(--line)] pt-2 text-base font-extrabold">
            <dt>К оплате за позицию</dt>
            <dd className="text-[var(--accent)]">
              {formatRub(priced.lineTotal)}
            </dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
