"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { RecipientPicker } from "./recipient-picker";
import {
  buildRecipientSearchQuery,
  loadSelectedRecipient,
  loadSelectedRecipientId,
} from "../lib/recipients";
import { trackSearch } from "../lib/learning";

const SUGGESTIONS = [
  "Подарок папе рыбаку до 3000",
  "Подарок маме",
  "Подарок папе",
  "Подарок девушке",
  "Подарок жене на годовщину",
  "Подарок начальнику",
  "Подарок учителю",
  "Подарок сотрудникам",
  "Карикатура",
  "Футболка",
  "Кружка",
  "Холст",
  "Фотокнига",
] as const;

const MAX_VISIBLE = 8;

export function HomeSearch() {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...SUGGESTIONS];
    return SUGGESTIONS.filter((item) => item.toLowerCase().includes(q));
  }, [query]);

  const visible = filtered.slice(0, MAX_VISIBLE);

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

  function go(value?: string) {
    const recipient = loadSelectedRecipient();
    let next = (value ?? query).trim();
    if (!next && recipient) {
      next = buildRecipientSearchQuery(recipient);
    }
    if (next) trackSearch(next);
    const params = new URLSearchParams();
    if (next) params.set("q", next);
    const recipientId = loadSelectedRecipientId();
    if (recipientId) params.set("recipient", recipientId);
    const qs = params.toString();
    router.push(qs ? `/ideas?${qs}` : "/ideas");
  }

  function pickSuggestion(value: string) {
    setQuery(value);
    setOpen(false);
    setActiveIndex(-1);
    go(value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex((prev) => {
        if (visible.length === 0) return -1;
        return prev < visible.length - 1 ? prev + 1 : 0;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex((prev) => {
        if (visible.length === 0) return -1;
        return prev <= 0 ? visible.length - 1 : prev - 1;
      });
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (open && activeIndex >= 0 && visible[activeIndex]) {
        pickSuggestion(visible[activeIndex]);
        return;
      }
      go();
    }
  }

  return (
    <div ref={rootRef} className="relative w-full max-w-3xl">
      <label
        htmlFor="gift-search"
        className="mb-4 block font-[family-name:var(--font-unbounded)] text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl"
      >
        Что хотите подарить?
      </label>

      <RecipientPicker
        compact
        onSelect={(person) => {
          if (person && !query.trim()) {
            setQuery(buildRecipientSearchQuery(person));
          }
        }}
      />

      <div className="relative mt-4">
        <input
          id="gift-search"
          type="search"
          value={query}
          autoComplete="off"
          role="combobox"
          aria-expanded={open && visible.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
          }
          placeholder="Начните вводить — например, подарок маме"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full rounded-[28px] border-2 border-[var(--line)] bg-white px-5 py-5 text-xl font-bold text-[var(--foreground)] shadow-[var(--shadow)] outline-none transition placeholder:font-bold placeholder:text-[var(--muted)] focus:border-[var(--accent)] sm:px-7 sm:py-6 sm:text-2xl"
        />

        {open && visible.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute inset-x-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[24px] border border-[var(--line)] bg-white py-2 shadow-[var(--shadow)]"
          >
            {visible.map((item, index) => {
              const active = index === activeIndex;
              return (
                <li key={item} role="option" aria-selected={active}>
                  <button
                    type="button"
                    id={`${listId}-option-${index}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => pickSuggestion(item)}
                    className={`flex w-full items-center px-5 py-3.5 text-left text-lg font-extrabold transition sm:px-6 sm:text-xl ${
                      active
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "text-[var(--foreground)] hover:bg-[var(--surface-warm)]"
                    }`}
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => go()}
        className="mt-5 w-full rounded-[26px] bg-[var(--accent)] px-8 py-5 text-xl font-extrabold text-white transition hover:bg-[var(--accent-hover)] sm:text-2xl"
      >
        Подобрать подарок
      </button>
    </div>
  );
}
