import Link from "next/link";
import {
  formatOrderCount,
  formatRating,
  formatRepeatPercent,
  type TrustMetrics,
} from "../../lib/trust";

type TrustMetricsBarProps = {
  metrics: TrustMetrics;
};

export function TrustMetricsBar({ metrics }: TrustMetricsBarProps) {
  const items = [
    {
      value: formatOrderCount(metrics.totalOrders),
      label: "человек уже заказали",
    },
    {
      value: formatRating(metrics.averageRating),
      label: `рейтинг · ${formatOrderCount(metrics.reviewCount)} отзывов`,
    },
    {
      value: String(metrics.ordersToday),
      label: "вручений сегодня",
    },
    {
      value: formatRepeatPercent(metrics.repeatRate),
      label: "возвращаются снова",
    },
  ];

  return (
    <section
      id="trust-metrics"
      aria-label="Доверие сервиса"
      className="rounded-[28px] bg-white px-4 py-5 shadow-[var(--shadow-soft)] sm:rounded-[32px] sm:px-8 sm:py-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--accent)]">
            Нам доверяют
          </p>
          <p className="mt-1 text-base font-bold text-[var(--muted)]">
            {metrics.citiesLabel}
          </p>
        </div>
        <Link
          href="/reviews"
          className="text-sm font-extrabold text-[var(--accent)] hover:underline"
        >
          Все отзывы →
        </Link>
      </div>
      <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.label}
            className="rounded-[20px] bg-[var(--surface-warm)] px-4 py-4"
          >
            <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--accent)] sm:text-3xl">
              {item.value}
            </p>
            <p className="mt-1 text-sm font-extrabold leading-snug text-[var(--muted)]">
              {item.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
