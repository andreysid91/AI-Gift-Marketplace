"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  clearGiftOrder,
  loadGiftOrder,
  type GiftOrderPayload,
} from "../lib/gift-order";
import {
  createMockOrderFromCheckout,
  pushCheckoutOrder,
} from "../lib/admin-mock";
import {
  ensureAccountFromOrder,
  loadCustomerSession,
  saveCustomerSession,
} from "../lib/auth";
import {
  formatDeliveryMoney,
  getDeliveryMethod,
  type DeliveryMethodId,
} from "../lib/delivery";
import { MOCK_IDEAS, formatPrice } from "../lib/mock-ideas";
import {
  appendGiftHistory,
  getRecipientById,
  loadSelectedRecipientId,
  saveSelectedRecipientId,
} from "../lib/recipients";
import { formatRub } from "../lib/scenario-catalog";

type CheckoutFormProps = {
  productId?: string;
  fromGift?: boolean;
  giftQuery?: string;
  recipientId?: string;
};

const PACKAGING = 350;

const RECEIVE_METHODS: Array<{
  id: DeliveryMethodId;
  title: string;
  hint: string;
}> = [
  { id: "pickup", title: "Самовывоз", hint: "Бесплатно" },
  { id: "delivery", title: "Доставка", hint: "от 400 ₽" },
];

