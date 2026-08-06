import {
  READY_GIFT_SETS,
  type ReadyGiftSet,
  calcSetTotal,
  formatRub,
} from "./scenario-catalog";

export type OccasionId =
  | "birthday"
  | "wedding"
  | "anniversary"
  | "baby"
  | "teacher"
  | "corporate"
  | "new-year"
  | "march-8"
  | "feb-23";

export type Occasion = {
  id: OccasionId;
  title: string;
  icon: string;
  prompt: string;
  tone: string;
};

export type OccasionGiftSet = ReadyGiftSet & {
  occasionId: OccasionId;
};

export const OCCASIONS: Occasion[] = [
  {
    id: "birthday",
    title: "День рождения",
    icon: "🎂",
    prompt: "Подарок на день рождения",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
  },
  {
    id: "wedding",
    title: "Свадьба",
    icon: "💍",
    prompt: "Подарок на свадьбу",
    tone: "bg-[#efe6d8] text-[#8a6a3d]",
  },
  {
    id: "anniversary",
    title: "Годовщина",
    icon: "❤️",
    prompt: "Подарок на годовщину",
    tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
  },
  {
    id: "baby",
    title: "Рождение ребенка",
    icon: "👶",
    prompt: "Подарок на рождение ребенка",
    tone: "bg-[var(--mint-soft)] text-[var(--mint)]",
  },
  {
    id: "teacher",
    title: "Учителю",
    icon: "👩‍🏫",
    prompt: "Подарок учителю",
    tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
  },
  {
    id: "corporate",
    title: "Корпоратив",
    icon: "🏢",
    prompt: "Подарок на корпоратив",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
  },
  {
    id: "new-year",
    title: "Новый год",
    icon: "🎄",
    prompt: "Подарок на Новый год",
    tone: "bg-[#e8f0ff] text-[#3b6fd8]",
  },
  {
    id: "march-8",
    title: "8 марта",
    icon: "🌷",
    prompt: "Подарок на 8 марта",
    tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
  },
  {
    id: "feb-23",
    title: "23 февраля",
    icon: "🛡️",
    prompt: "Подарок на 23 февраля",
    tone: "bg-[#e8f0ff] text-[#3b6fd8]",
  },
];

const TONES = {
  soft: "bg-[var(--accent-soft)] text-[var(--accent)]",
  warm: "bg-[var(--secondary-soft)] text-[#c56a12]",
  berry: "bg-[var(--berry-soft)] text-[var(--berry)]",
  mint: "bg-[var(--mint-soft)] text-[var(--mint)]",
  blue: "bg-[#e8f0ff] text-[#3b6fd8]",
  sand: "bg-[#efe6d8] text-[#8a6a3d]",
} as const;

