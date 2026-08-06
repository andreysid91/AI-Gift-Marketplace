import type { CheckoutCatalogOption } from "./types";

/**
 * Data-driven catalogs. Add a row here to ship a new packaging / card / extra.
 * Later: load from CMS / JSON / partner API with the same shape.
 */

export const PACKAGING_OPTIONS: CheckoutCatalogOption[] = [
  {
    id: "pack-none",
    kind: "packaging",
    title: "Без упаковки",
    subtitle: "Подарок как есть",
    price: 0,
    emoji: "📦",
    tone: "from-[#f0e6dc] to-[#d4c4b0]",
    tags: ["none"],
  },
  {
    id: "pack-kraft",
    kind: "packaging",
    title: "Крафт с лентой",
    subtitle: "Тёплый минимализм",
    price: 290,
    emoji: "🎀",
    tone: "from-[#e8d4c4] to-[#c4a484]",
    tags: ["kraft", "classic"],
  },
  {
    id: "pack-box",
    kind: "packaging",
    title: "Подарочная коробка",
    subtitle: "Жёсткая коробка + бумага",
    price: 450,
    emoji: "🎁",
    tone: "from-[#ffb4a2] to-[#ff5a3c]",
    tags: ["box", "popular"],
  },
  {
    id: "pack-premium",
    kind: "packaging",
    title: "Премиум-бокс",
    subtitle: "Бархат, магнитный замок",
    price: 790,
    emoji: "✨",
    tone: "from-[#2a1810] to-[#5a3a2a]",
    tags: ["premium"],
  },
  {
    id: "pack-eco",
    kind: "packaging",
    title: "Эко-набор",
    subtitle: "Бумага, бечёвка, сухоцветы",
    price: 390,
    emoji: "🌿",
    tone: "from-[#9de7c8] to-[#3db88a]",
    tags: ["eco"],
  },
];

export const CARD_OPTIONS: CheckoutCatalogOption[] = [
  {
    id: "card-none",
    kind: "card",
    title: "Без открытки",
    subtitle: "Только подарок",
    price: 0,
    emoji: "—",
    tone: "from-[#f0e6dc] to-[#e8ddd0]",
    tags: ["none"],
  },
  {
    id: "card-classic",
    kind: "card",
    title: "Классика",
    subtitle: "Белый картон, мягкий шрифт",
    price: 190,
    emoji: "💌",
    tone: "from-[#fff8f3] to-[#ffe0d4]",
    tags: ["classic"],
  },
  {
    id: "card-photo",
    kind: "card",
    title: "С фото",
    subtitle: "Лицевая сторона с вашим снимком",
    price: 350,
    emoji: "📷",
    tone: "from-[#a8d8ea] to-[#7ab8d4]",
    tags: ["photo"],
  },
  {
    id: "card-watercolor",
    kind: "card",
    title: "Акварель",
    subtitle: "Нежные разводы и место для текста",
    price: 290,
    emoji: "🎨",
    tone: "from-[#f7b6c8] to-[#e84d6f]",
    tags: ["watercolor"],
  },
  {
    id: "card-comic",
    kind: "card",
    title: "Комикс",
    subtitle: "Яркий кадр для юмора",
    price: 290,
    emoji: "💬",
    tone: "from-[#ffd59a] to-[#ff9f43]",
    tags: ["comic"],
  },
];

/** Future extras (chocolate, tea…) — empty by default, registry ready */
export const EXTRA_OPTIONS: CheckoutCatalogOption[] = [];

/** Legacy gift-page addon ids that map into packaging / card steps */
export const PACKAGING_LEGACY_IDS = new Set([
  "pack",
  "box",
  "pack-kraft",
  "pack-box",
  "pack-premium",
  "pack-eco",
]);

export const CARD_LEGACY_IDS = new Set([
  "card",
  "postcard",
  "card-classic",
  "card-photo",
  "card-watercolor",
  "card-comic",
]);

export function getPackagingOption(id: string): CheckoutCatalogOption {
  return (
    PACKAGING_OPTIONS.find((item) => item.id === id) ?? PACKAGING_OPTIONS[0]
  );
}

export function getCardOption(id: string): CheckoutCatalogOption {
  return CARD_OPTIONS.find((item) => item.id === id) ?? CARD_OPTIONS[0];
}

export function getExtraOption(id: string): CheckoutCatalogOption | undefined {
  return EXTRA_OPTIONS.find((item) => item.id === id);
}

export function listCatalogByKind(
  kind: CheckoutCatalogOption["kind"],
): CheckoutCatalogOption[] {
  if (kind === "packaging") return PACKAGING_OPTIONS;
  if (kind === "card") return CARD_OPTIONS;
  return EXTRA_OPTIONS;
}

/** Register extra service at runtime (partners / A-B / seasonal). */
export function registerCheckoutExtra(option: CheckoutCatalogOption) {
  if (option.kind !== "extra") return;
  if (EXTRA_OPTIONS.some((item) => item.id === option.id)) return;
  EXTRA_OPTIONS.push(option);
}
