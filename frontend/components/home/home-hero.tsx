"use client";

import Link from "next/link";
import { SiteAuthBar } from "../auth/site-auth-bar";
import { SmartSearch } from "./smart-search";

const QUICK = [
  { label: "🎁 Подарок", href: "/create?scenario=gift" },
  { label: "📷 Фотопечать", href: "/create?scenario=photo" },
  { label: "🏢 Для бизнеса", href: "/create?scenario=corporate" },
  { label: "🎲 Не знаю", href: "/create?scenario=unsure" },
] as const;

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-[36px] px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#ffc9b0_0%,transparent_50%),radial-gradient(ellipse_at_90%_10%,#ffd4a8_0%,transparent_45%),linear-gradient(165deg,#fff7f1_0%,#ffe4d4_55%,#ffd8c8_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-8 h-56 w-56 animate-[float-soft_7s_ease-in-out_infinite] rounded-full bg-[rgba(255,90,60,0.18)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 animate-[float-soft_9s_ease-in-out_infinite] rounded-full bg-[rgba(255,159,67,0.22)] blur-2xl"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <p className="animate-[fade-rise_0.6s_ease-out_both] font-[family-name:var(--font-unbounded)] text-4xl font-semibold tracking-tight text-[var(--accent)] sm:text-5xl lg:text-6xl">
            AI Gift
          </p>
          <SiteAuthBar />
        </div>

        <div className="mx-auto mt-10 max-w-3xl sm:mt-12">
          <h1 className="animate-[fade-rise_0.7s_ease-out_both] text-center font-[family-name:var(--font-unbounded)] text-3xl font-semibold leading-[1.1] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            Что хотите подарить?
          </h1>

          <div className="mt-8 animate-[fade-rise_0.8s_ease-out_both]">
            <SmartSearch />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3 animate-[fade-rise_0.9s_ease-out_both]">
            {QUICK.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[20px] border-2 border-white/90 bg-white/90 px-4 py-3 text-base font-extrabold shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow)] sm:px-5 sm:text-lg"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
