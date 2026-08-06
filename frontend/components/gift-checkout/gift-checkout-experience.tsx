"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  applyCardSelection,
  applyMessageMode,
  calculateCheckoutPricing,
  CARD_OPTIONS,
  createDraftFromGiftOrder,
  createDraftFromIdea,
  effectiveCardId,
  generateGreetingMessage,
  GIFT_CHECKOUT_STEP_IDS,
  nextStep,
  PACKAGING_OPTIONS,
  prevStep,
  STEP_META,
  type GiftCheckoutDraft,
  type GiftCheckoutStepId,
  type MessageMode,
} from "../../lib/gift-checkout";
import {
  clearGiftOrder,
  loadGiftOrder,
} from "../../lib/gift-order";
import {
  createMockOrderFromCheckout,
  pushCheckoutOrder,
} from "../../lib/admin-mock";
import {
  ensureAccountFromOrder,
  loadCustomerSession,
  saveCustomerSession,
} from "../../lib/auth";
import {
  formatDeliveryMoney,
  getDeliveryMethod,
  type DeliveryMethodId,
} from "../../lib/delivery";
import { MOCK_IDEAS } from "../../lib/mock-ideas";
import {
  appendGiftHistory,
  getRecipientById,
  loadSelectedRecipientId,
  saveSelectedRecipientId,
} from "../../lib/recipients";
import { formatRub } from "../../lib/scenario-catalog";
import { CatalogOptionCard } from "./catalog-option-card";
import { GiftCheckoutPreview } from "./gift-checkout-preview";

type GiftCheckoutExperienceProps = {
  productId?: string;
  fromGift?: boolean;
  giftQuery?: string;
  recipientId?: string;
};

const RECEIVE_METHODS: Array<{
  id: DeliveryMethodId;
  title: string;
  hint: string;
}> = [
  { id: "pickup", title: "Самовывоз", hint: "Бесплатно" },
  { id: "delivery", title: "Доставка", hint: "от 400 ₽" },
];

const MESSAGE_MODES: Array<{
  id: MessageMode;
  title: string;
  hint: string;
}> = [
  {
    id: "manual",
    title: "Написать самому",
    hint: "Свой текст на открытке",
  },
  {
    id: "ai",
    title: "Сгенерировать текст",
    hint: "Черновик за секунду",
  },
  {
    id: "none",
    title: "Без открытки",
    hint: "Только подарок и упаковка",
  },
];

