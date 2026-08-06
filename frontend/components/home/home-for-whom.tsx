import Image from "next/image";
import Link from "next/link";
import {
  HUB_RECIPIENTS,
  HUB_RECIPIENTS_ALL_HREF,
} from "../../lib/gift-hub";
import { HOME_PHOTOS } from "../../lib/home-media";

const RECIPIENT_PHOTO: Record<string, string> = {
  mom: HOME_PHOTOS.grandma,
  dad: HOME_PHOTOS.mugWarm,
  girlfriend: HOME_PHOTOS.coupleGift,
  boyfriend: HOME_PHOTOS.teeWear,
  wife: HOME_PHOTOS.coupleGift,
  husband: HOME_PHOTOS.smileOpen,
  brother: HOME_PHOTOS.teeWear,
  sister: HOME_PHOTOS.birthday,
  grandma: HOME_PHOTOS.grandma,
  grandpa: HOME_PHOTOS.mugHands,
  "friend-m": HOME_PHOTOS.smileOpen,
  "friend-f": HOME_PHOTOS.birthday,
  colleague: HOME_PHOTOS.officeMerch,
  boss: HOME_PHOTOS.officeMerch,
  teacher: HOME_PHOTOS.packing,
  child: HOME_PHOTOS.kids,
};

export function HomeForWhom() {
  return (
    <section id="for-whom" aria-labelledby="for-whom-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="for-whom-title"
            className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl"
          >
            Кому подарок
          </h2>
          <p className="mt-2 max-w-xl text-base font-bold text-[var(--muted)]">
            Выберите человека — сразу к подбору идеи
          </p>
        </div>
        <Link
          href={HUB_RECIPIENTS_ALL_HREF}
          className="text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          Смотреть все →
        </Link>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {HUB_RECIPIENTS.map((person, index) => {
          const photo = RECIPIENT_PHOTO[person.id] ?? HOME_PHOTOS.packing;
          return (
            <li key={person.id} className="min-w-0">
              <Link
                href={person.href}
                className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
                style={{
                  animation: `fade-rise 0.5s ease-out ${index * 30}ms both`,
                }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={photo}
                    alt={person.label}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 12vw"
                  />
                </div>
                <p className="truncate px-2 py-2.5 text-center font-[family-name:var(--font-unbounded)] text-sm font-semibold sm:py-3 sm:text-base">
                  {person.label}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-4">
        <Link
          href={HUB_RECIPIENTS_ALL_HREF}
          className="flex items-center justify-center rounded-[22px] border-2 border-dashed border-[var(--line)] bg-white/80 px-4 py-4 text-base font-extrabold text-[var(--accent)] transition hover:border-[var(--accent)] hover:bg-white"
        >
          Смотреть все сценарии →
        </Link>
      </div>
    </section>
  );
}
