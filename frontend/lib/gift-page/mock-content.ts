import type {
  GiftAddonOption,
  GiftClientPhoto,
  GiftComment,
  GiftHandoverVideo,
  GiftLinkCard,
  GiftReviewCard,
  GiftWhyReason,
} from "./types";
import { GIFT_ADDONS } from "../scenario-catalog";
import { MOCK_IDEAS } from "../mock-ideas";

export const DEFAULT_WHY: GiftWhyReason[] = [
  { id: "fit", label: "Подходит под ваш запрос" },
  { id: "budget", label: "В бюджете" },
  { id: "popular", label: "Популярный" },
  { id: "fast", label: "Можно изготовить быстро" },
  { id: "pack", label: "Можно красиво упаковать" },
];

export const GIFT_PAGE_ADDONS: GiftAddonOption[] = GIFT_ADDONS.map((item) => ({
  id: item.id,
  title: item.title,
  price: item.price,
  emoji: item.emoji,
}));

export function mockReviewsFor(productTitle: string): GiftReviewCard[] {
  return [
    {
      id: "r1",
      name: "Марина",
      rating: 5,
      text: "Мама плакала от счастья. Упаковка как в бутике.",
      occasion: "Дарили маме",
      emoji: "😍",
      tone: "from-[#ffb4a2] to-[#ff5a3c]",
    },
    {
      id: "r2",
      name: "Игорь",
      rating: 5,
      text: "Начальник удивился — думал, заказывали за границей.",
      occasion: "Дарили начальнику",
      emoji: "🤩",
      tone: "from-[#ffd59a] to-[#ff9f43]",
    },
    {
      id: "r3",
      name: "Алина",
      rating: 5,
      text: `${productTitle} — она сказала «лучший подарок за год».`,
      occasion: "Дарили девушке",
      emoji: "🥹",
      tone: "from-[#f7b6c8] to-[#e84d6f]",
    },
  ];
}

export function mockClientPhotos(): GiftClientPhoto[] {
  return [
    { id: "p1", emoji: "🎁", tone: "from-[#ffb4a2] to-[#ff6b4a]", caption: "Вручение на ДР" },
    { id: "p2", emoji: "☕", tone: "from-[#ffd59a] to-[#ff9f43]", caption: "Утро с кружкой" },
    { id: "p3", emoji: "🖼️", tone: "from-[#f7b6c8] to-[#e84d6f]", caption: "Холст дома" },
    { id: "p4", emoji: "📸", tone: "from-[#9de7c8] to-[#3db88a]", caption: "Распаковка" },
  ];
}

export function mockHandoverVideos(): GiftHandoverVideo[] {
  return [
    {
      id: "v1",
      title: "Реакция на подарок",
      emoji: "▶️",
      tone: "from-[#2a1810] to-[#5a3a2a]",
    },
    {
      id: "v2",
      title: "Распаковка набора",
      emoji: "▶️",
      tone: "from-[#3d2a20] to-[#7a5344]",
    },
  ];
}

export function mockSimilarIdeas(currentId: string): GiftLinkCard[] {
  return MOCK_IDEAS.filter((idea) => idea.id !== currentId)
    .slice(0, 4)
    .map((idea) => ({
      id: idea.id,
      title: idea.title,
      href: `/gift?id=${idea.id}`,
      emoji: idea.emoji,
      tone: idea.gradient,
      subtitle: idea.style,
    }));
}

export function mockSimilarGifts(productId: string): GiftLinkCard[] {
  const pool = [
    { id: "mug", title: "Кружка", emoji: "☕", tone: "from-[#ffb4a2] to-[#ff6b4a]" },
    { id: "tee", title: "Футболка", emoji: "👕", tone: "from-[#ffd59a] to-[#ff9f43]" },
    { id: "canvas", title: "Холст", emoji: "🖼️", tone: "from-[#f7b6c8] to-[#e84d6f]" },
    { id: "puzzle", title: "Пазл", emoji: "🧩", tone: "from-[#9de7c8] to-[#3db88a]" },
    { id: "frame", title: "Фоторамка", emoji: "🖼️", tone: "from-[#ffc4b0] to-[#d96b4c]" },
  ];
  return pool
    .filter((item) => item.id !== productId)
    .slice(0, 4)
    .map((item) => ({
      ...item,
      href: `/gift?id=${item.id}`,
    }));
}

export function mockPopularWeek(): GiftLinkCard[] {
  return [
    { id: "w1", title: "Кружка с фото", href: "/gift?id=mug", emoji: "☕", tone: "from-[#ffb4a2] to-[#ff6b4a]" },
    { id: "w2", title: "Холст-портрет", href: "/gift?id=canvas", emoji: "🖼️", tone: "from-[#f7b6c8] to-[#e84d6f]" },
    { id: "w3", title: "Футболка", href: "/gift?id=tee", emoji: "👕", tone: "from-[#ffd59a] to-[#ff9f43]" },
    { id: "w4", title: "Набор уюта", href: "/gift?id=idea-04", emoji: "🎁", tone: "from-[#9de7c8] to-[#3db88a]" },
  ];
}

export function mockComments(): GiftComment[] {
  return [
    {
      id: "c1",
      author: "Оля",
      text: "Заказывали уже второй раз — всегда вовремя.",
      at: "2 дня назад",
    },
    {
      id: "c2",
      author: "Сергей",
      text: "Можно ли срочно к пятнице? Написали в Telegram — ответили за 5 минут.",
      at: "5 дней назад",
    },
    {
      id: "c3",
      author: "Катя",
      text: "Упаковка огонь. Даже бант красивый.",
      at: "неделю назад",
    },
  ];
}

export const EMOTION_BY_PRODUCT: Record<string, string> = {
  mug: "Подарок, который согреет каждое утро.",
  tee: "Носится с улыбкой — и напоминает о вас.",
  canvas: "Подарок, который запомнится на всю жизнь.",
  puzzle: "Вечер вместе — и ваше фото в центре.",
  default: "Подарок, который запомнится на всю жизнь.",
};
