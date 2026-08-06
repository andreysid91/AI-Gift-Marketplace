import {
  loadAdminOrders,
  type OrderLineItem,
} from "./admin-mock";
import { isTerminalStatus } from "./order-pipeline";
import { readReviewPhoto } from "./reviews";

export const INSPIRATION_STORAGE_KEY = "ai-gift-inspiration-works";
export const INSPIRATION_LIKES_KEY = "ai-gift-inspiration-liked";

export type InspirationWork = {
  id: string;
  orderId: string;
  accountId: string;
  authorName: string;
  /** Preview image (data URL) */
  previewUrl: string;
  /** e.g. «Подарок маме» */
  occasion: string;
  publishedAt: string;
  likes: number;
  views: number;
  /** How many times «Хочу такой же» led to intent / order */
  orderedCount: number;
  /**
   * User opted in to public gallery.
   * Default when creating: false — private until checked.
   */
  publishToGallery: boolean;
  giftTitle: string;
  items: OrderLineItem[];
};

export const OCCASION_SUGGESTIONS = [
  "Подарок маме",
  "Подарок папе",
  "Подарок жене",
  "Подарок мужу",
  "День рождения",
  "Годовщина",
  "Свадьба",
  "Коллеге",
  "Учителю",
  "Новый год",
] as const;

const SEED_WORKS: InspirationWork[] = [
  {
    id: "INSP-SEED-01",
    orderId: "ORD-SEED-INSP-01",
    accountId: "seed",
    authorName: "Елена М.",
    previewUrl: "",
    occasion: "Подарок маме",
    publishedAt: "2026-07-28T14:20:00.000Z",
    likes: 128,
    views: 2140,
    orderedCount: 47,
    publishToGallery: true,
    giftTitle: "Набор «Для мамы»",
    items: [
      { id: "mug", title: "Кружка", price: 990, emoji: "☕" },
      { id: "tea", title: "Чай", price: 450, emoji: "🍵" },
      { id: "box", title: "Коробка", price: 350, emoji: "📦" },
    ],
  },
  {
    id: "INSP-SEED-02",
    orderId: "ORD-SEED-INSP-02",
    accountId: "seed",
    authorName: "Дмитрий К.",
    previewUrl: "",
    occasion: "Подарок папе",
    publishedAt: "2026-07-22T09:10:00.000Z",
    likes: 96,
    views: 1580,
    orderedCount: 31,
    publishToGallery: true,
    giftTitle: "Экспресс для папы",
    items: [
      { id: "mug", title: "Кружка", price: 990, emoji: "☕" },
      { id: "socks", title: "Носки", price: 690, emoji: "🧦" },
    ],
  },
  {
    id: "INSP-SEED-03",
    orderId: "ORD-SEED-INSP-03",
    accountId: "seed",
    authorName: "Ольга Р.",
    previewUrl: "",
    occasion: "Годовщина",
    publishedAt: "2026-07-15T18:45:00.000Z",
    likes: 211,
    views: 3204,
    orderedCount: 62,
    publishToGallery: true,
    giftTitle: "Холст с фото",
    items: [
      { id: "canvas", title: "Холст", price: 2490, emoji: "🖼️" },
      { id: "wine", title: "Вино", price: 1200, emoji: "🍷" },
    ],
  },
];

