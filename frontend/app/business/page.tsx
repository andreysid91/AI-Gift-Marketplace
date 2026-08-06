import type { Metadata } from "next";
import Link from "next/link";
import { BusinessDirectionView } from "../../components/business-direction-view";

export const metadata: Metadata = {
  title: "Корпоративная продукция под заказ — AI Gift",
  description:
    "Футболки, кружки, кепки, толстовки, наборы, медали и кубки для компаний. Тираж от 10 до 1000+. Расчёт под ваш бренд.",
};

export default function BusinessPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,#d4f5e8_0%,transparent_40%),radial-gradient(ellipse_at_88%_8%,#ffe0c8_0%,transparent_36%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_50%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-extrabold text-[var(--accent)] transition hover:gap-3"
        >
          <span aria-hidden>←</span>
          На главную
        </Link>

        {/* Hero for executives */}
        <header className="mt-8 max-w-4xl animate-fade-rise sm:mt-10">
          <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold tracking-tight text-[var(--mint)] sm:text-xl">
            AI Gift · Для бизнеса
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-unbounded)] text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl xl:text-[68px]">
            Корпоративная продукция под заказ
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-bold leading-snug text-[var(--muted)] sm:text-xl lg:text-2xl">
            Мерч, сувениры и награды с вашим логотипом — от пробного тиража до 1000+.
          </p>
        </header>

        <div className="mt-10 animate-fade-rise-delay-1 sm:mt-12">
          <BusinessDirectionView />
        </div>
      </div>
    </main>
  );
}
