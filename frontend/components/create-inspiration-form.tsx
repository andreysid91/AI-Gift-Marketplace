"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadAdminOrders } from "../lib/admin-mock";
import {
  getAccountById,
  loadCustomerSession,
} from "../lib/auth";
import {
  OCCASION_SUGGESTIONS,
  createInspirationWork,
  getWorkByOrderId,
  readWorkPhoto,
} from "../lib/inspiration";
import { isTerminalStatus } from "../lib/order-pipeline";

type Props = {
  orderId: string;
};

export function CreateInspirationForm({ orderId }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [occasion, setOccasion] = useState("");
  /** Default: do NOT publish */
  const [publishToGallery, setPublishToGallery] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const session = useMemo(() => {
    if (!ready) return null;
    return loadCustomerSession();
  }, [ready]);

  const account = useMemo(() => {
    if (!session) return null;
    return getAccountById(session.accountId);
  }, [session]);

  const order = useMemo(() => {
    if (!ready) return null;
    return loadAdminOrders().find((o) => o.id === orderId) ?? null;
  }, [orderId, ready]);

  const existing = useMemo(() => {
    if (!ready) return null;
    return getWorkByOrderId(orderId);
  }, [orderId, ready]);

  useEffect(() => {
    if (order?.title && !occasion) {
      setOccasion(order.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]);

  async function onPhoto(file: File | null) {
    setError("");
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    try {
      setPreviewUrl(await readWorkPhoto(file));
    } catch (err) {
      setPreviewUrl(null);
      setError(err instanceof Error ? err.message : "Ошибка фото");
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!session || !account) {
      setError("Войдите в аккаунт");
      return;
    }
    setSubmitting(true);
    setError("");
    const result = createInspirationWork(
      {
        orderId,
        accountId: account.id,
        authorName: account.name,
        previewUrl: previewUrl ?? "",
        occasion,
        publishToGallery,
      },
      account.orderIds,
    );
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push(
      result.work.publishToGallery
        ? "/account?work=1&published=1"
        : "/account?work=1&private=1",
    );
  }

  if (!ready) {
    return (
      <div className="rounded-[32px] bg-white p-8 font-bold text-[var(--muted)] shadow-[var(--shadow)]">
        Загрузка…
      </div>
    );
  }

  if (!session || !account) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Создать работу
        </h1>
        <p className="mt-3 font-bold text-[var(--muted)]">
          Войдите, чтобы добавить работу из выполненного заказа.
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(`/inspiration/create?order=${orderId}`)}`}
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
        <Link href="/account" className="mt-6 font-extrabold text-[var(--accent)] hover:underline">
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
        <Link href="/account" className="mt-6 font-extrabold text-[var(--accent)] hover:underline">
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
          Работу можно создать после статуса «Доставлено». Сейчас: «
          {order.status}».
        </p>
        <Link href="/account" className="mt-6 font-extrabold text-[var(--accent)] hover:underline">
          ← В кабинет
        </Link>
      </div>
    );
  }

  if (existing) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Работа уже создана
        </h1>
        <p className="mt-3 font-bold text-[var(--muted)]">
          {existing.publishToGallery
            ? "Работа сохранена и может показываться как вдохновение на страницах подарков."
            : "Она сохранена как личная."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/account"
            className="rounded-[22px] bg-[var(--accent)] px-6 py-3 font-extrabold text-white"
          >
            В кабинет
          </Link>
        </div>
      </div>
    );
  }

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
        Создать работу
      </h1>
      <p className="mt-2 text-base font-bold text-[var(--muted)]">
        Заказ {order.id} · {order.title}
      </p>

      <div className="mt-8">
        <label htmlFor="insp-preview" className="text-base font-extrabold">
          Превью работы
        </label>
        <input
          id="insp-preview"
          type="file"
          accept="image/*"
          required
          onChange={(e) => onPhoto(e.target.files?.[0] ?? null)}
          className="mt-2 block w-full text-sm font-bold text-[var(--muted)] file:mr-4 file:rounded-[16px] file:border-0 file:bg-[var(--accent-soft)] file:px-4 file:py-2 file:font-extrabold file:text-[var(--accent)]"
        />
        {previewUrl ? (
          <div className="mt-4 overflow-hidden rounded-[22px] border-2 border-[var(--line)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Превью"
              className="max-h-56 w-full object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <label htmlFor="insp-occasion" className="text-base font-extrabold">
          Повод
        </label>
        <input
          id="insp-occasion"
          required
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          placeholder="Например: Подарок маме"
          className={fieldClass}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {OCCASION_SUGGESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setOccasion(item)}
              className="rounded-[14px] border border-[var(--line)] bg-[var(--surface-warm)] px-3 py-1.5 text-sm font-extrabold transition hover:border-[var(--accent)]"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-[22px] border-2 border-dashed border-[var(--line)] bg-[var(--surface-warm)] p-4">
        <input
          type="checkbox"
          checked={publishToGallery}
          onChange={(e) => setPublishToGallery(e.target.checked)}
          className="mt-1 size-5 accent-[var(--accent)]"
        />
        <span>
          <span className="block text-base font-extrabold">
            Поделиться как вдохновение
          </span>
          <span className="mt-1 block text-sm font-bold text-[var(--muted)]">
            Работа может появиться как идея на страницах похожих подарков. По
            умолчанию — только у вас в кабинете.
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
        {submitting
          ? "Сохраняем…"
          : publishToGallery
            ? "Создать и опубликовать"
            : "Создать работу"}
      </button>
    </form>
  );
}
