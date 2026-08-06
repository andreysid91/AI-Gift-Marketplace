/**
 * Gift Profile — public page per customer with wishlist & privacy.
 */

import { GIFT_CONSTRUCTOR_ITEMS } from "./scenario-catalog";

export const GIFT_PROFILES_STORAGE_KEY = "ai-gift-profiles";

export type WishPriority = "love" | "want" | "nice";

export const WISH_PRIORITY_LABELS: Record<WishPriority, string> = {
  love: "Очень хочу",
  want: "Хочу",
  nice: "Было бы неплохо",
};

export const WISH_PRIORITY_TONE: Record<WishPriority, string> = {
  love: "bg-[var(--berry-soft)] text-[var(--berry)]",
  want: "bg-[var(--accent-soft)] text-[var(--accent)]",
  nice: "bg-[var(--secondary-soft)] text-[#c56a12]",
};

export type WishListItem = {
  id: string;
  title: string;
  description: string;
  priority: WishPriority;
  /** External URL (optional) */
  link: string | null;
  /** Catalog product id if giftable on site */
  productId: string | null;
  /** Marked as already gifted */
  fulfilled: boolean;
  createdAt: string;
};

export type ReceivedGiftEntry = {
  id: string;
  title: string;
  fromLabel: string;
  date: string;
  note?: string;
};

export type GiftProfilePrivacy = {
  /** Profile reachable by public link */
  isPublic: boolean;
  showPhoto: boolean;
  showCity: boolean;
  showWishlist: boolean;
  showReceived: boolean;
  showIdeas: boolean;
  showCategories: boolean;
};

export type GiftProfile = {
  accountId: string;
  /** Public slug → /u/{slug} */
  slug: string;
  displayName: string;
  photoDataUrl: string | null;
  city: string;
  favoriteCategories: string[];
  wishlist: WishListItem[];
  receivedGifts: ReceivedGiftEntry[];
  giftIdeas: string[];
  privacy: GiftProfilePrivacy;
  createdAt: string;
  updatedAt: string;
};

export const FAVORITE_CATEGORY_OPTIONS = [
  "Кружки",
  "Футболки",
  "Холсты",
  "Пазлы",
  "Фотопечать",
  "Сладости",
  "Чай и кофе",
  "Свечи",
  "Декор",
  "Для дома",
  "Юмор",
  "Романтика",
] as const;

export const DEFAULT_PRIVACY: GiftProfilePrivacy = {
  isPublic: true,
  showPhoto: true,
  showCity: true,
  showWishlist: true,
  showReceived: true,
  showIdeas: true,
  showCategories: true,
};

function newWishId(): string {
  return `WISH-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;
}

function slugify(name: string, accountId: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/ё/g, "e")
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  const tail = accountId.replace(/^U-/, "").slice(-6).toLowerCase();
  const latin = base
    .replace(/[а-я]/g, (ch) => {
      const map: Record<string, string> = {
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ж: "zh",
        з: "z",
        и: "i",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "h",
        ц: "ts",
        ч: "ch",
        ш: "sh",
        щ: "sch",
        ъ: "",
        ы: "y",
        ь: "",
        э: "e",
        ю: "yu",
        я: "ya",
      };
      return map[ch] ?? "";
    })
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${latin || "gift"}-${tail}`;
}

export function loadAllProfiles(): GiftProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GIFT_PROFILES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GiftProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAllProfiles(list: GiftProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GIFT_PROFILES_STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("ai-gift-profiles-change"));
}

export function getProfileByAccountId(
  accountId: string,
): GiftProfile | null {
  return loadAllProfiles().find((p) => p.accountId === accountId) ?? null;
}

export function getProfileBySlug(slug: string): GiftProfile | null {
  const key = slug.trim().toLowerCase();
  return (
    loadAllProfiles().find((p) => p.slug.toLowerCase() === key) ?? null
  );
}

