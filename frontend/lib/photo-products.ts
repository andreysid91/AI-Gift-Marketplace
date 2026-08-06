export type PhotoProduct = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  tone: string;
  sizes: string[];
  leadTime: string;
};

export const PHOTO_PRODUCTS: PhotoProduct[] = [
  {
    slug: "photos",
    title: "Фотографии",
    short: "Классическая печать",
    description: "Печать ваших снимков в любом удобном формате — от мини до А3.",
    icon: "🖼️",
    tone: "bg-[#e8f0ff] text-[#3b6fd8]",
    sizes: ["10×15", "15×20", "A4", "A3"],
    leadTime: "1 день",
  },
  {
    slug: "canvas",
    title: "Холст",
    short: "Портрет на стене",
    description: "Фото на холсте — тёплый подарок и яркий акцент для интерьера.",
    icon: "🎨",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    sizes: ["30×40", "40×50", "50×70", "60×90"],
    leadTime: "2–3 дня",
  },
  {
    slug: "poster",
    title: "Постер",
    short: "Крупный формат",
    description: "Большой постер для дома, офиса или события — чёткая печать и насыщенный цвет.",
    icon: "🪧",
    tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
    sizes: ["A3", "A2", "A1"],
    leadTime: "1–2 дня",
  },
  {
    slug: "puzzle",
    title: "Пазл",
    short: "Игра и память",
    description: "Пазл с вашей фотографией — необычный сувенир и семейное развлечение.",
    icon: "🧩",
    tone: "bg-[var(--mint-soft)] text-[var(--mint)]",
    sizes: ["A4 · 120 эл.", "A3 · 300 эл."],
    leadTime: "2–3 дня",
  },
  {
    slug: "calendar",
    title: "Календарь",
    short: "На весь год",
    description: "Персональный календарь с вашими лучшими кадрами — настенный или настольный.",
    icon: "📅",
    tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
    sizes: ["Настенный", "Настольный"],
    leadTime: "2–4 дня",
  },
  {
    slug: "magnet",
    title: "Магнит",
    short: "Маленький акцент",
    description: "Магниты с фото — для холодильника, офиса или набора в подарок.",
    icon: "🧲",
    tone: "bg-[#efe6d8] text-[#8a6a3d]",
    sizes: ["Квадрат", "Прямоугольник", "Набор 6 шт."],
    leadTime: "1–2 дня",
  },
  {
    slug: "photobook",
    title: "Фотокнига",
    short: "Ваша история",
    description: "Фотокнига из любимых снимков — путешествия, семья, важный год.",
    icon: "📖",
    tone: "bg-[#e8f0ff] text-[#2f6bb5]",
    sizes: ["20×20", "30×30", "A4"],
    leadTime: "5–7 дней",
  },
  {
    slug: "postcard",
    title: "Открытка",
    short: "С тёплыми словами",
    description: "Печатная открытка с фото и вашей подписью — к подарку или отдельно.",
    icon: "💌",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    sizes: ["10×15", "A6"],
    leadTime: "1 день",
  },
];

export function getPhotoProduct(slug: string): PhotoProduct | undefined {
  return PHOTO_PRODUCTS.find((item) => item.slug === slug);
}
