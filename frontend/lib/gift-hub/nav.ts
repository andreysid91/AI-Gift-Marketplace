/**
 * Gift Hub — единая навигация сайта (TASK-071).
 * Все разделы ≤ 1 клик из шапки. Карта: docs/27_Gift_Hub_Navigation.md
 */

export type GiftHubNavItem = {
  id: string;
  label: string;
  href: string;
};

/** Главные разделы — всегда в шапке */
export const GIFT_HUB_NAV: GiftHubNavItem[] = [
  { id: "home", label: "Главная", href: "/" },
  { id: "gifts", label: "Подарки", href: "/gifts" },
  { id: "photo", label: "Фотопечать", href: "/photo" },
  { id: "business", label: "Для бизнеса", href: "/business" },
  { id: "popular", label: "Популярное", href: "/popular" },
  { id: "reviews", label: "Отзывы", href: "/reviews" },
  { id: "inspiration", label: "Вдохновение", href: "/inspiration" },
];

export type HubRecipientCard = {
  id: string;
  label: string;
  emoji: string;
  tone: string;
  /** Value for Scenario Engine field `recipient` */
  recipientValue: string;
  /** Prefill query */
  query: string;
  href: string;
};

function recipientHref(recipientValue: string, query: string): string {
  const params = new URLSearchParams({
    scenario: "gift",
    recipient: recipientValue,
    q: query,
  });
  return `/create?${params.toString()}`;
}

/** «Кому подарок» на главной — каждая карточка → сценарий gift */
export const HUB_RECIPIENTS: HubRecipientCard[] = [
  {
    id: "mom",
    label: "Мама",
    emoji: "🌷",
    tone: "from-[#ffb4a2] to-[#ff5a3c]",
    recipientValue: "маме",
    query: "Подарок маме",
    href: recipientHref("маме", "Подарок маме"),
  },
  {
    id: "dad",
    label: "Папа",
    emoji: "☕",
    tone: "from-[#ffd59a] to-[#ff9f43]",
    recipientValue: "папе",
    query: "Подарок папе",
    href: recipientHref("папе", "Подарок папе"),
  },
  {
    id: "girlfriend",
    label: "Девушка",
    emoji: "💐",
    tone: "from-[#f7b6c8] to-[#e84d6f]",
    recipientValue: "девушке",
    query: "Подарок девушке",
    href: recipientHref("девушке", "Подарок девушке"),
  },
  {
    id: "boyfriend",
    label: "Парень",
    emoji: "🎯",
    tone: "from-[#a8d8ea] to-[#3b6fd8]",
    recipientValue: "парню",
    query: "Подарок парню",
    href: recipientHref("парню", "Подарок парню"),
  },
  {
    id: "wife",
    label: "Жена",
    emoji: "💍",
    tone: "from-[#ffd0dc] to-[#e86a8a]",
    recipientValue: "жене",
    query: "Подарок жене",
    href: recipientHref("жене", "Подарок жене"),
  },
  {
    id: "husband",
    label: "Муж",
    emoji: "🥂",
    tone: "from-[#e8d4c4] to-[#8b6914]",
    recipientValue: "мужу",
    query: "Подарок мужу",
    href: recipientHref("мужу", "Подарок мужу"),
  },
  {
    id: "brother",
    label: "Брат",
    emoji: "🤝",
    tone: "from-[#9ad8ff] to-[#3d9fd8]",
    recipientValue: "брату",
    query: "Подарок брату",
    href: recipientHref("брату", "Подарок брату"),
  },
  {
    id: "sister",
    label: "Сестра",
    emoji: "🌸",
    tone: "from-[#f7b6c8] to-[#ff8fab]",
    recipientValue: "сестре",
    query: "Подарок сестре",
    href: recipientHref("сестре", "Подарок сестре"),
  },
  {
    id: "grandma",
    label: "Бабушка",
    emoji: "🧶",
    tone: "from-[#ffe0c8] to-[#d4a574]",
    recipientValue: "бабушке",
    query: "Подарок бабушке",
    href: recipientHref("бабушке", "Подарок бабушке"),
  },
  {
    id: "grandpa",
    label: "Дедушка",
    emoji: "🎣",
    tone: "from-[#c8e8ff] to-[#6a9bd8]",
    recipientValue: "дедушке",
    query: "Подарок дедушке",
    href: recipientHref("дедушке", "Подарок дедушке"),
  },
  {
    id: "friend-m",
    label: "Друг",
    emoji: "😎",
    tone: "from-[#9de7c8] to-[#3db88a]",
    recipientValue: "другу",
    query: "Подарок другу",
    href: recipientHref("другу", "Подарок другу"),
  },
  {
    id: "friend-f",
    label: "Подруга",
    emoji: "✨",
    tone: "from-[#ffc9b0] to-[#ff7a5c]",
    recipientValue: "подруге",
    query: "Подарок подруге",
    href: recipientHref("подруге", "Подарок подруге"),
  },
  {
    id: "colleague",
    label: "Коллега",
    emoji: "💼",
    tone: "from-[#efe6d8] to-[#8a6a3d]",
    recipientValue: "коллеге",
    query: "Подарок коллеге",
    href: recipientHref("коллеге", "Подарок коллеге"),
  },
  {
    id: "boss",
    label: "Начальник",
    emoji: "👔",
    tone: "from-[#e8d4c4] to-[#5a4a3a]",
    recipientValue: "начальнику",
    query: "Подарок начальнику",
    href: recipientHref("начальнику", "Подарок начальнику"),
  },
  {
    id: "teacher",
    label: "Учитель",
    emoji: "📚",
    tone: "from-[#ffd59a] to-[#ff9f43]",
    recipientValue: "учителю",
    query: "Подарок учителю",
    href: recipientHref("учителю", "Подарок учителю"),
  },
  {
    id: "child",
    label: "Ребёнок",
    emoji: "🧒",
    tone: "from-[#c8e8ff] to-[#7ab8e8]",
    recipientValue: "ребёнку",
    query: "Подарок ребёнку",
    href: recipientHref("ребёнку", "Подарок ребёнку"),
  },
];

export const HUB_RECIPIENTS_ALL_HREF = "/create?scenario=gift";

export function isGiftHubPathActive(
  pathname: string,
  href: string,
): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
