"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  calculateConfigurationPrice,
  defaultSelections,
  type ProductSelections,
} from "../../lib/product-configurator";
import { formatRub } from "../../lib/scenario-catalog";
import { saveGiftOrder } from "../../lib/gift-order";
import type { GiftPageModel } from "../../lib/gift-page";
import {
  inspirationCreateHref,
  SOURCE_LABELS,
} from "../../lib/inspiration-engine";
import { getGiftScore, getGiftScoreOrFallback } from "../../lib/gift-score";
import { GiftScoreBadge } from "../gift-score-badge";

type GiftPageViewProps = {
  model: GiftPageModel;
};

export function GiftPageView({ model }: GiftPageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const b = model.blocks;

  const [mediaIndex, setMediaIndex] = useState(0);
  const [selections, setSelections] = useState<ProductSelections>(() =>
    defaultSelections(model.schema),
  );
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [slotId, setSlotId] = useState(
    model.slots.find((s) => s.available)?.id ?? "tomorrow",
  );

  const priced = useMemo(
    () => calculateConfigurationPrice(model.schema, selections),
    [model.schema, selections],
  );

  const addonsTotal = model.addons
    .filter((a) => addonIds.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  const grandTotal = priced.lineTotal + addonsTotal;
  const activeMedia = model.media[mediaIndex] ?? model.media[0];
  const metrics =
    getGiftScore(model.id) ??
    getGiftScore(model.productId) ??
    getGiftScoreOrFallback(model.productId, {
      title: model.title,
      emoji: model.emoji,
      tone: model.tone,
    });

  function updateParam(paramId: string, value: string | number) {
    setSelections((prev) => ({ ...prev, [paramId]: value }));
  }

  function toggleAddon(id: string) {
    setAddonIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function orderNow() {
    const addonLines = model.addons
      .filter((a) => addonIds.includes(a.id))
      .map((a) => ({
        id: a.id,
        title: a.title,
        price: a.price,
        emoji: a.emoji,
        kind: "addon" as const,
      }));

    const slotLabel =
      model.slots.find((s) => s.id === slotId)?.label ?? "Без слота";

    saveGiftOrder({
      query: `${model.title} · готовность: ${slotLabel}`,
      items: [
        {
          id: model.productId,
          title: model.title,
          price: priced.lineTotal,
          emoji: model.emoji,
          kind: "product",
          qty: priced.qty,
          unitPrice: priced.unitPrice,
          configSummary: [priced.summary, `Срок: ${slotLabel}`]
            .filter(Boolean)
            .join(" · "),
          selections: { ...priced.selections, slot: slotId },
        },
        ...addonLines,
      ],
      total: grandTotal,
      createdAt: new Date().toISOString(),
    });

    const params = new URLSearchParams({
      from: "gift",
      q: model.title,
      id: model.id,
    });
    router.push(`/checkout?${params.toString()}`);
  }

  const from = searchParams.get("from");
  const backHref =
    from === "ideas"
      ? `/ideas${searchParams.get("q") ? `?q=${encodeURIComponent(searchParams.get("q")!)}` : ""}`
      : from === "popular"
        ? "/popular"
        : from === "reviews"
          ? "/reviews"
          : "/";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_50%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-6 pb-28 sm:px-8 sm:py-10 sm:pb-32">
        <Link
          href={backHref}
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← Назад
        </Link>

        {/* 1–4 Media + hero */}
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-10">
          {b.media ? (
            <div>
              <div
                className={`relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[36px] bg-gradient-to-br ${activeMedia.tone} shadow-[var(--shadow)] sm:min-h-[420px]`}
              >
                {activeMedia.imageUrl ? (
                  <Image
                    src={activeMedia.imageUrl}
                    alt={activeMedia.label ?? model.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={mediaIndex === 0}
                  />
                ) : (
                  <span className="text-9xl drop-shadow-sm" aria-hidden>
                    {activeMedia.emoji}
                  </span>
                )}
                {activeMedia.kind === "video" ? (
                  <span className="absolute bottom-4 left-4 rounded-[14px] bg-white/95 px-3 py-2 text-sm font-extrabold">
                    Превью вручения · скоро видео
                  </span>
                ) : activeMedia.label ? (
                  <span className="absolute bottom-4 left-4 rounded-[14px] bg-white/95 px-3 py-2 text-sm font-extrabold">
                    {activeMedia.label}
                  </span>
                ) : null}
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {model.media.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMediaIndex(index)}
                    className={`relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-gradient-to-br ${item.tone} text-2xl transition ${
                      index === mediaIndex
                        ? "ring-2 ring-[var(--accent)] ring-offset-2"
                        : "opacity-80 hover:opacity-100"
                    }`}
                    aria-label={item.label ?? `Медиа ${index + 1}`}
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.label ?? ""}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      item.emoji
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {b.hero ? (
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
                Подарок
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-4xl font-semibold leading-tight sm:text-5xl">
                {model.title}
              </h1>
              <p className="mt-4 font-[family-name:var(--font-unbounded)] text-xl font-semibold text-[var(--accent)] sm:text-2xl">
                {model.emotion}
              </p>
              <p className="mt-3 text-lg font-bold text-[var(--muted)]">
                {model.description}
              </p>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-extrabold text-[var(--muted)]">
                    Цена от
                  </p>
                  <p className="font-[family-name:var(--font-unbounded)] text-4xl font-semibold text-[var(--accent)]">
                    {formatRub(grandTotal)}
                  </p>
                  <p className="mt-1 text-base font-bold text-[var(--muted)]">
                    Срок · {model.leadTimeLabel}
                  </p>
                </div>
              </div>

              {b.giftScore ? (
                <div className="mt-5">
                  <GiftScoreBadge metrics={metrics} compact />
                  <Link
                    href="/ratings"
                    className="mt-2 inline-flex text-sm font-extrabold text-[var(--accent)] hover:underline"
                  >
                    Все рейтинги →
                  </Link>
                </div>
              ) : null}

              <div className="mt-5">
                <p className="text-sm font-extrabold">Когда сможем изготовить</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {model.slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSlotId(slot.id)}
                      className={`rounded-[16px] border-2 px-4 py-2.5 text-sm font-extrabold transition ${
                        !slot.available
                          ? "cursor-not-allowed opacity-40"
                          : slotId === slot.id
                            ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                            : "border-[var(--line)] bg-white hover:border-[var(--accent)]"
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={orderNow}
                  className="flex-1 rounded-[26px] bg-[var(--accent)] px-8 py-5 text-xl font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)]"
                >
                  Заказать
                </button>
                <Link
                  href={model.similarHref}
                  className="flex flex-1 items-center justify-center rounded-[26px] border-2 border-[var(--line)] bg-white px-8 py-5 text-xl font-extrabold transition hover:border-[var(--accent)]"
                >
                  Создать похожий
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {/* 5 Why */}
        {b.why ? (
          <Section title="Почему рекомендуем">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {model.why.map((reason) => (
                <li
                  key={reason.id}
                  className="flex items-center gap-3 rounded-[22px] bg-white px-5 py-4 shadow-[var(--shadow-soft)]"
                >
                  <span className="text-[var(--mint)]" aria-hidden>
                    ✔
                  </span>
                  <span className="font-extrabold">{reason.label}</span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {b.giftScore ? (
          <Section title="Рейтинг">
            <GiftScoreBadge metrics={metrics} />
          </Section>
        ) : null}

        {/* 6 Configurator */}
        {b.configurator ? (
          <Section title="Параметры">
            <div className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
              <div className="mb-4 flex justify-between gap-3">
                <p className="text-sm font-bold text-[var(--muted)]">
                  {priced.summary}
                </p>
                <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--accent)]">
                  {formatRub(priced.lineTotal)}
                </p>
              </div>
              <div className="space-y-5">
                {model.schema.params.map((param) => {
                  if (param.kind === "quantity") {
                    const qty = Number(
                      selections[param.id] ?? param.defaultQty ?? 1,
                    );
                    return (
                      <div key={param.id}>
                        <p className="text-sm font-extrabold">{param.label}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            type="button"
                            disabled={qty <= (param.min ?? 1)}
                            onClick={() => updateParam(param.id, qty - 1)}
                            className="flex size-11 items-center justify-center rounded-[16px] border-2 border-[var(--line)] text-xl font-extrabold disabled:opacity-40"
                          >
                            −
                          </button>
                          <span className="min-w-[2.5rem] text-center text-xl font-extrabold">
                            {qty}
                          </span>
                          <button
                            type="button"
                            disabled={qty >= (param.max ?? 99)}
                            onClick={() => updateParam(param.id, qty + 1)}
                            className="flex size-11 items-center justify-center rounded-[16px] border-2 border-[var(--line)] text-xl font-extrabold disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  }
                  const selected = String(
                    selections[param.id] ?? param.defaultOptionId ?? "",
                  );
                  return (
                    <div key={param.id}>
                      <p className="text-sm font-extrabold">{param.label}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(param.options ?? []).map((option) => {
                          const on = selected === option.id;
                          const delta = option.priceDelta ?? 0;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => updateParam(param.id, option.id)}
                              className={`rounded-[16px] border-2 px-3 py-2.5 text-sm font-extrabold ${
                                on
                                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                                  : "border-[var(--line)] bg-[var(--surface-warm)] hover:border-[var(--accent)]"
                              }`}
                            >
                              {option.label}
                              {delta !== 0 ? (
                                <span className="ml-1 opacity-80">
                                  {delta > 0 ? "+" : ""}
                                  {formatRub(delta)}
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        ) : null}

        {/* 7 Addons */}
        {b.addons ? (
          <Section title="Добавить к подарку">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {model.addons.map((addon) => {
                const on = addonIds.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`flex items-center gap-3 rounded-[22px] border-2 px-4 py-4 text-left transition ${
                      on
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--line)] bg-white hover:border-[var(--accent)]"
                    }`}
                  >
                    <span className="text-3xl" aria-hidden>
                      {addon.emoji}
                    </span>
                    <span>
                      <span className="block font-extrabold">{addon.title}</span>
                      <span className="text-sm font-bold text-[var(--accent)]">
                        {formatRub(addon.price)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>
        ) : null}

        {b.reviews ? (
          <Section title="Отзывы">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {model.reviews.map((review) => (
                <article
                  key={review.id}
                  className="overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]"
                >
                  <div
                    className={`flex h-40 items-center justify-center bg-gradient-to-br ${review.tone}`}
                  >
                    <span className="text-7xl" aria-hidden>
                      {review.emoji}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-[var(--secondary)]" aria-label={`${review.rating} из 5`}>
                      {"★".repeat(review.rating)}
                    </p>
                    <p className="mt-2 text-base font-bold leading-snug">
                      «{review.text}»
                    </p>
                    <p className="mt-3 text-sm font-extrabold text-[var(--muted)]">
                      {review.name} · {review.occasion}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        ) : null}

        {b.clientPhotos ? (
          <Section title="Фото клиентов">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {model.clientPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={`flex aspect-square flex-col items-center justify-center rounded-[24px] bg-gradient-to-br ${photo.tone} p-3 text-white`}
                >
                  <span className="text-5xl" aria-hidden>
                    {photo.emoji}
                  </span>
                  <span className="mt-2 text-center text-sm font-extrabold">
                    {photo.caption}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm font-bold text-[var(--muted)]">
              Фото от клиентов после вручения
            </p>
          </Section>
        ) : null}

        {b.handoverVideo ? (
          <Section title="Видео вручения">
            <div className="grid gap-4 sm:grid-cols-2">
              {model.handoverVideos.map((video) => (
                <div
                  key={video.id}
                  className={`flex min-h-[180px] flex-col items-center justify-center rounded-[28px] bg-gradient-to-br ${video.tone} p-6 text-white`}
                >
                  <span className="text-5xl" aria-hidden>
                    {video.emoji}
                  </span>
                  <p className="mt-3 font-[family-name:var(--font-unbounded)] text-xl font-semibold">
                    {video.title}
                  </p>
                  <p className="mt-1 text-sm font-bold text-white/70">
                    Момент вручения
                  </p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {b.similarIdeas ? (
          <Section title="Похожие идеи">
            <CardRow cards={model.similarIdeas} />
          </Section>
        ) : null}

        {b.similarGifts ? (
          <Section title="Похожие подарки">
            <CardRow cards={model.similarGifts} />
          </Section>
        ) : null}

        {b.inspiration ? (
          <Section title="Вдохновение">
            <p className="mb-4 text-base font-bold text-[var(--muted)]">
              Идеи рядом с этим подарком — сразу к похожему созданию
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {model.inspiration.map((idea) => (
                <Link
                  key={idea.id}
                  href={inspirationCreateHref(idea)}
                  className="group flex gap-4 rounded-[24px] bg-white p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
                >
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br ${idea.tone} text-3xl`}
                    aria-hidden
                  >
                    {idea.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-[family-name:var(--font-unbounded)] text-base font-semibold leading-snug">
                      {idea.title}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                      {idea.subtitle}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {idea.sources.slice(0, 3).map((src) => (
                        <span
                          key={src}
                          className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-extrabold text-[var(--muted)]"
                        >
                          {SOURCE_LABELS[src]}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-sm font-extrabold text-[var(--accent)] group-hover:underline">
                      Создать похожий →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        ) : null}

        {b.popularWeek ? (
          <Section title="Самые популярные этой недели">
            <CardRow cards={model.popularWeek} />
          </Section>
        ) : null}

        {b.comments ? (
          <Section title="Комментарии">
            <ul className="space-y-3">
              {model.comments.map((comment) => (
                <li
                  key={comment.id}
                  className="rounded-[22px] bg-white px-5 py-4 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex justify-between gap-3">
                    <p className="font-extrabold">{comment.author}</p>
                    <p className="text-sm font-bold text-[var(--muted)]">
                      {comment.at}
                    </p>
                  </div>
                  <p className="mt-2 text-base font-bold text-[var(--foreground)]">
                    {comment.text}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <div className="sticky bottom-4 z-20 mt-10 flex justify-center pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={orderNow}
            className="rounded-[26px] bg-[var(--accent)] px-10 py-4 text-lg font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)]"
          >
            Заказать · {formatRub(grandTotal)}
          </button>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 sm:mt-16">
      <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function CardRow({
  cards,
}: {
  cards: Array<{
    id: string;
    title: string;
    href: string;
    emoji: string;
    tone: string;
    subtitle?: string;
  }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={card.href}
          className="overflow-hidden rounded-[24px] bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)]"
        >
          <div
            className={`flex h-32 items-center justify-center bg-gradient-to-br ${card.tone}`}
          >
            <span className="text-5xl" aria-hidden>
              {card.emoji}
            </span>
          </div>
          <div className="p-4">
            <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-snug">
              {card.title}
            </p>
            {card.subtitle ? (
              <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                {card.subtitle}
              </p>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
