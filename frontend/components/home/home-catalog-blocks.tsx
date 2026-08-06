import Image from "next/image";
import Link from "next/link";
import { POPULAR_HOME_CATEGORIES, WEEK_IDEAS } from "../../lib/home-media";

export function HomeCategories() {
  return (
    <section id="categories">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
            Популярные категории
          </h2>
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            Что чаще всего заказывают — сразу к подарку
          </p>
        </div>
        <Link
          href="/gifts"
          className="font-extrabold text-[var(--accent)] hover:underline"
        >
          Все подарки →
        </Link>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {POPULAR_HOME_CATEGORIES.map((cat, index) => (
          <li key={cat.id} className="min-w-0">
            <Link
              href={cat.href}
              className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
              style={{
                animation: `fade-rise 0.5s ease-out ${index * 40}ms both`,
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <div className="px-3 py-3">
                <p className="truncate font-[family-name:var(--font-unbounded)] text-base font-semibold">
                  {cat.title}
                </p>
                <p className="mt-0.5 truncate text-xs font-bold text-[var(--muted)] sm:text-sm">
                  {cat.subtitle}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HomeIdeasWeek() {
  return (
    <section id="ideas-week">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
            Лучшие идеи недели
          </h2>
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            То, что чаще всего заказывают прямо сейчас
          </p>
        </div>
        <Link
          href="/popular"
          className="font-extrabold text-[var(--accent)] hover:underline"
        >
          Популярное →
        </Link>
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WEEK_IDEAS.map((idea, index) => (
          <li key={idea.id}>
            <Link
              href={idea.href}
              className="group flex h-full flex-col overflow-hidden rounded-[26px] bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
              style={{
                animation: `fade-rise 0.55s ease-out ${index * 50}ms both`,
              }}
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <Image
                  src={idea.image}
                  alt={idea.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <span className="absolute left-3 top-3 rounded-[12px] bg-white/95 px-2.5 py-1 text-xs font-extrabold text-[var(--accent)]">
                  {idea.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col px-4 py-4">
                <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-snug">
                  {idea.title}
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                  {idea.subtitle}
                </p>
                <p className="mt-auto pt-3 text-sm font-extrabold text-[var(--accent)]">
                  Открыть подарок →
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
