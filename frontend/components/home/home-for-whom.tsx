import Link from "next/link";
import {
  HUB_RECIPIENTS,
  HUB_RECIPIENTS_ALL_HREF,
} from "../../lib/gift-hub";

/** Popular recipients on home (Gift Hub cards → scenarios). */
export function HomeForWhom() {
  return (
    <section id="for-whom" aria-labelledby="for-whom-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="for-whom-title"
            className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl"
          >
            Популярные получатели
          </h2>
          <p className="mt-2 max-w-xl text-base font-bold text-[var(--muted)]">
            Кому подарок чаще всего — один клик до сценария
          </p>
        </div>
        <Link
          href={HUB_RECIPIENTS_ALL_HREF}
          className="text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          Смотреть все →
        </Link>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8">
        {HUB_RECIPIENTS.map((person, index) => (
          <li key={person.id} className="min-w-0">
            <Link
              href={person.href}
              className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
              style={{
                animation: `fade-rise 0.5s ease-out ${index * 35}ms both`,
              }}
            >
              <div
                className={`flex h-16 items-center justify-center bg-gradient-to-br ${person.tone} text-3xl transition group-hover:scale-[1.03] sm:h-20 sm:text-4xl`}
                aria-hidden
              >
                {person.emoji}
              </div>
              <p className="truncate px-2 py-2.5 text-center font-[family-name:var(--font-unbounded)] text-sm font-semibold sm:py-3 sm:text-base">
                {person.label}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <Link
          href={HUB_RECIPIENTS_ALL_HREF}
          className="flex items-center justify-center rounded-[22px] border-2 border-dashed border-[var(--line)] bg-white/80 px-4 py-4 text-base font-extrabold text-[var(--accent)] transition hover:border-[var(--accent)] hover:bg-white"
        >
          Смотреть все →
        </Link>
      </div>
    </section>
  );
}
