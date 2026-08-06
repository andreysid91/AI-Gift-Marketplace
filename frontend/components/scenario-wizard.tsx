"use client";

import { useEffect, useMemo, useState } from "react";
import {
  answerCurrentStep,
  answersHasPhoto,
  answersToQuery,
  createFlowState,
  createSeededFlowState,
  getCurrentStep,
  getScenarioDefinition,
  getScenarioLabel,
  getStepProgress,
  goBackStep,
  listScenarios,
  skipOptionalStep,
  type ScenarioAnswers,
  type ScenarioFlowState,
  type ScenarioId,
} from "../lib/scenario-engine";

type ScenarioWizardProps = {
  scenarioId: ScenarioId;
  query: string;
  hasPhoto?: boolean;
  /** Prefill «Кому?» from Gift Hub */
  initialRecipient?: string;
  onScenarioChange?: (id: ScenarioId) => void;
  onComplete: (payload: {
    scenarioId: ScenarioId;
    answers: ScenarioAnswers;
    enrichedQuery: string;
    hasPhoto: boolean;
  }) => void;
};

export function ScenarioWizard({
  scenarioId,
  query,
  hasPhoto = false,
  initialRecipient,
  onScenarioChange,
  onComplete,
}: ScenarioWizardProps) {
  const seed = useMemo(
    () =>
      initialRecipient?.trim()
        ? ({ recipient: initialRecipient.trim() } as Partial<ScenarioAnswers>)
        : undefined,
    [initialRecipient],
  );

  const [state, setState] = useState<ScenarioFlowState>(() =>
    createSeededFlowState(scenarioId, seed),
  );
  const [textDraft, setTextDraft] = useState("");

  useEffect(() => {
    setState(createSeededFlowState(scenarioId, seed));
    setTextDraft("");
  }, [scenarioId, seed]);

  const def = getScenarioDefinition(state.scenarioId);
  const step = getCurrentStep(state);
  const progress = getStepProgress(state);
  const scenarios = useMemo(() => listScenarios(), []);

  function finish(answers: ScenarioAnswers) {
    const enrichedQuery = answersToQuery(state.scenarioId, answers, query);
    onComplete({
      scenarioId: state.scenarioId,
      answers,
      enrichedQuery,
      hasPhoto: answersHasPhoto(answers, hasPhoto),
    });
  }

  function submitValue(value: string | number | boolean | null) {
    const next = answerCurrentStep(state, value);
    setState(next);
    setTextDraft("");
    if (next.done) finish(next.answers);
  }

  if (state.done || step.kind === "done") {
    return (
      <div className="rounded-[32px] bg-white p-8 text-center shadow-[var(--shadow)]">
        <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--mint)]">
          Готово
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
          Собираем варианты
        </h2>
        <p className="mt-2 font-bold text-[var(--muted)]">Ещё момент…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {scenarios.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onScenarioChange?.(item.id);
              setState(createFlowState(item.id));
              setTextDraft("");
            }}
            className={`rounded-[16px] px-3 py-2 text-sm font-extrabold transition ${
              item.id === state.scenarioId
                ? "bg-[var(--accent)] text-white"
                : "border-2 border-[var(--line)] bg-white text-[var(--foreground)] hover:border-[var(--accent)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-[32px] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Сценарий · {getScenarioLabel(state.scenarioId)}
          </p>
          <p className="text-sm font-extrabold text-[var(--muted)]">
            Шаг {Math.min(progress.current, progress.total)} / {progress.total}
          </p>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all"
            style={{
              width: `${Math.round(
                (Math.min(progress.current, progress.total) /
                  Math.max(progress.total, 1)) *
                  100,
              )}%`,
            }}
          />
        </div>

        <h2 className="mt-6 font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
          {step.prompt}
        </h2>
        {step.hint ? (
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            {step.hint}
          </p>
        ) : null}
        <p className="mt-2 text-sm font-bold text-[var(--muted)]">
          {def.description}
        </p>

        {step.kind === "choice" && step.options ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {step.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => submitValue(option.value)}
                className="rounded-[22px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-5 py-4 text-left text-base font-extrabold transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}

        {step.kind === "boolean" ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => submitValue(true)}
              className="rounded-[22px] bg-[var(--accent)] px-8 py-4 text-base font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
            >
              Да
            </button>
            <button
              type="button"
              onClick={() => submitValue(false)}
              className="rounded-[22px] border-2 border-[var(--line)] px-8 py-4 text-base font-extrabold transition hover:border-[var(--accent)]"
            >
              Нет
            </button>
          </div>
        ) : null}

        {step.kind === "text" || step.kind === "number" ? (
          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (step.kind === "number") {
                const n = Number(textDraft.replace(/\s/g, ""));
                submitValue(
                  Number.isFinite(n) && n > 0 ? n : textDraft.trim() || null,
                );
              } else {
                submitValue(textDraft.trim() || null);
              }
            }}
          >
            <input
              value={textDraft}
              onChange={(e) => setTextDraft(e.target.value)}
              type={step.kind === "number" ? "number" : "text"}
              min={step.kind === "number" ? 1 : undefined}
              placeholder={step.placeholder}
              className="w-full rounded-[22px] border-2 border-[var(--line)] bg-white px-5 py-4 text-base font-bold outline-none focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              className="rounded-[22px] bg-[var(--accent)] px-8 py-4 text-base font-extrabold text-white"
            >
              Далее
            </button>
          </form>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setState(goBackStep(state))}
            disabled={state.stepIndex === 0}
            className="rounded-[18px] border-2 border-[var(--line)] px-4 py-2 text-sm font-extrabold disabled:opacity-40"
          >
            Назад
          </button>
          {step.optional ? (
            <button
              type="button"
              onClick={() => {
                const next = skipOptionalStep(state);
                setState(next);
                if (next.done) finish(next.answers);
              }}
              className="rounded-[18px] px-4 py-2 text-sm font-extrabold text-[var(--muted)] hover:text-[var(--accent)]"
            >
              Пропустить
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
