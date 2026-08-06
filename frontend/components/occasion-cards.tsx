"use client";

import Link from "next/link";
import { useState } from "react";
import {
  OCCASIONS,
  calcSetTotal,
  formatRub,
  getPopularSetsForOccasion,
  type OccasionId,
} from "../lib/occasions";

export function OccasionCards() {
  const [selectedId, setSelectedId] = useState<OccasionId | null>(null);
  const selected = OCCASIONS.find((item) => item.id === selectedId);
  const popularSets = getPopularSetsForOccasion(selectedId ?? undefined);

  return (
    <section>
      <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
        Когда нужен подарок?
      </h2>
      <p className="mt-2 text-lg font-bold text-[var(--muted)]">
        Выберите повод — покажем самые популярные наборы
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {OCCASIONS.map((item) => {
          const isActive = selectedId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setSelectedId((prev) => (prev === item.id ? null : item.id))
              }
              aria-pressed={isActive}
              className={`flex min-h-[140px] flex-col justify-between rounded-[24px] px-4 py-5 text-left shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)] sm:min-h-[160px] sm:px-5 sm:py-6 ${item.tone} ${
                isActive
                  ? "ring-4 ring-[var(--foreground)]/15 ring-offset-2 ring-offset-transparent"
                  : ""
              }`}
            >
              <span className="text-4xl sm:text-5xl" aria-hidden>
                {item.icon}
              </span>
              <span className="mt-4 font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-tight sm:text-xl">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {selected && popularSets.length > 0 ? (
        <div
          key={selected.id}
          className="mt-8 animate-fade-rise rounded-[32px] bg-white/70 p-5 shadow-[var(--shadow-soft)] sm:p-7"
        >
          <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Популярные наборы
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl">
            {selected.icon} {selected.title}
          </h3>
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            Всё подобрано под этот повод — можно сразу купить или изменить
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularSets.map((set, index) => {
              const total = calcSetTotal(set.itemIds);
              const href = `/ideas?q=${encodeURIComponent(set.query)}&set=${set.id}`;

              return (
                <Link
                  key={set.id}
                  href={href}
                  className={`group flex min-h-[170px] flex-col justify-between rounded-[24px] px-5 py-5 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)] ${set.tone}`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div>
                    <span className="text-3xl" aria-hidden>
                      {set.emoji}
                    </span>
                    <h4 className="mt-3 font-[family-name:var(--font-unbounded)] text-xl font-semibold leading-tight">
                      {set.title}
                    </h4>
                    <p className="mt-2 text-sm font-extrabold opacity-80">
                      {set.subtitle}
                    </p>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-2">
                    <span className="font-[family-name:var(--font-unbounded)] text-lg font-semibold">
                      {formatRub(total)}
                    </span>
                    <span className="text-sm font-extrabold opacity-0 transition group-hover:opacity-100">
                      Открыть →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
