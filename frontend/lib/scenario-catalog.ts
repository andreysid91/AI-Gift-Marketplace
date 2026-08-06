import { getGiftEngineConstructorIds } from "./gift-engine";

export function formatRub(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export const GIFT_SCENE_ITEMS = [
  { id: "mug", title: "Кружка", price: 990, emoji: "☕" },
  { id: "tee", title: "Футболка", price: 1690, emoji: "👕" },
  { id: "canvas", title: "Холст", price: 2490, emoji: "🖼️" },
  { id: "magnet", title: "Магнит", price: 350, emoji: "🧲" },
  { id: "puzzle", title: "Пазл", price: 1500, emoji: "🧩" },
  { id: "card", title: "Открытка", price: 250, emoji: "💌" },
  { id: "box", title: "Подарочная коробка", price: 450, emoji: "🎁" },
  { id: "frame", title: "Фоторамка", price: 890, emoji: "🖼️" },
] as const;

/** Full gift-set constructor options (scene + add-ons) */
export const GIFT_CONSTRUCTOR_ITEMS = [
  { id: "mug", title: "Кружка", price: 990, emoji: "☕" },
  { id: "canvas", title: "Холст", price: 2490, emoji: "🖼️" },
  { id: "tee", title: "Футболка", price: 1690, emoji: "👕" },
  { id: "magnet", title: "Магнит", price: 350, emoji: "🧲" },
  { id: "puzzle", title: "Пазл", price: 1500, emoji: "🧩" },
  { id: "frame", title: "Фоторамка", price: 890, emoji: "🖼️" },
  { id: "box", title: "Подарочная коробка", price: 450, emoji: "🎁" },
  { id: "card", title: "Открытка", price: 250, emoji: "💌" },
  { id: "chocolate", title: "Шоколад", price: 320, emoji: "🍫" },
  { id: "tea", title: "Чай", price: 280, emoji: "🍵" },
  { id: "coffee", title: "Кофе", price: 350, emoji: "☕" },
  { id: "candle", title: "Свеча", price: 490, emoji: "🕯️" },
] as const;

export const GIFT_CONSTRUCTOR_DEFAULTS = [
  "mug",
  "box",
  "card",
  "chocolate",
] as const;

export type ReadyGiftSet = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  tone: string;
  itemIds: readonly string[];
  query: string;
};

export const READY_GIFT_SETS: ReadyGiftSet[] = [
  {
    id: "under-1500",
    title: "До 1500 ₽",
    subtitle: "Кружка + открытка + шоколад",
    emoji: "🎁",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    itemIds: ["mug", "card", "chocolate"],
    query: "Готовый набор до 1500 ₽",
  },
  {
    id: "under-3000",
    title: "До 3000 ₽",
    subtitle: "Кружка + коробка + чай + свеча",
    emoji: "🎁",
    tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
    itemIds: ["mug", "box", "card", "tea", "candle"],
    query: "Готовый набор до 3000 ₽",
  },
  {
    id: "under-5000",
    title: "До 5000 ₽",
    subtitle: "Холст + рамка + коробка + шоколад",
    emoji: "🎁",
    tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
    itemIds: ["canvas", "frame", "box", "card", "chocolate"],
    query: "Готовый набор до 5000 ₽",
  },
  {
    id: "wow",
    title: "WOW",
    subtitle: "Холст + футболка + кружка + полный бокс",
    emoji: "🎁",
    tone: "bg-[#e8f0ff] text-[#3b6fd8]",
    itemIds: [
      "canvas",
      "tee",
      "mug",
      "frame",
      "box",
      "card",
      "chocolate",
      "candle",
      "coffee",
    ],
    query: "WOW подарочный набор",
  },
];

export function getReadySetById(id: string | undefined): ReadyGiftSet | undefined {
  if (!id) return undefined;
  return READY_GIFT_SETS.find((set) => set.id === id);
}

export function getReadySetItemIds(id: string | undefined): string[] | null {
  const set = getReadySetById(id);
  return set ? [...set.itemIds] : null;
}

export function calcSetTotal(itemIds: readonly string[]): number {
  const priceById = new Map<string, number>(
    GIFT_CONSTRUCTOR_ITEMS.map((item) => [item.id, item.price]),
  );
  return itemIds.reduce((sum, id) => sum + (priceById.get(id) ?? 0), 0);
}

/** Ready starter sets — Gift Engine v1 (knowledge JSON, no GPT). */
export function getConstructorDefaults(query: string): string[] {
  return getGiftEngineConstructorIds({ query });
}

export const GIFT_ADDONS = [
  { id: "pack", title: "Упаковка", price: 350, emoji: "🎀" },
  { id: "postcard", title: "Открытка", price: 250, emoji: "✉️" },
  { id: "candy", title: "Конфеты", price: 390, emoji: "🍬" },
  { id: "chocolate", title: "Шоколад", price: 320, emoji: "🍫" },
  { id: "tea", title: "Чай", price: 280, emoji: "🍵" },
  { id: "coffee", title: "Кофе", price: 350, emoji: "☕" },
  { id: "candle", title: "Свеча", price: 490, emoji: "🕯️" },
] as const;

export const PHOTO_STYLES = [
  "Карикатура",
  "Pixar",
  "Комикс",
  "Акварель",
  "Аниме",
  "Поп-арт",
  "Реализм",
  "Минимализм",
  "Студенческий",
  "Школьный",
  "Корпоративный",
  "Праздничный",
] as const;

export const PHOTO_STYLE_PRODUCTS = [
  { id: "mug", title: "Кружка", emoji: "☕" },
  { id: "canvas", title: "Холст", emoji: "🖼️" },
  { id: "tee", title: "Футболка", emoji: "👕" },
  { id: "puzzle", title: "Пазл", emoji: "🧩" },
  { id: "calendar", title: "Календарь", emoji: "📅" },
  { id: "magnet", title: "Магнит", emoji: "🧲" },
  { id: "card", title: "Открытка", emoji: "💌" },
  { id: "book", title: "Фотокнига", emoji: "📖" },
] as const;

export const BUSINESS_PRODUCTS = [
  { title: "Футболки", icon: "👕" },
  { title: "Кепки", icon: "🧢" },
  { title: "Толстовки", icon: "🧥" },
  { title: "Шопперы", icon: "🛍️" },
  { title: "Кружки", icon: "☕" },
  { title: "Ручки", icon: "✒️" },
  { title: "Блокноты", icon: "📓" },
  { title: "Наборы", icon: "🎁" },
  { title: "Медали", icon: "🏅" },
  { title: "Кубки", icon: "🏆" },
  { title: "Дипломы", icon: "📜" },
] as const;

export const BUSINESS_QTY = ["10", "20", "50", "100", "500", "1000+"] as const;

export const EXAMPLE_PROMPTS = [
  "Хочу подарок жене",
  "Нужно 80 футболок",
  "Хочу карикатуру по фотографии",
  "Распечатать фотографии",
  "Сделать кружку",
  "Подарок сотрудникам",
  "Хочу вышивку",
  "Сделать холст",
  "Нужен корпоративный подарок",
] as const;
