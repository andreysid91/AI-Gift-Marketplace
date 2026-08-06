/**
 * Smart Search — ChatGPT-like progressive search (TASK-063).
 * Gift Engine parse + one next question. No long forms.
 */

import { parseGiftEngineParams } from "./gift-engine";
import type { GiftEngineParams } from "./gift-engine";
import {
  classifyScenario,
  getScenarioDefinition,
  type ScenarioId,
} from "./scenario-engine";

export type DetectedChip = {
  key: string;
  label: string;
  value: string;
};

export type SearchSuggestion = {
  id: string;
  text: string;
  kind: "complete" | "scenario" | "product" | "popular";
};

export type NextQuestionOption = {
  value: string;
  label: string;
  /** Appended to query when chosen */
  append: string;
};

export type NextQuestion = {
  id: string;
  prompt: string;
  field: "recipient" | "occasion" | "budget" | "quantity" | "product" | "what";
  options: NextQuestionOption[];
};

export type SmartSearchSnapshot = {
  query: string;
  params: GiftEngineParams;
  scenarioId: ScenarioId;
  scenarioLabel: string;
  chips: DetectedChip[];
  suggestions: SearchSuggestion[];
  nextQuestion: NextQuestion | null;
  ready: boolean;
  /** Where to go when ready */
  href: string;
};

const PHRASE_BANK = [
  "Подарок маме",
  "Подарок маме до 3000",
  "Подарок папе",
  "Подарок папе рыбаку до 3000",
  "Подарок девушке",
  "Подарок жене на годовщину",
  "Подарок учителю",
  "Подарок другу",
  "Подарок коллеге",
  "Подарок на день рождения",
  "Кружка с фото",
  "Футболка с принтом",
  "Холст с портретом",
  "Фотокнига",
  "Подарочный набор до 3000",
  "100 футболок для компании",
  "50 кружек с логотипом",
  "Корпоративные подарки",
  "Фото на кружке",
  "Лазерная гравировка",
  "3D фигурка",
  "Вышивка на худи",
] as const;

const RECIPIENT_OPTS: NextQuestionOption[] = [
  { value: "маме", label: "Маме", append: " маме" },
  { value: "папе", label: "Папе", append: " папе" },
  { value: "девушке", label: "Девушке", append: " девушке" },
  { value: "мужу", label: "Мужу", append: " мужу" },
  { value: "другу", label: "Другу", append: " другу" },
  { value: "учителю", label: "Учителю", append: " учителю" },
  { value: "коллеге", label: "Коллеге", append: " коллеге" },
];

const OCCASION_OPTS: NextQuestionOption[] = [
  { value: "день рождения", label: "День рождения", append: " на день рождения" },
  { value: "годовщина", label: "Годовщина", append: " на годовщину" },
  { value: "новый год", label: "Новый год", append: " на новый год" },
  { value: "без повода", label: "Без повода", append: " без повода" },
];

const BUDGET_OPTS: NextQuestionOption[] = [
  { value: "1500", label: "До 1500 ₽", append: " до 1500" },
  { value: "3000", label: "До 3000 ₽", append: " до 3000" },
  { value: "5000", label: "До 5000 ₽", append: " до 5000" },
  { value: "без лимита", label: "Без лимита", append: " без лимита" },
];

const QTY_OPTS: NextQuestionOption[] = [
  { value: "10", label: "10", append: " 10 шт" },
  { value: "20", label: "20", append: " 20 шт" },
  { value: "50", label: "50", append: " 50 шт" },
  { value: "100", label: "100", append: " 100 шт" },
];

const PRODUCT_OPTS: NextQuestionOption[] = [
  { value: "футболки", label: "Футболки", append: " футболки" },
  { value: "кружки", label: "Кружки", append: " кружки" },
  { value: "холст", label: "Холст", append: " холст" },
  { value: "набор", label: "Набор", append: " подарочный набор" },
];

