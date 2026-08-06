const REASONS = [
  "Подбор за 1 минуту",
  "Индивидуальный дизайн",
  "Доставка",
  "Любой тираж",
  "Проверенные партнеры",
] as const;

export function HomeWhy() {
  return (
    <section>
      <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
        Почему выбирают нас
      </h2>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {REASONS.map((reason) => (
          <li
            key={reason}
            className="flex min-h-[120px] items-center gap-3 rounded-[24px] bg-white px-5 py-5 shadow-[var(--shadow-soft)] sm:min-h-[140px] sm:flex-col sm:items-start sm:justify-center sm:gap-4 sm:px-6"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--mint-soft)] text-xl font-extrabold text-[var(--mint)]"
              aria-hidden
            >
              ✔
            </span>
            <span className="font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-snug sm:text-xl">
              {reason}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
