const STEPS = [
  {
    label: "Написали",
    hint: "Кому подарок",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
  },
  {
    label: "Выбрали",
    hint: "Идею из вариантов",
    tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
  },
  {
    label: "Получили",
    hint: "Готовый подарок",
    tone: "bg-[var(--mint-soft)] text-[var(--mint)]",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="w-full">
      <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
        Как это работает
      </h2>
      <p className="mt-1 text-sm font-bold text-[var(--muted)]">
        3 простых шага
      </p>

      <ol className="mt-4 flex flex-col sm:flex-row sm:items-stretch sm:gap-2">
        {STEPS.map((step, index) => (
          <li
            key={step.label}
            className="flex flex-1 flex-col items-center sm:flex-row sm:items-stretch"
          >
            <div
              className={`flex w-full min-h-[84px] flex-1 flex-col justify-center rounded-[22px] px-5 py-4 shadow-[var(--shadow-soft)] ${step.tone}`}
            >
              <span className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold leading-none sm:text-[28px]">
                {step.label}
              </span>
              <span className="mt-2 text-sm font-extrabold opacity-75">
                {step.hint}
              </span>
            </div>

            {index < STEPS.length - 1 ? (
              <span
                aria-hidden
                className="flex shrink-0 items-center justify-center py-1 font-[family-name:var(--font-unbounded)] text-2xl text-[var(--accent)] sm:px-2 sm:py-0 sm:rotate-[-90deg]"
              >
                ↓
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
