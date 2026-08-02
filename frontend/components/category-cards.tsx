"use client";

import { useRouter } from "next/navigation";

const CATEGORIES = [
  {
    label: "Девушке",
    prompt: "Подарок девушке: романтика, уют и красивый дизайн",
    tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
  },
  {
    label: "Маме",
    prompt: "Подарок маме: тёплый, заботливый и персональный",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
  },
  {
    label: "Папе",
    prompt: "Подарок папе: практичный и стильный",
    tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
  },
  {
    label: "Ребёнку",
    prompt: "Подарок ребёнку: яркий, весёлый и безопасный",
    tone: "bg-[var(--mint-soft)] text-[var(--mint)]",
  },
  {
    label: "Любителю животных",
    prompt: "Подарок любителю животных с фото питомца",
    tone: "bg-[#e8f0ff] text-[#3b6fd8]",
  },
  {
    label: "День рождения",
    prompt: "Подарок на день рождения с вау-эффектом",
    tone: "bg-[#fff0c8] text-[#c48900]",
  },
] as const;

export function CategoryCards() {
  const router = useRouter();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((category) => (
        <button
          key={category.label}
          type="button"
          onClick={() =>
            router.push(`/ideas?q=${encodeURIComponent(category.prompt)}`)
          }
          className={`rounded-[28px] px-7 py-8 text-left shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)] ${category.tone}`}
        >
          <span className="block font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl">
            {category.label}
          </span>
          <span className="mt-3 block text-base font-bold opacity-75">
            Смотреть идеи
          </span>
        </button>
      ))}
    </div>
  );
}
