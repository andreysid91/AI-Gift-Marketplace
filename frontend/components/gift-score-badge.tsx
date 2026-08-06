import {
  starsRow,
  type GiftScoreMetrics,
} from "../lib/gift-score";

type GiftScoreBadgeProps = {
  metrics: GiftScoreMetrics;
  compact?: boolean;
  className?: string;
};

export function GiftScoreBadge({
  metrics,
  compact = false,
  className = "",
}: GiftScoreBadgeProps) {
  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <span
          className="text-lg tracking-wide text-[var(--secondary)]"
          aria-label={`${metrics.stars} из 5`}
        >
          {starsRow(metrics.stars)}
        </span>
        <span className="rounded-[12px] bg-[var(--accent-soft)] px-2.5 py-1 text-sm font-extrabold text-[var(--accent)]">
          Score {metrics.score}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[24px] bg-white p-5 shadow-[var(--shadow-soft)] ${className}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Gift Score
          </p>
          <p
            className="mt-1 text-2xl tracking-wide text-[var(--secondary)] sm:text-3xl"
            aria-label={`${metrics.stars} из 5`}
          >
            {starsRow(metrics.stars)}
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            {metrics.stars.toFixed(1)} · индекс {metrics.score}/100
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Заказы" value={metrics.orders} />
        <Stat label="Лайки" value={metrics.likes} />
        <Stat label="Сохранения" value={metrics.saves} />
        <Stat label="Отзывы" value={metrics.reviews} />
        <Stat label="Повторные" value={metrics.repeats} />
      </dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[16px] bg-[var(--surface-warm)] px-3 py-3">
      <dt className="text-xs font-extrabold text-[var(--muted)]">{label}</dt>
      <dd className="mt-1 font-[family-name:var(--font-unbounded)] text-xl font-semibold">
        {value.toLocaleString("ru-RU")}
      </dd>
    </div>
  );
}
