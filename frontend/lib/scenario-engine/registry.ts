import type { ScenarioDefinition, ScenarioId, ScenarioStep } from "./types";

function doneStep(): ScenarioStep {
  return {
    id: "done",
    prompt: "Готово",
    kind: "done",
    field: "_done",
  };
}

/**
 * Registry: add a new scenario here (definition + steps) — no other core changes.
 */
export const SCENARIO_REGISTRY: Record<ScenarioId, ScenarioDefinition> = {
  gift: {
    id: "gift",
    label: "Подарок",
    description: "Персональный подарок под человека и повод",
    orderType: "gift",
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
      "годовщин",
      "день рождения",
    ],
    weight: 4,
    steps: [
      {
        id: "whom",
        prompt: "Кому?",
        kind: "choice",
        field: "recipient",
        options: [
          { value: "маме", label: "Маме" },
          { value: "папе", label: "Папе" },
          { value: "жене / девушке", label: "Жене / девушке" },
          { value: "мужу / парню", label: "Мужу / парню" },
          { value: "другу / подруге", label: "Другу / подруге" },
          { value: "ребёнку", label: "Ребёнку" },
          { value: "коллеге", label: "Коллеге" },
          { value: "другому", label: "Другому" },
        ],
      },
      {
        id: "occasion",
        prompt: "Повод?",
        kind: "choice",
        field: "occasion",
        options: [
          { value: "день рождения", label: "День рождения" },
          { value: "годовщина", label: "Годовщина" },
          { value: "новый год", label: "Новый год" },
          { value: "благодарность", label: "Благодарность" },
          { value: "без повода", label: "Без повода" },
        ],
      },
      {
        id: "budget",
        prompt: "Бюджет?",
        kind: "choice",
        field: "budget",
        options: [
          { value: "до 1500", label: "До 1500 ₽" },
          { value: "до 3000", label: "До 3000 ₽" },
          { value: "до 5000", label: "До 5000 ₽" },
          { value: "без лимита", label: "Без лимита" },
        ],
      },
      {
        id: "photo",
        prompt: "Фото есть?",
        kind: "boolean",
        field: "hasPhoto",
        hint: "Можно напечатать портрет или карикатуру",
      },
      doneStep(),
    ],
  },

  photo: {
    id: "photo",
    label: "Фотопечать",
    description: "Печать и стилизация по фотографии",
    orderType: "photo",
    keywords: [
      "распечатать",
      "фото",
      "фотопечать",
      "холст",
      "пазл",
      "календар",
      "магнит",
      "фотокниг",
      "карикатур",
      "pixar",
      "пиксар",
      "по фото",
    ],
    weight: 4,
    steps: [
      {
        id: "product",
        prompt: "На чём напечатать?",
        kind: "choice",
        field: "product",
        options: [
          { value: "кружка", label: "Кружка" },
          { value: "холст", label: "Холст" },
          { value: "футболка", label: "Футболка" },
          { value: "пазл", label: "Пазл" },
          { value: "магнит", label: "Магнит" },
          { value: "фотокнига", label: "Фотокнига" },
        ],
      },
      {
        id: "photo",
        prompt: "Фото готово загрузить?",
        kind: "boolean",
        field: "hasPhoto",
      },
      {
        id: "style",
        prompt: "Стиль?",
        kind: "choice",
        field: "style",
        optional: true,
        options: [
          { value: "как есть", label: "Как на фото" },
          { value: "карикатура", label: "Карикатура" },
          { value: "pixar", label: "Pixar" },
          { value: "акварель", label: "Акварель" },
          { value: "поп-арт", label: "Поп-арт" },
        ],
      },
      {
        id: "budget",
        prompt: "Бюджет?",
        kind: "choice",
        field: "budget",
        options: [
          { value: "до 1500", label: "До 1500 ₽" },
          { value: "до 3000", label: "До 3000 ₽" },
          { value: "до 5000", label: "До 5000 ₽" },
          { value: "без лимита", label: "Без лимита" },
        ],
      },
      doneStep(),
    ],
  },

  corporate: {
    id: "corporate",
    label: "Корпоратив",
    description: "Тиражи, мерч и подарки для компании",
    orderType: "business",
    keywords: [
      "корпоратив",
      "сотрудник",
      "сотрудникам",
      "тираж",
      "логотип",
      "компани",
      "мерч",
      "бизнес",
      "welcome",
      "офис",
    ],
    patterns: [
      String.raw`\d+\s*(?:шт|штук|футболок|кружек|кепок|толстовок)`,
      String.raw`(?:10|20|30|50|80|100|200|500)\s*футболок`,
    ],
    weight: 5,
    steps: [
      {
        id: "what",
        prompt: "Что изготовить?",
        kind: "choice",
        field: "product",
        options: [
          { value: "футболки", label: "Футболки" },
          { value: "кружки", label: "Кружки" },
          { value: "шопперы", label: "Шопперы" },
          { value: "блокноты", label: "Блокноты" },
          { value: "welcome-box", label: "Welcome-box" },
          { value: "другое", label: "Другое" },
        ],
      },
      {
        id: "qty",
        prompt: "Количество?",
        kind: "choice",
        field: "quantity",
        options: [
          { value: "10", label: "10" },
          { value: "20", label: "20" },
          { value: "50", label: "50" },
          { value: "100", label: "100" },
          { value: "200+", label: "200+" },
        ],
      },
      {
        id: "logo",
        prompt: "Логотип есть?",
        kind: "boolean",
        field: "hasLogo",
      },
      {
        id: "deadline",
        prompt: "Срок?",
        kind: "choice",
        field: "deadline",
        options: [
          { value: "срочно", label: "Срочно (1–3 дня)" },
          { value: "неделя", label: "До недели" },
          { value: "две недели", label: "1–2 недели" },
          { value: "гибко", label: "Гибко" },
        ],
      },
      {
        id: "city",
        prompt: "Город?",
        kind: "choice",
        field: "city",
        options: [
          { value: "Красноярск", label: "Красноярск" },
          { value: "Новосибирск", label: "Новосибирск" },
          { value: "Москва", label: "Москва" },
          { value: "другой", label: "Другой" },
        ],
      },
      doneStep(),
    ],
  },

  print_3d: {
    id: "print_3d",
    label: "3D печать",
    description: "Изделия и прототипы на 3D-принтере",
    orderType: "custom",
    keywords: [
      "3d",
      "3д",
      "трёхмер",
      "трехмер",
      "аддитив",
      "фигурк",
      "прототип",
      "пластик pla",
      "3d печать",
      "3д печать",
    ],
    weight: 6,
    steps: [
      {
        id: "what",
        prompt: "Что напечатать?",
        kind: "text",
        field: "what",
        placeholder: "Фигурка, брелок, корпус…",
      },
      {
        id: "qty",
        prompt: "Количество?",
        kind: "number",
        field: "quantity",
        placeholder: "1",
      },
      {
        id: "material",
        prompt: "Материал?",
        kind: "choice",
        field: "material",
        optional: true,
        options: [
          { value: "PLA", label: "PLA" },
          { value: "PETG", label: "PETG" },
          { value: "не знаю", label: "Не знаю" },
        ],
      },
      {
        id: "deadline",
        prompt: "Срок?",
        kind: "choice",
        field: "deadline",
        options: [
          { value: "срочно", label: "Срочно" },
          { value: "неделя", label: "До недели" },
          { value: "гибко", label: "Гибко" },
        ],
      },
      doneStep(),
    ],
  },

  laser: {
    id: "laser",
    label: "Лазерная гравировка",
    description: "Гравировка на дереве, металле, стекле",
    orderType: "custom",
    keywords: [
      "лазер",
      "гравировк",
      "выгравир",
      "лазерная",
      "дерево гравир",
      "металл гравир",
    ],
    weight: 6,
    steps: [
      {
        id: "what",
        prompt: "Что гравировать?",
        kind: "choice",
        field: "product",
        options: [
          { value: "доска", label: "Доска / панно" },
          { value: "кружка", label: "Кружка / термос" },
          { value: "брелок", label: "Брелок" },
          { value: "рамка", label: "Рамка" },
          { value: "другое", label: "Другое" },
        ],
      },
      {
        id: "material",
        prompt: "Материал?",
        kind: "choice",
        field: "material",
        options: [
          { value: "дерево", label: "Дерево" },
          { value: "металл", label: "Металл" },
          { value: "стекло", label: "Стекло" },
          { value: "кожзам", label: "Кожзам" },
          { value: "не знаю", label: "Не знаю" },
        ],
      },
      {
        id: "qty",
        prompt: "Количество?",
        kind: "number",
        field: "quantity",
        placeholder: "1",
      },
      {
        id: "deadline",
        prompt: "Срок?",
        kind: "choice",
        field: "deadline",
        options: [
          { value: "срочно", label: "Срочно" },
          { value: "неделя", label: "До недели" },
          { value: "гибко", label: "Гибко" },
        ],
      },
      doneStep(),
    ],
  },

  embroidery: {
    id: "embroidery",
    label: "Вышивка",
    description: "Машинная вышивка логотипов и надписей",
    orderType: "custom",
    keywords: [
      "вышивк",
      "вышить",
      "машинная вышивка",
      "шеврон",
      "нашивк",
    ],
    weight: 6,
    steps: [
      {
        id: "what",
        prompt: "На чём вышить?",
        kind: "choice",
        field: "product",
        options: [
          { value: "футболка", label: "Футболка" },
          { value: "худи", label: "Худи" },
          { value: "кепка", label: "Кепка" },
          { value: "полотенце", label: "Полотенце" },
          { value: "другое", label: "Другое" },
        ],
      },
      {
        id: "qty",
        prompt: "Количество?",
        kind: "number",
        field: "quantity",
        placeholder: "1",
      },
      {
        id: "logo",
        prompt: "Логотип или макет есть?",
        kind: "boolean",
        field: "hasLogo",
      },
      {
        id: "deadline",
        prompt: "Срок?",
        kind: "choice",
        field: "deadline",
        options: [
          { value: "срочно", label: "Срочно" },
          { value: "неделя", label: "До недели" },
          { value: "гибко", label: "Гибко" },
        ],
      },
      doneStep(),
    ],
  },

  unsure: {
    id: "unsure",
    label: "Не знаю что подарить",
    description: "Поможем выбрать через короткие вопросы",
    orderType: "gift",
    keywords: [
      "не знаю что подарить",
      "не знаю подарок",
      "что подарить",
      "подскажите подарок",
      "идея подарка",
      "помогите выбрать",
    ],
    weight: 7,
    steps: [
      {
        id: "whom",
        prompt: "Кому дарите?",
        kind: "choice",
        field: "recipient",
        options: [
          { value: "маме", label: "Маме" },
          { value: "папе", label: "Папе" },
          { value: "паре", label: "Партнёру" },
          { value: "другу", label: "Другу / подруге" },
          { value: "коллеге", label: "Коллеге" },
          { value: "другому", label: "Другому" },
        ],
      },
      {
        id: "interests",
        prompt: "Что любит?",
        kind: "choice",
        field: "interests",
        options: [
          { value: "кофе и уют", label: "Кофе и уют" },
          { value: "юмор", label: "Юмор" },
          { value: "путешествия", label: "Путешествия" },
          { value: "спорт", label: "Спорт" },
          { value: "творчество", label: "Творчество" },
          { value: "не знаю", label: "Не знаю" },
        ],
      },
      {
        id: "budget",
        prompt: "Бюджет?",
        kind: "choice",
        field: "budget",
        options: [
          { value: "до 1500", label: "До 1500 ₽" },
          { value: "до 3000", label: "До 3000 ₽" },
          { value: "до 5000", label: "До 5000 ₽" },
          { value: "без лимита", label: "Без лимита" },
        ],
      },
      {
        id: "photo",
        prompt: "Есть фото для персонализации?",
        kind: "boolean",
        field: "hasPhoto",
      },
      doneStep(),
    ],
  },

  custom: {
    id: "custom",
    label: "Свой вариант",
    description: "Свободное описание — подберём вручную",
    orderType: "custom",
    keywords: [],
    weight: 1,
    steps: [
      {
        id: "describe",
        prompt: "Опишите, что нужно",
        kind: "text",
        field: "details",
        placeholder: "Технология, изделие, тираж, пожелания…",
      },
      {
        id: "contact",
        prompt: "Как удобнее связаться?",
        kind: "choice",
        field: "contact",
        options: [
          { value: "телефон", label: "Телефон" },
          { value: "telegram", label: "Telegram" },
          { value: "email", label: "Email" },
        ],
      },
      doneStep(),
    ],
  },
};

export function listScenarios(): ScenarioDefinition[] {
  return SCENARIO_IDS_LIST.map((id) => SCENARIO_REGISTRY[id]);
}

const SCENARIO_IDS_LIST = Object.keys(SCENARIO_REGISTRY) as ScenarioId[];

export function getScenarioDefinition(
  id: ScenarioId,
): ScenarioDefinition {
  return SCENARIO_REGISTRY[id];
}

export function getScenarioLabel(id: ScenarioId): string {
  return SCENARIO_REGISTRY[id].label;
}

export function isScenarioId(value: string | undefined | null): value is ScenarioId {
  return Boolean(value && value in SCENARIO_REGISTRY);
}

/** Legacy agent ids → Scenario Engine */
export function normalizeScenarioId(
  value: string | undefined | null,
): ScenarioId | null {
  if (!value) return null;
  if (value === "business") return "corporate";
  if (value === "free") return "custom";
  if (isScenarioId(value)) return value;
  return null;
}
