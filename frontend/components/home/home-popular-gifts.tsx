import Image from "next/image";
import Link from "next/link";
import {
  formatOrderCount,
  formatRating,
  getTrustSnapshot,
} from "../../lib/trust";

export function HomePopularGifts() {
  const { popularGifts } = getTrustSnapshot();

  return (
    <section id="popular-gifts">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
            Популярные подарки
          </h2>
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            Сколько человек заказали — и сразу к странице подарка
          </p>
        </div>
        <Link
          href="/popular"
          className="font-extrabold text-[var(--accent)] hover:underline"
        >
          Всё популярное →
        </Link>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {popularGifts.map((gift, index) => (
          <li key={gift.giftId}>
            <Link
              href={gift.href}
              className="group block overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)]"
              style={{
                animation: `fade-rise 0.55s ease-out ${index * 50}ms both`,
              }}
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <Image
                  src={gift.imageUrl}
                  alt={gift.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="px-5 py-4 sm:px-6 sm:py-5">
                <h3 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
                  {gift.title}
                </h3>
                <p className="mt-2 text-sm font-extrabold text-[var(--muted)]">
                  ★ {formatRating(gift.rating)} ·{" "}
                  {formatOrderCount(gift.orderCount)} заказов
                </p>
                <p className="mt-2 text-sm font-extrabold text-[var(--accent)]">
                  Смотреть →
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
