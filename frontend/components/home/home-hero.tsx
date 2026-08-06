"use client";

import Link from "next/link";
import {
  formatOrderCount,
  formatRating,
  getTrustSnapshot,
} from "../../lib/trust";
import { SmartSearch } from "./smart-search";

const QUICK = [
  { label: "🎁 Подарок", href: "/create?scenario=gift" },
  { label: "📷 Фотопечать", href: "/create?scenario=photo" },
  { label: "🏢 Для бизнеса", href: "/create?scenario=corporate" },
  { label: "🎲 Не знаю", href: "/create?scenario=unsure" },
] as const;

export function HomeHero() {
  const { metrics } = getTrustSnapshot();

  return (
    <section className="relative isolate overflow-hidden rounded-[28px] px-4 py-9 sm:rounded-[36px] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,#ffc9b0_0%,transparent_50%),radial-gradient(ellipse_at_90%_10%,#ffd4a8_0%,transparent_45%),linear-gradient(165deg,#fff7f1_0%,#ffe4d4_55%,#ffd8c8_100%)]"
      />

      <div className="mx-auto max-w-3xl">
        <p className="text-center text-sm font-extrabold text-[var(--accent)] sm:text-base">
          {formatOrderCount(metrics.totalOrders)}+ заказов · рейтинг{" "}
          {formatRating(metrics.averageRating)} · сегодня {metrics.ordersToday}{" "}
          вручений
        </p>
        <h1 className="mt-3 text-center font-[family-name:var(--font-unbounded)] text-[1.75rem] font-semibold leading-[1.15] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
          Кому хотите сделать подарок?
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-base font-bold text-[var(--muted)] sm:text-lg">
          Персональный подарок под человека — от идеи до вручения
        </p>

        <div className="mt-7 sm:mt-8">
          <SmartSearch />
        </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2 sm:mt-6 sm:gap-3">
          {QUICK.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[18px] border-2 border-white/90 bg-white/95 px-3.5 py-2.5 text-sm font-extrabold shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow)] sm:rounded-[20px] sm:px-5 sm:py-3 sm:text-lg"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/express"
            className="rounded-[18px] border-2 border-white/90 bg-white/95 px-3.5 py-2.5 text-sm font-extrabold shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow)] sm:rounded-[20px] sm:px-5 sm:py-3 sm:text-lg"
          >
            ⚡ Нужно срочно
          </Link>
        </div>
      </div>
    </section>
  );
}
