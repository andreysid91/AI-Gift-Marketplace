import Link from "next/link";
import { GiftProfileEditor } from "../../components/gift-profile-editor";

export const metadata = {
  title: "Gift Profile — AI Gift",
  description: "Публичная страница подарков: wish list, категории и приватность.",
};

export default function ProfilePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_8%,#ffe0c8_0%,transparent_42%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
          >
            ← AI Gift
          </Link>
          <Link
            href="/account"
            className="text-sm font-extrabold text-[var(--muted)] hover:text-[var(--accent)]"
          >
            Кабинет
          </Link>
        </div>
        <div className="mt-8">
          <GiftProfileEditor />
        </div>
      </div>
    </main>
  );
}
