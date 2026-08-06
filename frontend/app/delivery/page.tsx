import type { Metadata } from "next";
import Link from "next/link";
import { DeliveryPageClient } from "../../components/delivery-page-client";
import { DELIVERY_METHODS, formatDeliveryMoney } from "../../lib/delivery";

export const metadata: Metadata = {
  title: "Доставка — Gift",
  description:
    "Способы доставки: самовывоз, курьер, Яндекс, СДЭК, Почта России — стоимость, время, трек.",
};

export default function DeliveryPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-[var(--accent)]">
              Gift · Доставка
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
              Модуль доставки
            </h1>
            <p className="mt-3 text-base font-bold text-[var(--muted)]">
              Способы, стоимость, время и трек-номер
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/owner"
              className="rounded-[20px] bg-[var(--foreground)] px-5 py-3 text-base font-extrabold text-white"
            >
              Owner
            </Link>
            <Link
              href="/"
              className="rounded-[20px] bg-white px-5 py-3 text-base font-extrabold shadow-[var(--shadow-soft)]"
            >
              ← На сайт
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DELIVERY_METHODS.map((method) => (
            <div
              key={method.id}
              className={`rounded-[22px] px-5 py-5 ${method.tone}`}
            >
              <p className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
                {method.name}
              </p>
              <p className="mt-2 text-sm font-extrabold">
                {formatDeliveryMoney(method.cost)}
              </p>
              <p className="mt-1 text-sm font-bold opacity-90">
                {method.timeLabel}
              </p>
            </div>
          ))}
        </div>

        <DeliveryPageClient />
      </div>
    </main>
  );
}
