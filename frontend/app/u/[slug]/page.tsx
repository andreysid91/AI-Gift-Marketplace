import Link from "next/link";
import { PublicGiftProfileView } from "../../../components/public-gift-profile-view";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `Gift Profile · ${slug} — AI Gift`,
    description: "Публичный профиль подарков и wish list.",
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#ffe0c8_0%,transparent_45%),radial-gradient(ellipse_at_80%_10%,#d4f5e8_0%,transparent_40%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_100%)]"
      />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← AI Gift
        </Link>
        <div className="mt-8">
          <PublicGiftProfileView slug={slug} />
        </div>
      </div>
    </main>
  );
}
