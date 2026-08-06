"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_NAME } from "../lib/brand";
import { GIFT_HUB_NAV } from "../lib/gift-hub";

const HIDDEN_PREFIXES = [
  "/admin",
  "/owner",
  "/partner",
  "/partners",
  "/warehouse",
  "/delivery",
];

/** Shared customer footer — contact + track always one click away. */
export function SiteFooter() {
  const pathname = usePathname() || "/";
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface-warm)]/60">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-[var(--accent)]">
            {BRAND_NAME}
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            Красноярск · персональные подарки · заявку оформите за минуты
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-extrabold text-[var(--muted)]"
          aria-label="Подвал"
        >
          {GIFT_HUB_NAV.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="hover:text-[var(--accent)]"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/express" className="hover:text-[var(--accent)]">
            Срочно
          </Link>
          <Link href="/track" className="hover:text-[var(--accent)]">
            Отследить
          </Link>
          <Link href="/contact" className="hover:text-[var(--accent)]">
            Связаться
          </Link>
          <Link href="/account" className="hover:text-[var(--accent)]">
            Кабинет
          </Link>
        </nav>
      </div>
    </footer>
  );
}
