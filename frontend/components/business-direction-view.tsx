"use client";

import { useRef, useState, type ChangeEvent } from "react";

const PRODUCTS = [
  { title: "Футболки", icon: "👕", tone: "bg-[var(--accent-soft)] text-[var(--accent)]" },
  { title: "Кружки", icon: "☕", tone: "bg-[#efe6d8] text-[#8a6a3d]" },
  { title: "Кепки", icon: "🧢", tone: "bg-[var(--secondary-soft)] text-[#c56a12]" },
  { title: "Толстовки", icon: "🧥", tone: "bg-[#e8f0ff] text-[#3b6fd8]" },
  { title: "Шопперы", icon: "🛍️", tone: "bg-[var(--berry-soft)] text-[var(--berry)]" },
  { title: "Блокноты", icon: "📓", tone: "bg-[var(--mint-soft)] text-[var(--mint)]" },
  { title: "Ручки", icon: "✒️", tone: "bg-[#efe6d8] text-[#6b5344]" },
  { title: "Термокружки", icon: "🧊", tone: "bg-[#e8f0ff] text-[#2f6bb5]" },
  { title: "Подарочные наборы", icon: "🎁", tone: "bg-[var(--accent-soft)] text-[var(--accent)]" },
  { title: "Медали", icon: "🏅", tone: "bg-[var(--secondary-soft)] text-[#c56a12]" },
  { title: "Кубки", icon: "🏆", tone: "bg-[var(--berry-soft)] text-[var(--berry)]" },
  { title: "Дипломы", icon: "📜", tone: "bg-[var(--mint-soft)] text-[var(--mint)]" },
] as const;

const QUANTITIES = ["10", "30", "50", "100", "500", "1000+"] as const;

export function BusinessDirectionView() {
  const logoRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function toggleProduct(title: string) {
    setProducts((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title],
    );
    setSubmitted(false);
  }

  function onLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoName(file.name);
    setSubmitted(false);
  }

  function onSubmit() {
    if (products.length === 0 || !quantity) return;
    setSubmitted(true);
  }

  const canSubmit = products.length > 0 && quantity !== null;

  return (
    <>
      {/* Products */}
      <section>
        <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl lg:text-4xl">
          Что нужно изготовить?
        </h2>
        <p className="mt-2 text-base font-bold text-[var(--muted)] sm:text-lg">
          Выберите одну или несколько позиций
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {PRODUCTS.map((item) => {
            const active = products.includes(item.title);
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => toggleProduct(item.title)}
                className={`group relative flex min-h-[140px] flex-col justify-between rounded-[24px] px-4 py-5 text-left shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)] sm:min-h-[160px] sm:px-5 sm:py-6 ${item.tone} ${
                  active ? "ring-2 ring-[var(--foreground)] ring-offset-2" : ""
                }`}
              >
                {active ? (
                  <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--foreground)] text-sm font-black text-white">
                    ✓
                  </span>
                ) : null}
                <span className="text-4xl transition duration-200 group-hover:scale-110 sm:text-5xl" aria-hidden>
                  {item.icon}
                </span>
                <span className="mt-4 font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-tight sm:text-xl">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quantity */}
      <section className="mt-12 sm:mt-14">
        <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          Количество
        </h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {QUANTITIES.map((value) => {
            const active = quantity === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setQuantity(value);
                  setSubmitted(false);
                }}
                className={`min-w-[88px] rounded-[20px] px-5 py-4 font-[family-name:var(--font-unbounded)] text-xl font-semibold transition duration-200 sm:min-w-[100px] sm:text-2xl ${
                  active
                    ? "bg-[var(--mint)] text-white shadow-[var(--shadow)]"
                    : "bg-white text-[var(--foreground)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </section>

      {/* Logo */}
      <section className="mt-12 sm:mt-14">
        <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          Логотип
        </h2>
        <p className="mt-2 text-base font-bold text-[var(--muted)]">
          Прикрепите логотип компании — нанесём на продукцию
        </p>

        <button
          type="button"
          onClick={() => logoRef.current?.click()}
          className="mt-5 flex w-full max-w-xl flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-[var(--line)] bg-white px-6 py-10 text-center shadow-[var(--shadow-soft)] transition hover:border-[var(--mint)] hover:bg-[var(--mint-soft)]/40"
        >
          <span className="text-4xl" aria-hidden>
            📎
          </span>
          <span className="mt-4 font-[family-name:var(--font-unbounded)] text-xl font-semibold">
            {logoName ? "Логотип загружен" : "Прикрепить логотип"}
          </span>
          {logoName ? (
            <span className="mt-2 rounded-2xl bg-[var(--mint-soft)] px-4 py-2 text-sm font-extrabold text-[var(--mint)]">
              {logoName}
            </span>
          ) : (
            <span className="mt-2 text-sm font-bold text-[var(--muted)]">
              PNG, SVG, PDF или JPG
            </span>
          )}
        </button>
        <input
          ref={logoRef}
          type="file"
          accept="image/*,.pdf,.svg"
          className="hidden"
          onChange={onLogoChange}
        />
      </section>

      {/* CTA */}
      <section className="mt-12 pb-8 sm:mt-16 sm:pb-10">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full rounded-[28px] bg-[var(--mint)] px-8 py-5 text-xl font-extrabold text-white shadow-[var(--shadow)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 disabled:pointer-events-none disabled:opacity-45 sm:w-auto sm:min-w-[320px] sm:px-12 sm:py-6 sm:text-2xl"
        >
          Получить расчет
        </button>

        {!canSubmit ? (
          <p className="mt-4 text-base font-bold text-[var(--muted)]">
            Выберите продукцию и тираж
          </p>
        ) : null}

        {submitted ? (
          <div className="animate-fade-rise mt-5 max-w-xl rounded-[24px] bg-white px-5 py-4 shadow-[var(--shadow-soft)]">
            <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-[var(--mint)]">
              Заявка сформирована
            </p>
            <p className="mt-1 text-base font-bold text-[var(--muted)]">
              {products.join(", ")} · тираж {quantity}
              {logoName ? ` · логотип: ${logoName}` : ""}
            </p>
            <p className="mt-2 text-sm font-bold text-[var(--muted)]">
              Пока демо — расчёт отправим после подключения заявок.
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}
