import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomeReviews } from "../../components/home/home-reviews";
import { TrustStories } from "../../components/trust/trust-stories";
import { brandTitle } from "../../lib/brand";
import { getTrustSnapshot } from "../../lib/trust";

export const metadata: Metadata = {
  title: brandTitle("Отзывы"),
  description: "Реакции клиентов на персональные подарки",
};

export default function ReviewsPage() {
  const trust = getTrustSnapshot();

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
          Отзывы
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-bold text-[var(--muted)]">
          Каждый отзыв — к подарку. Можно сразу оформить такой же.
        </p>

        <div className="mt-10">
          <HomeReviews hideTitle />
        </div>

        <div className="mt-14">
          <TrustStories stories={trust.stories} />
        </div>

        <section className="mt-14">
          <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Заказы с историей
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trust.latestOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={order.giftHref}
                  className="flex gap-4 rounded-[22px] bg-white p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[16px]">
                    <Image
                      src={order.photoUrl}
                      alt={order.giftTitle}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-[family-name:var(--font-unbounded)] text-base font-semibold">
                      {order.giftTitle}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                      {order.recipientRole} · {order.completedLabel}
                    </p>
                    <p className="mt-2 text-sm font-extrabold text-[var(--accent)]">
                      Открыть подарок →
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/create?scenario=gift"
            className="rounded-[22px] bg-[var(--accent)] px-6 py-4 font-extrabold text-white"
          >
            Создать подарок
          </Link>
          <Link
            href="/popular"
            className="rounded-[22px] border-2 border-[var(--line)] bg-white px-6 py-4 font-extrabold"
          >
            Смотреть популярное
          </Link>
        </div>
      </div>
    </main>
  );
}
