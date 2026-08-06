import type { Scenario, ScenarioDefinition } from "./types";

/**
 * Scenario registry — single source of truth for agent flows.
 * Add a scenario here first, then rules + UI.
 */
export const SCENARIO_DEFINITIONS: Record<Scenario, ScenarioDefinition> = {
  gift: {
    id: "gift",
    label: "Подарок",
    description: "Персональный подарок: идея → сцена изделий → дополнения",
  },
  photo: {
    id: "photo",
    label: "Фотопечать",
    description: "Стили дизайна и печать на изделиях по фото",
  },
  business: {
    id: "business",
    label: "Корпоративный заказ",
    description: "Тиражи, мерч, логотип, расчёт",
  },
  custom: {
    id: "custom",
    label: "Свободный заказ",
    description: "Запрос не распознан — уточнение и связь с нами",
  },
};

export function getScenarioLabel(scenario: Scenario): string {
  return SCENARIO_DEFINITIONS[scenario].label;
}

export function isScenario(value: string | undefined): value is Scenario {
  return (
    value === "gift" ||
    value === "photo" ||
    value === "business" ||
    value === "custom"
  );
}
