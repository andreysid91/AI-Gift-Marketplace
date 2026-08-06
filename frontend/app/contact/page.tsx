import type { Metadata } from "next";
import Link from "next/link";
import { IdeaForm } from "../../components/idea-form";

export const metadata: Metadata = {
  title: "Опишите свою идею — Gift",
  description:
    "Напишите что угодно — фигурку, тираж, вышивку, шахматы. Подготовим варианты реализации.",
};

type ContactPageProps = {
  searchParams: Promise<{ idea?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { idea } = await searchParams;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,#ffe0c8_0%,transparent_45%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/"
          className="inline-flex text-lg font-extrabold text-[var(--accent)] hover:underline"
        >
          ← На главную
        </Link>

        <h1 className="mt-8 font-[family-name:var(--font-unbounded)] text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
          Опишите свою идею
        </h1>

        <IdeaForm initialIdea={idea?.trim() ?? ""} />
      </div>
    </main>
  );
}
