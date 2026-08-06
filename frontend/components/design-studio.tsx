"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { readReviewPhoto } from "../lib/reviews";
import {
  DESIGN_PRODUCTS,
  generateDesignVariants,
  getSurprisePrompt,
  productHrefForDesign,
  saveDesignPick,
  type DesignMode,
  type DesignVariant,
} from "../lib/design-studio";

type Step = "mode" | "input" | "generating" | "variants" | "products";

export function DesignStudio() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("mode");
  const [mode, setMode] = useState<DesignMode | null>(null);
  const [prompt, setPrompt] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [error, setError] = useState("");
  const [variants, setVariants] = useState<DesignVariant[]>([]);
  const [selected, setSelected] = useState<DesignVariant | null>(null);

  function chooseMode(next: DesignMode) {
    setMode(next);
    setError("");
    setSelected(null);
    setVariants([]);
    if (next === "surprise") {
      setPrompt(getSurprisePrompt());
      setStep("input");
      return;
    }
    setPrompt("");
    setPhotoDataUrl(null);
    setPhotoName("");
    setStep("input");
  }

  async function onPhoto(file: File | null) {
    setError("");
    if (!file) {
      setPhotoDataUrl(null);
      setPhotoName("");
      return;
    }
    try {
      const data = await readReviewPhoto(file);
      setPhotoDataUrl(data);
      setPhotoName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить фото");
    }
  }

  function runGenerate() {
    if (!mode) return;
    setError("");

    if (mode === "photo" && !photoDataUrl) {
      setError("Загрузите фотографию");
      return;
    }
    if (mode === "description" && prompt.trim().length < 2) {
      setError("Напишите описание — например: «Кот в космосе»");
      return;
    }

    const effectivePrompt =
      mode === "surprise"
        ? prompt.trim() || getSurprisePrompt()
        : mode === "photo"
          ? prompt.trim() || "Дизайн по фотографии"
          : prompt.trim();

    if (mode === "surprise" && !prompt.trim()) {
      setPrompt(effectivePrompt);
    }

    setStep("generating");
    window.setTimeout(() => {
      const next = generateDesignVariants({
        mode,
        prompt: effectivePrompt,
        photoDataUrl,
      });
      setVariants(next);
      setStep("variants");
    }, 900);
  }

  function pickVariant(variant: DesignVariant) {
    setSelected(variant);
    setStep("products");
  }

  function applyToProduct(productId: (typeof DESIGN_PRODUCTS)[number]["id"]) {
    if (!selected || !mode) return;
    const product = DESIGN_PRODUCTS.find((p) => p.id === productId)!;
    saveDesignPick({
      mode,
      prompt: selected.prompt,
      variant: selected,
      productId,
      createdAt: new Date().toISOString(),
    });
    router.push(productHrefForDesign(product, selected));
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {step === "mode" ? (
        <section>
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">
            Генерация дизайна
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
            Как создадим дизайн?
          </h1>
          <p className="mt-3 max-w-xl text-lg font-bold text-[var(--muted)]">
            Три режима — потом 4 варианта, затем нанесём на изделие.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <ModeCard
              title="По фотографии"
              hint="Загрузить фото"
              emoji="📷"
              tone="from-[#6bb8ff] to-[#3b6fd8]"
              onClick={() => chooseMode("photo")}
            />
            <ModeCard
              title="По описанию"
              hint="Например: кот в космосе"
              emoji="✍️"
              tone="from-[#ff7a5c] to-[#ff5a3c]"
              onClick={() => chooseMode("description")}
            />
            <ModeCard
              title="Удиви меня"
              hint="Сами предложим идеи"
              emoji="✨"
              tone="from-[#3db88a] to-[#2a9a72]"
              onClick={() => chooseMode("surprise")}
            />
          </div>
        </section>
      ) : null}

      {step === "input" && mode ? (
        <section className="rounded-[32px] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
          <button
            type="button"
            onClick={() => setStep("mode")}
            className="text-sm font-extrabold text-[var(--accent)] hover:underline"
          >
            ← Другой режим
          </button>

          <h2 className="mt-4 font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
            {mode === "photo"
              ? "По фотографии"
              : mode === "description"
                ? "По описанию"
                : "Удиви меня"}
          </h2>

          {mode === "photo" ? (
            <div className="mt-6">
              <label className="text-base font-extrabold">Фотография</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onPhoto(e.target.files?.[0] ?? null)
                }
                className="mt-2 block w-full text-sm font-bold text-[var(--muted)] file:mr-4 file:rounded-[16px] file:border-0 file:bg-[var(--accent-soft)] file:px-4 file:py-2 file:font-extrabold file:text-[var(--accent)]"
              />
              {photoDataUrl ? (
                <div className="mt-4 overflow-hidden rounded-[22px] border-2 border-[var(--line)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoDataUrl}
                    alt={photoName || "Фото"}
                    className="max-h-56 w-full object-cover"
                  />
                </div>
              ) : null}
              <label
                htmlFor="design-photo-hint"
                className="mt-5 block text-base font-extrabold"
              >
                Подсказка стиля{" "}
                <span className="font-bold text-[var(--muted)]">(необязательно)</span>
              </label>
              <input
                id="design-photo-hint"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Например: в стиле акварели"
                className="mt-2 w-full rounded-[22px] border-2 border-[var(--line)] px-5 py-4 text-lg font-bold outline-none focus:border-[var(--accent)]"
              />
            </div>
          ) : null}

          {mode === "description" ? (
            <div className="mt-6">
              <label htmlFor="design-prompt" className="text-base font-extrabold">
                Описание
              </label>
              <textarea
                id="design-prompt"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Кот в космосе"
                className="mt-2 w-full rounded-[22px] border-2 border-[var(--line)] px-5 py-4 text-lg font-bold outline-none focus:border-[var(--accent)]"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {["Кот в космосе", "Собака в очках", "Горы на закате"].map(
                  (example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => setPrompt(example)}
                      className="rounded-[14px] border border-[var(--line)] bg-[var(--surface-warm)] px-3 py-1.5 text-sm font-extrabold hover:border-[var(--accent)]"
                    >
                      {example}
                    </button>
                  ),
                )}
              </div>
            </div>
          ) : null}

          {mode === "surprise" ? (
            <div className="mt-6">
              <p className="text-base font-bold text-[var(--muted)]">
                Предложим неожиданные идеи. Можно подкрутить тему или оставить
                как есть.
              </p>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-4 w-full rounded-[22px] border-2 border-[var(--line)] px-5 py-4 text-lg font-bold outline-none focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={() => setPrompt(getSurprisePrompt())}
                className="mt-3 text-sm font-extrabold text-[var(--accent)] hover:underline"
              >
                Другая идея →
              </button>
            </div>
          ) : null}

          {error ? (
            <p className="mt-4 text-sm font-extrabold text-[var(--berry)]">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={runGenerate}
            className="mt-8 w-full rounded-[28px] bg-[var(--accent)] px-8 py-5 text-lg font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)]"
          >
            Сгенерировать 4 варианта
          </button>
        </section>
      ) : null}

      {step === "generating" ? (
        <section className="flex min-h-[40vh] flex-col items-center justify-center rounded-[32px] bg-white p-10 text-center shadow-[var(--shadow)]">
          <div
            className="size-16 animate-pulse rounded-full bg-gradient-to-br from-[#ff7a5c] to-[#ff5a3c]"
            aria-hidden
          />
          <p className="mt-6 font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Рисуем варианты…
          </p>
          <p className="mt-2 font-bold text-[var(--muted)]">
            Подбираем стили под ваш запрос
          </p>
        </section>
      ) : null}

      {step === "variants" ? (
        <section>
          <button
            type="button"
            onClick={() => setStep("input")}
            className="text-sm font-extrabold text-[var(--accent)] hover:underline"
          >
            ← Изменить запрос
          </button>
          <h2 className="mt-4 font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
            Выберите вариант
          </h2>
          <p className="mt-2 text-lg font-bold text-[var(--muted)]">
            4 идеи · «{variants[0]?.prompt}»
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {variants.map((variant, index) => (
              <li key={variant.id}>
                <button
                  type="button"
                  onClick={() => pickVariant(variant)}
                  className="group w-full overflow-hidden rounded-[28px] bg-white text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)]"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div
                    className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${variant.gradient}`}
                  >
                    {variant.photoDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={variant.photoDataUrl}
                        alt=""
                        className="absolute inset-0 size-full object-cover opacity-55 mix-blend-luminosity"
                      />
                    ) : null}
                    <span className="relative text-6xl drop-shadow-lg" aria-hidden>
                      {variant.emoji}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
                      {variant.styleTag}
                    </p>
                    <h3 className="mt-1 font-[family-name:var(--font-unbounded)] text-xl font-semibold">
                      {variant.title}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                      {variant.subtitle}
                    </p>
                    <span className="mt-4 inline-flex rounded-[16px] bg-[var(--accent)] px-4 py-2 text-sm font-extrabold text-white transition group-hover:bg-[var(--accent-hover)]">
                      Выбрать →
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={runGenerate}
            className="mt-8 text-base font-extrabold text-[var(--accent)] hover:underline"
          >
            Сгенерировать ещё раз
          </button>
        </section>
      ) : null}

      {step === "products" && selected ? (
        <section>
          <button
            type="button"
            onClick={() => setStep("variants")}
            className="text-sm font-extrabold text-[var(--accent)] hover:underline"
          >
            ← Другой вариант дизайна
          </button>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <div
              className={`relative flex min-h-[160px] flex-1 items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-br ${selected.gradient}`}
            >
              {selected.photoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.photoDataUrl}
                  alt=""
                  className="absolute inset-0 size-full object-cover opacity-50"
                />
              ) : null}
              <span className="relative text-5xl" aria-hidden>
                {selected.emoji}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center rounded-[28px] bg-white p-6 shadow-[var(--shadow-soft)]">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
                Выбранный дизайн
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
                {selected.title}
              </h2>
              <p className="mt-2 text-sm font-bold text-[var(--muted)]">
                {selected.prompt}
              </p>
            </div>
          </div>

          <h3 className="mt-10 font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
            Куда нанести?
          </h3>
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            Выберите изделие — дальше параметры и цена
          </p>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DESIGN_PRODUCTS.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => applyToProduct(product.id)}
                  className="flex min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-[24px] bg-white p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)]"
                >
                  <span className="text-3xl" aria-hidden>
                    {product.emoji}
                  </span>
                  <span className="text-center text-sm font-extrabold sm:text-base">
                    {product.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mt-10 text-center text-sm font-bold text-[var(--muted)]">
        Нужен готовый набор без дизайна?{" "}
        <Link href="/ideas" className="text-[var(--accent)] hover:underline">
          К подбору подарков
        </Link>
      </p>
    </div>
  );
}

function ModeCard({
  title,
  hint,
  emoji,
  tone,
  onClick,
}: {
  title: string;
  hint: string;
  emoji: string;
  tone: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[28px] bg-white p-6 text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)]"
    >
      <div
        className={`flex size-14 items-center justify-center rounded-[18px] bg-gradient-to-br text-2xl text-white ${tone}`}
        aria-hidden
      >
        {emoji}
      </div>
      <div>
        <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
          {title}
        </h2>
        <p className="mt-1 text-sm font-bold text-[var(--muted)]">{hint}</p>
      </div>
    </button>
  );
}
