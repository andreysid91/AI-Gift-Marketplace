import type { Metadata } from "next";
import Link from "next/link";
import { OwnerDashboard } from "../../components/owner-dashboard";

export const metadata: Metadata = {
  title: "Owner Dashboard — Gift",
  description: "Полный доступ владельца: заказы, прибыль, партнёры, база знаний, AI.",
};

export default function OwnerPage() {
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
              Gift · Owner
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
              Owner Dashboard
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-[20px] bg-white px-5 py-3 text-base font-extrabold shadow-[var(--shadow-soft)]"
          >
            ← На сайт
          </Link>
        </div>

        <OwnerDashboard />
      </div>
    </main>
  );
}
