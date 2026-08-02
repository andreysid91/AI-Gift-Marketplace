"use client";

import { useRouter } from "next/navigation";

const POPULAR = [
  {
    title: "Кружка с фото",
    price: "от 890 ₽",
    prompt: "Кружка с фото",
    gradient: "from-[#ffb4a2] to-[#ff6b4a]",
  },
  {
    title: "Футболка с принтом",
    price: "от 1 490 ₽",
    prompt: "Футболка с персональным принтом",
    gradient: "from-[#ffd59a] to-[#ff9f43]",
  },
  {
    title: "Холст-портрет",
    price: "от 2 490 ₽",
    prompt: "Холст с портретом",
    gradient: "from-[#f7b6c8] to-[#e84d6f]",
  },
  {
    title: "Подарочный набор",
    price: "от 2 990 ₽",
    prompt: "Готовый подарочный набор с кружкой и сладостями",
    gradient: "from-[#9de7c8] to-[#3db88a]",
  },
] as const;

export function PopularGifts() {
  const router = useRouter();

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {POPULAR.map((gift) => (
        <button
          key={gift.title}
          type="button"
          onClick={() =>
            router.push(`/ideas?q=${encodeURIComponent(gift.prompt)}`)
          }
          className="group overflow-hidden rounded-[32px] bg-white text-left shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)]"
        >
          <div
            className={`flex h-48 items-end bg-gradient-to-br ${gift.gradient} px-6 pb-5`}
          >
            <span className="rounded-2xl bg-white/90 px-4 py-2 text-sm font-extrabold text-[var(--foreground)]">
              Хит
            </span>
          </div>
          <div className="px-6 py-5">
            <h3 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--foreground)]">
              {gift.title}
            </h3>
            <p className="mt-2 text-lg font-extrabold text-[var(--accent)]">
              {gift.price}
            </p>
            <p className="mt-4 text-base font-bold text-[var(--muted)] transition group-hover:text-[var(--foreground)]">
              Заказать →
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
