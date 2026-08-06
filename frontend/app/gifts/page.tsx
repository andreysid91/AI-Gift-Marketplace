import type { Metadata } from "next";
import { CanOrderCards } from "../../components/can-order-cards";
import { DirectionShell } from "../../components/direction-shell";
import { HomePrompt } from "../../components/home-prompt";
import { HowItWorks } from "../../components/how-it-works";
import { PopularCategories } from "../../components/popular-categories";

export const metadata: Metadata = {
  title: "Подарок — AI Gift",
  description: "Создайте уникальный персональный подарок по описанию или фото.",
};

export default function GiftsPage() {
  return (
    <DirectionShell
      brand="🎁 Подарок"
      title="Создайте уникальный подарок"
      subtitle="Опишите человека или загрузите фото — подберём готовые идеи."
      accentClass="text-[var(--accent)]"
    >
      <div className="mx-auto max-w-3xl">
        <HomePrompt />
      </div>

      <div className="mt-12">
        <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
          Популярные категории
        </h2>
        <div className="mt-4">
          <PopularCategories />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
          Что можно заказать
        </h2>
        <div className="mt-4">
          <CanOrderCards />
        </div>
      </div>

      <div className="mt-12 pb-6">
        <HowItWorks />
      </div>
    </DirectionShell>
  );
}
