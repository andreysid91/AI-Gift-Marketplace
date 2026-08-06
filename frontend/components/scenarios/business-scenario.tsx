"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";
import {
  BUSINESS_PRODUCTS,
  BUSINESS_QTY,
} from "../../lib/scenario-catalog";

type BusinessScenarioProps = {
  query: string;
};

export function BusinessScenario({ query }: BusinessScenarioProps) {
  const router = useRouter();
  const logoRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);

  function toggle(title: string) {
    setProducts((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title],
    );
  }

  function onLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoName(file.name);
  }

  function requestQuote() {
    if (products.length === 0 || !quantity) return;
    const idea = [
      query || "Корпоративный заказ",
      `Изделия: ${products.join(", ")}`,
      `Тираж: ${quantity}`,
      logoName ? `Логотип: ${logoName}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    router.push(`/contact?idea=${encodeURIComponent(idea)}`);
  }

  return (
    <div>
      <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--mint)]">
        Сценарий · Корпоративный заказ
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
        Что изготовить?
      </h2>
      <p className="mt-2 text-lg font-bold text-[var(--muted)]">
        {query ? `По запросу: «${query}»` : "Корпоративная продукция"}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {BUSINESS_PRODUCTS.map((item) => {
          const active = products.includes(item.title);
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => toggle(item.title)}
              className={`flex min-h-[130px] flex-col justify-between rounded-[22px] bg-white px-4 py-5 text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-1 ${
                active ? "ring-2 ring-[var(--mint)] ring-offset-2" : ""
              }`}
            >
              <span className="text-3xl" aria-hidden>
                {item.icon}
              </span>
              <span className="mt-3 font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-tight">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <h3 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Количество
        </h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {BUSINESS_QTY.map((value) => {
            const active = quantity === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setQuantity(value)}
                className={`min-w-[84px] rounded-[18px] px-5 py-3.5 font-[family-name:var(--font-unbounded)] text-xl font-semibold transition ${
                  active
                    ? "bg-[var(--mint)] text-white"
                    : "bg-white text-[var(--foreground)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Логотип
        </h3>
        <button
          type="button"
          onClick={() => logoRef.current?.click()}
          className="mt-4 flex w-full max-w-lg flex-col items-center rounded-[24px] border-2 border-dashed border-[var(--line)] bg-white px-6 py-8 transition hover:border-[var(--mint)]"
        >
          <span className="text-3xl" aria-hidden>
            📎
          </span>
          <span className="mt-3 text-lg font-extrabold">
            {logoName ? logoName : "Прикрепить логотип"}
          </span>
        </button>
        <input
          ref={logoRef}
          type="file"
          accept="image/*,.pdf,.svg"
          className="hidden"
          onChange={onLogo}
        />
      </div>

      <div className="mt-10 pb-8">
        <button
          type="button"
          disabled={products.length === 0 || !quantity}
          onClick={requestQuote}
          className="w-full rounded-[26px] bg-[var(--mint)] px-8 py-5 text-xl font-extrabold text-white shadow-[var(--shadow)] transition hover:brightness-105 disabled:opacity-45 sm:w-auto sm:min-w-[280px]"
        >
          Получить расчёт
        </button>
        <p className="mt-4 max-w-lg text-sm font-bold text-[var(--muted)]">
          Откроем форму заявки с выбранными изделиями и тиражом.
        </p>
      </div>
    </div>
  );
}
