"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { MOCK_IDEAS, formatPrice } from "../lib/mock-ideas";

type CheckoutFormProps = {
  productId?: string;
};

const PACKAGING = 350;
const DELIVERY_FEE = 400;

export function CheckoutForm({ productId }: CheckoutFormProps) {
  const router = useRouter();
  const idea = useMemo(
    () => MOCK_IDEAS.find((item) => item.id === productId) ?? MOCK_IDEAS[0],
    [productId],
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [submitting, setSubmitting] = useState(false);

  const deliveryCost = method === "delivery" ? DELIVERY_FEE : 0;
  const total = idea.price + PACKAGING + deliveryCost;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    router.push(`/success?id=${idea.id}&method=${method}`);
  }

  const fieldClass =
    "mt-2 w-full rounded-[22px] border-2 border-[var(--line)] bg-white px-5 py-4 text-lg font-bold text-[var(--foreground)] outline-none transition placeholder:font-semibold placeholder:text-[var(--muted)] focus:border-[var(--accent)]";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_8%,#ffe0c8_0%,transparent_42%),radial-gradient(ellipse_at_90%_0%,#ffd0c4_0%,transparent_36%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
        <Link
          href={productId ? `/product?id=${productId}` : "/ideas"}
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← Назад
        </Link>

        <h1 className="mt-6 font-[family-name:var(--font-unbounded)] text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
          Оформление заявки
        </h1>
        <p className="mt-3 text-lg font-bold text-[var(--muted)]">
          Оставьте контакты — мы свяжемся и подтвердим заказ.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-10"
        >
          <section className="rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <div>
              <label htmlFor="name" className="text-base font-extrabold">
                Имя
              </label>
              <input
                id="name"
                name="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Как к вам обращаться"
                className={fieldClass}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="phone" className="text-base font-extrabold">
                Телефон
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+7 (___) ___-__-__"
                className={fieldClass}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="address" className="text-base font-extrabold">
                Адрес
              </label>
              <input
                id="address"
                name="address"
                required={method === "delivery"}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder={
                  method === "delivery"
                    ? "Куда доставить подарок"
                    : "Город / район (по желанию)"
                }
                className={fieldClass}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="comment" className="text-base font-extrabold">
                Комментарий
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Пожелания к дизайну, упаковке или вручению"
                className={`${fieldClass} resize-none`}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="deliveryDate" className="text-base font-extrabold">
                Дата вручения
              </label>
              <input
                id="deliveryDate"
                name="deliveryDate"
                type="date"
                required
                value={deliveryDate}
                onChange={(event) => setDeliveryDate(event.target.value)}
                className={fieldClass}
              />
            </div>

            <fieldset className="mt-6">
              <legend className="text-base font-extrabold">Способ получения</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-[22px] border-2 px-5 py-4 transition ${
                    method === "pickup"
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--line)] bg-[var(--surface-warm)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="pickup"
                    checked={method === "pickup"}
                    onChange={() => setMethod("pickup")}
                    className="size-5 accent-[var(--accent)]"
                  />
                  <span className="text-lg font-extrabold">Самовывоз</span>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-[22px] border-2 px-5 py-4 transition ${
                    method === "delivery"
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--line)] bg-[var(--surface-warm)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="delivery"
                    checked={method === "delivery"}
                    onChange={() => setMethod("delivery")}
                    className="size-5 accent-[var(--accent)]"
                  />
                  <span className="text-lg font-extrabold">Доставка</span>
                </label>
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full rounded-[28px] bg-[var(--accent)] px-8 py-5 text-lg font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)] disabled:opacity-70 lg:hidden"
            >
              {submitting ? "Отправляем..." : "Отправить заявку"}
            </button>
          </section>

          <aside className="rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] lg:sticky lg:top-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
              Итог заказа
            </h2>

            <div className="mt-6 flex items-center gap-4 rounded-[24px] bg-[var(--surface-warm)] p-4">
              <div
                className={`flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${idea.gradient}`}
              >
                <span className="text-3xl">{idea.emoji}</span>
              </div>
              <div>
                <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-snug">
                  {idea.title}
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                  {idea.style} · ≈ {idea.leadTime}
                </p>
              </div>
            </div>

            <dl className="mt-6 space-y-3 text-base font-bold">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Подарок</dt>
                <dd>{formatPrice(idea.price)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Упаковка</dt>
                <dd>{formatPrice(PACKAGING)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Получение</dt>
                <dd>
                  {method === "delivery"
                    ? formatPrice(DELIVERY_FEE)
                    : "Бесплатно"}
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-[var(--line)] pt-5">
              <div className="flex items-end justify-between gap-4">
                <p className="text-lg font-extrabold">К оплате</p>
                <p className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold text-[var(--accent)]">
                  {formatPrice(total)}
                </p>
              </div>
              <p className="mt-2 text-sm font-bold text-[var(--muted)]">
                Финальную сумму подтвердит менеджер после связи.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 hidden w-full rounded-[28px] bg-[var(--accent)] px-8 py-5 text-lg font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)] disabled:opacity-70 lg:block"
            >
              {submitting ? "Отправляем..." : "Отправить заявку"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}
