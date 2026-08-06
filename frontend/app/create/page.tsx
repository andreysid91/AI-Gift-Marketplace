import type { Metadata } from "next";
import {
  CreateView,
  parseForcedScenario,
} from "../../components/create-view";

export const metadata: Metadata = {
  title: "Создаём для вас — AI Gift",
  description: "AI-ассистент определяет сценарий и показывает готовые варианты.",
};

type CreatePageProps = {
  searchParams: Promise<{ q?: string; photo?: string; scenario?: string }>;
};

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const { q, photo, scenario } = await searchParams;

  return (
    <CreateView
      query={q ?? ""}
      hasPhoto={photo === "1"}
      forcedScenario={parseForcedScenario(scenario)}
    />
  );
}
