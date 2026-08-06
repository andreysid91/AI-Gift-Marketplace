import type { Metadata } from "next";
import { GiftRankingsView } from "../../components/gift-rankings-view";
import { getAllGiftRankings } from "../../lib/gift-score";

export const metadata: Metadata = {
  title: "Рейтинг подарков — Gift",
  description: "Рейтинг подарков: лучшие за неделю, месяц, год и спецподборки",
};

export default function GiftScorePage() {
  const rankings = getAllGiftRankings();
  return <GiftRankingsView rankings={rankings} />;
}
