"use client";

import { FormEvent, useRef, useState, type ChangeEvent } from "react";

const EXAMPLES = [
  "Хочу фигурку кота",
  "Хочу 50 кружек",
  "Хочу вышить логотип",
  "Хочу шахматы с лицами друзей",
  "Хочу деревянную карту мира",
] as const;

type AttachKey = "photos" | "logo" | "example";

type IdeaFormProps = {
  initialIdea?: string;
};

export function IdeaForm({ initialIdea = "" }: IdeaFormProps) {
  const [idea, setIdea] = useState(initialIdea);
  const [sent, setSent] = useState(false);
  const [files, setFiles] = useState<Record<AttachKey, string | null>>({
    photos: null,
    logo: null,
    example: null,
  });

  const photoRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const exampleRef = useRef<HTMLInputElement>(null);

  function onFile(
    key: AttachKey,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const list = event.target.files;
    if (!list?.length) return;
    if (key === "photos" && list.length > 1) {
      setFiles((prev) => ({
        ...prev,
        photos: `${list.length} файла`,
      }));
      return;
    }
    setFiles((prev) => ({ ...prev, [key]: list[0].name }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!idea.trim()) return;
    try {
      const leads = JSON.parse(
        localStorage.getItem("gift-contact-leads") || "[]",
      ) as unknown[];
      leads.unshift({
        idea: idea.trim(),
        files,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(
        "gift-contact-leads",
        JSON.stringify(leads.slice(0, 50)),
      );
    } catch {
      /* ignore */
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-10 rounded-[28px] bg-white px-6 py-12 text-center shadow-[var(--shadow-soft)] sm:px-10">
        <div
          className="mx-auto flex size-20 items-center justify-center rounded-full bg-[var(--mint)] text-4xl text-white"
          aria-hidden
        >
          ✓
        </div>
        <h2 className="mt-8 font-[family-name:var(--font-unbounded)] text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
          Заявку сохранили
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-xl font-bold leading-snug text-[var(--muted)] sm:text-2xl">
          Текст идеи записан. Файлы на этом шаге не загружаются на сервер —
          при необходимости приложите их в переписке. Мы свяжемся по контактам,
          если оставите их в кабинете или Telegram.
        </p>
        <a
          href="/create?scenario=custom"
          className="mt-8 inline-flex rounded-[22px] bg-[var(--accent)] px-6 py-3 font-extrabold text-white"
        >
          Или подобрать варианты сейчас
        </a>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-8 sm:mt-10" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="idea"
          className="block font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl"
        >
          Что вы хотите сделать?
        </label>
        <p className="mt-2 text-lg font-bold text-[var(--muted)]">
          Можно написать абсолютно всё
        </p>
        <textarea
          id="idea"
          name="idea"
          required
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          rows={6}
          placeholder="Опишите идею своими словами..."
          className="mt-5 w-full resize-none rounded-[28px] border-2 border-[var(--line)] bg-white px-5 py-5 text-xl font-bold leading-relaxed outline-none transition placeholder:font-bold placeholder:text-[var(--muted)] focus:border-[var(--accent)] sm:px-7 sm:py-6 sm:text-2xl"
        />

        <div className="mt-4 flex flex-wrap gap-2.5">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setIdea(example)}
              className="rounded-[16px] bg-white px-4 py-2.5 text-sm font-extrabold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] sm:text-base"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-[family-name:var(--font-unbounded)] text-xl font-semibold sm:text-2xl">
          Прикрепите файлы
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <AttachButton
            label="Прикрепить фотографии"
            fileName={files.photos}
            onClick={() => photoRef.current?.click()}
          />
          <AttachButton
            label="Прикрепить логотип"
            fileName={files.logo}
            onClick={() => logoRef.current?.click()}
          />
          <AttachButton
            label="Прикрепить пример"
            fileName={files.example}
            onClick={() => exampleRef.current?.click()}
          />
        </div>

        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => onFile("photos", event)}
        />
        <input
          ref={logoRef}
          type="file"
          accept="image/*,.svg,.pdf"
          className="hidden"
          onChange={(event) => onFile("logo", event)}
        />
        <input
          ref={exampleRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(event) => onFile("example", event)}
        />
        <p className="mt-3 text-sm font-bold text-[var(--muted)]">
          Пока только интерфейс — файлы никуда не отправляются.
        </p>
      </div>

      <button
        type="submit"
        disabled={!idea.trim()}
        className="w-full rounded-[26px] bg-[var(--accent)] px-8 py-5 text-xl font-extrabold text-white transition hover:bg-[var(--accent-hover)] disabled:pointer-events-none disabled:opacity-45 sm:w-auto sm:min-w-[320px] sm:text-2xl"
      >
        Получить предложение
      </button>
    </form>
  );
}

function AttachButton({
  label,
  fileName,
  onClick,
}: {
  label: string;
  fileName: string | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[120px] flex-col items-start justify-between rounded-[24px] border-2 border-dashed border-[var(--line)] bg-white px-5 py-5 text-left transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/40"
    >
      <span className="text-2xl" aria-hidden>
        📎
      </span>
      <span className="mt-3 text-base font-extrabold leading-snug sm:text-lg">
        {fileName ? fileName : label}
      </span>
    </button>
  );
}