export function CheckoutForm({
  productId,
  fromGift = false,
  giftQuery,
  recipientId,
}: CheckoutFormProps) {
  const router = useRouter();
  const idea = useMemo(
    () => MOCK_IDEAS.find((item) => item.id === productId) ?? MOCK_IDEAS[0],
    [productId],
  );

  const [giftOrder, setGiftOrder] = useState<GiftOrderPayload | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [method, setMethod] = useState<DeliveryMethodId>("pickup");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (recipientId) saveSelectedRecipientId(recipientId);
  }, [recipientId]);

  useEffect(() => {
    if (!fromGift) return;
    setGiftOrder(loadGiftOrder());
  }, [fromGift]);

  useEffect(() => {
    const session = loadCustomerSession();
    if (!session) return;
    if (session.name) setName(session.name);
    if (session.phone) setPhone(session.phone);
  }, []);

  const deliveryMethod = getDeliveryMethod(method);
  const deliveryCost = deliveryMethod.cost;
  const needsAddress = deliveryMethod.needsAddress;
  const giftMode = fromGift && giftOrder && giftOrder.items.length > 0;
  const total = giftMode
    ? giftOrder.total + deliveryCost
    : idea.price + PACKAGING + deliveryCost;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (needsAddress && !address.trim()) return;
    setSubmitting(true);

    const ADDON_IDS = new Set([
      "card",
      "box",
      "chocolate",
      "tea",
      "coffee",
      "candle",
      "pack",
    ]);

    const giftLines = giftMode ? giftOrder.items : [];
    const giftProducts = giftLines.filter((item) => !ADDON_IDS.has(item.id));
    const giftAddons = giftLines.filter((item) => ADDON_IDS.has(item.id));

    const commentParts = [
      telegram.trim() ? `Telegram: ${telegram.trim()}` : "",
      deliveryDate ? `Дата вручения: ${deliveryDate}` : "",
      comment.trim(),
    ].filter(Boolean);

    const order = createMockOrderFromCheckout({
      title: giftMode
        ? giftOrder.query || "Подарочный набор"
        : idea.title,
      clientName: name.trim() || "Клиент",
      phone: phone.trim() || "—",
      comment: commentParts.join("\n"),
      products: giftMode
        ? giftProducts.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            emoji: item.emoji,
          }))
        : [
            {
              id: idea.id,
              title: idea.title,
              price: idea.price,
              emoji: "🎁",
            },
          ],
      addons: giftMode
        ? giftAddons.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            emoji: item.emoji,
          }))
        : [
            {
              id: "pack",
              title: "Упаковка",
              price: PACKAGING,
              emoji: "🎀",
            },
          ],
      total,
      address: needsAddress
        ? address.trim() || "Адрес уточняется"
        : "Самовывоз",
      deliveryMethodId: method,
      type: giftMode ? "gift" : "new",
    });
    pushCheckoutOrder(order);

    const account = ensureAccountFromOrder({
      name: name.trim() || "Клиент",
      phone: phone.trim(),
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

    if (giftMode) clearGiftOrder();

    const params = new URLSearchParams({
      order: order.id,
      method,
      account: "1",
      total: String(total),
      name: name.trim() || "Клиент",
    });
    if (giftMode) params.set("from", "gift");
    else if (productId) params.set("id", productId);
    router.push(`/success?${params.toString()}`);
  }

  const fieldClass =
    "mt-2 w-full rounded-[22px] border-2 border-[var(--line)] bg-white px-5 py-4 text-xl font-bold outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] sm:py-5 sm:text-2xl";

  const backHref = giftMode
    ? `/ideas?q=${encodeURIComponent(giftOrder.query || giftQuery || "")}`
    : productId
      ? `/gift?id=${productId}`
      : "/";

  const orderTitle = giftMode
    ? giftOrder.query || "Подарочный набор"
    : idea.title;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,#ffc9b0_0%,transparent_45%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={backHref}
            className="text-base font-extrabold text-[var(--accent)] hover:underline"
          >
            ← Назад
          </Link>
          <p className="text-sm font-extrabold text-[var(--muted)]">
            Без оплаты · заявка
          </p>
        </div>

        <h1 className="mt-3 font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
          Оформление заказа
        </h1>

        <form
          onSubmit={onSubmit}
          className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-5"
        >
          <section className="space-y-3 rounded-[28px] bg-white p-4 shadow-[var(--shadow-soft)] sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm font-extrabold sm:text-base">
                  Имя
                </label>
                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-extrabold sm:text-base">
                  Телефон
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 9…"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="telegram" className="text-sm font-extrabold sm:text-base">
                Telegram{" "}
                <span className="font-bold text-[var(--muted)]">(необязательно)</span>
              </label>
              <input
                id="telegram"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@username"
                className={fieldClass}
              />
            </div>

            <fieldset>
              <legend className="text-sm font-extrabold sm:text-base">
                Способ получения
              </legend>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {RECEIVE_METHODS.map((item) => {
                  const on = method === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id)}
                      className={`rounded-[22px] border-2 px-4 py-4 text-left transition sm:py-5 ${
                        on
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                          : "border-[var(--line)] bg-[var(--surface-warm)] hover:border-[var(--accent)]"
                      }`}
                    >
                      <span className="block font-[family-name:var(--font-unbounded)] text-lg font-semibold sm:text-xl">
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

            {needsAddress ? (
              <div>
                <label htmlFor="address" className="text-sm font-extrabold sm:text-base">
                  Адрес
                </label>
                <input
                  id="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Город, улица, дом"
                  className={fieldClass}
                />
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="deliveryDate"
                  className="text-sm font-extrabold sm:text-base"
                >
                  Дата вручения
                </label>
                <input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="comment" className="text-sm font-extrabold sm:text-base">
                  Комментарий
                </label>
                <input
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Пожелания"
                  className={fieldClass}
                />
              </div>
            </div>
          </section>

          <aside className="flex flex-col rounded-[28px] bg-white p-4 shadow-[var(--shadow-soft)] sm:p-5">
            <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold sm:text-2xl">
              Проверка заказа
            </h2>

            <p className="mt-3 font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-snug">
              {orderTitle}
            </p>

            {giftMode ? (
              <ul className="mt-3 max-h-36 space-y-2 overflow-y-auto text-base font-bold">
                {giftOrder.items.map((item) => (
                  <li
                    key={`${item.id}-${item.title}`}
                    className="flex justify-between gap-2 border-b border-[var(--line)] pb-2"
                  >
                    <span>
                      {item.emoji} {item.title}
                    </span>
                    <span className="shrink-0 text-[var(--accent)]">
                      {formatRub(item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 flex items-center gap-3 rounded-[20px] bg-[var(--surface-warm)] p-3">
                <span className="text-4xl" aria-hidden>
                  {idea.emoji}
                </span>
                <div>
                  <p className="font-extrabold">{idea.title}</p>
                  <p className="text-sm font-bold text-[var(--muted)]">
                    + упаковка {formatPrice(PACKAGING)}
                  </p>
                </div>
              </div>
            )}

            <dl className="mt-4 space-y-2 text-base font-bold">
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--muted)]">Получение</dt>
                <dd>
                  {method === "pickup" ? "Самовывоз" : "Доставка"} ·{" "}
                  {formatDeliveryMoney(deliveryCost)}
                </dd>
              </div>
              {deliveryDate ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--muted)]">Дата</dt>
                  <dd>{deliveryDate}</dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-auto border-t border-[var(--line)] pt-4">
              <div className="flex items-end justify-between gap-3">
                <p className="text-base font-extrabold">Итого</p>
                <p className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold text-[var(--accent)] sm:text-4xl">
                  {giftMode ? formatRub(total) : formatPrice(total)}
                </p>
              </div>
              <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                Оплаты на сайте нет — подтвердим по телефону
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full rounded-[26px] bg-[var(--accent)] px-6 py-5 text-xl font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)] disabled:opacity-70 sm:text-2xl"
              >
                {submitting ? "Отправляем…" : "Отправить заявку"}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
