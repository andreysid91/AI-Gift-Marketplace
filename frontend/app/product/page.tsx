import Link from "next/link";
import { MOCK_IDEAS, formatPrice } from "../../lib/mock-ideas";

type ProductPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function ProductPage({ searchParams }: ProductPageProps) {
  const { id } = await searchParams;
  const idea = MOCK_IDEAS.find((item) => item.id === id) ?? MOCK_IDEAS[0];

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,#ffe0c8_0%,transparent_45%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_100%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-14">
        <div
          className={`flex min-h-[320px] items-center justify-center rounded-[40px] bg-gradient-to-br ${idea.gradient} shadow-[var(--shadow)] sm:min-h-[420px]`}
        >
          <span className="text-8xl">{idea.emoji}</span>
        </div>

        <div>
          <Link
            href="/ideas"
            className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
          >
            ← К вариантам
          </Link>

          <p className="mt-6 text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
            {idea.style} · {idea.technology}
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-unbounded)] text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
            {idea.title}
          </h1>

          <p className="mt-5 text-lg font-bold leading-relaxed text-[var(--muted)] sm:text-xl">
            {idea.description}
          </p>

          <p className="mt-8 font-[family-name:var(--font-unbounded)] text-4xl font-semibold text-[var(--accent)]">
            {formatPrice(idea.price)}
          </p>
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            Изготовление ≈ {idea.leadTime}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-2xl bg-white px-4 py-2 text-sm font-extrabold shadow-[var(--shadow-soft)]">
              {idea.recipient}
            </span>
            <span className="rounded-2xl bg-white px-4 py-2 text-sm font-extrabold shadow-[var(--shadow-soft)]">
              {idea.occasion}
            </span>
            <span className="rounded-2xl bg-white px-4 py-2 text-sm font-extrabold shadow-[var(--shadow-soft)]">
              {idea.budget}
            </span>
          </div>

          <Link
            href={`/checkout?id=${idea.id}`}
            className="mt-10 inline-flex w-full items-center justify-center rounded-[28px] bg-[var(--accent)] px-8 py-5 text-lg font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)] sm:w-auto"
          >
            Оформить заявку
          </Link>

          <p className="mt-4 text-base font-bold text-[var(--muted)]">
            Страница товара — тестовая заглушка. Дальше подключим полный
            конструктор.
          </p>
        </div>
      </div>
    </main>
  );
}
