"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PARTNER_WORK_STATUSES,
  PARTNER_WORK_STATUS_TONE,
  clearPartnerSession,
  getPartnerWorkOrders,
  loadPartnerSession,
  updatePartnerOrderStatus,
  type PartnerSession,
  type PartnerWorkOrder,
  type PartnerWorkStatus,
} from "../lib/partner-portal";

export function PartnerPortalOrders() {
  const router = useRouter();
  const [session, setSession] = useState<PartnerSession | null>(null);
  const [orders, setOrders] = useState<PartnerWorkOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = loadPartnerSession();
    if (!current) {
      router.replace("/partner");
      return;
    }
    setSession(current);
    setOrders(getPartnerWorkOrders(current.partnerId));
    setReady(true);
  }, [router]);

  function refresh(partnerId: string) {
    setOrders(getPartnerWorkOrders(partnerId));
  }

  function onStatusChange(orderId: string, status: PartnerWorkStatus) {
    if (!session) return;
    updatePartnerOrderStatus(session.partnerId, orderId, status);
    refresh(session.partnerId);
  }

  function logout() {
    clearPartnerSession();
    router.push("/partner");
  }

  if (!ready || !session) {
    return (
      <p className="text-lg font-bold text-[var(--muted)]">Загрузка…</p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Partner Portal
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
            {session.name}
          </h1>
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            Только ваши заказы · без данных клиента и цен
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin"
            className="rounded-[16px] bg-white px-4 py-3 text-sm font-extrabold shadow-[var(--shadow-soft)]"
          >
            Админка
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-[16px] bg-[var(--foreground)] px-4 py-3 text-sm font-extrabold text-white"
          >
            Выйти
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-[28px] bg-white px-6 py-12 text-center shadow-[var(--shadow-soft)]">
          <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Нет заказов на производство
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <PartnerWorkCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PartnerWorkCard({
  order,
  onStatusChange,
}: {
  order: PartnerWorkOrder;
  onStatusChange: (orderId: string, status: PartnerWorkStatus) => void;
}) {
  return (
    <article className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-[var(--muted)]">{order.id}</p>
          <h2 className="mt-1 font-[family-name:var(--font-unbounded)] text-xl font-semibold sm:text-2xl">
            {order.title}
          </h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold ${PARTNER_WORK_STATUS_TONE[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
          Что изготовить
        </p>
        <ul className="mt-2 space-y-2">
          {order.items.map((item, index) => (
            <li
              key={`${item.title}-${index}`}
              className="flex items-center justify-between gap-3 rounded-[16px] bg-[var(--surface-warm)] px-3 py-2.5"
            >
              <span className="flex items-center gap-2 font-extrabold">
                {item.emoji ? <span aria-hidden>{item.emoji}</span> : null}
                {item.title}
              </span>
              <span className="text-sm font-extrabold text-[var(--accent)]">
                × {item.qty}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Количество позиций" value={String(order.items.length)} />
        <Field label="Макет" value={order.mockup} />
        <Field label="Срок" value={order.deadline} />
        <Field label="Статус" value={order.status} />
      </div>

      <div className="mt-4">
        <Field label="Комментарий" value={order.comment} />
      </div>

      <div className="mt-5">
        <label className="block text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
          Изменить статус
        </label>
        <select
          value={order.status}
          onChange={(event) =>
            onStatusChange(order.id, event.target.value as PartnerWorkStatus)
          }
          className="mt-2 w-full rounded-[16px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-3 text-base font-bold outline-none focus:border-[var(--accent)] sm:max-w-sm"
        >
          {PARTNER_WORK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm font-bold text-[var(--muted)]">
          Статус сразу обновится в админке
        </p>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-base font-extrabold leading-snug">{value}</p>
    </div>
  );
}
