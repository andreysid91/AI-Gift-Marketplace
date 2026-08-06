"use client";

import { useEffect, useState } from "react";
import {
  LEARNING_CHANGE_EVENT,
  ensureLearningSeeded,
  getLearningInsights,
  getLearningSignals,
  resetLearningToMock,
  type CountRow,
  type LearningInsights,
  type LearningSignals,
} from "../lib/learning";

function RankList({
  title,
  hint,
  rows,
  empty = "Пока нет данных",
}: {
  title: string;
  hint: string;
  rows: CountRow[];
  empty?: string;
}) {
  return (
    <div className="rounded-[24px] border-2 border-[var(--line)] bg-white p-5">
      <h3 className="font-[family-name:var(--font-unbounded)] text-lg font-semibold">
        {title}
      </h3>
      <p className="mt-1 text-sm font-bold text-[var(--muted)]">{hint}</p>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm font-bold text-[var(--muted)]">{empty}</p>
      ) : (
        <ol className="mt-4 space-y-2">
          {rows.map((row, index) => (
            <li
              key={row.key}
              className="flex items-baseline justify-between gap-3 text-sm font-bold"
            >
              <span className="min-w-0">
                <span className="mr-2 text-[var(--muted)]">{index + 1}.</span>
                {row.label}
              </span>
              <span className="shrink-0 tabular-nums text-[var(--accent)]">
                {row.count}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function LearningInsightsPanel() {
  const [insights, setInsights] = useState<LearningInsights | null>(null);
  const [signals, setSignals] = useState<LearningSignals | null>(null);

  function refresh() {
    ensureLearningSeeded();
    setInsights(getLearningInsights());
    setSignals(getLearningSignals());
  }

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(LEARNING_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(LEARNING_CHANGE_EVENT, onChange);
  }, []);

  if (!insights) {
    return <p className="font-bold text-[var(--muted)]">Загрузка аналитики…</p>;
  }

  const boostPreview = Object.entries(signals?.productBoost ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-6 shadow-[var(--shadow)]">
        <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
          Learning Engine · без AI
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Продуктовая аналитика
        </h2>
        <p className="mt-2 max-w-2xl text-base font-bold text-[var(--muted)]">
          События с сайта и mock-seed. В будущем рекомендации будут усиливаться
          этими счётчиками — пока только сбор и просмотр.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-[14px] bg-[var(--accent-soft)] px-3 py-2 text-sm font-extrabold text-[var(--accent)]">
            Событий: {insights.eventCount}
          </span>
          <button
            type="button"
            onClick={() => {
              resetLearningToMock();
              refresh();
            }}
            className="rounded-[14px] border-2 border-[var(--line)] px-3 py-2 text-sm font-extrabold transition hover:border-[var(--accent)]"
          >
            Сбросить к mock
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RankList
          title="Что ищут"
          hint="Частые поисковые запросы"
          rows={insights.topSearches}
        />
        <RankList
          title="Что покупают"
          hint="Товары в оформленных наборах"
          rows={insights.topPurchases}
        />
        <RankList
          title="Берут вместе"
          hint="Пары из bundle / purchase"
          rows={insights.topBundles.map((row) => ({
            key: row.key,
            label: row.label,
            count: row.count,
          }))}
        />
        <RankList
          title="Сценарии"
          hint="gift / photo / business / custom"
          rows={insights.topScenarios}
        />
        <RankList
          title="Фильтры"
          hint="dimension · value"
          rows={insights.topFilters}
        />
        <RankList
          title="Повторные покупки"
          hint="Товар куплен ≥ 2 раз"
          rows={insights.repeatPurchases}
        />
        <RankList
          title="Почти не открывают"
          hint="Мало product_open в каталоге"
          rows={insights.coldProducts}
          empty="Все позиции открывают"
        />
      </div>

      <div className="rounded-[24px] border-2 border-dashed border-[var(--line)] bg-[var(--surface-warm)] p-5">
        <h3 className="font-[family-name:var(--font-unbounded)] text-lg font-semibold">
          Сигналы для рекомендаций (позже)
        </h3>
        <p className="mt-1 text-sm font-bold text-[var(--muted)]">
          <code className="font-extrabold">getLearningSignals()</code> — boost /
          affinity / cold penalty. Knowledge Engine пока не читает.
        </p>
        {boostPreview.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm font-bold">
            {boostPreview.map(([id, score]) => (
              <li key={id}>
                {id}: +{score.toFixed(1)}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
