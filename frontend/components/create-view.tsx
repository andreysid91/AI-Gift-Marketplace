"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  classifyScenario,
  getScenarioLabel,
  normalizeScenarioId,
  type ScenarioId,
} from "../lib/scenario-engine";
import { trackScenario } from "../lib/learning";
import { ScenarioWizard } from "./scenario-wizard";
import { BusinessScenario } from "./scenarios/business-scenario";
import { FreeScenario } from "./scenarios/free-scenario";
import { GiftScenario } from "./scenarios/gift-scenario";
import { PhotoScenario } from "./scenarios/photo-scenario";

type CreateViewProps = {
  query: string;
  hasPhoto: boolean;
  forcedScenario?: ScenarioId | string;
};

type Phase = "wizard" | "result";

export function CreateView({
  query,
  hasPhoto,
  forcedScenario,
}: CreateViewProps) {
  const router = useRouter();
  const initial = classifyScenario(query, {
    force: forcedScenario,
    hasPhoto,
  });
  const [scenarioId, setScenarioId] = useState<ScenarioId>(initial.scenarioId);
  const [phase, setPhase] = useState<Phase>("wizard");
  const [resultQuery, setResultQuery] = useState(query);
  const [resultPhoto, setResultPhoto] = useState(hasPhoto);

  useEffect(() => {
    trackScenario(scenarioId);
  }, [scenarioId]);

  useEffect(() => {
    const next = classifyScenario(query, {
      force: forcedScenario,
      hasPhoto,
    });
    setScenarioId(next.scenarioId);
    setPhase("wizard");
  }, [query, hasPhoto, forcedScenario]);

  function onComplete(payload: {
    scenarioId: ScenarioId;
    enrichedQuery: string;
    hasPhoto: boolean;
  }) {
    setResultQuery(payload.enrichedQuery);
    setResultPhoto(payload.hasPhoto);
    setScenarioId(payload.scenarioId);

    // Gift / unsure / photo → конструктор идей через Gift Engine
    if (
      payload.scenarioId === "gift" ||
      payload.scenarioId === "unsure" ||
      payload.scenarioId === "photo"
    ) {
      const params = new URLSearchParams();
      if (payload.enrichedQuery) params.set("q", payload.enrichedQuery);
      if (payload.hasPhoto) params.set("photo", "1");
      router.push(`/ideas?${params.toString()}`);
      return;
    }

    setPhase("result");
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,#ffe0c8_0%,transparent_40%),radial-gradient(ellipse_at_90%_8%,#ffd0c4_0%,transparent_36%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_50%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base font-extrabold text-[var(--accent)] transition hover:gap-3"
          >
            <span aria-hidden>←</span>
            Изменить запрос
          </Link>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[var(--muted)] shadow-[var(--shadow-soft)]">
            {getScenarioLabel(scenarioId)}
            {query ? ` · «${query.slice(0, 40)}${query.length > 40 ? "…" : ""}»` : ""}
          </span>
        </div>

        <div className="mt-8 animate-fade-rise sm:mt-10">
          {phase === "wizard" ? (
            <ScenarioWizard
              scenarioId={scenarioId}
              query={query}
              hasPhoto={hasPhoto}
              onScenarioChange={setScenarioId}
              onComplete={onComplete}
            />
          ) : (
            <ScenarioResult
              scenarioId={scenarioId}
              query={resultQuery}
              hasPhoto={resultPhoto}
              onRestart={() => setPhase("wizard")}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function ScenarioResult({
  scenarioId,
  query,
  hasPhoto,
  onRestart,
}: {
  scenarioId: ScenarioId;
  query: string;
  hasPhoto: boolean;
  onRestart: () => void;
}) {
  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onRestart}
        className="text-sm font-extrabold text-[var(--accent)] hover:underline"
      >
        ← Пройти вопросы снова
      </button>
      {scenarioId === "corporate" ? <BusinessScenario query={query} /> : null}
      {scenarioId === "custom" ||
      scenarioId === "print_3d" ||
      scenarioId === "laser" ||
      scenarioId === "embroidery" ? (
        <FreeScenario query={query} />
      ) : null}
      {scenarioId === "gift" || scenarioId === "unsure" ? (
        <GiftScenario query={query} />
      ) : null}
      {scenarioId === "photo" ? (
        <PhotoScenario query={query} hasPhoto={hasPhoto} />
      ) : null}
    </div>
  );
}

export function parseForcedScenario(
  value: string | undefined,
): ScenarioId | undefined {
  return normalizeScenarioId(value) ?? undefined;
}
