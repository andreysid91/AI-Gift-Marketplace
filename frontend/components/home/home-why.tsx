const REASONS = [
  {
    title: "Подбор за минуту",
    text: "Сценарий под человека и повод — без бесконечного скролла каталогов.",
  },
  {
    title: "Индивидуальный дизайн",
    text: "Портрет, принт, текст — под конкретную историю.",
  },
  {
    title: "Срок под дату",
    text: "К дню рождения, годовщине или «нужно завтра».",
  },
  {
    title: "Упаковка и открытка",
    text: "Красиво вручить можно сразу — не бегать по магазинам.",
  },
  {
    title: "Один заказ до вручения",
    text: "Изготовление и доставка в одном статусе.",
  },
] as const;

export function HomeWhy() {
  return (
    <section id="why-here">
      <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
        Что можно заказать — и почему здесь
      </h2>
      <p className="mt-2 max-w-2xl text-base font-bold text-[var(--muted)]">
        Кружки, холсты, футболки, фотопечать, наборы и корпоративный тираж —
        с эмоцией, а не «просто сувенир»
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {REASONS.map((reason) => (
          <li
            key={reason.title}
            className="flex flex-col rounded-[24px] bg-white px-5 py-5 shadow-[var(--shadow-soft)]"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--mint-soft)] text-xl font-extrabold text-[var(--mint)]"
              aria-hidden
            >
              ✔
            </span>
            <span className="mt-4 font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-snug">
              {reason.title}
            </span>
            <span className="mt-2 text-sm font-bold leading-snug text-[var(--muted)]">
              {reason.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
