import Link from "next/link";
import { DesignStudio } from "../../components/design-studio";

export const metadata = {
  title: "Генерация дизайна — AI Gift",
  description:
    "Дизайн по фото, по описанию или «Удиви меня». 4 варианта — затем кружка, футболка, холст и другие изделия.",
};

export default function DesignPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_8%,#ffe0c8_0%,transparent_42%),radial-gradient(ellipse_at_88%_5%,#c8e4ff_0%,transparent_40%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← AI Gift
        </Link>

        <div className="mt-8">
          <DesignStudio />
        </div>
      </div>
    </main>
  );
}
