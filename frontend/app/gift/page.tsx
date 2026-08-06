import type { Metadata } from "next";
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

  return <GiftPageView model={model} />;
}
