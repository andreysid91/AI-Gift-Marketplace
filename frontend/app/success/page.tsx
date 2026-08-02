import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,#ffe0c8_0%,transparent_45%),radial-gradient(ellipse_at_80%_30%,#d4f5e8_0%,transparent_40%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_100%)]"
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <div
          className="flex size-36 items-center justify-center rounded-full bg-[var(--mint)] shadow-[var(--shadow)] sm:size-44"
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-20 sm:size-24"
            aria-hidden
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mt-10 font-[family-name:var(--font-unbounded)] text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
          Спасибо!
        </h1>

        <p className="mt-6 text-xl font-extrabold text-[var(--foreground)] sm:text-2xl">
          Мы получили вашу заявку.
        </p>

        <p className="mt-4 max-w-md text-lg font-bold leading-relaxed text-[var(--muted)] sm:text-xl">
          В ближайшее время свяжемся с вами для подтверждения заказа.
        </p>

        <Link
          href="/"
          className="mt-12 rounded-[28px] bg-[var(--accent)] px-10 py-5 text-lg font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)]"
        >
          Вернуться на главную
        </Link>
      </section>
    </main>
  );
}
