const BENEFITS = [
  {
    label: "Индивидуальный дизайн",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
        <path
          d="M4 20l4.5-1.2L19 8.3a2.1 2.1 0 0 0-3-3L5.5 15.8 4 20z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 6.5l3 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Изготовление под заказ",
    tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
        <path
          d="M4 8.5h16v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-11z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 8.5V7a4 4 0 0 1 8 0v1.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M9 13h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Проверяем качество перед отправкой",
    tone: "bg-[var(--mint-soft)] text-[var(--mint)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
        <path
          d="M12 3l7 3v5.5c0 4.2-2.7 7.8-7 9.5-4.3-1.7-7-5.3-7-9.5V6l7-3z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 12.2l2 2 4-4.2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Удобная доставка",
    tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
        <path
          d="M3 7h11v10H3V7z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M14 10h4.2L21 13.2V17h-7v-7z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="18.5" r="1.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17" cy="18.5" r="1.6" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    label: "Поддержка на всех этапах",
    tone: "bg-[#e8f0ff] text-[#3b6fd8]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
        <path
          d="M12 21a8.5 8.5 0 1 0-7.4-4.3L3.5 20.2l3.6-1.1A8.4 8.4 0 0 0 12 21z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 11.5h6M9 14.5h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const;

export function WhyChooseUs() {
  return (
    <section className="w-full">
      <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Почему выбирают нас
      </h2>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {BENEFITS.map((item) => (
          <li
            key={item.label}
            className={`flex flex-col items-start gap-3 rounded-[24px] px-4 py-5 shadow-[var(--shadow-soft)] ${item.tone}`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
              {item.icon}
            </span>
            <span className="text-sm font-extrabold leading-snug sm:text-base">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
