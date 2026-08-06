import type { Metadata } from "next";
import Link from "next/link";
import { WarehousePageClient } from "../../components/warehouse-page-client";

export const metadata: Metadata = {
  title: "Склад — AI Gift",
  description:
    "Модуль склада: остатки, минимальный порог, автостатусы заканчивается / закончилось / нужно купить.",
};

export default function WarehousePage() {
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
              AI Gift · Склад
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
              Модуль склада
            </h1>
            <p className="mt-3 text-base font-bold text-[var(--muted)]">
              Остатки, минимальный порог и автостатусы: заканчивается /
              закончилось / нужно купить
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/purchases"
              className="rounded-[20px] bg-[var(--accent)] px-5 py-3 text-base font-extrabold text-white"
            >
              Закупки
            </Link>
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

        <WarehousePageClient />
      </div>
    </main>
  );
}
