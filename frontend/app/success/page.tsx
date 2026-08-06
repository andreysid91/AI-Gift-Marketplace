import Link from "next/link";
import { OrderTimeline } from "../../components/order-timeline";

type SuccessPageProps = {
  searchParams: Promise<{
    order?: string;
    from?: string;
    method?: string;
    account?: string;
    total?: string;
    name?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { order, name } = await searchParams;
  const trackHref = order
    ? `/track?order=${encodeURIComponent(order)}`
    : "/track";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#ffc9b0_0%,transparent_48%),radial-gradient(ellipse_at_85%_15%,#d4f5e8_0%,transparent_42%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[10%] top-[12%] size-28 animate-[float-soft_7s_ease-in-out_infinite] rounded-full bg-[rgba(255,90,60,0.18)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[12%] top-[22%] size-20 animate-[float-soft_9s_ease-in-out_infinite] rounded-full bg-[rgba(61,184,138,0.22)] blur-xl"
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-5 py-12 sm:px-6 sm:py-16">
        <div className="text-center">
          <div
            className="mx-auto flex size-28 animate-[fade-rise_0.5s_ease-out_both] items-center justify-center rounded-full bg-gradient-to-br from-[#5cc9a0] to-[#3db88a] shadow-[0_20px_44px_rgba(61,184,138,0.35)] sm:size-32"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-14 sm:size-16">
              <path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="mt-8 animate-[fade-rise_0.6s_ease-out_both] font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
            Спасибо{name ? `, ${name.split(/\s+/)[0]}` : ""}!
          </h1>
          <p className="mt-3 animate-[fade-rise_0.7s_ease-out_both] text-xl font-extrabold sm:text-2xl">
            Ваш заказ принят.
          </p>
          {order ? (
            <p className="mt-2 animate-[fade-rise_0.75s_ease-out_both] text-base font-extrabold text-[var(--accent)]">
              {order}
            </p>
          ) : null}
        </div>

        <div className="mt-8 animate-[fade-rise_0.85s_ease-out_both] rounded-[32px] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
          <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Статус заказа
          </p>
          <div className="mt-5">
            <OrderTimeline status="Новая заявка" />
          </div>
        </div>

        <div className="mt-8 flex animate-[fade-rise_0.95s_ease-out_both] flex-col gap-3">
          <Link
            href={trackHref}
            className="rounded-[26px] bg-[var(--accent)] px-8 py-5 text-center text-lg font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)] sm:text-xl"
          >
            Отследить заказ
          </Link>
          <Link
            href="/"
            className="rounded-[26px] border-2 border-[var(--line)] bg-white px-8 py-5 text-center text-lg font-extrabold transition hover:border-[var(--accent)] sm:text-xl"
          >
            Вернуться на главную
          </Link>
        </div>
      </section>
    </main>
  );
}
