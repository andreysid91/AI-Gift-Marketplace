import {
  loadAdminOrders,
  type AdminOrder,
} from "./admin-mock";
import { isTerminalStatus } from "./order-pipeline";

export const REVIEWS_STORAGE_KEY = "ai-gift-reviews";

export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export type GiftReview = {
  id: string;
  orderId: string;
  accountId: string;
  clientName: string;
  rating: ReviewRating;
  comment: string;
  /** data URL or empty */
  photoDataUrl: string | null;
  /** Permission to publish on site */
  showOnSite: boolean;
  createdAt: string;
  /** Gift title snapshot */
  giftTitle: string;
};

/** Seeded public reviews so the homepage section is never empty in demo */
const SEED_PUBLIC_REVIEWS: GiftReview[] = [
  {
    id: "REV-SEED-01",
    orderId: "ORD-SEED-01",
    accountId: "seed",
    clientName: "Марина К.",
    rating: 5,
    comment:
      "Папа был в восторге! Кружка с фото и набор чая пришли вовремя, упаковка красивая.",
    photoDataUrl: null,
    showOnSite: true,
    createdAt: "2026-07-20",
    giftTitle: "Подарок папе",
  },
  {
    id: "REV-SEED-02",
    orderId: "ORD-SEED-02",
    accountId: "seed",
    clientName: "Игорь С.",
    rating: 5,
    comment:
      "Заказал жене на годовщину. Фото на холсте — как в галерее. Обязательно вернёмся.",
    photoDataUrl: null,
    showOnSite: true,
    createdAt: "2026-07-18",
    giftTitle: "Холст с фото",
  },
  {
    id: "REV-SEED-03",
    orderId: "ORD-SEED-03",
    accountId: "seed",
    clientName: "Анна В.",
    rating: 4,
    comment:
      "Коллегам welcome-box — все в восторге. Чуть дольше ждали, но результат того стоит.",
    photoDataUrl: null,
    showOnSite: true,
    createdAt: "2026-07-12",
    giftTitle: "Корпоративный набор",
  },
];

function newId(): string {
  return `REV-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;
}

export function loadReviews(): GiftReview[] {
  if (typeof window === "undefined") return [...SEED_PUBLIC_REVIEWS];
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) return [...SEED_PUBLIC_REVIEWS];
    const parsed = JSON.parse(raw) as GiftReview[];
    if (!Array.isArray(parsed)) return [...SEED_PUBLIC_REVIEWS];
    const userIds = new Set(parsed.map((r) => r.id));
    const seeds = SEED_PUBLIC_REVIEWS.filter((s) => !userIds.has(s.id));
    return [...parsed, ...seeds];
  } catch {
    return [...SEED_PUBLIC_REVIEWS];
  }
}

function saveUserReviews(reviews: GiftReview[]) {
  if (typeof window === "undefined") return;
  const userOnly = reviews.filter((r) => !r.id.startsWith("REV-SEED-"));
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(userOnly));
  window.dispatchEvent(new Event("ai-gift-reviews-change"));
}

export function getReviewByOrderId(orderId: string): GiftReview | null {
  return loadReviews().find((r) => r.orderId === orderId) ?? null;
}

export function getReviewsByAccount(accountId: string): GiftReview[] {
  return loadReviews().filter((r) => r.accountId === accountId);
}

/** Reviews with consent — shown in «Наши счастливые клиенты» */
export function getPublicReviews(): GiftReview[] {
  return loadReviews()
    .filter((r) => r.showOnSite)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getCompletedOrdersForAccount(
  orderIds: string[],
): AdminOrder[] {
  const all = loadAdminOrders();
  return orderIds
    .map((id) => all.find((o) => o.id === id))
    .filter((o): o is AdminOrder => Boolean(o))
    .filter((o) => isTerminalStatus(o.status));
}

export function getAccountOrders(orderIds: string[]): AdminOrder[] {
  const all = loadAdminOrders();
  return orderIds
    .map((id) => all.find((o) => o.id === id))
    .filter((o): o is AdminOrder => Boolean(o));
}

export type CreateReviewInput = {
  orderId: string;
  accountId: string;
  clientName: string;
  rating: ReviewRating;
  comment: string;
  photoDataUrl: string | null;
  showOnSite: boolean;
};

export type CreateReviewResult =
  | { ok: true; review: GiftReview }
  | { ok: false; message: string };

/**
 * Review allowed only after a delivered order, once per order, by the account owner.
 */
export function createReview(
  input: CreateReviewInput,
  accountOrderIds: string[],
): CreateReviewResult {
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
      message: "Отзыв можно оставить только после выполненного заказа (Доставлено)",
    };
  }

  if (getReviewByOrderId(input.orderId)) {
    return { ok: false, message: "Вы уже оставили отзыв по этому заказу" };
  }

  const rating = input.rating;
  if (rating < 1 || rating > 5) {
    return { ok: false, message: "Выберите оценку от 1 до 5" };
  }

  const comment = input.comment.trim();
  if (comment.length < 5) {
    return { ok: false, message: "Напишите комментарий покороче — хотя бы пару слов" };
  }

  const review: GiftReview = {
    id: newId(),
    orderId: input.orderId,
    accountId: input.accountId,
    clientName: input.clientName.trim() || order.clientName,
    rating,
    comment,
    photoDataUrl: input.photoDataUrl,
    showOnSite: Boolean(input.showOnSite),
    createdAt: new Date().toISOString().slice(0, 10),
    giftTitle: order.title,
  };

  const list = loadReviews().filter((r) => !r.id.startsWith("REV-SEED-"));
  list.unshift(review);
  saveUserReviews(list);

  return { ok: true, review };
}

export function starsLabel(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(Math.max(0, 5 - rating));
}

/** Read image file as data URL; reject oversized files */
export function readReviewPhoto(file: File): Promise<string> {
  const MAX = 1.2 * 1024 * 1024;
  if (!file.type.startsWith("image/")) {
    return Promise.reject(new Error("Нужен файл изображения"));
  }
  if (file.size > MAX) {
    return Promise.reject(new Error("Фото слишком большое (макс. ~1 МБ)"));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("Не удалось прочитать фото"));
    };
    reader.onerror = () => reject(new Error("Ошибка чтения файла"));
    reader.readAsDataURL(file);
  });
}
