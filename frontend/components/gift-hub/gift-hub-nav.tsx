"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  GIFT_HUB_NAV,
  isGiftHubPathActive,
} from "../../lib/gift-hub";
import { BRAND_NAME } from "../../lib/brand";
import { SiteAuthBar } from "../auth/site-auth-bar";

const HIDDEN_PREFIXES = [
  "/admin",
  "/owner",
  "/partner",
  "/partners",
  "/warehouse",
  "/delivery",
];

export function GiftHubNav() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(255,244,236,0.94)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
        <Link
          href="/"
          className="shrink-0 font-[family-name:var(--font-unbounded)] text-lg font-semibold text-[var(--accent)] sm:text-xl"
          onClick={() => setOpen(false)}
        >
          {BRAND_NAME}
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto lg:flex"
          aria-label="Основные разделы"
        >
          {GIFT_HUB_NAV.map((item) => {
            const active = isGiftHubPathActive(pathname, item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`shrink-0 rounded-[12px] px-2.5 py-2 text-sm font-extrabold whitespace-nowrap transition ${
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--muted)] hover:bg-white hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <SiteAuthBar />
          </div>
          <button
            type="button"
            className="rounded-[14px] border-2 border-[var(--line)] bg-white px-3 py-2 text-sm font-extrabold lg:hidden"
            aria-expanded={open}
            aria-controls="gift-hub-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Закрыть" : "Меню"}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="gift-hub-menu"
          className="max-h-[70vh] overflow-y-auto border-t border-[var(--line)] bg-[var(--surface-warm)] px-3 py-3 lg:hidden"
          aria-label="Мобильное меню"
        >
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {GIFT_HUB_NAV.map((item) => {
              const active = isGiftHubPathActive(pathname, item.href);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-[16px] px-3 py-3 text-center text-sm font-extrabold ${
                      active
                        ? "bg-[var(--accent)] text-white"
                        : "bg-white text-[var(--foreground)] shadow-[var(--shadow-soft)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex justify-center sm:hidden">
            <SiteAuthBar />
          </div>
        </nav>
      ) : null}
    </header>
  );
}
