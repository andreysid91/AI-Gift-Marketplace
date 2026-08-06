import Link from "next/link";
import { starsRow, type GiftRanking } from "../lib/gift-score";

type GiftRankingsViewProps = {
  rankings: GiftRanking[];
};

export function GiftRankingsView({ rankings }: GiftRankingsViewProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_50%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← Gift
        </Link>

        <h1 className="mt-6 font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
          Рейтинг подарков
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-bold text-[var(--muted)]">
          Единый рейтинг: звёзды, заказы, лайки, сохранения, отзывы и повторные
          покупки.
        </p>

        <nav className="mt-8 flex flex-wrap gap-2">
          {rankings.map((ranking) => (
            <a
              key={ranking.id}
              href={`#${ranking.id}`}
              className="rounded-[16px] border-2 border-[var(--line)] bg-white px-4 py-2 text-sm font-extrabold transition hover:border-[var(--accent)]"
            >
              {ranking.title}
            </a>
          ))}
        </nav>

        <div className="mt-12 space-y-16">
          {rankings.map((ranking) => (
            <section key={ranking.id} id={ranking.id}>
              <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
                {ranking.title}
              </h2>
              <p className="mt-2 text-base font-bold text-[var(--muted)]">
                {ranking.description}
              </p>

              <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                {ranking.items.map((item, index) => (
                  <li key={`${ranking.id}-${item.giftId}`}>
                    <Link
                      href={item.href}
                      className="flex h-full gap-4 overflow-hidden rounded-[28px] bg-white p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)] sm:p-5"
                    >
                      <div
                        className={`flex size-20 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br ${item.tone} text-4xl sm:size-24`}
                      >
                        {item.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-snug sm:text-xl">
                            <span className="text-[var(--muted)]">
                              {index + 1}.{" "}
                            </span>
                            {item.title}
                          </p>
                          <span className="shrink-0 rounded-[12px] bg-[var(--accent-soft)] px-2 py-1 text-xs font-extrabold text-[var(--accent)]">
                            {item.score}
                          </span>
                        </div>
                        <p className="mt-1 text-base text-[var(--secondary)]">
                          {starsRow(item.stars)}
                        </p>
                        <p className="mt-2 text-xs font-bold text-[var(--muted)] sm:text-sm">
                          {item.orders.toLocaleString("ru-RU")} заказов ·{" "}
                          {item.likes.toLocaleString("ru-RU")} лайков ·{" "}
                          {item.saves.toLocaleString("ru-RU")} сохранений ·{" "}
                          {item.reviews} отзывов · {item.repeats} повторных
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <section className="mt-16 rounded-[32px] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
          <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Как считается рейтинг
          </h2>
          <p className="mt-3 text-base font-bold text-[var(--muted)]">
            Звёзды 35% · заказы 25% · лайки 15% · сохранения 10% · отзывы 10% ·
            повторные 5%. Только счётчики и оценки.
          </p>
        </section>
      </div>
    </main>
  );
}
