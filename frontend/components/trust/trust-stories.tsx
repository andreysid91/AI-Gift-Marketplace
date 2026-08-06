import Image from "next/image";
import Link from "next/link";
import { starsLabel, type TrustStory } from "../../lib/trust";

type TrustStoriesProps = {
  stories: TrustStory[];
};

export function TrustStories({ stories }: TrustStoriesProps) {
  return (
    <section id="client-stories">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
            Истории клиентов
          </h2>
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            Как подарок сработал в жизни — и какой именно заказывали
          </p>
        </div>
        <Link
          href="/reviews"
          className="font-extrabold text-[var(--accent)] hover:underline"
        >
          Ещё истории →
        </Link>
      </div>

      <ul className="mt-6 grid gap-4 lg:grid-cols-3">
        {stories.map((story, index) => (
          <li key={story.id}>
            <Link
              href={story.giftHref}
              className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
              style={{
                animation: `fade-rise 0.55s ease-out ${index * 60}ms both`,
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={story.imageUrl}
                  alt={story.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm font-extrabold text-[var(--accent)]">
                  {starsLabel(story.rating)} · {story.recipientRole}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-unbounded)] text-xl font-semibold leading-snug">
                  {story.title}
                </h3>
                <p className="mt-3 flex-1 text-sm font-bold leading-snug text-[var(--muted)]">
                  {story.body}
                </p>
                <p className="mt-4 text-sm font-extrabold">
                  — {story.author}
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                  {story.giftTitle}
                </p>
                <p className="mt-3 text-sm font-extrabold text-[var(--accent)]">
                  Открыть этот подарок →
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
