import type { KeywordRule } from "./types";

/**
 * Extensible keyword rules for intent analysis.
 *
 * How to extend:
 * 1. Add a rule object (keywords / patterns + weight + scenario).
 * 2. Keep weights comparable (2–5 typical, 6+ for strong overrides).
 * 3. Prefer specific rules over broad ones.
 *
 * Later: replace or augment with LLM — UI still consumes IntentAnalysis.
 */
export const INTENT_RULES: KeywordRule[] = [
  // —— gift ——
  {
    id: "gift-core",
    scenario: "gift",
    keywords: [
      "подарок",
      "подарки",
      "сюрприз",
      "жене",
      "мужу",
      "брату",
      "сестре",
      "маме",
      "папе",
      "девушке",
      "парню",
      "другу",
      "подруге",
      "ребёнку",
      "ребенку",
      "годовщин",
      "день рождения",
    ],
    weight: 4,
    description: "Прямые подарочные формулировки",
  },
  {
    id: "gift-action",
    scenario: "gift",
    keywords: ["хочу подарок", "подобрать подарок", "сделать кружку"],
    weight: 3,
  },

  // —— photo ——
  {
    id: "photo-core",
    scenario: "photo",
    keywords: [
      "распечатать",
      "распечата",
      "фото",
      "фотограф",
      "печат",
      "холст",
      "пазл",
      "календар",
      "магнит",
      "фотокниг",
      "открытк",
      "постер",
    ],
    weight: 4,
    description: "Фотопечать и печатная продукция",
  },
  {
    id: "photo-styles",
    scenario: "photo",
    keywords: [
      "карикатур",
      "pixar",
      "пиксар",
      "комикс",
      "акварель",
      "аниме",
      "поп-арт",
      "поп арт",
      "реализм",
      "стилизац",
    ],
    weight: 4,
  },
  {
    id: "photo-by-photo",
    scenario: "photo",
    keywords: ["по фотографии", "по фото", "загрузить фото"],
    weight: 5,
  },

  // —— business ——
  {
    id: "business-core",
    scenario: "business",
    keywords: [
      "бизнес",
      "корпоратив",
      "сотрудник",
      "сотрудникам",
      "тираж",
      "логотип",
      "компани",
      "мерч",
      "welcome",
      "диплом",
      "медал",
      "кубк",
      "кепк",
      "толстов",
      "шоппер",
      "блокнот",
    ],
    weight: 4,
  },
  {
    id: "business-qty",
    scenario: "business",
    keywords: [],
    patterns: [
      // Avoid \\b — JS word boundaries break on Cyrillic
      String.raw`\d+\s*(?:шт|штук|футболок|футболки|кружек|кружки|кепок|толстовок|шопперов)`,
      String.raw`(?:10|20|30|50|80|100|200|500|1000)\s*футболок`,
    ],
    weight: 6,
    description: "Тираж: «50 футболок», «80 шт»",
  },
  {
    id: "business-gift-override",
    scenario: "business",
    keywords: [
      "подарок сотрудникам",
      "подарки сотрудникам",
      "корпоративный подарок",
      "корпоративные подарки",
    ],
    weight: 6,
    description: "Подарок для компании → business, не gift",
  },
];
