import type { Metadata } from "next";
import Link from "next/link";
import { PhotoCatalog } from "../../components/photo-catalog";

export const metadata: Metadata = {
  title: "Фотопечать — AI Gift",
  description:
    "Что хотите напечатать? Фотографии, холст, постер, пазл, календарь, магнит, фотокнига, открытка.",
};

export default function PhotoPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,#e8f0ff_0%,transparent_42%),radial-gradient(ellipse_at_90%_8%,#ffe0c8_0%,transparent_36%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_50%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-extrabold text-[var(--accent)] transition hover:gap-3"
        >
          <span aria-hidden>←</span>
          На главную
        </Link>

        <header className="mt-8 max-w-4xl animate-fade-rise sm:mt-10">
          <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold tracking-tight text-[#3b6fd8] sm:text-xl">
            AI Gift · Фотопечать
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-unbounded)] text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl xl:text-[68px]">
            Что хотите напечатать?
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-bold leading-snug text-[var(--muted)] sm:text-xl">
            Выберите продукт — загрузите фото и оформите печать.
          </p>
        </header>

        <div className="mt-10 sm:mt-12">
          <PhotoCatalog />
        </div>
      </div>
    </main>
  );
}
