"use client";

import { useEffect, useState } from "react";
import {
  getPublicReviews,
  starsLabel,
  type GiftReview,
} from "../lib/reviews";

export function HappyCustomers() {
  const [reviews, setReviews] = useState<GiftReview[]>([]);

  useEffect(() => {
    function sync() {
      setReviews(getPublicReviews());
    }
    sync();
    window.addEventListener("ai-gift-reviews-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ai-gift-reviews-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
        Наши счастливые клиенты
      </h2>
      <p className="mt-2 max-w-xl text-lg font-bold text-[var(--muted)]">
        Отзывы тех, кто разрешил показать их на сайте
      </p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <li
            key={review.id}
            className="animate-[fade-rise_0.55s_ease-out_both] overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]"
            style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
          >
            {review.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={review.photoDataUrl}
                alt={`Подарок — ${review.giftTitle}`}
                className="h-44 w-full object-cover"
              />
            ) : (
              <div
                className="flex h-44 items-center justify-center bg-gradient-to-br from-[#ffe0c8] via-[#ffd0c4] to-[#fff4ec] text-5xl"
                aria-hidden
              >
                🎁
              </div>
            )}

            <div className="p-5 sm:p-6">
              <p
                className="text-xl tracking-wide text-[var(--secondary)]"
                aria-label={`Оценка ${review.rating} из 5`}
              >
                {starsLabel(review.rating)}
              </p>
              <p className="mt-3 text-base font-bold leading-relaxed text-[var(--foreground)]">
                «{review.comment}»
              </p>
              <p className="mt-4 text-sm font-extrabold text-[var(--muted)]">
                {review.clientName}
                <span className="mx-1.5 text-[var(--line)]">·</span>
                {review.giftTitle}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
