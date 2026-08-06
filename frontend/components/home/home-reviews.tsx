import Image from "next/image";
import Link from "next/link";
import { getTrustSnapshot, starsLabel } from "../../lib/trust";
import { OrderSameButton } from "../order-same-button";

type HomeReviewsProps = {
  hideTitle?: boolean;
};

export function HomeReviews({ hideTitle = false }: HomeReviewsProps) {
  const { reviews } = getTrustSnapshot();

  return (
    <section id="reviews">
      {!hideTitle ? (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
              Отзывы
            </h2>
            <p className="mt-2 text-base font-bold text-[var(--muted)]">
              Откройте подарок или сразу оформите такой же
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
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${hideTitle ? "" : "mt-6"}`}
      >
        {reviews.map((review, index) => (
          <li key={review.id} className="min-w-0">
            <article
              className="flex h-full flex-col overflow-hidden rounded-[26px] bg-white shadow-[var(--shadow-soft)]"
              style={{
                animation: `fade-rise 0.55s ease-out ${index * 50}ms both`,
              }}
            >
              <Link
                href={`${review.giftHref}${review.giftHref.includes("?") ? "&" : "?"}from=reviews`}
                className="relative aspect-[4/3] overflow-hidden"
              >
                <Image
                  src={review.photoUrl}
                  alt={review.giftTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <span className="absolute bottom-3 left-3 rounded-[12px] bg-white/95 px-2.5 py-1 text-xs font-extrabold">
                  {review.emotion}
                </span>
              </Link>
              <div className="flex flex-1 flex-col px-4 py-4">
                <p className="text-sm font-extrabold text-[var(--accent)]">
                  {starsLabel(review.rating)}
                </p>
                <p className="mt-1 font-[family-name:var(--font-unbounded)] text-lg font-semibold">
                  {review.author}
                </p>
                <p className="mt-2 flex-1 text-sm font-bold leading-snug">
                  «{review.text}»
                </p>
                <p className="mt-3 truncate text-sm font-bold text-[var(--muted)]">
                  {review.giftTitle}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={review.giftHref}
                    className="rounded-[14px] border-2 border-[var(--line)] px-3 py-2 text-xs font-extrabold"
                  >
                    К подарку
                  </Link>
                  <OrderSameButton
                    giftId={review.giftId}
                    query={review.giftTitle}
                    className="rounded-[14px] bg-[var(--accent)] px-3 py-2 text-xs font-extrabold text-white"
                  />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
