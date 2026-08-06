"use client";

import { useRef, useState, type ChangeEvent } from "react";
import type { PhotoProduct } from "../lib/photo-products";

type PhotoProductViewProps = {
  product: PhotoProduct;
};

export function PhotoProductView({ product }: PhotoProductViewProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setSubmitted(false);
  }

  function onSubmit() {
    if (!fileName || !size) return;
    setSubmitted(true);
  }

  const canSubmit = Boolean(fileName && size);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-[var(--line)] bg-white px-6 py-14 text-center shadow-[var(--shadow-soft)] transition hover:border-[#3b6fd8] hover:bg-[#e8f0ff]/40"
        >
          <span className="animate-float text-5xl" aria-hidden>
            {product.icon}
          </span>
          <span className="mt-5 font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            {fileName ? "Фото загружено" : "Загрузить фотографию"}
          </span>
          {fileName ? (
            <span className="mt-3 rounded-2xl bg-[var(--mint-soft)] px-4 py-2 text-sm font-extrabold text-[var(--mint)]">
              {fileName}
            </span>
          ) : (
            <span className="mt-2 text-base font-bold text-[var(--muted)]">
              JPG или PNG
            </span>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        <div className="mt-8">
          <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold sm:text-2xl">
            Формат
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {product.sizes.map((value) => {
              const active = size === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setSize(value);
                    setSubmitted(false);
                  }}
                  className={`rounded-[18px] px-5 py-3.5 text-base font-extrabold transition sm:text-lg ${
                    active
                      ? "bg-[#3b6fd8] text-white shadow-[var(--shadow)]"
                      : "bg-white text-[var(--foreground)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="mt-10 w-full rounded-[24px] bg-[#3b6fd8] px-8 py-5 text-lg font-extrabold text-white shadow-[var(--shadow)] transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-45 sm:w-auto sm:min-w-[280px]"
        >
          Заказать {product.title.toLowerCase()}
        </button>

        {!canSubmit ? (
          <p className="mt-3 text-sm font-bold text-[var(--muted)]">
            Загрузите фото и выберите формат
          </p>
        ) : null}

        {submitted ? (
          <div className="animate-fade-rise mt-5 rounded-[22px] bg-white px-5 py-4 shadow-[var(--shadow-soft)]">
            <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-[#3b6fd8]">
              Заявка готова
            </p>
            <p className="mt-1 text-base font-bold text-[var(--muted)]">
              {product.title} · {size} · {fileName}
            </p>
            <p className="mt-2 text-sm font-bold text-[var(--muted)]">
              Пока демо — без отправки на сервер.
            </p>
          </div>
        ) : null}
      </div>

      <aside className={`rounded-[28px] p-6 shadow-[var(--shadow-soft)] sm:p-8 ${product.tone}`}>
        <p className="text-sm font-extrabold uppercase tracking-wide opacity-75">
          Срок
        </p>
        <p className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
          {product.leadTime}
        </p>
        <p className="mt-6 text-base font-extrabold leading-snug opacity-90 sm:text-lg">
          {product.description}
        </p>
        <ul className="mt-8 space-y-3">
          {["Печать по вашему фото", "Проверка качества", "Аккуратная упаковка"].map(
            (line) => (
              <li key={line} className="flex items-center gap-3">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/80 text-sm font-black"
                  aria-hidden
                >
                  ✓
                </span>
                <span className="text-base font-extrabold">{line}</span>
              </li>
            ),
          )}
        </ul>
      </aside>
    </div>
  );
}
