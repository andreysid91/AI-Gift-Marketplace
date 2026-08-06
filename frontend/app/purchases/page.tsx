import type { Metadata } from "next";
import Link from "next/link";
import { PurchasesPageClient } from "../../components/purchases-page-client";

export const metadata: Metadata = {
  title: "Закупки — AI Gift",
  description:
    "Список закупок: позиции ниже минимума на складе добавляются автоматически.",
};

export default function PurchasesPage() {
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
              AI Gift · Закупки
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
              Список закупок
            </h1>
            <p className="mt-3 text-base font-bold text-[var(--muted)]">
              Если остаток меньше минимума — позиция добавляется автоматически
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/warehouse"
              className="rounded-[20px] bg-white px-5 py-3 text-base font-extrabold shadow-[var(--shadow-soft)]"
            >
              Склад
            </Link>
            <Link
              href="/owner"
              className="rounded-[20px] bg-[var(--foreground)] px-5 py-3 text-base font-extrabold text-white"
            >
              Owner
            </Link>
          </div>
        </div>

        <PurchasesPageClient />
      </div>
    </main>
  );
}
