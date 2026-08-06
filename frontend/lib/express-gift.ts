import {
  GIFT_CONSTRUCTOR_ITEMS,
  READY_GIFT_SETS,
  calcSetTotal,
  type ReadyGiftSet,
} from "./scenario-catalog";

export type ExpressRecipient =
  | "her"
  | "him"
  | "mom"
  | "dad"
  | "friend"
  | "colleague"
  | "child";

export type ExpressBudget = "1500" | "3000" | "5000" | "wow";

export type ExpressToday = "yes" | "no";

export type ExpressAnswers = {
  recipient: ExpressRecipient;
  budget: ExpressBudget;
  today: ExpressToday;
};

export const EXPRESS_RECIPIENTS: {
  id: ExpressRecipient;
  label: string;
  emoji: string;
  tone: string;
}[] = [
  {
    id: "her",
    label: "Ей",
    emoji: "💐",
    tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
  },
  {
    id: "him",
    label: "Ему",
    emoji: "🎯",
    tone: "bg-[#e8f0ff] text-[#3b6fd8]",
  },
  {
    id: "mom",
    label: "Маме",
    emoji: "🌷",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
  },
  {
    id: "dad",
    label: "Папе",
    emoji: "☕",
    tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
  },
  {
    id: "friend",
    label: "Другу",
    emoji: "🤝",
    tone: "bg-[var(--mint-soft)] text-[var(--mint)]",
  },
  {
    id: "colleague",
    label: "Коллеге",
    emoji: "💼",
    tone: "bg-[#efe6d8] text-[#8a6a3d]",
  },
  {
    id: "child",
    label: "Ребёнку",
    emoji: "🧒",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
  },
];

export const EXPRESS_BUDGETS: {
  id: ExpressBudget;
  label: string;
  max: number;
  tone: string;
}[] = [
  {
    id: "1500",
    label: "До 1500 ₽",
    max: 1500,
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
  },
  {
    id: "3000",
    label: "До 3000 ₽",
    max: 3000,
    tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
  },
  {
    id: "5000",
    label: "До 5000 ₽",
    max: 5000,
    tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
  },
  {
    id: "wow",
    label: "Без лимита",
    max: Number.POSITIVE_INFINITY,
    tone: "bg-[#e8f0ff] text-[#3b6fd8]",
  },
];

export const EXPRESS_TODAY: {
  id: ExpressToday;
  label: string;
  hint: string;
  tone: string;
}[] = [
  {
    id: "yes",
    label: "Да, сегодня",
    hint: "Готовые наборы — можно сразу купить",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
  },
  {
    id: "no",
    label: "Не срочно",
    hint: "Есть время подобрать идеально",
    tone: "bg-[var(--mint-soft)] text-[var(--mint)]",
  },
];

const RECIPIENT_LABEL: Record<ExpressRecipient, string> = {
  her: "ей",
  him: "ему",
  mom: "маме",
  dad: "папе",
  friend: "другу",
  colleague: "коллеге",
  child: "ребёнку",
};

/** Recipient-tuned compositions used for express matching. */
const EXPRESS_VARIANTS: Record<
  ExpressRecipient,
  { id: string; title: string; subtitle: string; emoji: string; itemIds: string[]; tone: string }[]
