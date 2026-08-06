import Link from "next/link";
import { ReviewForm } from "../../components/review-form";

type ReviewPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const { order } = await searchParams;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,#ffe0c8_0%,transparent_42%),radial-gradient(ellipse_at_85%_0%,#d4f5e8_0%,transparent_40%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-xl px-5 py-10 sm:py-14">
        <Link
          href="/"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← AI Gift
        </Link>

        <div className="mt-8">
          {order ? (
            <ReviewForm orderId={order} />
          ) : (
            <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
              <h1 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
                Выберите заказ
              </h1>
              <p className="mt-3 font-bold text-[var(--muted)]">
                Отзыв оставляется из кабинета по выполненному заказу.
              </p>
              <Link
                href="/account"
                className="mt-6 inline-flex rounded-[22px] bg-[var(--accent)] px-6 py-3 font-extrabold text-white"
              >
                В кабинет
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
