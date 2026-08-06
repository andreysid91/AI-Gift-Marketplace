"use client";

import {
  effectiveCardId,
  getCardOption,
  getPackagingOption,
  type GiftCheckoutDraft,
} from "../../lib/gift-checkout";

type GiftCheckoutPreviewProps = {
  draft: GiftCheckoutDraft;
  compact?: boolean;
};

export function GiftCheckoutPreview({
  draft,
  compact = false,
}: GiftCheckoutPreviewProps) {
  const packaging = getPackagingOption(draft.packagingId);
  const card = getCardOption(effectiveCardId(draft));
  const primary = draft.giftLines[0];
  const hasCard = card.id !== "card-none";
  const hasMessage = Boolean(draft.messageText.trim()) && hasCard;

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] ${
        compact ? "p-4" : "p-6 sm:p-8"
      }`}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#ffc9b0_0%,transparent_50%),radial-gradient(ellipse_at_90%_20%,#ffd0c4_0%,transparent_45%),linear-gradient(165deg,#fff8f3_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
          Превью подарка
        </p>

        <div
          className={`mt-4 grid items-end gap-4 ${
            hasCard ? "sm:grid-cols-[1.1fr_0.9fr]" : ""
          }`}
        >
          {/* Gift in packaging */}
          <div className="relative">
            <div
              className={`mx-auto flex aspect-square max-w-[220px] flex-col items-center justify-center rounded-[28px] bg-gradient-to-br ${packaging.tone} shadow-[var(--shadow)] transition duration-500`}
            >
              <span
                className={`${compact ? "text-5xl" : "text-7xl"} drop-shadow-sm`}
                aria-hidden
              >
                {primary?.emoji ?? "🎁"}
              </span>
              <span className="mt-3 text-4xl" aria-hidden>
                {packaging.id !== "pack-none" ? packaging.emoji : ""}
              </span>
            </div>
            <p className="mt-3 text-center font-[family-name:var(--font-unbounded)] text-lg font-semibold">
              {primary?.title ?? draft.query}
            </p>
            <p className="text-center text-sm font-bold text-[var(--muted)]">
              {packaging.id === "pack-none"
                ? "Без упаковки"
                : `Упаковка: ${packaging.title}`}
            </p>
          </div>

          {hasCard ? (
            <div
              className={`rounded-[22px] border border-[var(--line)] bg-gradient-to-br ${card.tone} p-4 shadow-[var(--shadow-soft)]`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  {card.emoji}
                </span>
                <p className="font-[family-name:var(--font-unbounded)] text-sm font-semibold">
                  {card.title}
                </p>
              </div>
              {hasMessage ? (
                <p className="mt-3 max-h-36 overflow-y-auto whitespace-pre-wrap text-sm font-bold leading-relaxed text-[var(--foreground)]">
                  {draft.messageText}
                </p>
              ) : (
                <p className="mt-3 text-sm font-bold text-[var(--muted)]">
                  Текст поздравления появится здесь
                </p>
              )}
            </div>
          ) : null}
        </div>

        {draft.giftLines.length > 1 ? (
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {draft.giftLines.slice(1).map((line) => (
              <li
                key={`${line.id}-${line.title}`}
                className="rounded-full bg-white/80 px-3 py-1 text-sm font-extrabold shadow-sm"
              >
                {line.emoji} {line.title}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
