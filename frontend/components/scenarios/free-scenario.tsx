"use client";

import Link from "next/link";
import { useState } from "react";

type FreeScenarioProps = {
  query: string;
};

export function FreeScenario({ query }: FreeScenarioProps) {
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-2xl pb-10 text-center">
      <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
        Сценарий · Свободный заказ
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-unbounded)] text-3xl font-semibold leading-tight sm:text-4xl">
        Не нашли нужный вариант?
      </h2>
      <p className="mt-4 text-lg font-bold text-[var(--muted)] sm:text-xl">
        Опишите подробнее или свяжитесь с нами.
        <br />
        Мы реализуем практически любую идею.
      </p>

      {query ? (
        <p className="mt-6 rounded-[22px] bg-white px-5 py-4 text-base font-bold text-[var(--foreground)] shadow-[var(--shadow-soft)]">
          Ваш запрос: «{query}»
        </p>
      ) : null}

      <textarea
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        rows={4}
        placeholder="Расскажите подробнее, что нужно..."
        className="mt-6 w-full resize-none rounded-[24px] border-2 border-[var(--line)] bg-white px-5 py-4 text-left text-base font-bold outline-none transition focus:border-[var(--accent)]"
      />

      <button
        type="button"
        onClick={() => setSent(true)}
        className="mt-5 w-full rounded-[24px] bg-[var(--accent)] px-8 py-4 text-lg font-extrabold text-white transition hover:bg-[var(--accent-hover)] sm:w-auto"
      >
        Связаться с нами
      </button>

      {sent ? (
        <p className="animate-fade-rise mt-4 text-base font-bold text-[var(--mint)]">
          Спасибо! Мы свяжемся — пока демо без отправки.
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/create?q=Хочу%20подарок&scenario=gift"
          className="rounded-[18px] bg-white px-4 py-3 text-sm font-extrabold shadow-[var(--shadow-soft)]"
        >
          🎁 Подарок
        </Link>
        <Link
          href="/create?q=Распечатать%20фото&scenario=photo"
          className="rounded-[18px] bg-white px-4 py-3 text-sm font-extrabold shadow-[var(--shadow-soft)]"
        >
          📷 Фотопечать
        </Link>
        <Link
          href="/create?q=Корпоративный%20заказ&scenario=business"
          className="rounded-[18px] bg-white px-4 py-3 text-sm font-extrabold shadow-[var(--shadow-soft)]"
        >
          🏢 Бизнес
        </Link>
      </div>
    </div>
  );
}
