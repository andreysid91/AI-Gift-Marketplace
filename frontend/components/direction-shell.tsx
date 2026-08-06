import type { ReactNode } from "react";

type DirectionShellProps = {
  brand: string;
  title: string;
  subtitle: string;
  accentClass?: string;
  children: ReactNode;
};

export function DirectionShell({
  brand,
  title,
  subtitle,
  accentClass = "text-[var(--accent)]",
  children,
}: DirectionShellProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,#ffe0c8_0%,transparent_42%),radial-gradient(ellipse_at_90%_10%,#ffd0c4_0%,transparent_36%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:py-10">
        <header className="max-w-3xl animate-fade-rise">
          <p
            className={`font-[family-name:var(--font-unbounded)] text-lg font-semibold tracking-tight sm:text-xl ${accentClass}`}
          >
            {brand}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-bold leading-snug text-[var(--muted)] sm:text-xl">
            {subtitle}
          </p>
        </header>

        <div className="mt-10 animate-fade-rise-delay-1">{children}</div>
      </div>
    </main>
  );
}
