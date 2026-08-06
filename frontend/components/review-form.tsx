"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadAdminOrders } from "../lib/admin-mock";
import {
  getAccountById,
  loadCustomerSession,
} from "../lib/auth";
import { isTerminalStatus } from "../lib/order-pipeline";
import {
  createReview,
  getReviewByOrderId,
  readReviewPhoto,
  type ReviewRating,
} from "../lib/reviews";

type ReviewFormProps = {
  orderId: string;
};

export function ReviewForm({ orderId }: ReviewFormProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState<ReviewRating>(5);
  const [hover, setHover] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [showOnSite, setShowOnSite] = useState(true);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setReady(true);
  }, []);

  const session = useMemo(() => {
    if (!ready) return null;
    return loadCustomerSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, tick]);

  const account = useMemo(() => {
    if (!session) return null;
    return getAccountById(session.accountId);
  }, [session]);

  const order = useMemo(() => {
    if (!ready) return null;
    return loadAdminOrders().find((o) => o.id === orderId) ?? null;
  }, [orderId, ready, tick]);

  const existing = useMemo(() => {
    if (!ready) return null;
    return getReviewByOrderId(orderId);
  }, [orderId, ready, tick]);

  async function onPhotoChange(file: File | null) {
    setError("");
    if (!file) {
      setPhotoDataUrl(null);
      setPhotoName("");
      return;
    }
    try {
      const data = await readReviewPhoto(file);
      setPhotoDataUrl(data);
      setPhotoName(file.name);
    } catch (err) {
      setPhotoDataUrl(null);
      setPhotoName("");
      setError(err instanceof Error ? err.message : "Ошибка фото");
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!session || !account) {
      setError("Войдите в аккаунт, чтобы оставить отзыв");
      return;
    }
    setSubmitting(true);
    setError("");
    const result = createReview(
      {
        orderId,
        accountId: account.id,
        clientName: account.name,
        rating,
        comment,
        photoDataUrl,
        showOnSite,
      },
      account.orderIds,
    );
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setTick((n) => n + 1);
    router.push(
      showOnSite
        ? "/account?reviewed=1&public=1"
        : "/account?reviewed=1",
    );
  }

  if (!ready) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <p className="font-bold text-[var(--muted)]">Загрузка…</p>
      </div>
    );
  }

  if (!session || !account) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Отзыв
        </h1>
        <p className="mt-3 font-bold text-[var(--muted)]">
          Войдите, чтобы оставить отзыв по выполненному заказу.
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(`/review?order=${orderId}`)}`}
          className="mt-6 inline-flex rounded-[22px] bg-[var(--accent)] px-6 py-3 font-extrabold text-white"
        >
          Войти
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Заказ не найден
        </h1>
        <Link
          href="/account"
          className="mt-6 inline-flex font-extrabold text-[var(--accent)] hover:underline"
        >
          ← В кабинет
        </Link>
      </div>
    );
  }

  if (!account.orderIds.includes(orderId)) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Нет доступа
        </h1>
        <p className="mt-3 font-bold text-[var(--muted)]">
          Этот заказ не привязан к вашему аккаунту.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-flex font-extrabold text-[var(--accent)] hover:underline"
        >
          ← В кабинет
        </Link>
      </div>
    );
  }

  if (!isTerminalStatus(order.status)) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Ещё рано
        </h1>
        <p className="mt-3 font-bold text-[var(--muted)]">
          Отзыв можно оставить только после того, как заказ выполнен (статус
          «Доставлено»). Сейчас: «{order.status}».
        </p>
        <Link
          href="/account"
          className="mt-6 inline-flex font-extrabold text-[var(--accent)] hover:underline"
        >
          ← В кабинет
        </Link>
      </div>
    );
  }

  if (existing) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Отзыв уже оставлен
        </h1>
        <p className="mt-3 font-bold text-[var(--muted)]">
          По заказу {orderId} вы уже написали отзыв.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-flex font-extrabold text-[var(--accent)] hover:underline"
        >
          ← В кабинет
        </Link>
      </div>
    );
  }

  const displayStars = hover ?? rating;
  const fieldClass =
    "mt-2 w-full rounded-[22px] border-2 border-[var(--line)] bg-white px-5 py-4 text-lg font-bold outline-none focus:border-[var(--accent)]";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[32px] bg-white p-6 shadow-[var(--shadow)] sm:p-8"
    >
      <Link
        href="/account"
        className="text-sm font-extrabold text-[var(--accent)] hover:underline"
      >
        ← В кабинет
      </Link>

      <h1 className="mt-4 font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
        Оставить отзыв
      </h1>
      <p className="mt-2 text-base font-bold text-[var(--muted)]">
        Заказ {order.id} · {order.title}
      </p>

      <fieldset className="mt-8">
        <legend className="text-base font-extrabold">Оценка</legend>
        <div className="mt-3 flex gap-1" role="radiogroup" aria-label="Оценка">
          {([1, 2, 3, 4, 5] as ReviewRating[]).map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} из 5`}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(value)}
              className={`text-4xl transition ${
                value <= displayStars
                  ? "scale-110 text-[var(--secondary)]"
                  : "text-[var(--line)]"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm font-extrabold text-[var(--muted)]">
          {rating} / 5
        </p>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="review-comment" className="text-base font-extrabold">
          Комментарий
        </label>
        <textarea
          id="review-comment"
          required
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Как прошёл заказ? Что понравилось?"
          className={fieldClass}
        />
      </div>

      <div className="mt-6">
        <label htmlFor="review-photo" className="text-base font-extrabold">
          Фото готового подарка
        </label>
        <input
          id="review-photo"
          type="file"
          accept="image/*"
          onChange={(e) => onPhotoChange(e.target.files?.[0] ?? null)}
          className="mt-2 block w-full text-sm font-bold text-[var(--muted)] file:mr-4 file:rounded-[16px] file:border-0 file:bg-[var(--accent-soft)] file:px-4 file:py-2 file:font-extrabold file:text-[var(--accent)]"
        />
        {photoDataUrl ? (
          <div className="mt-4 overflow-hidden rounded-[22px] border-2 border-[var(--line)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoDataUrl}
              alt={photoName || "Фото подарка"}
              className="max-h-56 w-full object-cover"
            />
          </div>
        ) : (
          <p className="mt-2 text-sm font-bold text-[var(--muted)]">
            Необязательно, но очень желательно
          </p>
        )}
      </div>

      <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-[22px] bg-[var(--surface-warm)] p-4">
        <input
          type="checkbox"
          checked={showOnSite}
          onChange={(e) => setShowOnSite(e.target.checked)}
          className="mt-1 size-5 accent-[var(--accent)]"
        />
        <span>
          <span className="block text-base font-extrabold">
            Разрешаю показать отзыв на сайте
          </span>
          <span className="mt-1 block text-sm font-bold text-[var(--muted)]">
            Если согласитесь — отзыв появится в разделе «Наши счастливые
            клиенты»
          </span>
        </span>
      </label>

      {error ? (
        <p className="mt-4 text-sm font-extrabold text-[var(--berry)]">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full rounded-[28px] bg-[var(--accent)] px-8 py-5 text-lg font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)] disabled:opacity-70"
      >
        {submitting ? "Отправляем…" : "Отправить отзыв"}
      </button>
    </form>
  );
}
