import type { Metadata } from "next";
import Link from "next/link";
import { AdminDashboard } from "../../components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin — AI Gift",
  description: "Панель заявок, заказов, партнёров и товаров. Без авторизации (демо).",
};

export default function AdminPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-[var(--accent)]">
              AI Gift · Admin
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-4xl font-semibold tracking-tight sm:text-5xl">
              Панель управления
            </h1>
          </div>
          <Link
            href="/owner"
            className="rounded-[20px] bg-[var(--foreground)] px-5 py-3 text-base font-extrabold text-white shadow-[var(--shadow-soft)] transition hover:opacity-90"
          >
            Owner
          </Link>
          <Link
            href="/partner"
            className="rounded-[20px] bg-white px-5 py-3 text-base font-extrabold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-soft)]"
          >
            Partner Portal
          </Link>
          <Link
            href="/"
            className="rounded-[20px] bg-white px-5 py-3 text-base font-extrabold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-soft)]"
          >
            ← На сайт
          </Link>
        </div>

        <p className="mt-4 max-w-2xl text-base font-bold text-[var(--muted)]">
          Пока без авторизации. Статусы заявок можно менять локально в браузере.
        </p>

        <div className="mt-8">
          <AdminDashboard />
        </div>
      </div>
    </main>
  );
}
