/**
 * Customer-facing order timeline (TASK-066).
 */

import type { OrderPipelineStatus } from "./order-pipeline";

export const CUSTOMER_TIMELINE = [
  "Получен",
  "Подтверждение",
  "Производство",
  "Упаковка",
  "Доставка",
  "Вручен",
] as const;

export type CustomerTimelineStep = (typeof CUSTOMER_TIMELINE)[number];

/**
 * How many steps are completed (✔).
 * Next index is the current open step (○ highlighted), unless all done.
 */
export function customerDoneCount(
  status: OrderPipelineStatus | string | null | undefined,
): number {
  switch (status) {
    case "Доставлено":
      return CUSTOMER_TIMELINE.length;
    case "Передано в доставку":
      return 4;
    case "Готово":
      return 3;
    case "Передано партнеру":
    case "Изготавливается":
      return 2;
    case "Ожидает подтверждения":
      return 1;
    case "Новая заявка":
    default:
      return 1; // Получен ✔ right after submit
  }
}
