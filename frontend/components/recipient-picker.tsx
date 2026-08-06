"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  loadCustomerSession,
  type CustomerSession,
} from "../lib/auth";
import {
  buildRecipientSearchQuery,
  formatBirthdayDisplay,
  getRecipientsForAccount,
  getRelationLabel,
  loadSelectedRecipientId,
  saveSelectedRecipientId,
  type GiftRecipient,
} from "../lib/recipients";

type RecipientPickerProps = {
  /** Called when user picks a card (optional — also sets session selection) */
  onSelect?: (recipient: GiftRecipient | null) => void;
  /** Compact strip for home / express */
  compact?: boolean;
};

export function RecipientPicker({
  onSelect,
  compact = false,
}: RecipientPickerProps) {
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [list, setList] = useState<GiftRecipient[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    function sync() {
      const s = loadCustomerSession();
      setSession(s);
      if (s) setList(getRecipientsForAccount(s.accountId));
      else setList([]);
      setSelectedId(loadSelectedRecipientId());
    }
    sync();
    window.addEventListener("ai-gift-recipients-change", sync);
    window.addEventListener("ai-gift-auth-change", sync);
    return () => {
      window.removeEventListener("ai-gift-recipients-change", sync);
      window.removeEventListener("ai-gift-auth-change", sync);
    };
  }, []);

  if (!session) {
    return (
      <div
        className={`rounded-[22px] border border-dashed border-[var(--line)] bg-white/70 px-4 py-3 ${
          compact ? "" : "mt-4"
        }`}
      >
        <p className="text-sm font-bold text-[var(--muted)]">
          Получатели подарков — после входа.{" "}
          <Link href="/login?next=/recipients" className="text-[var(--accent)] hover:underline">
            Войти
          </Link>
          {" · "}
          <Link href="/recipients" className="text-[var(--accent)] hover:underline">
            Подробнее
          </Link>
        </p>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div
        className={`rounded-[22px] border border-dashed border-[var(--line)] bg-white/70 px-4 py-3 ${
          compact ? "" : "mt-4"
        }`}
      >
        <p className="text-sm font-bold text-[var(--muted)]">
          Добавьте карточки людей — подбор станет точнее.{" "}
          <Link
            href="/recipients/new"
            className="font-extrabold text-[var(--accent)] hover:underline"
          >
            Создать
          </Link>
        </p>
      </div>
    );
  }

  function pick(person: GiftRecipient | null) {
    const id = person?.id ?? null;
    saveSelectedRecipientId(id);
    setSelectedId(id);
    onSelect?.(person);
  }

  return (
    <div className={compact ? "" : "mt-4"}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
          Кому дарим
        </p>
        <Link
          href="/recipients"
          className="text-xs font-extrabold text-[var(--accent)] hover:underline"
        >
          Все карточки
        </Link>
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => pick(null)}
          className={`shrink-0 rounded-[16px] border-2 px-3 py-2 text-sm font-extrabold transition ${
            !selectedId
              ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
              : "border-[var(--line)] bg-white text-[var(--muted)]"
          }`}
        >
          Без карточки
        </button>
        {list.map((person) => (
          <button
            key={person.id}
            type="button"
            onClick={() => pick(person)}
            title={`${getRelationLabel(person)} · ДР ${formatBirthdayDisplay(person.birthday)}`}
            className={`shrink-0 rounded-[16px] border-2 px-3 py-2 text-left text-sm font-extrabold transition ${
              selectedId === person.id
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--line)] bg-white"
            }`}
          >
            <span className="block">{person.name}</span>
            <span className="block text-[10px] font-bold opacity-70">
              {getRelationLabel(person)}
            </span>
          </button>
        ))}
      </div>
      {selectedId ? (
        <p className="mt-2 text-xs font-bold text-[var(--muted)]">
          Подбор с учётом профиля ·{" "}
          {buildRecipientSearchQuery(
            list.find((p) => p.id === selectedId)!,
          )}
        </p>
      ) : null}
    </div>
  );
}
