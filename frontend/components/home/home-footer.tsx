import Link from "next/link";
import { BRAND_NAME } from "../../lib/brand";
import { GIFT_HUB_NAV } from "../../lib/gift-hub";

export function HomeFooter() {
  return (
    <footer className="border-t border-[var(--line)] pt-8 pb-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="font-[family-name:var(--font-unbounded)] text-xl font-semibold text-[var(--accent)]">
          {BRAND_NAME}
        </p>
        <nav
          className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-extrabold text-[var(--muted)] sm:text-base"
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
          <Link href="/contact" className="hover:text-[var(--accent)]">
            Связаться
          </Link>
          <Link href="/account" className="hover:text-[var(--accent)]">
            Кабинет
          </Link>
        </nav>
      </div>
      <p className="mt-6 text-sm font-bold text-[var(--muted)]">
        Красноярск · персональные подарки · сервис, которым пользуются каждый день
      </p>
    </footer>
  );
}
