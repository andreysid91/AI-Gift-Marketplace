"use client";

import { useState } from "react";
import {
  GIFT_ADDONS,
  GIFT_SCENE_ITEMS,
  formatRub,
} from "../../lib/scenario-catalog";

type GiftScenarioProps = {
  query: string;
};

export function GiftScenario({ query }: GiftScenarioProps) {
  const [cart, setCart] = useState<string[]>([]);

  function toggle(id: string) {
    setCart((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  return (
    <div>
      <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
        Сценарий · Подарок
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
        Вот что можно подарить
      </h2>
      <p className="mt-2 text-lg font-bold text-[var(--muted)]">
        По запросу: «{query || "Подарок"}» — один стиль на всех изделиях
      </p>

      <div className="relative mt-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#ffb4a2] via-[#ff8f6b] to-[#ff5a3c] p-6 shadow-[var(--shadow)] sm:p-10">
        <p className="relative font-[family-name:var(--font-unbounded)] text-xl font-semibold text-white sm:text-2xl">
          Подарочная сцена
        </p>
        <div className="relative mt-8 grid grid-cols-4 gap-3 sm:gap-4 md:grid-cols-8">
          {GIFT_SCENE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex aspect-square flex-col items-center justify-center rounded-[20px] bg-white/25"
            >
              <span className="text-3xl sm:text-4xl" aria-hidden>
                {item.emoji}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Изделия
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GIFT_SCENE_ITEMS.map((item) => {
            const added = cart.includes(item.id);
            return (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[var(--shadow-soft)]"
              >
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#ffb4a2] to-[#ff5a3c]">
                  <span className="text-5xl" aria-hidden>
                    {item.emoji}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h4 className="font-[family-name:var(--font-unbounded)] text-lg font-semibold">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-lg font-extrabold text-[var(--accent)]">
                    {formatRub(item.price)}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className={`mt-4 rounded-[18px] px-4 py-3 text-base font-extrabold text-white transition ${
                      added
                        ? "bg-[var(--mint)]"
                        : "bg-[var(--accent)] hover:bg-[var(--accent-hover)]"
                    }`}
                  >
                    {added ? "Добавлено ✓" : "Добавить"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-12 pb-8">
        <h3 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Дополнительно
        </h3>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {GIFT_ADDONS.map((item) => {
            const added = cart.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={`rounded-[22px] px-4 py-5 text-left shadow-[var(--shadow-soft)] transition ${
                  added
                    ? "bg-[var(--mint-soft)] ring-2 ring-[var(--mint)]"
                    : "bg-white hover:-translate-y-0.5"
                }`}
              >
                <span className="text-3xl" aria-hidden>
                  {item.emoji}
                </span>
                <span className="mt-3 block font-[family-name:var(--font-unbounded)] text-base font-semibold">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm font-extrabold text-[var(--accent)]">
                  {formatRub(item.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
