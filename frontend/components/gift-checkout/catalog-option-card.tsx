"use client";

import type { CheckoutCatalogOption } from "../../lib/gift-checkout";
import { formatRub } from "../../lib/scenario-catalog";

type CatalogOptionCardProps = {
  option: CheckoutCatalogOption;
  selected: boolean;
  onSelect: () => void;
};

export function CatalogOptionCard({
  option,
  selected,
  onSelect,
}: CatalogOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`overflow-hidden rounded-[24px] border-2 text-left transition ${
        selected
          ? "border-[var(--accent)] shadow-[var(--shadow)]"
          : "border-[var(--line)] hover:border-[var(--accent)]"
      }`}
    >
      <div
        className={`flex h-28 items-center justify-center bg-gradient-to-br ${option.tone} text-5xl`}
        aria-hidden
      >
        {option.emoji}
      </div>
      <div className="bg-white px-4 py-3">
        <p className="font-[family-name:var(--font-unbounded)] text-base font-semibold leading-snug">
          {option.title}
        </p>
        <p className="mt-1 text-sm font-bold text-[var(--muted)]">
          {option.subtitle}
        </p>
        <p className="mt-2 text-base font-extrabold text-[var(--accent)]">
          {option.price === 0 ? "Бесплатно" : `+ ${formatRub(option.price)}`}
        </p>
      </div>
    </button>
  );
}
