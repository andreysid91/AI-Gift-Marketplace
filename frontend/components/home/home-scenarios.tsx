import Link from "next/link";

const SCENARIOS = [
  {
    title: "Подарок маме",
    href: "/ideas?q=" + encodeURIComponent("Подарок маме"),
    tone: "from-[#ffb4a2] to-[#ff5a3c]",
    emoji: "💐",
  },
  {
    title: "Подарок девушке",
    href: "/ideas?q=" + encodeURIComponent("Подарок девушке"),
    tone: "from-[#f7b6c8] to-[#e84d6f]",
    emoji: "💖",
  },
  {
    title: "Подарок учителю",
    href: "/ideas?q=" + encodeURIComponent("Подарок учителю"),
    tone: "from-[#ffd59a] to-[#ff9f43]",
    emoji: "📚",
  },
  {
    title: "Корпоратив",
    href: "/create?scenario=corporate",
    tone: "from-[#ffc9a0] to-[#e07a3a]",
    emoji: "🏢",
  },
  {
    title: "Свадьба",
    href: "/ideas?q=" + encodeURIComponent("Подарок на свадьбу"),
    tone: "from-[#ffd0dc] to-[#e86a8a]",
    emoji: "💍",
  },
  {
    title: "День рождения",
    href: "/ideas?q=" + encodeURIComponent("Подарок на день рождения"),
    tone: "from-[#9de7c8] to-[#3db88a]",
    emoji: "🎂",
  },
] as const;

export function HomeScenarios() {
  return (
    <section>
      <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
        Популярные сценарии
      </h2>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SCENARIOS.map((item, index) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className={`group flex min-h-[160px] flex-col justify-between overflow-hidden rounded-[28px] bg-gradient-to-br ${item.tone} p-6 text-white shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)] sm:min-h-[180px] sm:p-7`}
              style={{
                animation: `fade-rise 0.55s ease-out ${index * 60}ms both`,
              }}
            >
              <span className="text-4xl sm:text-5xl" aria-hidden>
                {item.emoji}
              </span>
              <span className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold leading-tight sm:text-3xl">
                {item.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
