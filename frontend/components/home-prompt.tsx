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
    <div className="w-full">
      <label
        htmlFor="gift-prompt"
        className="mb-2 block font-[family-name:var(--font-unbounded)] text-lg font-semibold text-[var(--foreground)] sm:text-xl"
      >
        Кому подарок?
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
        placeholder="Брату на день рождения..."
        rows={2}
        className="w-full resize-none rounded-[22px] border-2 border-[var(--line)] bg-white px-4 py-3.5 text-base font-bold leading-relaxed text-[var(--foreground)] shadow-[var(--shadow-soft)] outline-none transition placeholder:font-semibold placeholder:text-[var(--muted)] focus:border-[var(--accent)] sm:text-lg"
      />

      {photoName ? (
        <p className="mt-2 text-sm font-bold text-[var(--muted)]">
          Файл «{photoName}» отмечен для заказа. Сам файл передадите при
          оформлении / в переписке.
        </p>
      ) : null}

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={goToIdeas}
          className="rounded-[20px] bg-[var(--accent)] px-5 py-3.5 text-base font-extrabold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] active:translate-y-0 sm:text-lg"
        >
          Подобрать подарок
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-[20px] bg-[var(--secondary)] px-5 py-3.5 text-base font-extrabold text-white shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 sm:text-lg"
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
