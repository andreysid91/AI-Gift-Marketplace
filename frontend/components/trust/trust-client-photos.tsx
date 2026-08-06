import Image from "next/image";
import Link from "next/link";
import type { TrustClientPhoto } from "../../lib/trust";

type TrustClientPhotosProps = {
  photos: TrustClientPhoto[];
};

export function TrustClientPhotos({ photos }: TrustClientPhotosProps) {
  return (
    <section id="client-photos">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
            Фото клиентов
          </h2>
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            Настоящие вручения — нажмите, чтобы открыть подарок
          </p>
        </div>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {photos.map((photo, index) => (
          <li key={photo.id}>
            <Link
              href={photo.giftHref}
              className="group relative block aspect-square overflow-hidden rounded-[22px] shadow-[var(--shadow-soft)]"
              style={{
                animation: `fade-rise 0.5s ease-out ${index * 40}ms both`,
              }}
            >
              <Image
                src={photo.imageUrl}
                alt={photo.caption}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 16vw"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 text-xs font-extrabold text-white sm:text-sm">
                {photo.caption}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
