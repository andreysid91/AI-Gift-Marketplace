"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  loadAdminOrders,
  saveAdminOrders,
  setOrderStatus,
  type AdminOrder,
} from "../../lib/admin-mock";
import {
  formatPhoneDisplay,
  getAccountById,
  loadCustomerSession,
  signOutCustomer,
  type CustomerAccount,
  type CustomerSession,
} from "../../lib/auth";
import { ORDER_STATUS_TONE, isTerminalStatus } from "../../lib/order-pipeline";
import { getWorkByOrderId } from "../../lib/inspiration";
import { getReviewByOrderId, starsLabel } from "../../lib/reviews";

export function AccountPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [account, setAccount] = useState<CustomerAccount | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const reviewed = searchParams.get("reviewed") === "1";
  const madePublic = searchParams.get("public") === "1";

  function refreshOrders(acc: CustomerAccount) {
    const all = loadAdminOrders();
    setOrders(
      acc.orderIds
        .map((id) => all.find((o) => o.id === id))
        .filter((o): o is AdminOrder => Boolean(o)),
    );
  }

  useEffect(() => {
    const s = loadCustomerSession();
    setSession(s);
    if (!s) {
      setAccount(null);
      setOrders([]);
      return;
    }
    const acc = getAccountById(s.accountId);
    setAccount(acc);
    if (!acc) {
      setOrders([]);
      return;
    }
    refreshOrders(acc);
  }, [reviewed]);

  function markDelivered(orderId: string) {
    if (!account) return;
    const all = loadAdminOrders();
    const next = all.map((o) =>
      o.id === orderId
        ? setOrderStatus(o, "Доставлено", "Демо: заказ выполнен")
        : o,
    );
    saveAdminOrders(next);
    refreshOrders(account);
  }

  if (!session || !account) {
    return (
      <div className="mx-auto w-full max-w-lg rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
          Кабинет
        </h1>
        <p className="mt-3 text-base font-bold text-[var(--muted)]">
          Войдите по телефону, Google или email. Регистрация не нужна — аккаунт
          появляется после первого заказа.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex w-full items-center justify-center rounded-[28px] bg-[var(--accent)] px-8 py-4 text-lg font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
        >
          Войти
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
      <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
        Аккаунт
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
        {account.name}
      </h1>

      {reviewed ? (
        <p className="mt-4 rounded-[16px] bg-[var(--mint-soft)] px-4 py-3 text-sm font-extrabold text-[var(--mint)]">
          Спасибо за отзыв!
          {madePublic
            ? " Он уже в разделе «Наши счастливые клиенты»."
            : ""}
        </p>
      ) : null}

      {searchParams.get("work") === "1" ? (
        <p className="mt-4 rounded-[16px] bg-[var(--secondary-soft)] px-4 py-3 text-sm font-extrabold text-[#c56a12]">
          Работа сохранена
          {searchParams.get("private") === "1"
            ? " — в галерею не публиковали (по умолчанию)."
            : "."}
        </p>
      ) : null}

      <dl className="mt-8 space-y-4 text-base font-bold">
        <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-3">
          <dt className="text-[var(--muted)]">Телефон</dt>
          <dd>
            {account.phone ? formatPhoneDisplay(account.phone) : "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-3">
          <dt className="text-[var(--muted)]">Email</dt>
          <dd>{account.email ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-3">
          <dt className="text-[var(--muted)]">Вход через</dt>
          <dd className="capitalize">{session.provider}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-3">
          <dt className="text-[var(--muted)]">Заказов</dt>
          <dd>{account.orderIds.length}</dd>
        </div>
      </dl>

      {orders.length > 0 ? (
        <div className="mt-6">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            История заказов
          </p>
          <ul className="mt-3 space-y-3">
            {orders.map((order) => {
              const review = getReviewByOrderId(order.id);
              const work = getWorkByOrderId(order.id);
              const canReview = isTerminalStatus(order.status) && !review;
              const canCreateWork =
                isTerminalStatus(order.status) && !work;
              return (
                <li
                  key={order.id}
                  className="rounded-[18px] bg-[var(--surface-warm)] px-4 py-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-extrabold">{order.id}</p>
                      <p className="mt-0.5 text-sm font-bold text-[var(--muted)]">
                        {order.title}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${ORDER_STATUS_TONE[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {review ? (
                    <p className="mt-2 text-sm font-extrabold text-[var(--secondary)]">
                      {starsLabel(review.rating)} · отзыв оставлен
                      {review.showOnSite ? " · на сайте" : ""}
                    </p>
                  ) : null}

                  {work ? (
                    <p className="mt-2 text-sm font-extrabold text-[var(--mint)]">
                      Работа создана
                      {work.publishToGallery
                        ? " · в галерее вдохновения"
                        : " · только у вас"}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {canReview ? (
                      <Link
                        href={`/review?order=${order.id}`}
                        className="inline-flex rounded-[14px] bg-[var(--accent)] px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
                      >
                        Оставить отзыв
                      </Link>
                    ) : null}
                    {canCreateWork ? (
                      <Link
                        href={`/inspiration/create?order=${order.id}`}
                        className="inline-flex rounded-[14px] border-2 border-[var(--accent)] bg-white px-4 py-2 text-sm font-extrabold text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
                      >
                        В галерею вдохновения
                      </Link>
                    ) : null}
                  </div>

                  {!isTerminalStatus(order.status) ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold text-[var(--muted)]">
                        Отзыв и работа — после «Доставлено»
                      </p>
                      <button
                        type="button"
                        onClick={() => markDelivered(order.id)}
                        className="text-xs font-extrabold text-[var(--accent)] hover:underline"
                      >
                        Демо: доставить
                      </button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : account.orderIds.length > 0 ? (
        <div className="mt-6">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            История заказов
          </p>
          <ul className="mt-3 space-y-2">
            {account.orderIds.map((id) => (
              <li
                key={id}
                className="rounded-[16px] bg-[var(--surface-warm)] px-4 py-3 text-sm font-extrabold"
              >
                {id}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/profile"
          className="inline-flex flex-1 items-center justify-center rounded-[22px] border-2 border-[var(--accent)] bg-white px-6 py-4 text-base font-extrabold text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
        >
          Gift Profile
        </Link>
        <Link
          href="/recipients"
          className="inline-flex flex-1 items-center justify-center rounded-[22px] border-2 border-[var(--accent)] bg-white px-6 py-4 text-base font-extrabold text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
        >
          Получатели подарков
        </Link>
        <Link
          href="/"
          className="inline-flex flex-1 items-center justify-center rounded-[22px] bg-[var(--accent)] px-6 py-4 text-base font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
        >
          На главную
        </Link>
        <button
          type="button"
          onClick={() => {
            signOutCustomer();
            router.push("/login");
          }}
          className="inline-flex flex-1 items-center justify-center rounded-[22px] border-2 border-[var(--line)] bg-white px-6 py-4 text-base font-extrabold transition hover:border-[var(--accent)]"
        >
          Выйти
        </button>
      </div>
    </div>
  );
}
