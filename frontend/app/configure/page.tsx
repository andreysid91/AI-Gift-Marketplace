import Link from "next/link";
import { ConfigureDemo } from "../../components/configure-demo";

type Props = {
  searchParams: Promise<{ product?: string }>;
};

export default async function ConfigurePage({ searchParams }: Props) {
  const { product } = await searchParams;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_8%,#ffe0c8_0%,transparent_42%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← Gift
        </Link>
        <h1 className="mt-8 font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
          Universal Product Card
        </h1>
        <p className="mt-3 max-w-xl text-lg font-bold text-[var(--muted)]">
          Одна карточка для любого товара — параметры и цена сразу.
        </p>
        <div className="mt-10">
          <ConfigureDemo initialProductId={product ?? "tee"} />
        </div>
      </div>
    </main>
  );
}
