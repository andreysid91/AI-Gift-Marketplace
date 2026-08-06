import Image from "next/image";
import Link from "next/link";
import { HOME_PHOTOS } from "../../lib/home-media";
import {
  formatOrderCount,
  formatRating,
  getTrustSnapshot,
} from "../../lib/trust";

const STEPS = [
  {
    n: "1",
    title: "Кому подарок",
    text: "Выберите человека или опишите ситуацию своими словами.",
  },
  {
    n: "2",
    title: "Готовые идеи",
    text: "Смотрите варианты с ценой и сроком — без поиска по цехам.",
  },
  {
    n: "3",
    title: "Оформление",
    text: "Упаковка, открытка, текст поздравления — всё на одном экране.",
  },
  {
    n: "4",
    title: "Вручение",
    text: "Следите за статусом. Подарок доходит до человека.",
  },
] as const;

export function HomeStory() {
  const { metrics } = getTrustSnapshot();

  return (
    <section id="what" className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[var(--shadow)] sm:rounded-[32px]">
        <Image
          src={HOME_PHOTOS.smileOpen}
          alt="Радость при открытии подарка"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      <div>
        <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--accent)]">
          Что это
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold leading-tight sm:text-4xl">
          Сервис персональных подарков под человека и повод
        </h2>
        <p className="mt-4 text-lg font-bold leading-snug text-[var(--muted)]">
          Вы говорите, кому дарите — мы собираем готовый подарок: дизайн,
          изделие, упаковку и доставку. Один бренд до вручения.
        </p>
        <ul className="mt-6 space-y-3">
          {[
            metrics.citiesLabel,
            `${formatOrderCount(metrics.totalOrders)}+ заказов в открытой статистике`,
            `Средняя оценка ${formatRating(metrics.averageRating)} · повторные покупки каждый месяц`,
          ].map((line) => (
            <li key={line} className="flex gap-3 text-base font-bold">
              <span className="mt-0.5 text-[var(--mint)]" aria-hidden>
                ✔
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/create?scenario=gift"
          className="mt-8 inline-flex rounded-[22px] bg-[var(--accent)] px-6 py-3.5 font-extrabold text-white shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-hover)]"
        >
          Подобрать подарок
        </Link>
      </div>
    </section>
  );
}

export function HomeHow() {
  return (
    <section id="how">
      <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
        Как это работает
      </h2>
      <p className="mt-2 max-w-2xl text-base font-bold text-[var(--muted)]">
        Четыре простых шага — от «кому» до вручения
      </p>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <li
            key={step.n}
            className="rounded-[24px] bg-white p-5 shadow-[var(--shadow-soft)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] font-[family-name:var(--font-unbounded)] text-lg font-semibold text-[var(--accent)]">
              {step.n}
            </span>
            <p className="mt-4 font-[family-name:var(--font-unbounded)] text-lg font-semibold">
              {step.title}
            </p>
            <p className="mt-2 text-sm font-bold leading-snug text-[var(--muted)]">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function HomeTrust() {
  const { metrics } = getTrustSnapshot();

  return (
    <section
      id="trust"
      className="overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)] sm:rounded-[32px]"
    >
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative min-h-[240px] sm:min-h-[280px] lg:min-h-[360px]">
          <Image
            src={HOME_PHOTOS.workshop}
            alt="Изготовление персонального подарка"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--accent)]">
            Почему доверять
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
            Мы отвечаем за подарок до вручения
          </h2>
          <p className="mt-4 text-base font-bold text-[var(--muted)]">
            {formatOrderCount(metrics.totalOrders)} заказов · рейтинг{" "}
            {formatRating(metrics.averageRating)} ·{" "}
            {formatOrderCount(metrics.reviewCount)} отзывов
          </p>
          <ul className="mt-6 space-y-4">
            {[
              {
                t: "Единый сервис",
                d: "Не нужно выбирать типографию и курьера — всё в одном заказе.",
              },
              {
                t: "Срок и статус",
                d: "Видно, когда готов и когда едет. Можно к конкретной дате.",
              },
              {
                t: "Живые отзывы и фото",
                d: "Каждый отзыв и снимок ведут на реальный подарок.",
              },
            ].map((item) => (
              <li key={item.t}>
                <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold">
                  {item.t}
                </p>
                <p className="mt-1 text-base font-bold text-[var(--muted)]">
                  {item.d}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function HomeAbout() {
  const { metrics } = getTrustSnapshot();

  return (
    <section
      id="about"
      className="scroll-mt-24 rounded-[28px] bg-white p-6 shadow-[var(--shadow-soft)] sm:rounded-[32px] sm:p-10"
    >
      <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--accent)]">
        О проекте
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
        Почему именно здесь
      </h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <p className="text-lg font-bold leading-snug text-[var(--foreground)]">
          Gift — сервис персональных подарков. Мы помогаем выбрать идею под
          человека, изготовить изделие и доставить его так, чтобы вручение
          запомнилось. Партнёры производства остаются за кадром — клиент видит
          один бренд и один заказ.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { k: `${formatOrderCount(metrics.totalOrders)}+`, v: "вручений" },
            { k: formatRating(metrics.averageRating), v: "средняя оценка" },
            { k: "12–48 ч", v: "типичный срок" },
            { k: "Красноярск", v: "и доставка по РФ" },
          ].map((stat) => (
            <div
              key={stat.v}
              className="rounded-[20px] bg-[var(--surface-warm)] px-4 py-4"
            >
              <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--accent)]">
                {stat.k}
              </p>
              <p className="mt-1 text-sm font-extrabold text-[var(--muted)]">
                {stat.v}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="rounded-[20px] bg-[var(--accent)] px-5 py-3 font-extrabold text-white"
        >
          Связаться
        </Link>
        <Link
          href="/reviews"
          className="rounded-[20px] border-2 border-[var(--line)] px-5 py-3 font-extrabold"
        >
          Читать отзывы
        </Link>
      </div>
    </section>
  );
}
