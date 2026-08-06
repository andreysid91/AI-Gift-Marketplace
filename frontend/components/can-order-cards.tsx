"use client";

import { useRouter } from "next/navigation";

const ORDER_OPTIONS = [
  {
    from: "Карикатура",
    to: "Кружка",
    prompt: "Карикатура на кружке",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
  },
  {
    from: "Фото",
    to: "Холст",
    prompt: "Холст с фото",
    tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
  },
  {
    from: "Фото",
    to: "Футболка",
    prompt: "Футболка с фото",
    tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
  },
  {
    from: "Гравировка",
    to: "Доска",
    prompt: "Гравировка на разделочной доске",
    tone: "bg-[#efe6d8] text-[#8a6a3d]",
  },
  {
    from: "Вышивка",
    to: "Халат",
    prompt: "Халат с вышивкой",
    tone: "bg-[var(--mint-soft)] text-[var(--mint)]",
  },
  {
    from: "3D",
    to: "Фигурка",
    prompt: "3D фигурка по фото",
    tone: "bg-[#e8f0ff] text-[#3b6fd8]",
  },
] as const;

export function CanOrderCards() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {ORDER_OPTIONS.map((item) => (
        <button
          key={`${item.from}-${item.to}`}
          type="button"
          onClick={() =>
            router.push(`/ideas?q=${encodeURIComponent(item.prompt)}`)
          }
          className={`rounded-[20px] px-3.5 py-4 text-left shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)] ${item.tone}`}
        >
          <span className="block text-xs font-extrabold opacity-80 sm:text-sm">
            {item.from}
          </span>
          <span className="mt-1.5 block font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-tight sm:text-xl">
            → {item.to}
          </span>
        </button>
      ))}
    </div>
  );
}
