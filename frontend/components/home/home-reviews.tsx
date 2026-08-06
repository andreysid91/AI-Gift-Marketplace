import Link from "next/link";
import { getShowcaseReviews } from "../../lib/showcase-orders";

type HomeReviewsProps = {
  hideTitle?: boolean;
};

export function HomeReviews({ hideTitle = false }: HomeReviewsProps) {
  const reviews = getShowcaseReviews();

  return (
    <section id="reviews">
      {!hideTitle ? (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
              Популярные отзывы
            </h2>
            <p className="mt-2 text-base font-bold text-[var(--muted)]">
              Нажмите — откроется страница этого подарка
            </p>
          </div>
          <Link
            href="/reviews"
            className="font-extrabold text-[var(--accent)] hover:underline"
          >
            Все отзывы →
          </Link>
        </div>
      ) : null}

      <ul
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 ${hideTitle ? "" : "mt-6"}`}
      >
        {reviews.map((review, index) => (
          <li key={review.id} className="min-w-0">
            <Link
              href={review.giftHref}
              className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
              style={{
                animation: `fade-rise 0.55s ease-out ${index * 60}ms both`,
              }}
            >
              <div
                className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${review.tone} sm:h-44`}
              >
                <span className="text-6xl drop-shadow-sm sm:text-7xl" aria-hidden>
                  {review.emoji}
                </span>
                <span className="absolute bottom-3 left-3 rounded-[14px] bg-white/95 px-2.5 py-1.5 text-xs font-extrabold sm:text-sm">
                  {review.emotion}
                </span>
              </div>
              <div className="flex flex-1 flex-col px-4 py-4">
                <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold">
                  {review.author}
                </p>
                <p className="mt-2 flex-1 text-sm font-bold leading-snug text-[var(--foreground)]">
                  «{review.text}»
                </p>
                <p className="mt-3 text-sm font-bold text-[var(--muted)]">
                  {review.giftTitle}
                </p>
                <p className="mt-2 text-sm font-extrabold text-[var(--accent)]">
                  К подарку →
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
