import type { Metadata } from "next";
import { Suspense } from "react";
import { GiftPageView } from "../../components/gift-page/gift-page-view";
import { resolveGiftPage } from "../../lib/gift-page";

export const metadata: Metadata = {
  title: "Подарок — Gift",
  description: "Почему именно этот подарок стоит заказать",
};

type GiftPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function GiftPage({ searchParams }: GiftPageProps) {
  const { id } = await searchParams;
  const model = resolveGiftPage(id);

  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center font-bold text-[var(--muted)]">
          Загрузка…
        </main>
      }
    >
      <GiftPageView model={model} />
    </Suspense>
  );
}