const PHOTO_PRODUCT_OPTS: NextQuestionOption[] = [
  { value: "кружка", label: "Кружка", append: " на кружке" },
  { value: "холст", label: "Холст", append: " на холсте" },
  { value: "футболка", label: "Футболка", append: " на футболке" },
  { value: "пазл", label: "Пазл", append: " на пазле" },
];

function buildChips(params: GiftEngineParams, scenarioLabel: string): DetectedChip[] {
  const chips: DetectedChip[] = [
    { key: "type", label: "Тип", value: scenarioLabel },
  ];
  if (params.recipient) {
    chips.push({ key: "recipient", label: "Кому", value: params.recipient });
  }
  if (params.occasion) {
    chips.push({ key: "occasion", label: "Повод", value: params.occasion });
  }
  if (params.budgetMax != null) {
    chips.push({
      key: "budget",
      label: "Бюджет",
      value: `до ${params.budgetMax.toLocaleString("ru-RU")} ₽`,
    });
  }
  if (params.quantity != null) {
    chips.push({
      key: "quantity",
      label: "Кол-во",
      value: `${params.quantity} шт`,
    });
  }
  if (params.mentionedProductIds.length > 0) {
    chips.push({
      key: "product",
      label: "Товар",
      value: params.mentionedProductIds[0],
    });
  }
  return chips;
}

function buildSuggestions(query: string, scenarioId: ScenarioId): SearchSuggestion[] {
  const q = query.trim().toLowerCase();
  const out: SearchSuggestion[] = [];
  const seen = new Set<string>();

  function push(text: string, kind: SearchSuggestion["kind"]) {
    const key = text.toLowerCase();
    if (!text.trim() || seen.has(key)) return;
    if (q && key === q) return;
    seen.add(key);
    out.push({ id: `${kind}-${out.length}`, text, kind });
  }

  if (!q) {
    for (const phrase of PHRASE_BANK.slice(0, 6)) {
      push(phrase, "popular");
    }
    return out;
  }

  for (const phrase of PHRASE_BANK) {
    if (phrase.toLowerCase().startsWith(q) || phrase.toLowerCase().includes(q)) {
      push(phrase, "complete");
    }
    if (out.length >= 5) break;
  }

  // Soft completions by appending common tails
  if (q.length >= 2 && out.length < 5) {
    const tails = [" до 3000", " на день рождения", " с фото"];
    for (const tail of tails) {
      const candidate = `${query.trim()}${tail}`;
      if (!seen.has(candidate.toLowerCase())) push(candidate, "complete");
      if (out.length >= 6) break;
    }
  }

  const def = getScenarioDefinition(scenarioId);
  push(`${def.label}: ${query.trim() || "…"}`, "scenario");

  return out.slice(0, 6);
}

function hasProductSignal(params: GiftEngineParams, query: string): boolean {
  if (params.mentionedProductIds.length > 0) return true;
  return /футболк|кружк|холст|набор|пазл|магнит|фотокниг|кепк|худи|фигурк/i.test(
    query,
  );
}

/**
 * Only the next missing question — never a full form.
 */
