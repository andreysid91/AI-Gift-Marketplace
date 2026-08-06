/**
 * Five fully styled completed orders for the live home (TASK-072).
 * Mock only — each links to an existing Gift Page + «заказать такой же».
 */

export type ShowcaseHistoryStep = {
  label: string;
  at: string;
  done: boolean;
};

export type ShowcaseReview = {
  id: string;
  author: string;
  text: string;
  emotion: string;
};

export type ShowcaseOrder = {
  id: string;
  recipient: string;
  recipientRole: string;
  giftTitle: string;
  giftId: string;
  emoji: string;
  tone: string;
  photoLabel: string;
  total: number;
  date: string;
  dateLabel: string;
  history: ShowcaseHistoryStep[];
  reviews: ShowcaseReview[];
  /** Order the same gift */
  orderSameHref: string;
  giftHref: string;
};

export const SHOWCASE_ORDERS: ShowcaseOrder[] = [
  {
    id: "live-01",
    recipient: "Ольга",
    recipientRole: "Мама",
    giftTitle: "Кружка с акварельным портретом",
    giftId: "mug",
    emoji: "☕",
    tone: "from-[#ffb4a2] to-[#ff5a3c]",
    photoLabel: "Фото кружки в руках",
    total: 2490,
    date: "2026-07-28",
    dateLabel: "28 июля",
    history: [
      { label: "Заявка принята", at: "26 июл", done: true },
      { label: "В работе", at: "26 июл", done: true },
      { label: "Готов", at: "27 июл", done: true },
      { label: "Вручен", at: "28 июл", done: true },
    ],
    reviews: [
      {
        id: "r1",
        author: "Аня",
        text: "Мама расплакалась. Портрет получился нежным, как просили.",
        emotion: "Слёзы счастья",
      },
    ],
    orderSameHref: "/checkout?from=gift&id=mug",
    giftHref: "/gift?id=mug",
  },
  {
    id: "live-02",
    recipient: "Игорь",
    recipientRole: "Папа",
    giftTitle: "Кружка-карикатура рыбаку",
    giftId: "idea-01",
    emoji: "🎣",
    tone: "from-[#9ad8ff] to-[#3d9fd8]",
    photoLabel: "Фото у озера",
    total: 1890,
    date: "2026-07-30",
    dateLabel: "30 июля",
    history: [
      { label: "Заявка принята", at: "29 июл", done: true },
      { label: "В работе", at: "29 июл", done: true },
      { label: "Готов", at: "30 июл", done: true },
      { label: "Вручен", at: "30 июл", done: true },
    ],
    reviews: [
      {
        id: "r2",
        author: "Сергей",
        text: "Папа орёт от смеха до сих пор. Упаковка огонь.",
        emotion: "В восторге",
      },
    ],
    orderSameHref: "/checkout?from=gift&id=idea-01",
    giftHref: "/gift?id=idea-01",
  },
  {
    id: "live-03",
    recipient: "Марина",
    recipientRole: "Девушка",
    giftTitle: "Холст в стиле Pixar",
    giftId: "canvas",
    emoji: "🖼️",
    tone: "from-[#f7b6c8] to-[#e84d6f]",
    photoLabel: "Холст на стене",
    total: 4590,
    date: "2026-08-01",
    dateLabel: "1 августа",
    history: [
      { label: "Заявка принята", at: "30 июл", done: true },
      { label: "В работе", at: "30 июл", done: true },
      { label: "Готов", at: "31 июл", done: true },
      { label: "Вручен", at: "1 авг", done: true },
    ],
    reviews: [
      {
        id: "r3",
        author: "Дима",
        text: "Вау при вручении. Она сначала не поняла, что это мы.",
        emotion: "Вау",
      },
    ],
    orderSameHref: "/checkout?from=gift&id=canvas",
    giftHref: "/gift?id=canvas",
  },
  {
    id: "live-04",
    recipient: "Кирилл",
    recipientRole: "Брат",
    giftTitle: "Футболка с комикс-принтом",
    giftId: "tee",
    emoji: "👕",
    tone: "from-[#ffd59a] to-[#ff9f43]",
    photoLabel: "Надел сразу",
    total: 2790,
    date: "2026-08-02",
    dateLabel: "2 августа",
    history: [
      { label: "Заявка принята", at: "1 авг", done: true },
      { label: "В работе", at: "1 авг", done: true },
      { label: "Готов", at: "2 авг", done: true },
      { label: "Вручен", at: "2 авг", done: true },
    ],
    reviews: [
      {
        id: "r4",
        author: "Лена",
        text: "Брат в ней уже третий день. Размер сел идеально.",
        emotion: "Идеально",
      },
    ],
    orderSameHref: "/checkout?from=gift&id=tee",
    giftHref: "/gift?id=tee",
  },
  {
    id: "live-05",
    recipient: "Семья Петровых",
    recipientRole: "Семья",
    giftTitle: "Пазл с семейным фото",
    giftId: "puzzle",
    emoji: "🧩",
    tone: "from-[#9de7c8] to-[#3db88a]",
    photoLabel: "Вечер за пазлом",
    total: 3290,
    date: "2026-08-03",
    dateLabel: "3 августа",
    history: [
      { label: "Заявка принята", at: "1 авг", done: true },
      { label: "В работе", at: "2 авг", done: true },
      { label: "Готов", at: "3 авг", done: true },
      { label: "Вручен", at: "3 авг", done: true },
    ],
    reviews: [
      {
        id: "r5",
        author: "Катя",
        text: "Собрали всей семьёй. Лучший подарок на новоселье.",
        emotion: "Тепло",
      },
    ],
    orderSameHref: "/checkout?from=gift&id=puzzle",
    giftHref: "/gift?id=puzzle",
  },
];

/** Flat reviews for home / reviews hub — always point to a gift page */
export function getShowcaseReviews() {
  return SHOWCASE_ORDERS.flatMap((order) =>
    order.reviews.map((review) => ({
      ...review,
      giftTitle: order.giftTitle,
      giftHref: order.giftHref,
      recipientRole: order.recipientRole,
      emoji: order.emoji,
      tone: order.tone,
      orderId: order.id,
    })),
  );
}
