import type { Metadata } from "next";
import Link from "next/link";
import {
  INSPIRATION_CATALOG,
  SOURCE_LABELS,
  inspirationCreateHref,
} from "../../lib/inspiration-engine";
import { HUB_RECIPIENTS } from "../../lib/gift-hub";

export const metadata: Metadata = {
  title: "Вдохновение — Gift",
  description:
    "Идеи подарков по категории, стилю, поводу и получателю — сразу к созданию",
};

export default function InspirationHubPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_8%,#ffe0c8_0%,transparent_42%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <h1 className="font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
          Вдохновение
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-bold text-[var(--muted)]">
          Каждая идея ведёт к созданию похожего подарка. На странице подарка
          идеи подбираются под ваш выбор автоматически.
        </p>

        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
            По получателю
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {HUB_RECIPIENTS.slice(0, 8).map((person) => (
              <li key={person.id}>
                <Link
                  href={person.href}
                  className="inline-flex items-center gap-2 rounded-[16px] bg-white px-3 py-2 text-sm font-extrabold shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)]"
                >
                  <span aria-hidden>{person.emoji}</span>
                  {person.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#for-whom"
                className="inline-flex rounded-[16px] border-2 border-dashed border-[var(--line)] px-3 py-2 text-sm font-extrabold text-[var(--accent)]"
              >
                Все →
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
            Идеи для похожего подарка
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INSPIRATION_CATALOG.map((idea) => (
              <li key={idea.id}>
                <Link
                  href={inspirationCreateHref(idea)}
                  className="group flex gap-4 rounded-[24px] bg-white p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
                >
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br ${idea.tone} text-3xl`}
                    aria-hidden
                  >
                    {idea.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="font-[family-name:var(--font-unbounded)] text-base font-semibold">
                      {idea.title}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                      {idea.subtitle}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {idea.sources.slice(0, 2).map((src) => (
                        <span
                          key={src}
                          className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-extrabold text-[var(--muted)]"
                        >
                          {SOURCE_LABELS[src]}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-sm font-extrabold text-[var(--accent)] group-hover:underline">
                      Создать похожий →
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
