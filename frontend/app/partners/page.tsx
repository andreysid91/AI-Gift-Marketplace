import type { Metadata } from "next";
import Link from "next/link";
import { PartnerCard } from "../../components/partner-card";
import { PARTNERS } from "../../lib/partners";

export const metadata: Metadata = {
  title: "Партнёры — Gift",
  description:
    "Производственные партнёры Gift: возможности, сроки, контакты и условия.",
};

export default function PartnersPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,#ffe0c8_0%,transparent_42%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <Link
          href="/"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← На главную
        </Link>

        <header className="mt-8 max-w-3xl">
          <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--accent)] sm:text-3xl">
            Gift
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl lg:text-6xl">
            Партнёры
          </h1>
          <p className="mt-4 text-lg font-bold text-[var(--muted)] sm:text-xl">
            Кто производит заказы: возможности, сроки, контакты и условия.
          </p>
        </header>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {PARTNERS.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>

        <p className="mt-10 text-base font-bold text-[var(--muted)]">
          Mock-данные · без backend ·{" "}
          <Link href="/partner" className="text-[var(--accent)] hover:underline">
            Partner Portal
          </Link>
          {" · "}
          <Link href="/admin" className="text-[var(--accent)] hover:underline">
            админка
          </Link>
        </p>
      </div>
    </main>
  );
}
