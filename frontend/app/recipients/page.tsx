import Link from "next/link";
import { RecipientsList } from "../../components/recipients-list";

export default function RecipientsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_8%,#ffe0c8_0%,transparent_42%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← AI Gift
        </Link>
        <div className="mt-8">
          <RecipientsList />
        </div>
      </div>
    </main>
  );
}
