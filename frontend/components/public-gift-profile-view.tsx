"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  WISH_PRIORITY_LABELS,
  WISH_PRIORITY_TONE,
  getProfileBySlug,
  markWishFulfilled,
  sortWishlist,
  toPublicProfile,
  wishGiftHref,
  type PublicGiftProfile,
  type WishListItem,
} from "../lib/gift-profile";
import { loadCustomerSession } from "../lib/auth";

type PublicGiftProfileViewProps = {
  slug: string;
};

export function PublicGiftProfileView({ slug }: PublicGiftProfileViewProps) {
  const [ready, setReady] = useState(false);
  const [publicProfile, setPublicProfile] = useState<PublicGiftProfile | null>(
    null,
  );
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const profile = getProfileBySlug(slug);
    const session = loadCustomerSession();
    setIsOwner(Boolean(session && profile?.accountId === session.accountId));
    setAccountId(profile?.accountId ?? null);

    if (!profile) {
      setPublicProfile(null);
      setReady(true);
      return;
    }
    const pub = toPublicProfile(profile);
    if (!pub) {
      setPrivateProfile(true);
      setPublicProfile(null);
    } else {
      setPrivateProfile(false);
      setPublicProfile(pub);
    }
    setReady(true);
  }, [slug, message]);

  if (!ready) {
    return <p className="font-bold text-[var(--muted)]">Загрузка…</p>;
  }

  if (privateProfile) {
    return (
      <div className="rounded-[32px] bg-white p-8 text-center shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
          Профиль скрыт
        </h1>
        <p className="mt-3 font-bold text-[var(--muted)]">
          Владелец отключил публичный доступ.
        </p>
        <Link href="/" className="mt-6 inline-flex font-extrabold text-[var(--accent)] hover:underline">
          На главную
        </Link>
      </div>
    );
  }

  if (!publicProfile) {
    return (
      <div className="rounded-[32px] bg-white p-8 text-center shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
          Профиль не найден
        </h1>
        <Link href="/" className="mt-6 inline-flex font-extrabold text-[var(--accent)] hover:underline">
          На главную
        </Link>
      </div>
    );
  }

  const wishlist = sortWishlist(publicProfile.wishlist);

  function onGiftThroughSite(item: WishListItem) {
    const href = wishGiftHref(item);
    if (href) window.location.href = href;
  }

  function onMarkGifted(item: WishListItem) {
    if (!accountId) return;
    if (
      !confirm(
        `Отметить «${item.title}» как подаренное? Попадёт в «Что уже подарили».`,
      )
    ) {
      return;
    }
    const session = loadCustomerSession();
    const fromLabel = session?.name || "Друг";
    const result = markWishFulfilled(accountId, item.id, fromLabel);
    if (!("error" in result)) {
      setMessage(`Подарок «${item.title}» отмечен`);
    }
  }

  return (
    <div className="space-y-8">
      <header className="overflow-hidden rounded-[32px] bg-white shadow-[var(--shadow)]">
        <div className="bg-gradient-to-br from-[#ffe0c8] via-[#ffd0c4] to-[#fff4ec] px-6 py-10 sm:px-10">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end">
            <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-[28px] bg-white text-5xl shadow-[var(--shadow-soft)] sm:size-32">
              {publicProfile.photoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={publicProfile.photoDataUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <span aria-hidden>🎁</span>
              )}
            </div>
            <div className="text-center sm:pb-1 sm:text-left">
              <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
                Gift Profile
              </p>
              <h1 className="mt-1 font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
                {publicProfile.displayName}
              </h1>
              {publicProfile.city ? (
                <p className="mt-2 text-lg font-bold text-[var(--muted)]">
                  {publicProfile.city}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        {isOwner ? (
          <div className="border-t border-[var(--line)] px-6 py-3 sm:px-10">
            <Link
              href="/profile"
              className="text-sm font-extrabold text-[var(--accent)] hover:underline"
            >
              Редактировать профиль →
            </Link>
          </div>
        ) : null}
      </header>

      {message ? (
        <p className="rounded-[16px] bg-[var(--mint-soft)] px-4 py-3 text-sm font-extrabold text-[var(--mint)]">
          {message}
        </p>
      ) : null}

      {publicProfile.favoriteCategories.length > 0 ? (
        <section>
          <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Любимые категории
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {publicProfile.favoriteCategories.map((cat) => (
              <li
                key={cat}
                className="rounded-[14px] bg-white px-3 py-2 text-sm font-extrabold shadow-[var(--shadow-soft)]"
              >
                {cat}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Wish List
        </h2>
        {wishlist.length === 0 ? (
          <p className="mt-3 font-bold text-[var(--muted)]">
            Пока пусто — загляните позже.
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {wishlist.map((item) => {
              const giftHref = wishGiftHref(item);
              return (
                <li
                  key={item.id}
                  className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6"
                >
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${WISH_PRIORITY_TONE[item.priority]}`}
                  >
                    {WISH_PRIORITY_LABELS[item.priority]}
                  </span>
                  <h3 className="mt-3 font-[family-name:var(--font-unbounded)] text-xl font-semibold">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="mt-2 text-base font-bold text-[var(--muted)]">
                      {item.description}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {giftHref ? (
                      <button
                        type="button"
                        onClick={() => onGiftThroughSite(item)}
                        className="rounded-[16px] bg-[var(--accent)] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
                      >
                        Подарить через сайт
                      </button>
                    ) : null}
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-[16px] border-2 border-[var(--line)] px-4 py-2.5 text-sm font-extrabold transition hover:border-[var(--accent)]"
                      >
                        Открыть ссылку
                      </a>
                    ) : null}
                    {!isOwner ? (
                      <button
                        type="button"
                        onClick={() => onMarkGifted(item)}
                        className="rounded-[16px] border-2 border-[var(--mint)] px-4 py-2.5 text-sm font-extrabold text-[var(--mint)]"
                      >
                        Я уже подарил(а)
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {publicProfile.receivedGifts.length > 0 ? (
        <section>
          <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Что уже подарили
          </h2>
          <p className="mt-2 text-sm font-bold text-[var(--muted)]">
            Чтобы не дарить одно и то же
          </p>
          <ul className="mt-4 space-y-2">
            {publicProfile.receivedGifts.map((g) => (
              <li
                key={g.id}
                className="rounded-[18px] bg-white px-4 py-3 text-sm font-bold shadow-[var(--shadow-soft)]"
              >
                <span className="font-extrabold">{g.title}</span>
                <span className="text-[var(--muted)]">
                  {" "}
                  · {g.fromLabel} · {g.date}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {publicProfile.giftIdeas.length > 0 ? (
        <section>
          <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Идеи подарков
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {publicProfile.giftIdeas.map((idea, i) => (
              <li
                key={`${idea}-${i}`}
                className="rounded-[14px] bg-white px-3 py-2 text-sm font-extrabold shadow-[var(--shadow-soft)]"
              >
                {idea}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="rounded-[20px] border border-dashed border-[var(--line)] bg-white/70 px-4 py-3 text-sm font-bold text-[var(--muted)]">
        Коллективный подарок («скинуться») — в Roadmap, скоро.
      </p>
    </div>
  );
}
