import Link from "next/link";
import { RecipientPageClient } from "../../../components/recipient-page-client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RecipientDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,#ffe0c8_0%,transparent_42%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_100%)]"
      />
      <div className="relative z-10 mx-auto w-full max-w-xl px-5 py-10 sm:py-14">
        <Link
          href="/recipients"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← Получатели
        </Link>
        <div className="mt-8">
          <RecipientPageClient recipientId={id} mode="view" />
        </div>
      </div>
    </main>
  );
}
