import Link from "next/link";
import {
  READY_GIFT_SETS,
  calcSetTotal,
  formatRub,
} from "../lib/scenario-catalog";

export function ReadySetsCards() {
  return (
    <section>
      <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
        Готовые подарочные наборы
      </h2>
      <p className="mt-2 text-lg font-bold text-[var(--muted)]">
        Всё уже подобрано — можно сразу купить или изменить состав
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {READY_GIFT_SETS.map((set) => {
          const total = calcSetTotal(set.itemIds);
          const href = `/ideas?q=${encodeURIComponent(set.query)}&set=${set.id}`;

          return (
            <Link
              key={set.id}
              href={href}
              className={`group flex min-h-[180px] flex-col justify-between rounded-[28px] px-5 py-6 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)] ${set.tone}`}
            >
              <div>
                <span className="text-4xl" aria-hidden>
                  {set.emoji}
                </span>
                <h3 className="mt-4 font-[family-name:var(--font-unbounded)] text-2xl font-semibold leading-tight">
                  {set.title}
                </h3>
                <p className="mt-2 text-sm font-extrabold opacity-80">
                  {set.subtitle}
                </p>
              </div>
              <div className="mt-5 flex items-end justify-between gap-2">
                <span className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
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
    </section>
  );
}
