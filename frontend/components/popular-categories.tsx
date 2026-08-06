"use client";

import { useRouter } from "next/navigation";

const POPULAR_CATEGORIES = [
  { label: "Маме", prompt: "Подарок маме" },
  { label: "Папе", prompt: "Подарок папе" },
  { label: "Жене", prompt: "Подарок жене" },
  { label: "Мужу", prompt: "Подарок мужу" },
  { label: "Ребенку", prompt: "Подарок ребенку" },
  { label: "Начальнику", prompt: "Подарок начальнику" },
  { label: "Другу", prompt: "Подарок другу" },
] as const;

export function PopularCategories() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-3">
      {POPULAR_CATEGORIES.map((category) => (
        <button
          key={category.label}
          type="button"
          onClick={() =>
            router.push(`/ideas?q=${encodeURIComponent(category.prompt)}`)
          }
          className="rounded-[18px] bg-white px-4 py-2.5 text-sm font-extrabold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] sm:px-5 sm:py-3 sm:text-base"
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
