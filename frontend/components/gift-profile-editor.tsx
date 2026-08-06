"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { readReviewPhoto } from "../lib/reviews";
import {
  FAVORITE_CATEGORY_OPTIONS,
  WISH_PRIORITY_LABELS,
  WISH_PRIORITY_TONE,
  addWishItem,
  catalogProductsForWish,
  deleteWishItem,
  ensureGiftProfile,
  markWishFulfilled,
  publicProfileUrl,
  sortWishlist,
  updateGiftProfile,
  type GiftProfile,
  type WishPriority,
} from "../lib/gift-profile";
import {
  getAccountById,
  loadCustomerSession,
} from "../lib/auth";

export function GiftProfileEditor() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<GiftProfile | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [wishTitle, setWishTitle] = useState("");
  const [wishDesc, setWishDesc] = useState("");
  const [wishPriority, setWishPriority] = useState<WishPriority>("want");
  const [wishLink, setWishLink] = useState("");
  const [wishProductId, setWishProductId] = useState("");
  const [ideaDraft, setIdeaDraft] = useState("");

  useEffect(() => {
    const session = loadCustomerSession();
    if (!session) {
      setReady(true);
      return;
    }
    const account = getAccountById(session.accountId);
    const next = ensureGiftProfile(
      session.accountId,
      account?.name || session.name,
    );
    setProfile(next);
    setReady(true);
  }, []);

  const publicUrl = useMemo(() => {
    if (!profile) return "";
    return publicProfileUrl(profile.slug);
  }, [profile]);

  if (!ready) {
    return <p className="font-bold text-[var(--muted)]">Загрузка…</p>;
  }

  if (!profile) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-[var(--shadow)]">
        <h1 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
          Gift Profile
        </h1>
        <p className="mt-3 font-bold text-[var(--muted)]">
          Войдите, чтобы создать публичную страницу подарков.
        </p>
        <Link
          href="/login?next=/profile"
          className="mt-6 inline-flex rounded-[22px] bg-[var(--accent)] px-6 py-3 font-extrabold text-white"
        >
          Войти
        </Link>
      </div>
    );
  }

  function savePatch(patch: Parameters<typeof updateGiftProfile>[1]) {
    setError("");
    const result = updateGiftProfile(profile!.accountId, patch);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setProfile(result);
  }

  async function onPhoto(file: File | null) {
    if (!file) {
      savePatch({ photoDataUrl: null });
      return;
    }
    try {
      const data = await readReviewPhoto(file);
      savePatch({ photoDataUrl: data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка фото");
    }
  }

  function onAddWish(event: FormEvent) {
    event.preventDefault();
    const result = addWishItem(profile!.accountId, {
      title: wishTitle,
      description: wishDesc,
      priority: wishPriority,
      link: wishLink || null,
      productId: wishProductId || null,
    });
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setProfile(result);
    setWishTitle("");
    setWishDesc("");
    setWishLink("");
    setWishProductId("");
    setWishPriority("want");
  }

  function toggleCategory(cat: string) {
    const has = profile!.favoriteCategories.includes(cat);
    const next = has
      ? profile!.favoriteCategories.filter((c) => c !== cat)
      : [...profile!.favoriteCategories, cat];
    savePatch({ favoriteCategories: next });
  }

  const fieldClass =
    "mt-2 w-full rounded-[18px] border-2 border-[var(--line)] bg-white px-4 py-3 text-base font-bold outline-none focus:border-[var(--accent)]";

  const wishlist = sortWishlist(profile.wishlist);

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
        <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
          Gift Profile
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
          Ваша публичная страница
        </h1>
        <p className="mt-2 text-base font-bold text-[var(--muted)]">
          Друзья откроют wish list по ссылке и смогут подарить через сайт.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            readOnly
            value={publicUrl}
            className={`${fieldClass} mt-0 flex-1 bg-[var(--surface-warm)]`}
          />
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(publicUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {
                setError("Не удалось скопировать");
              }
            }}
            className="rounded-[18px] bg-[var(--accent)] px-5 py-3 text-base font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
          >
            {copied ? "Скопировано" : "Копировать ссылку"}
          </button>
          <Link
            href={`/u/${profile.slug}`}
            className="rounded-[18px] border-2 border-[var(--line)] px-5 py-3 text-center text-base font-extrabold transition hover:border-[var(--accent)]"
          >
            Открыть
          </Link>
        </div>

        <label className="mt-4 block text-sm font-extrabold">
          Короткий адрес (slug)
        </label>
        <div className="mt-2 flex gap-2">
          <span className="flex items-center text-sm font-bold text-[var(--muted)]">
            /u/
          </span>
          <input
            value={profile.slug}
            onChange={(e) =>
              setProfile({ ...profile, slug: e.target.value.toLowerCase() })
            }
            onBlur={() => savePatch({ slug: profile.slug })}
            className={`${fieldClass} mt-0`}
          />
        </div>
      </header>

      {error ? (
        <p className="text-sm font-extrabold text-[var(--berry)]">{error}</p>
      ) : null}

      <section className="rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Профиль
        </h2>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row">
          <div className="sm:w-40">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[24px] bg-[var(--surface-warm)] text-5xl">
              {profile.photoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.photoDataUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <span aria-hidden>🎁</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onPhoto(e.target.files?.[0] ?? null)}
              className="mt-3 block w-full text-xs font-bold text-[var(--muted)] file:rounded-[12px] file:border-0 file:bg-[var(--accent-soft)] file:px-3 file:py-2 file:font-extrabold file:text-[var(--accent)]"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="text-sm font-extrabold">Имя</label>
              <input
                value={profile.displayName}
                onChange={(e) =>
                  setProfile({ ...profile, displayName: e.target.value })
                }
                onBlur={() => savePatch({ displayName: profile.displayName })}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-sm font-extrabold">
                Город{" "}
                <span className="font-bold text-[var(--muted)]">(по желанию)</span>
              </label>
              <input
                value={profile.city}
                onChange={(e) =>
                  setProfile({ ...profile, city: e.target.value })
                }
                onBlur={() => savePatch({ city: profile.city })}
                placeholder="Красноярск"
                className={fieldClass}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Приватность
        </h2>
        <div className="mt-4 space-y-3">
          {(
            [
              ["isPublic", "Публичный профиль по ссылке"],
              ["showPhoto", "Показывать фото"],
              ["showCity", "Показывать город"],
              ["showWishlist", "Показывать Wish List"],
              ["showCategories", "Показывать любимые категории"],
              ["showReceived", "Показывать «что уже подарили»"],
              ["showIdeas", "Показывать идеи подарков"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 rounded-[16px] bg-[var(--surface-warm)] px-4 py-3"
            >
              <input
                type="checkbox"
                checked={profile.privacy[key]}
                onChange={(e) =>
                  savePatch({
                    privacy: {
                      ...profile.privacy,
                      [key]: e.target.checked,
                    },
                  })
                }
                className="size-5 accent-[var(--accent)]"
              />
              <span className="text-sm font-extrabold">{label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Любимые категории
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {FAVORITE_CATEGORY_OPTIONS.map((cat) => {
            const on = profile.favoriteCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`rounded-[14px] border-2 px-3 py-2 text-sm font-extrabold transition ${
                  on
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--line)] bg-[var(--surface-warm)]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Wish List
        </h2>

        <form onSubmit={onAddWish} className="mt-5 space-y-3">
          <input
            required
            value={wishTitle}
            onChange={(e) => setWishTitle(e.target.value)}
            placeholder="Название"
            className={fieldClass}
          />
          <textarea
            rows={2}
            value={wishDesc}
            onChange={(e) => setWishDesc(e.target.value)}
            placeholder="Описание"
            className={fieldClass}
          />
          <div className="flex flex-wrap gap-2">
            {(Object.keys(WISH_PRIORITY_LABELS) as WishPriority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setWishPriority(p)}
                className={`rounded-[14px] border-2 px-3 py-2 text-sm font-extrabold ${
                  wishPriority === p
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--line)]"
                }`}
              >
                {WISH_PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
          <input
            value={wishLink}
            onChange={(e) => setWishLink(e.target.value)}
            placeholder="Ссылка (необязательно)"
            className={fieldClass}
          />
          <select
            value={wishProductId}
            onChange={(e) => setWishProductId(e.target.value)}
            className={fieldClass}
          >
            <option value="">Товар на сайте — нет</option>
            {catalogProductsForWish().map((p) => (
              <option key={p.id} value={p.id}>
                {p.emoji} {p.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full rounded-[18px] bg-[var(--accent)] px-5 py-3 font-extrabold text-white"
          >
            Добавить в Wish List
          </button>
        </form>

        <ul className="mt-6 space-y-3">
          {wishlist.map((item) => (
            <li
              key={item.id}
              className={`rounded-[18px] border-2 px-4 py-3 ${
                item.fulfilled
                  ? "border-[var(--line)] opacity-60"
                  : "border-[var(--line)] bg-[var(--surface-warm)]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${WISH_PRIORITY_TONE[item.priority]}`}
                  >
                    {WISH_PRIORITY_LABELS[item.priority]}
                  </span>
                  <p className="mt-2 font-extrabold">{item.title}</p>
                  {item.description ? (
                    <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  {!item.fulfilled ? (
                    <button
                      type="button"
                      onClick={() => {
                        const result = markWishFulfilled(
                          profile.accountId,
                          item.id,
                          "Отмечено мной",
                        );
                        if (!("error" in result)) setProfile(result);
                      }}
                      className="text-xs font-extrabold text-[var(--mint)] hover:underline"
                    >
                      Получено
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      const result = deleteWishItem(
                        profile.accountId,
                        item.id,
                      );
                      if (!("error" in result)) setProfile(result);
                    }}
                    className="text-xs font-extrabold text-[var(--berry)] hover:underline"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Что уже подарили
        </h2>
        {profile.receivedGifts.length === 0 ? (
          <p className="mt-3 text-sm font-bold text-[var(--muted)]">
            Появится, когда друзья отметят подарок с вашего wish list или вы
            добавите запись.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {profile.receivedGifts.map((g) => (
              <li
                key={g.id}
                className="rounded-[16px] bg-[var(--surface-warm)] px-4 py-3 text-sm font-bold"
              >
                <span className="font-extrabold">{g.title}</span>
                <span className="text-[var(--muted)]">
                  {" "}
                  · от {g.fromLabel} · {g.date}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Идеи подарков
        </h2>
        <p className="mt-2 text-sm font-bold text-[var(--muted)]">
          Короткие подсказки друзьям (не жёсткий wish list)
        </p>
        <div className="mt-4 flex gap-2">
          <input
            value={ideaDraft}
            onChange={(e) => setIdeaDraft(e.target.value)}
            placeholder="Что-то уютное для дома"
            className={`${fieldClass} mt-0`}
          />
          <button
            type="button"
            onClick={() => {
              const text = ideaDraft.trim();
              if (!text) return;
              savePatch({ giftIdeas: [...profile.giftIdeas, text] });
              setIdeaDraft("");
            }}
            className="rounded-[18px] bg-[var(--foreground)] px-4 py-3 font-extrabold text-white"
          >
            +
          </button>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {profile.giftIdeas.map((idea, i) => (
            <li
              key={`${idea}-${i}`}
              className="flex items-center gap-2 rounded-[14px] bg-[var(--surface-warm)] px-3 py-2 text-sm font-extrabold"
            >
              {idea}
              <button
                type="button"
                onClick={() =>
                  savePatch({
                    giftIdeas: profile.giftIdeas.filter((_, j) => j !== i),
                  })
                }
                className="text-[var(--berry)]"
                aria-label="Удалить"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
