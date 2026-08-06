"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadCustomerSession } from "../lib/auth";
import { RecipientForm } from "./recipient-form";
import { GiftHistoryPanel } from "./gift-history-panel";
import {
  buildRecipientSearchQuery,
  formatBirthdayDisplay,
  getRecipientById,
  getRelationLabel,
  saveSelectedRecipientId,
  type GiftRecipient,
} from "../lib/recipients";

type Props = {
  recipientId: string;
  mode: "view" | "edit" | "create";
};

export function RecipientPageClient({ recipientId, mode }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<GiftRecipient | null>(null);
  const [editing, setEditing] = useState(mode === "edit");

  useEffect(() => {
    const session = loadCustomerSession();
    setAccountId(session?.accountId ?? null);
    if (mode !== "create" && recipientId) {
      setRecipient(getRecipientById(recipientId));
    }
    setReady(true);
  }, [recipientId, mode]);

  if (!ready) {
    return <p className="font-bold text-[var(--muted)]">Загрузка…</p>;
  }

  if (!accountId) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <p className="font-bold text-[var(--muted)]">Нужен вход в аккаунт.</p>
        <Link
          href={`/login?next=${encodeURIComponent(
            mode === "create" ? "/recipients/new" : `/recipients/${recipientId}`,
          )}`}
          className="mt-4 inline-flex font-extrabold text-[var(--accent)] hover:underline"
        >
          Войти
        </Link>
      </div>
    );
  }

  if (mode === "create") {
    return <RecipientForm accountId={accountId} />;
  }

  if (!recipient || recipient.accountId !== accountId) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Не найдено
        </h1>
        <Link href="/recipients" className="mt-4 inline-flex font-extrabold text-[var(--accent)] hover:underline">
          ← К списку
        </Link>
      </div>
    );
  }

  if (editing) {
    return <RecipientForm accountId={accountId} initial={recipient} />;
  }

  const rows: { label: string; value: string }[] = [
    { label: "Кто это", value: getRelationLabel(recipient) },
    { label: "Дата рождения", value: formatBirthdayDisplay(recipient.birthday) },
    { label: "Любимые цвета", value: recipient.favoriteColors || "—" },
    { label: "Увлечения", value: recipient.hobbies || "—" },
    { label: "Размер одежды", value: recipient.clothingSize || "—" },
    { label: "Размер кружки", value: recipient.mugSize || "—" },
    { label: "Сладости", value: recipient.favoriteSweets || "—" },
    { label: "Напиток", value: recipient.favoriteDrink || "—" },
    { label: "Комментарий", value: recipient.comment || "—" },
  ];

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
      <Link
        href="/recipients"
        className="text-sm font-extrabold text-[var(--accent)] hover:underline"
      >
        ← Все получатели
      </Link>

      <p className="mt-4 text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
        {getRelationLabel(recipient)}
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-unbounded)] text-4xl font-semibold">
        {recipient.name}
      </h1>

      <dl className="mt-8 space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 border-b border-[var(--line)] pb-3 sm:flex-row sm:justify-between sm:gap-4"
          >
            <dt className="text-sm font-extrabold text-[var(--muted)]">
              {row.label}
            </dt>
            <dd className="text-base font-bold sm:text-right">{row.value}</dd>
          </div>
        ))}
      </dl>

      <GiftHistoryPanel
        recipient={recipient}
        onChange={(next) => setRecipient(next)}
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            saveSelectedRecipientId(recipient.id);
            router.push(
              `/ideas?q=${encodeURIComponent(buildRecipientSearchQuery(recipient))}&recipient=${recipient.id}`,
            );
          }}
          className="flex-1 rounded-[22px] bg-[var(--accent)] px-6 py-4 text-base font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
        >
          Подобрать подарок
        </button>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex-1 rounded-[22px] border-2 border-[var(--line)] px-6 py-4 text-base font-extrabold transition hover:border-[var(--accent)]"
        >
          Редактировать
        </button>
      </div>
    </div>
  );
}
