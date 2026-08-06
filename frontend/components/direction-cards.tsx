import Link from "next/link";

const DIRECTIONS = [
  {
    href: "/gifts",
    icon: "🎁",
    title: "Подарки",
    tone: "from-[#ff7a5c] to-[#ff5a3c]",
    soft: "bg-[var(--accent-soft)]",
  },
  {
    href: "/photo",
    icon: "📷",
    title: "Фотопечать",
    tone: "from-[#6bb8ff] to-[#3b6fd8]",
    soft: "bg-[#e8f0ff]",
  },
  {
    href: "/business",
    icon: "🏢",
    title: "Для бизнеса",
    tone: "from-[#3db88a] to-[#2a9a72]",
    soft: "bg-[var(--mint-soft)]",
  },
] as const;

export function DirectionCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-5">
      {DIRECTIONS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[28px] bg-white p-6 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)] sm:min-h-[220px] sm:p-7"
        >
          <div
            aria-hidden
            className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.tone}`}
          />
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-[22px] text-4xl ${item.soft}`}
          >
            {item.icon}
          </span>
          <h2 className="mt-6 font-[family-name:var(--font-unbounded)] text-2xl font-semibold tracking-tight sm:text-3xl">
            {item.title}
          </h2>
        </Link>
      ))}
    </div>
  );
}
