import Link from "next/link";
import { SHOWCASE_ORDERS } from "../../lib/showcase-orders";
import { formatRub } from "../../lib/scenario-catalog";

export function HomeLatestOrders() {
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
            Реальные истории вручения — можно заказать такой же
          </p>
        </div>
        <p className="text-sm font-extrabold text-[var(--mint)]">
          Сегодня уже 12 вручений
        </p>
      </div>

      <ul className="mt-6 grid gap-4 lg:grid-cols-1">
        {SHOWCASE_ORDERS.map((order, index) => (
          <li
            key={order.id}
            className="overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]"
            style={{
              animation: `fade-rise 0.55s ease-out ${index * 60}ms both`,
            }}
          >
            <div className="grid gap-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div
                className={`relative flex min-h-[200px] flex-col items-center justify-center bg-gradient-to-br ${order.tone} p-6`}
              >
                <span className="text-7xl drop-shadow-sm sm:text-8xl" aria-hidden>
                  {order.emoji}
                </span>
                <span className="mt-4 rounded-[14px] bg-white/95 px-3 py-1.5 text-sm font-extrabold">
                  {order.photoLabel}
                </span>
              </div>

              <div className="flex flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-extrabold text-[var(--muted)]">
                      {order.dateLabel} · {order.recipientRole}
                    </p>
                    <h3 className="mt-1 font-[family-name:var(--font-unbounded)] text-xl font-semibold sm:text-2xl">
                      {order.giftTitle}
                    </h3>
                    <p className="mt-1 text-base font-bold text-[var(--foreground)]">
                      Для: {order.recipient}
                    </p>
                  </div>
                  <p className="font-[family-name:var(--font-unbounded)] text-xl font-semibold text-[var(--accent)]">
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

                {order.reviews[0] ? (
                  <blockquote className="mt-4 rounded-[18px] bg-[var(--surface-warm)] px-4 py-3">
                    <p className="text-sm font-extrabold text-[var(--accent)]">
                      {order.reviews[0].emotion}
                    </p>
                    <p className="mt-1 text-base font-bold leading-snug">
                      «{order.reviews[0].text}»
                    </p>
                    <p className="mt-2 text-sm font-bold text-[var(--muted)]">
                      — {order.reviews[0].author}
                    </p>
                  </blockquote>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={order.orderSameHref}
                    className="rounded-[18px] bg-[var(--accent)] px-5 py-3 text-sm font-extrabold text-white shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-hover)]"
                  >
                    Заказать такой же
                  </Link>
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