export function GiftCheckoutExperience({
  productId,
  fromGift = false,
  giftQuery,
  recipientId,
}: GiftCheckoutExperienceProps) {
  const router = useRouter();
  const idea = useMemo(
    () => MOCK_IDEAS.find((item) => item.id === productId) ?? MOCK_IDEAS[0],
    [productId],
  );

  const [ready, setReady] = useState(false);
  const [emptyCart, setEmptyCart] = useState(false);
  const [step, setStep] = useState<GiftCheckoutStepId>("verify");
  const [draft, setDraft] = useState<GiftCheckoutDraft | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);

  useEffect(() => {
    if (recipientId) saveSelectedRecipientId(recipientId);
  }, [recipientId]);

  useEffect(() => {
    const session = loadCustomerSession();
    const contact = {
      name: session?.name ?? "",
      phone: session?.phone ?? "",
    };

    const order = loadGiftOrder();
    const hasOrder = Boolean(order && order.items.length > 0);
    const hasProduct = Boolean(productId?.trim());

    if (fromGift && !hasOrder && !hasProduct) {
      setEmptyCart(true);
      setDraft(null);
      setReady(true);
      return;
    }

    setEmptyCart(false);

    let next: GiftCheckoutDraft;
    if (hasOrder && order) {
      next = createDraftFromGiftOrder(order, contact);
      if (giftQuery) next = { ...next, query: giftQuery || next.query };
    } else {
      const ideaMatch =
        MOCK_IDEAS.find((item) => item.id === productId) ?? idea;
      next = createDraftFromIdea({
        id: productId || ideaMatch.id,
        title: ideaMatch.title,
        price: ideaMatch.price,
        emoji: ideaMatch.emoji,
        query: giftQuery || ideaMatch.title,
        contact,
      });
    }

    setDraft(next);
    setReady(true);
  }, [fromGift, giftQuery, idea, productId]);

  const pricing = useMemo(
    () => (draft ? calculateCheckoutPricing(draft) : null),
    [draft],
  );

  const stepMeta = STEP_META[step];
  const stepIndex = GIFT_CHECKOUT_STEP_IDS.indexOf(step);
  const deliveryMethod = draft
    ? getDeliveryMethod(draft.contact.method)
    : getDeliveryMethod("pickup");

  function patchDraft(updater: (d: GiftCheckoutDraft) => GiftCheckoutDraft) {
    setDraft((prev) => (prev ? updater(prev) : prev));
  }

  function goNext() {
    const n = nextStep(step);
    if (n) setStep(n);
  }

  function goBack() {
    const p = prevStep(step);
    if (p) setStep(p);
  }

  function runAiMessage() {
    setAiBusy(true);
    window.setTimeout(() => {
      setDraft((prev) => {
        if (!prev) return prev;
        const text = generateGreetingMessage({
          giftTitle: prev.giftLines[0]?.title,
          occasionHint: prev.query,
        });
        return applyMessageMode({ ...prev, messageText: text }, "ai");
      });
      setAiBusy(false);
    }, 450);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !pricing) return;
    if (deliveryMethod.needsAddress && !draft.contact.address.trim()) return;
    setSubmitting(true);

    const cardId = effectiveCardId(draft);
    const pack = calculateCheckoutPricing(draft);
    const packagingLine =
      pack.packaging > 0 || draft.packagingId !== "pack-none"
        ? pack.lines.find((l) => l.id === draft.packagingId)
        : null;
    const cardLine =
      draft.messageMode !== "none" && cardId !== "card-none"
        ? pack.lines.find((l) => l.id === cardId)
        : null;

    const commentParts = [
      draft.contact.telegram.trim()
        ? `Telegram: ${draft.contact.telegram.trim()}`
        : "",
      draft.contact.deliveryDate
        ? `Дата вручения: ${draft.contact.deliveryDate}`
        : "",
      draft.messageMode !== "none" && draft.messageText.trim()
        ? `Открытка (${draft.messageMode === "ai" ? "автотекст" : "свой текст"}):\n${draft.messageText.trim()}`
        : "Без открытки",
      draft.contact.comment.trim(),
    ].filter(Boolean);

    const addons = [
      ...(packagingLine
        ? [
            {
              id: packagingLine.id,
              title: packagingLine.title,
              price: packagingLine.price,
              emoji: packagingLine.emoji,
            },
          ]
        : []),
      ...(cardLine
        ? [
            {
              id: cardLine.id,
              title: cardLine.title,
              price: cardLine.price,
              emoji: cardLine.emoji,
            },
          ]
        : []),
      ...draft.giftLines
        .filter((line) => line.kind === "addon")
        .map((line) => ({
          id: line.id,
          title: line.title,
          price: line.price,
          emoji: line.emoji,
        })),
    ];

    const products = draft.giftLines
      .filter((line) => line.kind !== "addon")
      .map((line) => ({
        id: line.id,
        title: line.title,
        price: line.price,
        emoji: line.emoji,
      }));

    const order = createMockOrderFromCheckout({
      title: draft.query || "Подарочный набор",
      clientName: draft.contact.name.trim() || "Клиент",
      phone: draft.contact.phone.trim() || "—",
      comment: commentParts.join("\n\n"),
      products:
        products.length > 0
          ? products
          : [
              {
                id: idea.id,
                title: idea.title,
                price: idea.price,
                emoji: idea.emoji,
              },
            ],
      addons,
      total: pricing.total,
      address: deliveryMethod.needsAddress
        ? draft.contact.address.trim() || "Адрес уточняется"
        : "Самовывоз",
      deliveryMethodId: draft.contact.method,
      type: "gift",
    });
    pushCheckoutOrder(order);

    const account = ensureAccountFromOrder({
      name: draft.contact.name.trim() || "Клиент",
      phone: draft.contact.phone.trim(),
      email: null,
      orderId: order.id,
    });
    saveCustomerSession({
      accountId: account.id,
      name: account.name,
      phone: account.phone,
      email: account.email,
      provider: "phone",
      signedInAt: new Date().toISOString(),
    });

    const rid = loadSelectedRecipientId() || recipientId;
    if (rid) {
      const person = getRecipientById(rid);
      if (person && person.accountId === account.id) {
        appendGiftHistory(rid, {
          orderId: order.id,
          title: order.title,
          date: new Date().toISOString().slice(0, 10),
          cost: order.total,
          photoDataUrl: null,
          review: "",
          itemIds: [
            ...order.products.map((p) => p.id),
            ...order.addons.map((a) => a.id),
          ],
        });
      }
    }

    clearGiftOrder();

    const params = new URLSearchParams({
      order: order.id,
      method: draft.contact.method,
      account: "1",
      total: String(pricing.total),
      name: draft.contact.name.trim() || "Клиент",
      from: "gift",
    });
    router.push(`/success?${params.toString()}`);
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] font-bold text-[var(--muted)]">
        Загрузка оформления…
      </main>
    );
  }

  if (emptyCart || !draft || !pricing) {
    return (
      <main className="relative min-h-screen overflow-x-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
        />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-10">
          <div className="rounded-[28px] bg-white p-8 shadow-[var(--shadow)]">
            <h1 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
              Корзина пуста
            </h1>
            <p className="mt-3 text-base font-bold text-[var(--muted)]">
              Выберите подарок ещё раз — затем оформите заказ.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={productId ? `/gift?id=${encodeURIComponent(productId)}` : "/"}
                className="rounded-[22px] bg-[var(--accent)] px-6 py-3 font-extrabold text-white"
              >
                К подаркам
              </Link>
              <Link
                href="/popular"
                className="rounded-[22px] border-2 border-[var(--line)] px-6 py-3 font-extrabold"
              >
                Популярное
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const fieldClass =
    "mt-2 w-full rounded-[22px] border-2 border-[var(--line)] bg-white px-5 py-4 text-lg font-bold outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]";

  const backHref = productId
    ? `/gift?id=${encodeURIComponent(productId)}`
    : fromGift
      ? `/ideas?q=${encodeURIComponent(draft.query || giftQuery || "")}`
      : "/";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,#ffc9b0_0%,transparent_45%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          {step === "verify" ? (
            <Link
              href={backHref}
              className="text-base font-extrabold text-[var(--accent)] hover:underline"
            >
              ← Назад
            </Link>
          ) : (
            <button
              type="button"
              onClick={goBack}
              className="text-base font-extrabold text-[var(--accent)] hover:underline"
            >
              ← Назад
            </button>
          )}
          <p className="text-sm font-extrabold text-[var(--muted)]">
            Шаг {stepMeta.index} из {GIFT_CHECKOUT_STEP_IDS.length}
          </p>
        </div>

        {/* Progress */}
        <div className="mt-4 flex gap-1.5">
          {GIFT_CHECKOUT_STEP_IDS.map((id, i) => (
            <div
              key={id}
              className={`h-1.5 flex-1 rounded-full transition ${
                i <= stepIndex
                  ? "bg-[var(--accent)]"
                  : "bg-[var(--line)]"
              }`}
            />
          ))}
        </div>

        <h1 className="mt-4 font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
          {stepMeta.title}
        </h1>
        <p className="mt-1 text-base font-bold text-[var(--muted)]">
          {stepMeta.hint}
        </p>

        <div className="mt-5 grid flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-5">
          <section className="rounded-[28px] bg-white p-4 shadow-[var(--shadow-soft)] sm:p-5">
            {step === "verify" ? (
              <div className="space-y-3">
                <p className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
                  {draft.query}
                </p>
                <ul className="space-y-2">
                  {draft.giftLines.map((line) => (
                    <li
                      key={`${line.id}-${line.title}`}
                      className="flex items-center gap-3 rounded-[20px] bg-[var(--surface-warm)] px-4 py-3"
                    >
                      <span className="text-3xl" aria-hidden>
                        {line.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold">{line.title}</p>
                        {line.configSummary ? (
                          <p className="text-sm font-bold text-[var(--muted)]">
                            {line.configSummary}
                          </p>
                        ) : null}
                      </div>
                      <p className="shrink-0 font-extrabold text-[var(--accent)]">
                        {formatRub(line.price)}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-bold text-[var(--muted)]">
                  Дальше — упаковка, открытка и поздравление. Оплаты на сайте нет:
                  отправите заявку, мы свяжемся и подтвердим заказ.
                </p>
              </div>
            ) : null}

            {step === "packaging" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {PACKAGING_OPTIONS.map((option) => (
                  <CatalogOptionCard
                    key={option.id}
                    option={option}
                    selected={draft.packagingId === option.id}
                    onSelect={() =>
                      patchDraft((d) => ({ ...d, packagingId: option.id }))
                    }
                  />
                ))}
              </div>
            ) : null}

            {step === "card" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {CARD_OPTIONS.map((option) => (
                  <CatalogOptionCard
                    key={option.id}
                    option={option}
                    selected={draft.cardId === option.id}
                    onSelect={() =>
                      patchDraft((d) => applyCardSelection(d, option.id))
                    }
                  />
                ))}
              </div>
            ) : null}

            {step === "message" ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {MESSAGE_MODES.map((mode) => {
                    const on = draft.messageMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          if (mode.id === "ai") {
                            patchDraft((d) => applyMessageMode(d, "ai"));
                            runAiMessage();
                          } else {
                            patchDraft((d) => applyMessageMode(d, mode.id));
                          }
                        }}
                        className={`rounded-[22px] border-2 px-4 py-4 text-left transition ${
                          on
                            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                            : "border-[var(--line)] bg-[var(--surface-warm)] hover:border-[var(--accent)]"
                        }`}
                      >
                        <span className="block font-[family-name:var(--font-unbounded)] text-base font-semibold">
                          {mode.title}
                        </span>
                        <span className="mt-1 block text-sm font-bold text-[var(--muted)]">
                          {mode.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {draft.messageMode !== "none" ? (
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-extrabold"
                      >
                        Текст открытки
                      </label>
                      {draft.messageMode === "ai" ? (
                        <button
                          type="button"
                          disabled={aiBusy}
                          onClick={runAiMessage}
                          className="text-sm font-extrabold text-[var(--accent)] hover:underline disabled:opacity-60"
                        >
                          {aiBusy ? "Генерируем…" : "Ещё вариант"}
                        </button>
                      ) : null}
                    </div>
                    <textarea
                      id="message"
                      rows={6}
                      value={draft.messageText}
                      onChange={(e) =>
                        patchDraft((d) => ({
                          ...d,
                          messageText: e.target.value,
                          messageMode:
                            d.messageMode === "none" ? "manual" : d.messageMode,
                        }))
                      }
                      placeholder="Напишите тёплые слова…"
                      className={`${fieldClass} resize-y`}
                    />
                  </div>
                ) : (
                  <p className="rounded-[20px] bg-[var(--surface-warm)] px-4 py-3 text-base font-bold text-[var(--muted)]">
                    Открытку не добавляем — в итог войдут подарок и выбранная
                    упаковка.
                  </p>
                )}
              </div>
            ) : null}

            {step === "review" ? (
              <form id="checkout-review" onSubmit={onSubmit} className="space-y-3">
                <GiftCheckoutPreview draft={draft} />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="text-sm font-extrabold">
                      Имя
                    </label>
                    <input
                      id="name"
                      required
                      value={draft.contact.name}
                      onChange={(e) =>
                        patchDraft((d) => ({
                          ...d,
                          contact: { ...d.contact, name: e.target.value },
                        }))
                      }
                      placeholder="Как к вам обращаться"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm font-extrabold">
                      Телефон
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={draft.contact.phone}
                      onChange={(e) =>
                        patchDraft((d) => ({
                          ...d,
                          contact: { ...d.contact, phone: e.target.value },
                        }))
                      }
                      placeholder="+7 9…"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telegram" className="text-sm font-extrabold">
                    Telegram{" "}
                    <span className="font-bold text-[var(--muted)]">
                      (необязательно)
                    </span>
                  </label>
                  <input
                    id="telegram"
                    value={draft.contact.telegram}
                    onChange={(e) =>
                      patchDraft((d) => ({
                        ...d,
                        contact: { ...d.contact, telegram: e.target.value },
                      }))
                    }
                    placeholder="@username"
                    className={fieldClass}
                  />
                </div>

                <fieldset>
                  <legend className="text-sm font-extrabold">
                    Способ получения
                  </legend>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {RECEIVE_METHODS.map((item) => {
                      const on = draft.contact.method === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            patchDraft((d) => ({
                              ...d,
                              contact: { ...d.contact, method: item.id },
                            }))
                          }
                          className={`rounded-[22px] border-2 px-4 py-4 text-left transition ${
                            on
                              ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                              : "border-[var(--line)] bg-[var(--surface-warm)] hover:border-[var(--accent)]"
                          }`}
                        >
                          <span className="block font-[family-name:var(--font-unbounded)] text-lg font-semibold">
                            {item.title}
                          </span>
                          <span className="mt-1 block text-sm font-bold text-[var(--muted)]">
                            {item.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {deliveryMethod.needsAddress ? (
                  <div>
                    <label htmlFor="address" className="text-sm font-extrabold">
                      Адрес
                    </label>
                    <input
                      id="address"
                      required
                      value={draft.contact.address}
                      onChange={(e) =>
                        patchDraft((d) => ({
                          ...d,
                          contact: { ...d.contact, address: e.target.value },
                        }))
                      }
                      placeholder="Город, улица, дом"
                      className={fieldClass}
                    />
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="deliveryDate"
                      className="text-sm font-extrabold"
                    >
                      Дата вручения
                    </label>
                    <input
                      id="deliveryDate"
                      type="date"
                      value={draft.contact.deliveryDate}
                      onChange={(e) =>
                        patchDraft((d) => ({
                          ...d,
                          contact: {
                            ...d.contact,
                            deliveryDate: e.target.value,
                          },
                        }))
                      }
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="comment" className="text-sm font-extrabold">
                      Комментарий
                    </label>
                    <input
                      id="comment"
                      value={draft.contact.comment}
                      onChange={(e) =>
                        patchDraft((d) => ({
                          ...d,
                          contact: { ...d.contact, comment: e.target.value },
                        }))
                      }
                      placeholder="Пожелания"
                      className={fieldClass}
                    />
                  </div>
                </div>
              </form>
            ) : null}
          </section>

          <aside className="flex flex-col rounded-[28px] bg-white p-4 shadow-[var(--shadow-soft)] sm:p-5">
            {step === "review" || step === "message" || step === "card" ? (
              <div className="mb-4 overflow-hidden rounded-[22px] border border-[var(--line)]">
                <GiftCheckoutPreview draft={draft} compact />
              </div>
            ) : null}

            <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
              Итого сейчас
            </h2>

            <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-base font-bold">
              {pricing.lines.map((line) => (
                <li
                  key={`${line.id}-${line.title}`}
                  className="flex justify-between gap-2 border-b border-[var(--line)] pb-2"
                >
                  <span>
                    {line.emoji} {line.title}
                  </span>
                  <span className="shrink-0 text-[var(--accent)]">
                    {line.price === 0 ? "—" : formatRub(line.price)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 text-base font-bold">
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--muted)]">Получение</dt>
                <dd>
                  {draft.contact.method === "pickup" ? "Самовывоз" : "Доставка"}{" "}
                  · {formatDeliveryMoney(pricing.delivery)}
                </dd>
              </div>
            </dl>

            <div className="mt-auto border-t border-[var(--line)] pt-4">
              <div className="flex items-end justify-between gap-3">
                <p className="text-base font-extrabold">Итого</p>
                <p className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold text-[var(--accent)] transition-all sm:text-4xl">
                  {formatRub(pricing.total)}
                </p>
              </div>
              <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                Цена пересчитывается сразу · оплаты на сайте нет
              </p>

              {step === "review" ? (
                <button
                  type="submit"
                  form="checkout-review"
                  disabled={submitting}
                  className="mt-4 w-full rounded-[26px] bg-[var(--accent)] px-6 py-5 text-xl font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)] disabled:opacity-70"
                >
                  {submitting ? "Отправляем…" : "Отправить заявку"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  className="mt-4 w-full rounded-[26px] bg-[var(--accent)] px-6 py-5 text-xl font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)]"
                >
                  Далее
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
