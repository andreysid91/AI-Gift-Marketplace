import type { Metadata } from "next";
import {
  CreateView,
  parseForcedScenario,
} from "../../components/create-view";

export const metadata: Metadata = {
  title: "Создаём для вас — Gift",
  description: "Подберём сценарий и готовые варианты под ваш запрос.",
};

type CreatePageProps = {
  searchParams: Promise<{
    q?: string;
    photo?: string;
    scenario?: string;
    recipient?: string;
  }>;
};

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const { q, photo, scenario, recipient } = await searchParams;

  return (
    <CreateView
      query={q ?? ""}
      hasPhoto={photo === "1"}
      forcedScenario={parseForcedScenario(scenario)}
      initialRecipient={recipient}
    />
  );
}
