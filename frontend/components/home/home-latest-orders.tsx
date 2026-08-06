import Image from "next/image";
import Link from "next/link";
import { formatRub } from "../../lib/scenario-catalog";
import { getTrustSnapshot } from "../../lib/trust";
import { OrderSameButton } from "../order-same-button";

export function HomeLatestOrders() {
  const { latestOrders, metrics } = getTrustSnapshot();

  return (
    <section id="latest-orders" aria-labelledby="latest-orders-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="latest-orders-title"
            className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl"
          >
            Последние выполненные заказы
          </h2>
          <p className="mt-2 max-w-xl text-base font-bold text-[var(--muted)]">
            Свежие вручения — можно открыть подарок или сразу оформить такой же
          </p>
        </div>
        <p className="text-sm font-extrabold text-[var(--mint)]">
          Сегодня уже {metrics.ordersToday} вручений
        </p>
      </div>

      <ul className="mt-6 grid gap-4">
        {latestOrders.map((order, index) => (
          <li
            key={order.id}
            className="overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]"
            style={{
              animation: `fade-rise 0.55s ease-out ${index * 60}ms both`,
            }}
          >
            <div className="grid gap-0 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <Link
                href={`${order.giftHref}${order.giftHref.includes("?") ? "&" : "?"}from=home`}
                className="relative block min-h-[220px] md:min-h-full"
              >
                <Image
                  src={order.photoUrl}
                  alt={order.photoCaption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <span className="absolute bottom-3 left-3 rounded-[14px] bg-white/95 px-3 py-1.5 text-sm font-extrabold shadow-sm">
                  {order.photoCaption}
                </span>
              </Link>

              <div className="flex flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-[var(--muted)]">
                      {order.completedLabel} · {order.recipientRole}
                    </p>
                    <h3 className="mt-1 font-[family-name:var(--font-unbounded)] text-xl font-semibold sm:text-2xl">
                      <Link
                        href={order.giftHref}
                        className="hover:text-[var(--accent)]"
                      >
                        {order.giftTitle}
                      </Link>
                    </h3>
                    <p className="mt-1 text-base font-bold">
                      Для: {order.recipientName}
                    </p>
                  </div>
                  <p className="shrink-0 font-[family-name:var(--font-unbounded)] text-xl font-semibold text-[var(--accent)]">
                    {formatRub(order.total)}
                  </p>
                </div>

                <ol className="mt-4 flex flex-wrap gap-2">
                  {order.history.map((step) => (
                    <li
                      key={step.label}
                      className={`rounded-[12px] px-2.5 py-1 text-xs font-extrabold ${
                        step.done
                          ? "bg-[var(--mint-soft)] text-[var(--mint)]"
                          : "bg-[var(--surface-warm)] text-[var(--muted)]"
                      }`}
                    >
                      {step.done ? "✓ " : ""}
                      {step.label}
                      <span className="ml-1 opacity-70">{step.at}</span>
                    </li>
                  ))}
                </ol>

                {order.previewReview ? (
                  <Link
                    href={order.giftHref}
                    className="mt-4 block rounded-[18px] bg-[var(--surface-warm)] px-4 py-3 transition hover:bg-[var(--accent-soft)]"
                  >
                    <p className="text-sm font-extrabold text-[var(--accent)]">
                      {order.previewReview.emotion}
                    </p>
                    <p className="mt-1 text-base font-bold leading-snug">
                      «{order.previewReview.text}»
                    </p>
                    <p className="mt-2 text-sm font-bold text-[var(--muted)]">
                      — {order.previewReview.author}
                    </p>
                  </Link>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <OrderSameButton
                    giftId={order.giftId}
                    query={order.giftTitle}
                    className="rounded-[18px] bg-[var(--accent)] px-5 py-3 text-sm font-extrabold text-white shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-hover)]"
                  />
                  <Link
                    href={order.giftHref}
                    className="rounded-[18px] border-2 border-[var(--line)] bg-white px-5 py-3 text-sm font-extrabold transition hover:border-[var(--accent)]"
                  >
                    Смотреть подарок
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
