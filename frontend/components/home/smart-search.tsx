"use client";

import { useRouter } from "next/navigation";
import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { trackSearch } from "../../lib/learning";
import {
  analyzeSmartSearch,
  appendSearchAnswer,
  type NextQuestionOption,
  type SmartSearchSnapshot,
} from "../../lib/smart-search";

type SmartSearchProps = {
  className?: string;
  autoFocus?: boolean;
};

export function SmartSearch({ className = "", autoFocus = false }: SmartSearchProps) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [asking, setAsking] = useState(false);

  const deferredQuery = useDeferredValue(query);
  const snapshot: SmartSearchSnapshot = useMemo(
    () => analyzeSmartSearch(deferredQuery),
    [deferredQuery],
  );

  const suggestions = snapshot.suggestions;

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function navigate(href: string, text: string) {
    if (text.trim()) trackSearch(text.trim());
    router.push(href);
  }

  function commit(text: string) {
    const snap = analyzeSmartSearch(text);
    if (!text.trim()) {
      navigate("/create?scenario=unsure", "");
      return;
    }
    if (snap.ready) {
      setAsking(false);
      navigate(snap.href, text);
      return;
    }
    // Not enough info — one question only
    setQuery(text);
    setAsking(true);
    setOpen(false);
  }

  function applySuggestion(text: string) {
    setQuery(text);
    setOpen(false);
    setActiveIndex(-1);
    commit(text);
  }

  function answerQuestion(option: NextQuestionOption) {
    const next = appendSearchAnswer(query, option);
    setQuery(next);
    const snap = analyzeSmartSearch(next);
    if (snap.ready) {
      setAsking(false);
      navigate(snap.href, next);
      return;
    }
    setAsking(true);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (open && activeIndex >= 0 && suggestions[activeIndex]) {
      applySuggestion(suggestions[activeIndex].text);
      return;
    }
    commit(query);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((prev) =>
        suggestions.length === 0
          ? -1
          : prev < suggestions.length - 1
            ? prev + 1
            : 0,
      );
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        suggestions.length === 0
          ? -1
          : prev <= 0
            ? suggestions.length - 1
            : prev - 1,
      );
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      setAsking(false);
      setActiveIndex(-1);
    }
  }

  const question = snapshot.nextQuestion;
  const showAsk = asking && question;

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      <form onSubmit={onSubmit} className="relative">
        <div className="rounded-[28px] border-2 border-white/80 bg-white shadow-[var(--shadow)] transition focus-within:border-[var(--accent)]">
          <input
            ref={inputRef}
            id="gift-smart-search"
            type="search"
            value={query}
            autoFocus={autoFocus}
            autoComplete="off"
            role="combobox"
            aria-expanded={open && suggestions.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
            }
            placeholder="Например: маме на день рождения…"
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setAsking(false);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="w-full rounded-[28px] bg-transparent px-5 py-5 text-xl font-bold outline-none placeholder:text-[var(--muted)] sm:px-7 sm:py-6 sm:text-2xl"
          />

          {/* Live detected params */}
          {query.trim() && snapshot.chips.length > 0 ? (
            <div className="flex flex-wrap gap-2 border-t border-[var(--line)] px-4 py-3 sm:px-6">
              {snapshot.chips.map((chip) => (
                <span
                  key={chip.key}
                  className="rounded-[14px] bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-extrabold text-[var(--accent)]"
                >
                  {chip.label}: {chip.value}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Live suggestions — every keystroke */}
        {open && !showAsk && suggestions.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute inset-x-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-[24px] border border-[var(--line)] bg-white py-2 shadow-[var(--shadow)]"
          >
            {suggestions.map((item, index) => {
              const active = index === activeIndex;
              return (
                <li key={item.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    id={`${listId}-option-${index}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => applySuggestion(item.text)}
                    className={`flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition sm:px-6 ${
                      active
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "hover:bg-[var(--surface-warm)]"
                    }`}
                  >
                    <span className="text-lg font-extrabold sm:text-xl">
                      {item.text}
                    </span>
                    <span className="shrink-0 text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
                      {item.kind === "complete"
                        ? "подсказка"
                        : item.kind === "scenario"
                          ? "сценарий"
                          : "хит"}
                    </span>
                  </button>
                </li>
              );
            })}
            {snapshot.nextQuestion ? (
              <li className="border-t border-[var(--line)] px-5 py-3 text-sm font-bold text-[var(--muted)] sm:px-6">
                Enter → {snapshot.nextQuestion.prompt}
              </li>
            ) : snapshot.ready ? (
              <li className="border-t border-[var(--line)] px-5 py-3 text-sm font-bold text-[var(--mint)] sm:px-6">
                Enter → открыть сценарий
              </li>
            ) : null}
          </ul>
        ) : null}

        <button
          type="submit"
          className="mt-4 w-full rounded-[26px] bg-[var(--accent)] px-8 py-5 text-xl font-extrabold text-white transition hover:bg-[var(--accent-hover)] sm:text-2xl"
        >
          Придумать подарок
        </button>
      </form>

      {/* One next question — ChatGPT style, no form */}
      {showAsk && question ? (
        <div className="mt-5 animate-[fade-rise_0.35s_ease-out_both] rounded-[28px] border-2 border-[var(--accent)] bg-white p-5 shadow-[var(--shadow)] sm:p-6">
          <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Уточнение · один вопрос
          </p>
          <p className="mt-2 font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl">
            {question.prompt}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {question.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => answerQuestion(option)}
                className="rounded-[18px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-3 text-base font-extrabold transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              // Skip this field and proceed with what we have
              setAsking(false);
              const snap = analyzeSmartSearch(query);
              navigate(snap.href, query);
            }}
            className="mt-4 text-sm font-extrabold text-[var(--muted)] hover:text-[var(--accent)]"
          >
            Пропустить и открыть →
          </button>
        </div>
      ) : null}
    </div>
  );
}