export function ensureGiftProfile(
  accountId: string,
  displayName: string,
): GiftProfile {
  const existing = getProfileByAccountId(accountId);
  if (existing) return existing;

  const now = new Date().toISOString();
  let slug = slugify(displayName || "user", accountId);
  const all = loadAllProfiles();
  if (all.some((p) => p.slug.toLowerCase() === slug.toLowerCase())) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
  }

  const profile: GiftProfile = {
    accountId,
    slug,
    displayName: displayName.trim() || "Пользователь",
    photoDataUrl: null,
    city: "",
    favoriteCategories: [],
    wishlist: [],
    receivedGifts: [],
    giftIdeas: [],
    privacy: { ...DEFAULT_PRIVACY },
    createdAt: now,
    updatedAt: now,
  };
  all.unshift(profile);
  saveAllProfiles(all);
  return profile;
}

export type GiftProfileUpdate = Partial<
  Pick<
    GiftProfile,
    | "displayName"
    | "photoDataUrl"
    | "city"
    | "favoriteCategories"
    | "giftIdeas"
    | "privacy"
    | "slug"
  >
>;

export function updateGiftProfile(
  accountId: string,
  patch: GiftProfileUpdate,
): GiftProfile | { error: string } {
  const list = loadAllProfiles();
  const idx = list.findIndex((p) => p.accountId === accountId);
  if (idx < 0) return { error: "Профиль не найден" };

  if (patch.slug) {
    const nextSlug = patch.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (nextSlug.length < 3) return { error: "Ссылка слишком короткая" };
    if (
      list.some(
        (p) =>
          p.accountId !== accountId &&
          p.slug.toLowerCase() === nextSlug,
      )
    ) {
      return { error: "Такая ссылка уже занята" };
    }
    patch = { ...patch, slug: nextSlug };
  }

  list[idx] = {
    ...list[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveAllProfiles(list);
  return list[idx];
}

export type WishInput = {
  title: string;
  description?: string;
  priority: WishPriority;
  link?: string | null;
  productId?: string | null;
};

export function addWishItem(
  accountId: string,
  input: WishInput,
): GiftProfile | { error: string } {
  const title = input.title.trim();
  if (!title) return { error: "Укажите название" };
  const list = loadAllProfiles();
  const idx = list.findIndex((p) => p.accountId === accountId);
  if (idx < 0) return { error: "Профиль не найден" };

  const item: WishListItem = {
    id: newWishId(),
    title,
    description: (input.description ?? "").trim(),
    priority: input.priority,
    link: input.link?.trim() || null,
    productId: input.productId || null,
    fulfilled: false,
    createdAt: new Date().toISOString(),
  };
  list[idx] = {
    ...list[idx],
    wishlist: [item, ...list[idx].wishlist],
    updatedAt: new Date().toISOString(),
  };
  saveAllProfiles(list);
  return list[idx];
}

export function updateWishItem(
  accountId: string,
  wishId: string,
  patch: Partial<WishInput> & { fulfilled?: boolean },
): GiftProfile | { error: string } {
  const list = loadAllProfiles();
  const idx = list.findIndex((p) => p.accountId === accountId);
  if (idx < 0) return { error: "Профиль не найден" };
  const wishlist = list[idx].wishlist.map((w) => {
    if (w.id !== wishId) return w;
    return {
      ...w,
      title: patch.title?.trim() ?? w.title,
      description:
        patch.description !== undefined
          ? patch.description.trim()
          : w.description,
      priority: patch.priority ?? w.priority,
      link:
        patch.link !== undefined ? patch.link?.trim() || null : w.link,
      productId:
        patch.productId !== undefined ? patch.productId : w.productId,
      fulfilled:
        patch.fulfilled !== undefined ? patch.fulfilled : w.fulfilled,
    };
  });
  list[idx] = {
    ...list[idx],
    wishlist,
    updatedAt: new Date().toISOString(),
  };
  saveAllProfiles(list);
  return list[idx];
}

export function deleteWishItem(
  accountId: string,
  wishId: string,
): GiftProfile | { error: string } {
  const list = loadAllProfiles();
  const idx = list.findIndex((p) => p.accountId === accountId);
  if (idx < 0) return { error: "Профиль не найден" };
  list[idx] = {
    ...list[idx],
    wishlist: list[idx].wishlist.filter((w) => w.id !== wishId),
    updatedAt: new Date().toISOString(),
  };
  saveAllProfiles(list);
  return list[idx];
}

export function markWishFulfilled(
  accountId: string,
  wishId: string,
  fromLabel = "Друг",
): GiftProfile | { error: string } {
  const list = loadAllProfiles();
  const idx = list.findIndex((p) => p.accountId === accountId);
  if (idx < 0) return { error: "Профиль не найден" };
  const wish = list[idx].wishlist.find((w) => w.id === wishId);
  if (!wish) return { error: "Желание не найдено" };

  const received: ReceivedGiftEntry = {
    id: `RG-${Date.now().toString(36)}`,
    title: wish.title,
    fromLabel,
    date: new Date().toISOString().slice(0, 10),
    note: "Подарено через wish list",
  };

  list[idx] = {
    ...list[idx],
    wishlist: list[idx].wishlist.map((w) =>
      w.id === wishId ? { ...w, fulfilled: true } : w,
    ),
    receivedGifts: [received, ...list[idx].receivedGifts],
    updatedAt: new Date().toISOString(),
  };
  saveAllProfiles(list);
  return list[idx];
}

export function addReceivedGift(
  accountId: string,
  entry: Omit<ReceivedGiftEntry, "id">,
): GiftProfile | { error: string } {
  const list = loadAllProfiles();
  const idx = list.findIndex((p) => p.accountId === accountId);
  if (idx < 0) return { error: "Профиль не найден" };
  const received: ReceivedGiftEntry = {
    ...entry,
    id: `RG-${Date.now().toString(36)}`,
  };
  list[idx] = {
    ...list[idx],
    receivedGifts: [received, ...list[idx].receivedGifts],
    updatedAt: new Date().toISOString(),
  };
  saveAllProfiles(list);
  return list[idx];
}

/** Public view respecting privacy flags */
export type PublicGiftProfile = {
  slug: string;
  displayName: string;
  photoDataUrl: string | null;
  city: string | null;
  favoriteCategories: string[];
  wishlist: WishListItem[];
  receivedGifts: ReceivedGiftEntry[];
  giftIdeas: string[];
  isPublic: boolean;
};

export function toPublicProfile(profile: GiftProfile): PublicGiftProfile | null {
  if (!profile.privacy.isPublic) return null;
  const p = profile.privacy;
  return {
    slug: profile.slug,
    displayName: profile.displayName,
    photoDataUrl: p.showPhoto ? profile.photoDataUrl : null,
    city: p.showCity && profile.city.trim() ? profile.city.trim() : null,
    favoriteCategories: p.showCategories ? profile.favoriteCategories : [],
    wishlist: p.showWishlist
      ? profile.wishlist.filter((w) => !w.fulfilled)
      : [],
    receivedGifts: p.showReceived ? profile.receivedGifts : [],
    giftIdeas: p.showIdeas ? profile.giftIdeas : [],
    isPublic: true,
  };
}

export function publicProfileUrl(slug: string, origin?: string): string {
  const path = `/u/${encodeURIComponent(slug)}`;
  if (origin) return `${origin}${path}`;
  if (typeof window !== "undefined") return `${window.location.origin}${path}`;
  return path;
}

export function catalogProductsForWish(): Array<{
  id: string;
  title: string;
  emoji: string;
}> {
  return GIFT_CONSTRUCTOR_ITEMS.map((item) => ({
    id: item.id,
    title: item.title,
    emoji: item.emoji,
  }));
}

export function wishGiftHref(item: WishListItem): string | null {
  if (!item.productId) return null;
  const known = GIFT_CONSTRUCTOR_ITEMS.some((p) => p.id === item.productId);
  if (!known) return null;
  if (["mug", "tee", "canvas", "puzzle"].includes(item.productId)) {
    return `/configure?product=${item.productId}&wish=${item.id}`;
  }
  return `/ideas?q=${encodeURIComponent(item.title)}&product=${item.productId}`;
}

export function sortWishlist(items: WishListItem[]): WishListItem[] {
  const rank: Record<WishPriority, number> = { love: 0, want: 1, nice: 2 };
  return [...items].sort((a, b) => {
    if (a.fulfilled !== b.fulfilled) return a.fulfilled ? 1 : -1;
    return rank[a.priority] - rank[b.priority];
  });
}
