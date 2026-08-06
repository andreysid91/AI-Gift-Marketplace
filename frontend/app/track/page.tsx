"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { OrderTimeline } from "../../components/order-timeline";
import { loadAdminOrders, type AdminOrder } from "../../lib/admin-mock";
import { formatRub } from "../../lib/scenario-catalog";

function TrackContent() {
  const params = useSearchParams();
  const orderId = params.get("order")?.trim() ?? "";
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function sync() {
      if (!orderId) {
        setOrder(null);
        setReady(true);
        return;
      }
      const found =
        loadAdminOrders().find(
          (item) => item.id.toLowerCase() === orderId.toLowerCase(),
        ) ?? null;
      setOrder(found);
      setReady(true);
    }
    sync();
    const timer = window.setInterval(sync, 2500);
    return () => window.clearInterval(timer);
  }, [orderId]);

  if (!ready) {
    return <p className="font-bold text-[var(--muted)]">Загрузка…</p>;
  }

  return (
    <div className="w-full max-w-lg">
      <h1 className="font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
        Отслеживание
      </h1>
      {orderId ? (
        <p className="mt-2 text-lg font-extrabold text-[var(--accent)]">
          {orderId}
        </p>
      ) : (
        <p className="mt-2 font-bold text-[var(--muted)]">
          Укажите номер заказа в ссылке
        </p>
      )}

      {order ? (
        <div className="mt-4 rounded-[24px] bg-white/80 px-5 py-4 text-base font-bold shadow-[var(--shadow-soft)]">
          <p className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
            {order.title}
          </p>
          <p className="mt-1 text-[var(--muted)]">
            {formatRub(order.total)} · {order.status}
          </p>
        </div>
      ) : orderId ? (
        <p className="mt-4 text-base font-bold text-[var(--muted)]">
          Заказ пока в обработке — статус обновится автоматически.
        </p>
      ) : null}

      <div className="mt-8 rounded-[32px] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
        <OrderTimeline status={order?.status ?? "Новая заявка"} />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/"
          className="rounded-[26px] bg-[var(--accent)] px-8 py-5 text-center text-lg font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
        >
          Вернуться на главную
        </Link>
        <Link
          href="/account"
          className="rounded-[26px] border-2 border-[var(--line)] bg-white px-8 py-5 text-center text-lg font-extrabold transition hover:border-[var(--accent)]"
        >
          Мой аккаунт
        </Link>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-5 py-12 sm:px-6">
        <Suspense fallback={<p className="font-bold text-[var(--muted)]">Загрузка…</p>}>
          <TrackContent />
        </Suspense>
      </div>
    </main>
  );
}
