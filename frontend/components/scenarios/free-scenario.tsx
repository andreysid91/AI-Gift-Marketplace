"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FreeScenarioProps = {
  query: string;
};

export function FreeScenario({ query }: FreeScenarioProps) {
  const router = useRouter();
  const [details, setDetails] = useState("");

  function contact() {
    const text = [query, details].filter(Boolean).join("\n\n");
    const params = new URLSearchParams();
    if (text) params.set("idea", text);
    router.push(`/contact${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="mx-auto max-w-2xl pb-10 text-center">
      <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
        Свободный заказ
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-unbounded)] text-3xl font-semibold leading-tight sm:text-4xl">
        Не нашли нужный вариант?
      </h2>
      <p className="mt-4 text-lg font-bold text-[var(--muted)] sm:text-xl">
        Опишите подробнее или напишите нам — подберём реализацию.
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
        onClick={contact}
        className="mt-5 w-full rounded-[24px] bg-[var(--accent)] px-8 py-4 text-lg font-extrabold text-white transition hover:bg-[var(--accent-hover)] sm:w-auto"
      >
        Написать нам
      </button>

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
          href="/create?q=Корпоративный%20заказ&scenario=corporate"
          className="rounded-[18px] bg-white px-4 py-3 text-sm font-extrabold shadow-[var(--shadow-soft)]"
        >
          🏢 Бизнес
        </Link>
      </div>
    </div>
  );
}
