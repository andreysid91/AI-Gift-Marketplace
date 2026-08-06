"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadCustomerSession } from "../lib/auth";
import {
  buildRecipientSearchQuery,
  deleteRecipient,
  formatBirthdayDisplay,
  getRecipientsForAccount,
  getRelationLabel,
  saveSelectedRecipientId,
  type GiftRecipient,
} from "../lib/recipients";

export function RecipientsList() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [list, setList] = useState<GiftRecipient[]>([]);

  function refresh(id: string) {
    setList(getRecipientsForAccount(id));
  }

  useEffect(() => {
    const session = loadCustomerSession();
    setAccountId(session?.accountId ?? null);
    if (session) refresh(session.accountId);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <p className="font-bold text-[var(--muted)]">Загрузка…</p>
    );
  }

  if (!accountId) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
          Получатели подарков
        </h1>
        <p className="mt-3 font-bold text-[var(--muted)]">
          Войдите в аккаунт, чтобы сохранять карточки людей. Аккаунт появится
          после первого заказа.
        </p>
        <Link
          href="/login?next=/recipients"
          className="mt-6 inline-flex rounded-[22px] bg-[var(--accent)] px-6 py-3 font-extrabold text-white"
        >
          Войти
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-unbounded)] text-4xl font-semibold">
            Получатели подарков
          </h1>
          <p className="mt-2 max-w-xl text-lg font-bold text-[var(--muted)]">
            Карточки людей — сайт использует их при подборе подарков
          </p>
        </div>
        <Link
          href="/recipients/new"
          className="rounded-[22px] bg-[var(--accent)] px-5 py-3 text-base font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
        >
          + Новая карточка
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-[28px] bg-white px-6 py-12 text-center shadow-[var(--shadow-soft)]">
          <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Пока никого нет
          </p>
          <p className="mt-2 font-bold text-[var(--muted)]">
            Добавьте маму, папу, коллегу — и подбор станет точнее
          </p>
          <Link
            href="/recipients/new"
            className="mt-6 inline-flex rounded-[22px] bg-[var(--accent)] px-6 py-3 font-extrabold text-white"
          >
            Создать первую карточку
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((person) => (
            <li
              key={person.id}
              className="flex flex-col rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)]"
            >
              <Link href={`/recipients/${person.id}`} className="flex-1">
                <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
                  {getRelationLabel(person)}
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
                  {person.name}
                </h2>
                <p className="mt-3 text-sm font-bold text-[var(--muted)]">
                  ДР: {formatBirthdayDisplay(person.birthday)}
                </p>
                {person.hobbies ? (
                  <p className="mt-1 text-sm font-bold text-[var(--foreground)]">
                    {person.hobbies}
                  </p>
                ) : null}
                <p className="mt-3 text-xs font-extrabold text-[var(--muted)]">
                  Подарков в истории: {person.giftHistory.length}
                </p>
              </Link>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    saveSelectedRecipientId(person.id);
                    const q = buildRecipientSearchQuery(person);
                    router.push(
                      `/ideas?q=${encodeURIComponent(q)}&recipient=${person.id}`,
                    );
                  }}
                  className="flex-1 rounded-[16px] bg-[var(--accent)] px-3 py-2.5 text-sm font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
                >
                  Подобрать подарок
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm(`Удалить карточку «${person.name}»?`)) return;
                    deleteRecipient(person.id, accountId);
                    refresh(accountId);
                  }}
                  className="rounded-[16px] border-2 border-[var(--line)] px-3 py-2.5 text-sm font-extrabold text-[var(--muted)] hover:border-[var(--berry)] hover:text-[var(--berry)]"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