export function getNextQuestion(
  params: GiftEngineParams,
  scenarioId: ScenarioId,
  query: string,
): NextQuestion | null {
  const q = query.trim();

  if (scenarioId === "corporate" || params.orderType === "business") {
    if (!hasProductSignal(params, q)) {
      return {
        id: "product",
        prompt: "Что изготовить?",
        field: "product",
        options: PRODUCT_OPTS,
      };
    }
    if (params.quantity == null) {
      return {
        id: "quantity",
        prompt: "Сколько штук?",
        field: "quantity",
        options: QTY_OPTS,
      };
    }
    return null;
  }

  if (scenarioId === "photo" || params.orderType === "photo") {
    if (!hasProductSignal(params, q)) {
      return {
        id: "product",
        prompt: "На чём напечатать?",
        field: "product",
        options: PHOTO_PRODUCT_OPTS,
      };
    }
    if (params.budgetMax == null && !/без\s*лимита/i.test(q)) {
      return {
        id: "budget",
        prompt: "Какой бюджет?",
        field: "budget",
        options: BUDGET_OPTS,
      };
    }
    return null;
  }

  if (
    scenarioId === "print_3d" ||
    scenarioId === "laser" ||
    scenarioId === "embroidery"
  ) {
    if (!hasProductSignal(params, q) && q.length < 8) {
      return {
        id: "what",
        prompt: "Что нужно?",
        field: "what",
        options: PRODUCT_OPTS,
      };
    }
    if (params.quantity == null && /\d/.test(q) === false) {
      return {
        id: "quantity",
        prompt: "Сколько штук?",
        field: "quantity",
        options: QTY_OPTS,
      };
    }
    return null;
  }

  if (scenarioId === "custom") {
    return q.length >= 3 ? null : {
      id: "what",
      prompt: "Что нужно?",
      field: "what",
      options: PRODUCT_OPTS,
    };
  }

  // gift / unsure
  if (!params.recipient) {
    return {
      id: "recipient",
      prompt: "Кому подарок?",
      field: "recipient",
      options: RECIPIENT_OPTS,
    };
  }
  if (!params.occasion) {
    return {
      id: "occasion",
      prompt: "Повод?",
      field: "occasion",
      options: OCCASION_OPTS,
    };
  }
  if (params.budgetMax == null && !/без\s*лимита/i.test(q)) {
    return {
      id: "budget",
      prompt: "Какой бюджет?",
      field: "budget",
      options: BUDGET_OPTS,
    };
  }
  return null;
}

function buildHref(
  query: string,
  scenarioId: ScenarioId,
  params: GiftEngineParams,
): string {
  const q = query.trim();
  const encoded = encodeURIComponent(q || "Подарок");

  if (
    scenarioId === "corporate" ||
    params.orderType === "business"
  ) {
    return `/create?scenario=corporate&q=${encoded}`;
  }
  if (scenarioId === "photo") {
    return `/ideas?q=${encoded}`;
  }
  if (
    scenarioId === "print_3d" ||
    scenarioId === "laser" ||
    scenarioId === "embroidery" ||
    scenarioId === "custom"
  ) {
    return `/create?scenario=${scenarioId}&q=${encoded}`;
  }
  return `/ideas?q=${encoded}`;
}

/**
 * Live snapshot after every keystroke / answer.
 */
export function analyzeSmartSearch(rawQuery: string): SmartSearchSnapshot {
  const query = rawQuery;
  const params = parseGiftEngineParams({ query });
  const classified = classifyScenario(query);
  const scenarioId = classified.scenarioId;
  const scenarioLabel = getScenarioDefinition(scenarioId).label;
  const nextQuestion = getNextQuestion(params, scenarioId, query);
  const ready = nextQuestion == null && query.trim().length > 0;

  return {
    query,
    params,
    scenarioId,
    scenarioLabel,
    chips: buildChips(params, scenarioLabel),
    suggestions: buildSuggestions(query, scenarioId),
    nextQuestion: ready ? null : query.trim() ? nextQuestion : null,
    ready,
    href: buildHref(query, scenarioId, params),
  };
}

/** Append a quick answer into the free-text query. */
export function appendSearchAnswer(
  query: string,
  option: NextQuestionOption,
): string {
  const base = query.trim();
  const append = option.append.trim();
  if (!base) {
    if (option.append.includes("маме") || option.append.includes("папе")) {
      return `Подарок${option.append}`.replace(/\s+/g, " ").trim();
    }
    return append;
  }
  const lower = base.toLowerCase();
  const needle = append.toLowerCase().trim();
  if (needle && lower.includes(needle.replace(/^\s+/, ""))) return base;
  return `${base}${option.append}`.replace(/\s+/g, " ").trim();
}