/** Popular ready sets ranked per occasion (order = popularity). */
export const OCCASION_POPULAR_SETS: OccasionGiftSet[] = [
  // Birthday
  {
    id: "birthday-classic",
    occasionId: "birthday",
    title: "Классика",
    subtitle: "Кружка + коробка + открытка + шоколад",
    emoji: "🎂",
    tone: TONES.soft,
    itemIds: ["mug", "box", "card", "chocolate"],
    query: "Подарок на день рождения — классика",
  },
  {
    id: "birthday-bright",
    occasionId: "birthday",
    title: "Яркий",
    subtitle: "Футболка + кружка + коробка",
    emoji: "🎉",
    tone: TONES.warm,
    itemIds: ["tee", "mug", "box", "card"],
    query: "Подарок на день рождения — яркий набор",
  },
  {
    id: "birthday-premium",
    occasionId: "birthday",
    title: "Премиум",
    subtitle: "Холст + рамка + свеча",
    emoji: "✨",
    tone: TONES.berry,
    itemIds: ["canvas", "frame", "box", "card", "candle"],
    query: "Подарок на день рождения — премиум",
  },
  {
    id: "birthday-wow",
    occasionId: "birthday",
    title: "WOW",
    subtitle: "Холст + футболка + кружка + бокс",
    emoji: "🎁",
    tone: TONES.blue,
    itemIds: ["canvas", "tee", "mug", "box", "card", "chocolate", "candle"],
    query: "WOW набор на день рождения",
  },

  // Wedding
  {
    id: "wedding-romance",
    occasionId: "wedding",
    title: "Романтика",
    subtitle: "Холст + рамка + свеча + открытка",
    emoji: "💍",
    tone: TONES.sand,
    itemIds: ["canvas", "frame", "box", "card", "candle"],
    query: "Подарок на свадьбу — романтика",
  },
  {
    id: "wedding-cozy",
    occasionId: "wedding",
    title: "Уют",
    subtitle: "Кружка + чай + свеча + коробка",
    emoji: "🕯️",
    tone: TONES.berry,
    itemIds: ["mug", "box", "card", "tea", "candle"],
    query: "Подарок на свадьбу — уютный набор",
  },
  {
    id: "wedding-wow",
    occasionId: "wedding",
    title: "WOW",
    subtitle: "Холст + футболка + кружка + шоколад",
    emoji: "✨",
    tone: TONES.soft,
    itemIds: ["canvas", "tee", "mug", "frame", "box", "card", "chocolate"],
    query: "WOW набор на свадьбу",
  },

  // Anniversary
  {
    id: "anniversary-heart",
    occasionId: "anniversary",
    title: "Сердце",
    subtitle: "Холст + рамка + свеча",
    emoji: "❤️",
    tone: TONES.berry,
    itemIds: ["canvas", "frame", "box", "card", "candle"],
    query: "Подарок на годовщину — сердце",
  },
  {
    id: "anniversary-evening",
    occasionId: "anniversary",
    title: "Вечер вдвоём",
    subtitle: "Кружка + шоколад + свеча + чай",
    emoji: "🌙",
    tone: TONES.warm,
    itemIds: ["mug", "box", "card", "chocolate", "tea", "candle"],
    query: "Подарок на годовщину — вечер вдвоём",
  },
  {
    id: "anniversary-wow",
    occasionId: "anniversary",
    title: "WOW",
    subtitle: "Холст + кружка + рамка + полный бокс",
    emoji: "🎁",
    tone: TONES.soft,
    itemIds: ["canvas", "mug", "frame", "box", "card", "chocolate", "candle", "coffee"],
    query: "WOW набор на годовщину",
  },

  // Baby
  {
    id: "baby-memory",
    occasionId: "baby",
    title: "Память",
    subtitle: "Рамка + магнит + открытка",
    emoji: "👶",
    tone: TONES.mint,
    itemIds: ["frame", "magnet", "box", "card"],
    query: "Подарок на рождение ребенка — память",
  },
  {
    id: "baby-play",
    occasionId: "baby",
    title: "Игра",
    subtitle: "Пазл + магнит + коробка",
    emoji: "🧩",
    tone: TONES.soft,
    itemIds: ["puzzle", "magnet", "box", "card"],
    query: "Подарок на рождение ребенка — игра",
  },
  {
    id: "baby-premium",
    occasionId: "baby",
    title: "Премиум",
    subtitle: "Холст + рамка + магнит + коробка",
    emoji: "✨",
    tone: TONES.blue,
    itemIds: ["canvas", "frame", "magnet", "box", "card"],
    query: "Подарок на рождение ребенка — премиум",
  },

  // Teacher
  {
    id: "teacher-thanks",
    occasionId: "teacher",
    title: "Спасибо",
    subtitle: "Кружка + чай + открытка",
    emoji: "👩‍🏫",
    tone: TONES.warm,
    itemIds: ["mug", "box", "card", "tea"],
    query: "Подарок учителю — спасибо",
  },
  {
    id: "teacher-sweet",
    occasionId: "teacher",
    title: "Сладости",
    subtitle: "Кружка + шоколад + коробка",
    emoji: "🍫",
    tone: TONES.soft,
    itemIds: ["mug", "box", "card", "chocolate"],
    query: "Подарок учителю — сладости",
  },
  {
    id: "teacher-premium",
    occasionId: "teacher",
    title: "Премиум",
    subtitle: "Холст + кружка + чай",
    emoji: "✨",
    tone: TONES.berry,
    itemIds: ["canvas", "mug", "box", "card", "tea"],
    query: "Подарок учителю — премиум",
  },

  // Corporate
  {
    id: "corporate-team",
    occasionId: "corporate",
    title: "Команда",
    subtitle: "Кружка + футболка + открытка",
    emoji: "🏢",
    tone: TONES.soft,
    itemIds: ["mug", "tee", "box", "card"],
    query: "Подарок на корпоратив — команда",
  },
  {
    id: "corporate-coffee",
    occasionId: "corporate",
    title: "Кофе-брейк",
    subtitle: "Кружка + кофе + коробка",
    emoji: "☕",
    tone: TONES.warm,
    itemIds: ["mug", "box", "card", "coffee"],
    query: "Подарок на корпоратив — кофе-брейк",
  },
  {
    id: "corporate-wow",
    occasionId: "corporate",
    title: "WOW",
    subtitle: "Футболка + кружка + холст + бокс",
    emoji: "🎁",
    tone: TONES.blue,
    itemIds: ["tee", "mug", "canvas", "box", "card", "chocolate"],
    query: "WOW набор на корпоратив",
  },

  // New Year
  {
    id: "new-year-festive",
    occasionId: "new-year",
    title: "Праздник",
    subtitle: "Кружка + шоколад + свеча",
    emoji: "🎄",
    tone: TONES.blue,
    itemIds: ["mug", "box", "card", "chocolate", "candle"],
    query: "Подарок на Новый год — праздник",
  },
  {
    id: "new-year-warm",
    occasionId: "new-year",
    title: "Уют",
    subtitle: "Футболка + кружка + шоколад",
    emoji: "🧣",
    tone: TONES.soft,
    itemIds: ["tee", "mug", "box", "card", "chocolate"],
    query: "Подарок на Новый год — уют",
  },
  {
    id: "new-year-wow",
    occasionId: "new-year",
    title: "WOW",
    subtitle: "Холст + кружка + свеча + шоколад",
    emoji: "✨",
    tone: TONES.berry,
    itemIds: ["canvas", "mug", "box", "card", "chocolate", "candle", "coffee"],
    query: "WOW набор на Новый год",
  },

  // March 8
  {
    id: "march8-tender",
    occasionId: "march-8",
    title: "Нежность",
    subtitle: "Свеча + шоколад + чай + открытка",
    emoji: "🌷",
    tone: TONES.berry,
    itemIds: ["mug", "box", "card", "chocolate", "tea", "candle"],
    query: "Подарок на 8 марта — нежность",
  },
  {
    id: "march8-bloom",
    occasionId: "march-8",
    title: "Цветение",
    subtitle: "Холст + рамка + свеча",
    emoji: "🌸",
    tone: TONES.soft,
    itemIds: ["canvas", "frame", "box", "card", "candle"],
    query: "Подарок на 8 марта — цветение",
  },
  {
    id: "march8-wow",
    occasionId: "march-8",
    title: "WOW",
    subtitle: "Холст + кружка + свеча + шоколад",
    emoji: "🎁",
    tone: TONES.warm,
    itemIds: ["canvas", "mug", "frame", "box", "card", "chocolate", "candle"],
    query: "WOW набор на 8 марта",
  },

  // Feb 23
  {
    id: "feb23-strong",
    occasionId: "feb-23",
    title: "Сильный",
    subtitle: "Кружка + кофе + открытка",
    emoji: "🛡️",
    tone: TONES.blue,
    itemIds: ["mug", "box", "card", "coffee"],
    query: "Подарок на 23 февраля — сильный",
  },
  {
    id: "feb23-style",
    occasionId: "feb-23",
    title: "Стиль",
    subtitle: "Футболка + кружка + шоколад",
    emoji: "👕",
    tone: TONES.soft,
    itemIds: ["tee", "mug", "box", "card", "chocolate"],
    query: "Подарок на 23 февраля — стиль",
  },
  {
    id: "feb23-wow",
    occasionId: "feb-23",
    title: "WOW",
    subtitle: "Холст + футболка + кружка + кофе",
    emoji: "🎁",
    tone: TONES.warm,
    itemIds: ["canvas", "tee", "mug", "box", "card", "coffee", "chocolate"],
    query: "WOW набор на 23 февраля",
  },
];

export function getOccasionById(id: string | undefined): Occasion | undefined {
  if (!id) return undefined;
  return OCCASIONS.find((item) => item.id === id);
}

export function getPopularSetsForOccasion(
  occasionId: OccasionId | string | undefined,
): OccasionGiftSet[] {
  if (!occasionId) return [];
  return OCCASION_POPULAR_SETS.filter((set) => set.occasionId === occasionId);
}

export function getOccasionSetById(
  id: string | undefined,
): OccasionGiftSet | undefined {
  if (!id) return undefined;
  return OCCASION_POPULAR_SETS.find((set) => set.id === id);
}

/** Budget sets + occasion sets — one registry for constructor lookup. */
export function getAnyGiftSetById(
  id: string | undefined,
): ReadyGiftSet | undefined {
  if (!id) return undefined;
  return (
    READY_GIFT_SETS.find((set) => set.id === id) ??
    OCCASION_POPULAR_SETS.find((set) => set.id === id)
  );
}

export function getAnyGiftSetItemIds(id: string | undefined): string[] | null {
  const set = getAnyGiftSetById(id);
  return set ? [...set.itemIds] : null;
}

export { calcSetTotal, formatRub };
