const REVIEWS = [
  {
    name: "Марина",
    emotion: "В восторге",
    gift: "Кружка папе",
    emoji: "😍",
    tone: "from-[#ffb4a2] via-[#ff8f6b] to-[#ff5a3c]",
  },
  {
    name: "Игорь",
    emotion: "Слёзы счастья",
    gift: "Холст жене",
    emoji: "🥹",
    tone: "from-[#f7b6c8] via-[#ef7a9a] to-[#e84d6f]",
  },
  {
    name: "Анна",
    emotion: "Команда в шоке",
    gift: "Welcome-box",
    emoji: "🤩",
    tone: "from-[#9de7c8] via-[#5cc9a0] to-[#3db88a]",
  },
  {
    name: "Дмитрий",
    emotion: "Идеально",
    gift: "Футболки на тираж",
    emoji: "🔥",
    tone: "from-[#ffd59a] via-[#ffb35c] to-[#ff9f43]",
  },
] as const;

export function HomeReviews() {
  return (
    <section>
      <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
        Отзывы
      </h2>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REVIEWS.map((review, index) => (
          <li
            key={review.name}
            className="overflow-hidden rounded-[32px] bg-white shadow-[var(--shadow-soft)]"
            style={{
              animation: `fade-rise 0.55s ease-out ${index * 70}ms both`,
            }}
          >
            <div
              className={`relative flex h-56 items-center justify-center bg-gradient-to-br ${review.tone} sm:h-64`}
            >
              <span className="text-8xl drop-shadow-sm sm:text-9xl" aria-hidden>
                {review.emoji}
              </span>
              <span className="absolute bottom-4 left-4 rounded-[16px] bg-white/95 px-3 py-2 text-sm font-extrabold text-[var(--foreground)]">
                {review.emotion}
              </span>
            </div>
            <div className="px-5 py-4">
              <p className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
                {review.name}
              </p>
              <p className="mt-1 text-base font-bold text-[var(--muted)]">
                {review.gift}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
