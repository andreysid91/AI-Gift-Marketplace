import type { Metadata } from "next";
import Link from "next/link";
import { PartnerPortalLogin } from "../../components/partner-portal-login";

export const metadata: Metadata = {
  title: "Partner Portal — Gift",
  description: "Вход для производственных партнёров Gift.",
};

export default function PartnerLoginPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <Link
          href="/"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← На главную
        </Link>

        <header className="mt-8 max-w-xl">
          <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--accent)]">
            Gift
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
            Partner Portal
          </h1>
          <p className="mt-3 text-lg font-bold text-[var(--muted)]">
            Кабинет производства. Без данных клиентов и цен.
          </p>
        </header>

        <div className="mt-10">
          <PartnerPortalLogin />
        </div>
      </div>
    </main>
  );
}
