import Link from "next/link";
import { InspirationGallery } from "../../components/inspiration-gallery";

export default function InspirationPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_8%,#ffe0c8_0%,transparent_42%),radial-gradient(ellipse_at_90%_5%,#ffd0c4_0%,transparent_36%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
          >
            ← AI Gift
          </Link>
          <Link
            href="/account"
            className="rounded-[18px] border-2 border-[var(--line)] bg-white px-4 py-2 text-sm font-extrabold transition hover:border-[var(--accent)]"
          >
            Добавить свою работу
          </Link>
        </div>

        <div className="mt-8">
          <InspirationGallery />
        </div>
      </div>
    </main>
  );
}