> = {
  her: [
    {
      id: "express-her-soft",
      title: "Нежность",
      subtitle: "Кружка + свеча + шоколад + открытка",
      emoji: "💐",
      itemIds: ["mug", "candle", "chocolate", "card", "box"],
      tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
    },
    {
      id: "express-her-bloom",
      title: "Цветение",
      subtitle: "Холст + рамка + свеча",
      emoji: "🌸",
      itemIds: ["canvas", "frame", "candle", "card", "box"],
      tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    },
    {
      id: "express-her-wow",
      title: "WOW",
      subtitle: "Холст + кружка + свеча + шоколад",
      emoji: "✨",
      itemIds: ["canvas", "mug", "frame", "candle", "chocolate", "card", "box"],
      tone: "bg-[#e8f0ff] text-[#3b6fd8]",
    },
  ],
  him: [
    {
      id: "express-him-coffee",
      title: "Кофе-набор",
      subtitle: "Кружка + кофе + открытка",
      emoji: "☕",
      itemIds: ["mug", "coffee", "card", "box"],
      tone: "bg-[#e8f0ff] text-[#3b6fd8]",
    },
    {
      id: "express-him-style",
      title: "Стиль",
      subtitle: "Футболка + кружка + шоколад",
      emoji: "👕",
      itemIds: ["tee", "mug", "chocolate", "card", "box"],
      tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
    },
    {
      id: "express-him-wow",
      title: "WOW",
      subtitle: "Холст + футболка + кружка + кофе",
      emoji: "🎁",
      itemIds: ["canvas", "tee", "mug", "coffee", "card", "box", "chocolate"],
      tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    },
  ],
  mom: [
    {
      id: "express-mom-tea",
      title: "Чайный",
      subtitle: "Кружка + чай + открытка",
      emoji: "🍵",
      itemIds: ["mug", "tea", "card", "box"],
      tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    },
    {
      id: "express-mom-warm",
      title: "Тепло",
      subtitle: "Кружка + свеча + шоколад",
      emoji: "🕯️",
      itemIds: ["mug", "candle", "chocolate", "card", "box"],
      tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
    },
    {
      id: "express-mom-wow",
      title: "WOW",
      subtitle: "Холст + кружка + свеча + чай",
      emoji: "✨",
      itemIds: ["canvas", "mug", "frame", "tea", "candle", "card", "box"],
      tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
    },
  ],
  dad: [
    {
      id: "express-dad-coffee",
      title: "Кофе-брейк",
      subtitle: "Кружка + кофе + открытка",
      emoji: "☕",
      itemIds: ["mug", "coffee", "card", "box"],
      tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
    },
    {
      id: "express-dad-tee",
      title: "Практичный",
      subtitle: "Футболка + кружка + коробка",
      emoji: "👕",
      itemIds: ["tee", "mug", "card", "box"],
      tone: "bg-[#e8f0ff] text-[#3b6fd8]",
    },
    {
      id: "express-dad-wow",
      title: "WOW",
      subtitle: "Холст + футболка + кружка + кофе",
      emoji: "🎁",
      itemIds: ["canvas", "tee", "mug", "coffee", "card", "box"],
      tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    },
  ],
  friend: [
    {
      id: "express-friend-fun",
      title: "Весёлый",
      subtitle: "Кружка + шоколад + открытка",
      emoji: "🎉",
      itemIds: ["mug", "chocolate", "card", "box"],
      tone: "bg-[var(--mint-soft)] text-[var(--mint)]",
    },
    {
      id: "express-friend-bright",
      title: "Яркий",
      subtitle: "Футболка + кружка + коробка",
      emoji: "👕",
      itemIds: ["tee", "mug", "card", "box"],
      tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    },
    {
      id: "express-friend-wow",
      title: "WOW",
      subtitle: "Холст + футболка + кружка + шоколад",
      emoji: "✨",
      itemIds: ["canvas", "tee", "mug", "chocolate", "card", "box"],
      tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
    },
  ],
  colleague: [
    {
      id: "express-colleague-desk",
      title: "За стол",
      subtitle: "Кружка + кофе + открытка",
      emoji: "💼",
      itemIds: ["mug", "coffee", "card", "box"],
      tone: "bg-[#efe6d8] text-[#8a6a3d]",
    },
    {
      id: "express-colleague-brand",
      title: "Стиль",
      subtitle: "Футболка + кружка + коробка",
      emoji: "👕",
      itemIds: ["tee", "mug", "card", "box"],
      tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    },
    {
      id: "express-colleague-wow",
      title: "WOW",
      subtitle: "Холст + футболка + кружка",
      emoji: "🎁",
      itemIds: ["canvas", "tee", "mug", "card", "box", "chocolate"],
      tone: "bg-[#e8f0ff] text-[#3b6fd8]",
    },
  ],
  child: [
    {
      id: "express-child-play",
      title: "Игра",
      subtitle: "Пазл + магнит + открытка",
      emoji: "🧩",
      itemIds: ["puzzle", "magnet", "card", "box"],
      tone: "bg-[var(--mint-soft)] text-[var(--mint)]",
    },
    {
      id: "express-child-fun",
      title: "Радость",
      subtitle: "Кружка + магнит + шоколад",
      emoji: "🎈",
      itemIds: ["mug", "magnet", "chocolate", "card", "box"],
      tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    },
    {
      id: "express-child-wow",
      title: "WOW",
      subtitle: "Холст + пазл + кружка",
      emoji: "✨",
      itemIds: ["canvas", "puzzle", "mug", "magnet", "card", "box"],
      tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
    },
  ],
};