function newId(): string {
  return `INSP-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;
}

function saveStoredWorks(works: InspirationWork[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(INSPIRATION_STORAGE_KEY, JSON.stringify(works));
  window.dispatchEvent(new Event("ai-gift-inspiration-change"));
}

function loadStoredWorks(): InspirationWork[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INSPIRATION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InspirationWork[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadAllWorks(): InspirationWork[] {
  const stored = loadStoredWorks();
  if (typeof window === "undefined" && stored.length === 0) {
    return [...SEED_WORKS];
  }
  const storedIds = new Set(stored.map((w) => w.id));
  const seeds = SEED_WORKS.filter((s) => !storedIds.has(s.id));
  return [...stored, ...seeds];
}

/** Only public works — gallery source of truth */
export function getPublicWorks(): InspirationWork[] {
  return loadAllWorks()
    .filter((w) => w.publishToGallery)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getWorkById(id: string): InspirationWork | null {
  return loadAllWorks().find((w) => w.id === id) ?? null;
}

export function getWorkByOrderId(orderId: string): InspirationWork | null {
  return loadAllWorks().find((w) => w.orderId === orderId) ?? null;
}

export function getWorksByAccount(accountId: string): InspirationWork[] {
  return loadAllWorks().filter((w) => w.accountId === accountId);
}

export type CreateInspirationInput = {
  orderId: string;
  accountId: string;
  authorName: string;
  previewUrl: string;
  occasion: string;
  /** Must be explicit — default path should pass false */
  publishToGallery: boolean;
};

export type CreateInspirationResult =
  | { ok: true; work: InspirationWork }
  | { ok: false; message: string };

/**
 * Create a work from a completed order.
 * Gallery publish is opt-in; default in UI must be unchecked (false).
 */
export function createInspirationWork(
  input: CreateInspirationInput,
  accountOrderIds: string[],
): CreateInspirationResult {
  if (!accountOrderIds.includes(input.orderId)) {
    return { ok: false, message: "Этот заказ не принадлежит вашему аккаунту" };
  }

  const order = loadAdminOrders().find((o) => o.id === input.orderId);
  if (!order) {
    return { ok: false, message: "Заказ не найден" };
  }
  if (!isTerminalStatus(order.status)) {
    return {
      ok: false,
      message: "Работу можно создать только после выполненного заказа",
    };
  }

  if (getWorkByOrderId(input.orderId)) {
    return { ok: false, message: "Работа по этому заказу уже создана" };
  }

  const occasion = input.occasion.trim();
  if (occasion.length < 2) {
    return { ok: false, message: "Укажите повод" };
  }

  if (!input.previewUrl) {
    return { ok: false, message: "Добавьте превью работы (фото подарка)" };
  }

  const work: InspirationWork = {
    id: newId(),
    orderId: input.orderId,
    accountId: input.accountId,
    authorName: input.authorName.trim() || order.clientName,
    previewUrl: input.previewUrl,
    occasion,
    publishedAt: new Date().toISOString(),
    likes: 0,
    views: 0,
    orderedCount: 0,
    publishToGallery: Boolean(input.publishToGallery),
    giftTitle: order.title,
    items: [...order.products, ...order.addons],
  };

  const list = loadStoredWorks();
  list.unshift(work);
  saveStoredWorks(list);

  return { ok: true, work };
}

function updateWork(
  id: string,
  patch: (work: InspirationWork) => InspirationWork,
): InspirationWork | null {
  const current = getWorkById(id);
  if (!current) return null;
  const next = patch(current);
  const stored = loadStoredWorks();
  const idx = stored.findIndex((w) => w.id === id);
  if (idx >= 0) stored[idx] = next;
  else stored.unshift(next);
  saveStoredWorks(stored);
  return next;
}

export function incrementWorkViews(id: string): void {
  updateWork(id, (w) => ({ ...w, views: w.views + 1 }));
}

export function toggleWorkLike(
  id: string,
  accountId: string | null,
): { liked: boolean; likes: number } | null {
  const likedSet = loadLikedIds(accountId);
  const already = likedSet.has(id);
  if (already) {
    likedSet.delete(id);
    saveLikedIds(accountId, likedSet);
    const work = updateWork(id, (w) => ({
      ...w,
      likes: Math.max(0, w.likes - 1),
    }));
    return work ? { liked: false, likes: work.likes } : null;
  }
  likedSet.add(id);
  saveLikedIds(accountId, likedSet);
  const work = updateWork(id, (w) => ({ ...w, likes: w.likes + 1 }));
  return work ? { liked: true, likes: work.likes } : null;
}

export function hasLikedWork(
  id: string,
  accountId: string | null,
): boolean {
  return loadLikedIds(accountId).has(id);
}

/** «Хочу такой же» — count as order intent */
export function recordWantSame(id: string): InspirationWork | null {
  return updateWork(id, (w) => ({
    ...w,
    orderedCount: w.orderedCount + 1,
  }));
}

function likeStorageKey(accountId: string | null) {
  return `${INSPIRATION_LIKES_KEY}:${accountId ?? "anon"}`;
}

function loadLikedIds(accountId: string | null): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(likeStorageKey(accountId));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveLikedIds(accountId: string | null, ids: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(likeStorageKey(accountId), JSON.stringify([...ids]));
}

export function formatPublishedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("ru-RU").format(n);
}

export { readReviewPhoto as readWorkPhoto };
