import type { Metadata } from "next";
import Link from "next/link";
import { HomePopularGifts } from "../../components/home/home-popular-gifts";
import { getTopByGiftScore } from "../../lib/gift-score";

export const metadata: Metadata = {
  title: "Популярное — Gift",
  description: "Самые популярные подарки и рейтинги",
};

export default function PopularPage() {
  const top = getTopByGiftScore(8);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <h1 className="font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
          Популярное
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-bold text-[var(--muted)]">
          Хиты и топ рейтинга — сразу к созданию похожего подарка
        </p>

        <div className="mt-10">
          <HomePopularGifts />
        </div>

        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl">
              Топ рейтинга
            </h2>
            <Link
              href="/ratings"
              className="font-extrabold text-[var(--accent)] hover:underline"
            >
              Все рейтинги →
            </Link>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {top.map((item) => (
              <li key={item.giftId}>
                <Link
                  href={item.href || `/gift?id=${encodeURIComponent(item.giftId)}`}
                  className="flex h-full flex-col rounded-[24px] bg-white p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
                >
                  <span className="text-4xl" aria-hidden>
                    {item.emoji}
                  </span>
                  <p className="mt-3 font-[family-name:var(--font-unbounded)] text-lg font-semibold">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                    ★ {item.stars} · {item.orders} заказов
                  </p>
                  <p className="mt-auto pt-4 text-sm font-extrabold text-[var(--accent)]">
                    Открыть подарок →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/create?scenario=gift"
            className="rounded-[22px] bg-[var(--accent)] px-6 py-4 font-extrabold text-white shadow-[var(--shadow)]"
          >
            Создать свой
          </Link>
          <Link
            href="/gifts"
            className="rounded-[22px] border-2 border-[var(--line)] bg-white px-6 py-4 font-extrabold"
          >
            Все подарки
          </Link>
        </div>
      </div>
    </main>
  );
}