function budgetMax(budget: ExpressBudget): number {
  return EXPRESS_BUDGETS.find((item) => item.id === budget)?.max ?? 3000;
}

function trimToBudget(itemIds: string[], max: number): string[] {
  const priceById = new Map<string, number>(
    GIFT_CONSTRUCTOR_ITEMS.map((item) => [item.id, item.price]),
  );
  const result: string[] = [];
  let sum = 0;
  for (const id of itemIds) {
    const price = priceById.get(id) ?? 0;
    if (sum + price > max) continue;
    result.push(id);
    sum += price;
  }
  if (result.length === 0) {
    // fallback: cheapest items until budget
    const cheapest = [...GIFT_CONSTRUCTOR_ITEMS].sort((a, b) => a.price - b.price);
    for (const item of cheapest) {
      if (sum + item.price > max) continue;
      result.push(item.id);
      sum += item.price;
      if (result.length >= 3) break;
    }
  }
  return result;
}

export function buildExpressQuery(answers: ExpressAnswers): string {
  const who = RECIPIENT_LABEL[answers.recipient];
  const urgent = answers.today === "yes" ? "срочно" : "подарок";
  return `Экспресс ${urgent} ${who}`;
}

export function matchExpressSets(answers: ExpressAnswers): ReadyGiftSet[] {
  const max = budgetMax(answers.budget);
  const query = buildExpressQuery(answers);
  const variants = EXPRESS_VARIANTS[answers.recipient];

  const personalized: ReadyGiftSet[] = variants
    .map((variant) => {
      const itemIds = trimToBudget([...variant.itemIds], max);
      return {
        id: variant.id,
        title: variant.title,
        subtitle: variant.subtitle,
        emoji: variant.emoji,
        tone: variant.tone,
        itemIds,
        query: `${query} — ${variant.title}`,
      };
    })
    .filter((set) => set.itemIds.length > 0 && calcSetTotal(set.itemIds) <= max);

  // Always include budget-tier ready sets that fit
  const budgetSets = READY_GIFT_SETS.filter(
    (set) => calcSetTotal(set.itemIds) <= max,
  ).map((set) => ({
    ...set,
    id: `express-${set.id}`,
    query: `${query} — ${set.title}`,
  }));

  // Prefer personalized first; for "today" keep list short (max 3)
  const merged = [...personalized];
  for (const set of budgetSets) {
    if (merged.some((item) => item.title === set.title)) continue;
    if (calcSetTotal(set.itemIds) > max) continue;
    merged.push(set);
  }

  const limit = answers.today === "yes" ? 3 : 4;
  return merged.slice(0, limit);
}

export const EXPRESS_PICK_STORAGE_KEY = "ai-gift-express-pick";

export function saveExpressPick(set: ReadyGiftSet) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(EXPRESS_PICK_STORAGE_KEY, JSON.stringify(set));
}

export function loadExpressPick(setId?: string): ReadyGiftSet | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(EXPRESS_PICK_STORAGE_KEY);
  if (!raw) return null;
  try {
    const set = JSON.parse(raw) as ReadyGiftSet;
    if (setId && set.id !== setId) return null;
    return set;
  } catch {
    return null;
  }
}
