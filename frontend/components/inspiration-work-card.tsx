"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadCustomerSession } from "../lib/auth";
import { saveGiftOrder } from "../lib/gift-order";
import {
  formatCount,
  formatPublishedAt,
  hasLikedWork,
  incrementWorkViews,
  recordWantSame,
  toggleWorkLike,
  type InspirationWork,
} from "../lib/inspiration";

type InspirationWorkCardProps = {
  work: InspirationWork;
  /** Count a view when the card mounts in the gallery */
  trackView?: boolean;
};

export function InspirationWorkCard({
  work: initial,
  trackView = false,
}: InspirationWorkCardProps) {
  const router = useRouter();
  const [work, setWork] = useState(initial);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setWork(initial);
  }, [initial]);

  useEffect(() => {
    const session = loadCustomerSession();
    setLiked(hasLikedWork(initial.id, session?.accountId ?? null));
  }, [initial.id]);

  useEffect(() => {
    if (!trackView) return;
    incrementWorkViews(initial.id);
    setWork((w) => ({ ...w, views: w.views + 1 }));
    // once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.id, trackView]);

  function onLike() {
    const session = loadCustomerSession();
    const result = toggleWorkLike(work.id, session?.accountId ?? null);
    if (!result) return;
    setLiked(result.liked);
    setWork((w) => ({ ...w, likes: result.likes }));
  }

  function onWantSame() {
    recordWantSame(work.id);
    setWork((w) => ({ ...w, orderedCount: w.orderedCount + 1 }));

    if (work.items.length > 0) {
      const total = work.items.reduce(
        (sum, item) => sum + item.price * (item.qty ?? 1),
        0,
      );
      saveGiftOrder({
        query: work.occasion,
        items: work.items.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          emoji: item.emoji ?? "🎁",
          kind: "product" as const,
        })),
        total,
        createdAt: new Date().toISOString(),
      });
      router.push(
        `/ideas?q=${encodeURIComponent(work.occasion)}&from=inspiration&work=${work.id}`,
      );
      return;
    }

    router.push(`/ideas?q=${encodeURIComponent(work.occasion)}`);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#ffe0c8] via-[#ffd0c4] to-[#fff4ec]">
        {work.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={work.previewUrl}
            alt={work.occasion}
            className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-6xl" aria-hidden>
            🎁
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold leading-snug">
          {work.occasion}
        </h3>
        <p className="mt-1.5 text-sm font-bold text-[var(--muted)]">
          {formatPublishedAt(work.publishedAt)}
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-[16px] bg-[var(--surface-warm)] px-2 py-2.5">
            <dt className="text-[10px] font-extrabold uppercase tracking-wide text-[var(--muted)]">
              Лайки
            </dt>
            <dd className="mt-0.5 text-base font-extrabold">
              {formatCount(work.likes)}
            </dd>
          </div>
          <div className="rounded-[16px] bg-[var(--surface-warm)] px-2 py-2.5">
            <dt className="text-[10px] font-extrabold uppercase tracking-wide text-[var(--muted)]">
              Просмотры
            </dt>
            <dd className="mt-0.5 text-base font-extrabold">
              {formatCount(work.views)}
            </dd>
          </div>
          <div className="rounded-[16px] bg-[var(--surface-warm)] px-2 py-2.5">
            <dt className="text-[10px] font-extrabold uppercase tracking-wide text-[var(--muted)]">
              Заказали
            </dt>
            <dd className="mt-0.5 text-base font-extrabold">
              {formatCount(work.orderedCount)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={onLike}
            aria-pressed={liked}
            className={`rounded-[16px] border-2 px-3 py-2.5 text-sm font-extrabold transition ${
              liked
                ? "border-[var(--berry)] bg-[var(--berry-soft)] text-[var(--berry)]"
                : "border-[var(--line)] bg-white text-[var(--foreground)] hover:border-[var(--berry)]"
            }`}
          >
            {liked ? "♥" : "♡"} {formatCount(work.likes)}
          </button>
          <button
            type="button"
            onClick={onWantSame}
            className="flex-1 rounded-[16px] bg-[var(--accent)] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[var(--accent-hover)] sm:text-base"
          >
            Хочу такой же
          </button>
        </div>

        <p className="mt-3 text-xs font-bold text-[var(--muted)]">
          {work.authorName}
          {work.giftTitle ? ` · ${work.giftTitle}` : ""}
        </p>
      </div>
    </article>
  );
}

export function InspirationGalleryGrid({
  works,
}: {
  works: InspirationWork[];
}) {
  if (works.length === 0) {
    return (
      <div className="rounded-[28px] bg-white/80 px-6 py-12 text-center shadow-[var(--shadow-soft)]">
        <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Пока пусто
        </p>
        <p className="mt-2 font-bold text-[var(--muted)]">
          Здесь появятся работы, которые авторы разрешили опубликовать.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-flex rounded-[22px] bg-[var(--accent)] px-6 py-3 font-extrabold text-white"
        >
          Создать работу из заказа
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {works.map((work, index) => (
        <li
          key={work.id}
          className="animate-[fade-rise_0.55s_ease-out_both]"
          style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        >
          <InspirationWorkCard work={work} trackView />
        </li>
      ))}
    </ul>
  );
}
