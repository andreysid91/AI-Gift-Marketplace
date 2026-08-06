"use client";

import { useState } from "react";
import {
  PHOTO_STYLES,
  PHOTO_STYLE_PRODUCTS,
} from "../../lib/scenario-catalog";

type PhotoScenarioProps = {
  query: string;
  hasPhoto: boolean;
};

export function PhotoScenario({ query, hasPhoto }: PhotoScenarioProps) {
  const [style, setStyle] = useState<string | null>(null);
  const [products, setProducts] = useState<string[]>([]);

  function toggleProduct(id: string) {
    setProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  return (
    <div>
      <p className="text-sm font-extrabold uppercase tracking-wide text-[#3b6fd8]">
        Сценарий · Фотопечать
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
        Выберите стиль
      </h2>
      <p className="mt-2 text-lg font-bold text-[var(--muted)]">
        {query ? `По запросу: «${query}»` : "Дизайн по вашей идее"}
        {hasPhoto ? " · фото учтено" : ""}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {PHOTO_STYLES.map((item) => {
          const active = style === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setStyle(item)}
              className={`min-h-[96px] rounded-[22px] px-4 py-5 text-left font-[family-name:var(--font-unbounded)] text-lg font-semibold shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 sm:text-xl ${
                active
                  ? "bg-[#3b6fd8] text-white shadow-[var(--shadow)]"
                  : "bg-white text-[var(--foreground)] hover:bg-[#e8f0ff]"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {style ? (
        <div className="animate-fade-rise mt-12 pb-8">
          <h3 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl">
            Где использовать стиль «{style}»
          </h3>
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            Один дизайн — сразу на разных изделиях
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PHOTO_STYLE_PRODUCTS.map((item) => {
              const active = products.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleProduct(item.id)}
                  className={`flex min-h-[140px] flex-col items-start justify-between rounded-[24px] bg-white px-4 py-5 text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-1 ${
                    active ? "ring-2 ring-[#3b6fd8] ring-offset-2" : ""
                  }`}
                >
                  <span className="text-4xl" aria-hidden>
                    {item.emoji}
                  </span>
                  <span className="mt-3 font-[family-name:var(--font-unbounded)] text-lg font-semibold">
                    {item.title}
                  </span>
                  <span className="mt-2 text-sm font-extrabold text-[#3b6fd8]">
                    {active ? "Выбрано ✓" : "Выбрать"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
