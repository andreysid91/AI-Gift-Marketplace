"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FILTER_OPTIONS,
  MOCK_IDEAS,
  formatPrice,
  type GiftIdea,
} from "../lib/mock-ideas";
import { trackFilter, trackProductOpen } from "../lib/learning";

type IdeasViewProps = {
  query: string;
  hasPhoto: boolean;
};

type Filters = {
  recipient: string;
  occasion: string;
  budget: string;
  technology: string;
  style: string;
};

const EMPTY_FILTERS: Filters = {
  recipient: "",
  occasion: "",
  budget: "",
  technology: "",
  style: "",
};

function matchesFilters(idea: GiftIdea, filters: Filters) {
  return (
    (!filters.recipient || idea.recipient === filters.recipient) &&
    (!filters.occasion || idea.occasion === filters.occasion) &&
    (!filters.budget || idea.budget === filters.budget) &&
    (!filters.technology || idea.technology === filters.technology) &&
    (!filters.style || idea.style === filters.style)
  );
}

export function IdeasView({ query, hasPhoto }: IdeasViewProps) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [ideas, setIdeas] = useState(MOCK_IDEAS);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const visibleIdeas = useMemo(() => {
    const filtered = ideas.filter((idea) => matchesFilters(idea, filters));
    if (shuffleSeed === 0) return filtered;
    return [...filtered].sort((a, b) => {
      const score = (id: string) =>
        (id.charCodeAt(id.length - 1) + shuffleSeed) % 7;
      return score(a.id) - score(b.id);
    });
  }, [ideas, filters, shuffleSeed]);

  function updateFilter(key: keyof Filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (value) trackFilter(key, value);
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
  }

  function regenerate() {
    setShuffleSeed((prev) => prev + 1);
    setIdeas([...MOCK_IDEAS].reverse());
  }

  const displayQuery = query.trim() || "Подарок на любой случай";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_8%,#ffe0c8_0%,transparent_42%),radial-gradient(ellipse_at_88%_0%,#ffd0c4_0%,transparent_38%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_50%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        {/* Query bar */}
        <div className="flex flex-col gap-4 rounded-[28px] bg-white/80 p-5 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
              Ваш запрос
            </p>
            <p className="mt-1 font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
              {displayQuery}
            </p>
            {hasPhoto ? (
              <p className="mt-2 text-base font-bold text-[var(--mint)]">
                Фотография учтена в подборе
              </p>
            ) : null}
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-[22px] border-2 border-[var(--line)] bg-white px-5 py-3 text-base font-extrabold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
          >
            ✏ Изменить запрос
          </Link>
        </div>

        {/* Title */}
        <div className="mt-10 max-w-3xl">
          <h1 className="font-[family-name:var(--font-unbounded)] text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
            🎁 Мы подобрали подарки для вас
          </h1>
          <p className="mt-4 text-lg font-bold text-[var(--muted)] sm:text-xl">
            Выберите понравившийся вариант или попросите AI создать новые.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
          {/* Filters */}
          <aside className="h-fit rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] lg:sticky lg:top-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
                Фильтры
              </h2>
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-extrabold text-[var(--accent)] hover:underline"
              >
                Сбросить
              </button>
            </div>

            <FilterGroup
              label="Получатель"
              value={filters.recipient}
              options={FILTER_OPTIONS.recipient}
              onChange={(value) => updateFilter("recipient", value)}
            />
            <FilterGroup
              label="Повод"
              value={filters.occasion}
              options={FILTER_OPTIONS.occasion}
              onChange={(value) => updateFilter("occasion", value)}
            />
            <FilterGroup
              label="Бюджет"
              value={filters.budget}
              options={FILTER_OPTIONS.budget}
              onChange={(value) => updateFilter("budget", value)}
            />
            <FilterGroup
              label="Технология"
              value={filters.technology}
              options={FILTER_OPTIONS.technology}
              onChange={(value) => updateFilter("technology", value)}
            />
            <FilterGroup
              label="Стиль AI"
              value={filters.style}
              options={FILTER_OPTIONS.style}
              onChange={(value) => updateFilter("style", value)}
            />
          </aside>

          {/* Cards */}
          <section>
            {visibleIdeas.length === 0 ? (
              <div className="rounded-[32px] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
                <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
                  Ничего не нашлось
                </p>
                <p className="mt-3 text-lg font-bold text-[var(--muted)]">
                  Сбросьте фильтры или сгенерируйте новые варианты.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 rounded-[22px] bg-[var(--accent)] px-6 py-3 text-base font-extrabold text-white"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleIdeas.map((idea) => (
                  <IdeaCard key={`${idea.id}-${shuffleSeed}`} idea={idea} />
                ))}
              </div>
            )}

            <div className="mt-10 flex justify-center pb-8">
              <button
                type="button"
                onClick={regenerate}
                className="rounded-[28px] bg-[var(--secondary)] px-8 py-5 text-lg font-extrabold text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:brightness-105"
              >
                🔄 Сгенерировать еще варианты
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function FilterGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-6">
      <label className="block text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[18px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-3 text-base font-bold text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
      >
        <option value="">Все</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function IdeaCard({ idea }: { idea: GiftIdea }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[32px] bg-white shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)]">
      <div
        className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${idea.gradient}`}
      >
        <span className="text-6xl drop-shadow-sm">{idea.emoji}</span>
        <span className="absolute left-4 top-4 rounded-2xl bg-white/90 px-3 py-1.5 text-sm font-extrabold text-[var(--foreground)]">
          {idea.style}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 py-5">
        <h3 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold leading-snug text-[var(--foreground)]">
          {idea.title}
        </h3>
        <p className="mt-2 flex-1 text-base font-bold leading-snug text-[var(--muted)]">
          {idea.description}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-extrabold text-[var(--accent)]">
              {formatPrice(idea.price)}
            </p>
            <p className="mt-1 text-sm font-bold text-[var(--muted)]">
              ≈ {idea.leadTime}
            </p>
          </div>
        </div>

        <Link
          href={`/product?id=${idea.id}`}
          onClick={() => trackProductOpen(idea.id)}
          className="mt-5 inline-flex items-center justify-center rounded-[22px] bg-[var(--accent)] px-5 py-3.5 text-base font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
        >
          Подробнее
        </Link>
      </div>
    </article>
  );
}
