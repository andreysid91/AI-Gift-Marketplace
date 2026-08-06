import Link from "next/link";
import { Suspense } from "react";
import { AccountPanel } from "../../components/auth/account-panel";

export default function AccountPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,#ffe0c8_0%,transparent_42%),radial-gradient(ellipse_at_85%_20%,#d4f5e8_0%,transparent_40%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
        <Link
          href="/"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← AI Gift
        </Link>
        <div className="mt-8">
          <Suspense
            fallback={
              <div className="rounded-[32px] bg-white p-8 font-bold text-[var(--muted)] shadow-[var(--shadow)]">
                Загрузка…
              </div>
            }
          >
            <AccountPanel />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
