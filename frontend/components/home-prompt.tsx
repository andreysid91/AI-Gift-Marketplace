"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";

export function HomePrompt() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");
  const [photoName, setPhotoName] = useState<string | null>(null);

  function goToIdeas() {
    const query = prompt.trim();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (photoName) params.set("photo", "1");
    const qs = params.toString();
    router.push(qs ? `/ideas?${qs}` : "/ideas");
  }

  function onPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    if (!prompt.trim()) {
      setPrompt("Подарок по фотографии");
    }
  }

  return (
    <div className="w-full animate-fade-rise-delay-2">
      <label htmlFor="gift-prompt" className="sr-only">
        Кому подарок
      </label>
      <textarea
        id="gift-prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            goToIdeas();
          }
        }}
        placeholder="Например: подарок брату на день рождения..."
        rows={3}
        className="w-full resize-none rounded-[28px] border-2 border-[var(--line)] bg-white px-6 py-5 text-lg font-bold leading-relaxed text-[var(--foreground)] shadow-[var(--shadow-soft)] outline-none transition placeholder:font-semibold placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
      />

      {photoName ? (
        <p className="mt-3 text-base font-bold text-[var(--mint)]">
          Фото добавлено: {photoName}
        </p>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={goToIdeas}
          className="animate-pulse-glow rounded-[24px] bg-[var(--accent)] px-6 py-5 text-lg font-extrabold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] active:translate-y-0"
        >
          Найти подарок
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-[24px] border-2 border-[var(--foreground)]/10 bg-[var(--secondary)] px-6 py-5 text-lg font-extrabold text-white shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
        >
          Загрузить фотографию
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPhotoChange}
      />
    </div>
  );
}
