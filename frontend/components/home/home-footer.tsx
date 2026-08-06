import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="border-t border-[var(--line)] pt-8 pb-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="font-[family-name:var(--font-unbounded)] text-xl font-semibold text-[var(--accent)]">
          AI Gift
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-base font-extrabold text-[var(--muted)]">
          <Link href="/contact" className="hover:text-[var(--accent)]">
            Связаться
          </Link>
          <Link href="/account" className="hover:text-[var(--accent)]">
            Кабинет
          </Link>
          <Link href="/inspiration" className="hover:text-[var(--accent)]">
            Галерея
          </Link>
        </nav>
      </div>
      <p className="mt-6 text-sm font-bold text-[var(--muted)]">
        Красноярск · персональные подарки
      </p>
    </footer>
  );
}
