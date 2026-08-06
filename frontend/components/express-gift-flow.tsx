"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  EXPRESS_BUDGETS,
  EXPRESS_RECIPIENTS,
  EXPRESS_TODAY,
  buildExpressQuery,
  matchExpressSets,
  saveExpressPick,
  type ExpressAnswers,
  type ExpressBudget,
  type ExpressRecipient,
  type ExpressToday,
} from "../lib/express-gift";
import { loadCustomerSession } from "../lib/auth";
import {
  getRecipientsForAccount,
  getRelationLabel,
  loadSelectedRecipientId,
  saveSelectedRecipientId,
  type GiftRecipient,
} from "../lib/recipients";
import { calcSetTotal, formatRub, type ReadyGiftSet } from "../lib/scenario-catalog";

type Step = "hero" | "who" | "budget" | "today" | "results";

export function ExpressGiftFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("hero");
  const [recipient, setRecipient] = useState<ExpressRecipient | null>(null);
  const [budget, setBudget] = useState<ExpressBudget | null>(null);
  const [today, setToday] = useState<ExpressToday | null>(null);
  const [savedPeople, setSavedPeople] = useState<GiftRecipient[]>([]);

  useEffect(() => {
    const session = loadCustomerSession();
    if (session) setSavedPeople(getRecipientsForAccount(session.accountId));
  }, [step]);

  function pickSavedPerson(person: GiftRecipient) {
    saveSelectedRecipientId(person.id);
    const map: Partial<Record<string, ExpressRecipient>> = {
      mom: "mom",
      dad: "dad",
      girlfriend: "her",
      wife: "her",
      boyfriend: "him",
      husband: "him",
      friend: "friend",
      colleague: "colleague",
      child: "child",
    };
    setRecipient(map[person.relation] ?? "friend");
    setStep("budget");
  }

  const answers: ExpressAnswers | null =
    recipient && budget && today
      ? { recipient, budget, today }
      : null;

  const sets = useMemo(
    () => (answers ? matchExpressSets(answers) : []),
    [answers],
  );

  function openSet(set: ReadyGiftSet) {
    saveExpressPick(set);
    const params = new URLSearchParams({
      q: set.query,
      set: set.id,
    });
    const rid = loadSelectedRecipientId();
    if (rid) params.set("recipient", rid);
    router.push(`/ideas?${params.toString()}`);
  }

  function restart() {
    setRecipient(null);
    setBudget(null);
    setToday(null);
    setStep("hero");
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,#ffd0b8_0%,transparent_45%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← На главную
        </Link>

        {step === "hero" ? (
          <section className="mt-10 flex min-h-[70vh] flex-col justify-center pb-16 sm:mt-14">
            <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--accent)] sm:text-3xl">
              AI Gift
            </p>
            <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
              Экспресс подарок
            </p>
            <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-unbounded)] text-5xl font-semibold leading-[1.05] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
              Нужно срочно?
            </h1>
            <p className="mt-5 max-w-xl text-xl font-bold text-[var(--muted)] sm:text-2xl">
              Подберём подарок за 1 минуту.
            </p>
            <button
              type="button"
              onClick={() => setStep("who")}
              className="mt-10 inline-flex w-full items-center justify-center rounded-[28px] bg-[var(--accent)] px-10 py-6 text-2xl font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)] hover:shadow-[0_20px_44px_rgba(255,90,60,0.28)] sm:w-auto sm:min-w-[280px] sm:text-3xl"
            >
              Начать
            </button>
          </section>
        ) : null}

        {step === "who" ? (
          <QuestionShell
            step={1}
            title="Кому?"
            onBack={() => setStep("hero")}
          >
            {savedPeople.length > 0 ? (
              <div className="mb-6">
                <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
                  Ваши получатели
                </p>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {savedPeople.map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => pickSavedPerson(person)}
                      className="shrink-0 rounded-[18px] border-2 border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3 text-left transition hover:-translate-y-0.5"
                    >
                      <span className="block font-extrabold text-[var(--accent)]">
                        {person.name}
                      </span>
                      <span className="block text-xs font-bold text-[var(--muted)]">
                        {getRelationLabel(person)}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-sm font-bold text-[var(--muted)]">
                  Или выберите быстро:
                </p>
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {EXPRESS_RECIPIENTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setRecipient(item.id);
                    setStep("budget");
                  }}
                  className={`flex min-h-[120px] flex-col justify-between rounded-[24px] px-4 py-5 text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)] sm:min-h-[140px] ${item.tone}`}
                >
                  <span className="text-4xl" aria-hidden>
                    {item.emoji}
                  </span>
                  <span className="mt-3 font-[family-name:var(--font-unbounded)] text-xl font-semibold sm:text-2xl">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </QuestionShell>
        ) : null}

        {step === "budget" ? (
          <QuestionShell
            step={2}
            title="Бюджет?"
            onBack={() => setStep("who")}
          >
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {EXPRESS_BUDGETS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setBudget(item.id);
                    setStep("today");
                  }}
                  className={`flex min-h-[110px] items-center rounded-[24px] px-6 py-5 text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)] ${item.tone}`}
                >
                  <span className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </QuestionShell>
        ) : null}

        {step === "today" ? (
          <QuestionShell
            step={3}
            title="Сегодня нужен?"
            onBack={() => setStep("budget")}
          >
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {EXPRESS_TODAY.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setToday(item.id);
                    setStep("results");
                  }}
                  className={`flex min-h-[140px] flex-col justify-between rounded-[24px] px-6 py-6 text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)] ${item.tone}`}
                >
                  <span className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl">
                    {item.label}
                  </span>
                  <span className="mt-3 text-base font-extrabold opacity-80">
                    {item.hint}
                  </span>
                </button>
              ))}
            </div>
          </QuestionShell>
        ) : null}

        {step === "results" && answers ? (
          <section className="mt-10 animate-fade-rise pb-16">
            <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
              Готово
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
              Ваши наборы
            </h2>
            <p className="mt-3 text-lg font-bold text-[var(--muted)]">
              {buildExpressQuery(answers)}
              {answers.today === "yes" ? " · можно купить сразу" : null}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {sets.map((set) => {
                const total = calcSetTotal(set.itemIds);
                return (
                  <button
                    key={set.id}
                    type="button"
                    onClick={() => openSet(set)}
                    className={`group flex min-h-[180px] flex-col justify-between rounded-[28px] px-5 py-6 text-left shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)] ${set.tone}`}
                  >
                    <div>
                      <span className="text-4xl" aria-hidden>
                        {set.emoji}
                      </span>
                      <h3 className="mt-4 font-[family-name:var(--font-unbounded)] text-2xl font-semibold leading-tight">
                        {set.title}
                      </h3>
                      <p className="mt-2 text-sm font-extrabold opacity-80">
                        {set.subtitle}
                      </p>
                    </div>
                    <div className="mt-5 flex items-end justify-between gap-2">
                      <span className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
                        {formatRub(total)}
                      </span>
                      <span className="text-sm font-extrabold opacity-0 transition group-hover:opacity-100">
                        Выбрать →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={restart}
              className="mt-8 text-base font-extrabold text-[var(--accent)] hover:underline"
            >
              Пройти заново
            </button>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function QuestionShell({
  step,
  title,
  onBack,
  children,
}: {
  step: number;
  title: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 animate-fade-rise pb-16 sm:mt-14">
      <button
        type="button"
        onClick={onBack}
        className="text-base font-extrabold text-[var(--muted)] hover:text-[var(--accent)]"
      >
        ← Назад
      </button>
      <p className="mt-6 text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
        Вопрос {step} из 3
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}
