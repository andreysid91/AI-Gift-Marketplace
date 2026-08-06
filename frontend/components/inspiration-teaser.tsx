"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  formatCount,
  getPublicWorks,
  type InspirationWork,
} from "../lib/inspiration";

/** Compact teaser of public works on the homepage */
export function InspirationTeaser() {
  const [works, setWorks] = useState<InspirationWork[]>([]);

  useEffect(() => {
    setWorks(getPublicWorks().slice(0, 3));
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
            Галерея вдохновения
          </h2>
          <p className="mt-2 max-w-xl text-lg font-bold text-[var(--muted)]">
            Публичные работы пользователей — идеи, которые уже дарили
          </p>
        </div>
        <Link
          href="/inspiration"
          className="rounded-[22px] bg-[var(--foreground)] px-5 py-3 text-base font-extrabold text-white transition hover:opacity-90"
        >
          Смотреть все →
        </Link>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {works.map((work) => (
          <li key={work.id}>
            <Link
              href="/inspiration"
              className="group block overflow-hidden rounded-[24px] bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)]"
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-[#ffe0c8] via-[#ffd0c4] to-[#fff4ec] text-5xl">
                {work.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={work.previewUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <span aria-hidden>🎁</span>
                )}
              </div>
              <div className="p-4">
                <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold">
                  {work.occasion}
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                  ♥ {formatCount(work.likes)} ·{" "}
                  {formatCount(work.views)} просм. · заказали{" "}
                  {formatCount(work.orderedCount)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
