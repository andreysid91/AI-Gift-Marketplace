import Link from "next/link";

const GIFTS = [
  {
    title: "Кружка",
    emoji: "☕",
    href: "/gift?id=mug",
    tone: "from-[#ffb4a2] to-[#ff6b4a]",
  },
  {
    title: "Футболка",
    emoji: "👕",
    href: "/gift?id=tee",
    tone: "from-[#ffd59a] to-[#ff9f43]",
  },
  {
    title: "Холст",
    emoji: "🖼️",
    href: "/gift?id=canvas",
    tone: "from-[#f7b6c8] to-[#e84d6f]",
  },
  {
    title: "Пазл",
    emoji: "🧩",
    href: "/gift?id=puzzle",
    tone: "from-[#9de7c8] to-[#3db88a]",
  },
  {
    title: "Фотокнига",
    emoji: "📖",
    href: "/create?scenario=photo&q=" + encodeURIComponent("Фотокнига"),
    tone: "from-[#ffe0b8] to-[#e8a04a]",
  },
  {
    title: "Подарочный набор",
    emoji: "🎁",
    href: "/gift?id=idea-04",
    tone: "from-[#ffc9b0] to-[#ff7a5c]",
  },
] as const;

export function HomePopularGifts() {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
          Популярные подарки
        </h2>
        <Link
          href="/popular"
          className="font-extrabold text-[var(--accent)] hover:underline"
        >
          Всё популярное →
        </Link>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GIFTS.map((gift, index) => (
          <li key={gift.title}>
            <Link
              href={gift.href}
              className="group block overflow-hidden rounded-[32px] bg-white shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)]"
              style={{
                animation: `fade-rise 0.55s ease-out ${index * 50}ms both`,
              }}
            >
              <div
                className={`flex h-44 items-center justify-center bg-gradient-to-br ${gift.tone} sm:h-52`}
              >
                <span
                  className="text-7xl transition duration-300 group-hover:scale-110 sm:text-8xl"
                  aria-hidden
                >
                  {gift.emoji}
                </span>
              </div>
              <div className="px-5 py-5 sm:px-6">
                <h3 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl">
                  {gift.title}
                </h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
