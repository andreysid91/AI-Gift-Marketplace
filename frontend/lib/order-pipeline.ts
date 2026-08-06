/**
 * Internal order processing pipeline (mock, no backend).
 *
 * Новая заявка → Ожидает подтверждения → Передано партнеру →
 * Изготавливается → Готово → Передано в доставку → Доставлено
 */

export const ORDER_PIPELINE = [
  "Новая заявка",
  "Ожидает подтверждения",
  "Передано партнеру",
  "Изготавливается",
  "Готово",
  "Передано в доставку",
  "Доставлено",
] as const;

export type OrderPipelineStatus = (typeof ORDER_PIPELINE)[number];

export type StatusHistoryEntry = {
  status: OrderPipelineStatus;
  at: string;
  note?: string;
};

export const ORDER_STATUS_TONE: Record<OrderPipelineStatus, string> = {
  "Новая заявка": "bg-[var(--accent-soft)] text-[var(--accent)]",
  "Ожидает подтверждения": "bg-[var(--secondary-soft)] text-[#c56a12]",
  "Передано партнеру": "bg-[#e8f0ff] text-[#3b6fd8]",
  Изготавливается: "bg-[var(--berry-soft)] text-[var(--berry)]",
  Готово: "bg-[var(--mint-soft)] text-[var(--mint)]",
  "Передано в доставку": "bg-[#efe6d8] text-[#8a6a3d]",
  Доставлено: "bg-[#e8f5e9] text-[#2e7d4f]",
};

export function getStatusIndex(status: OrderPipelineStatus): number {
  return ORDER_PIPELINE.indexOf(status);
}

export function getNextStatus(
  status: OrderPipelineStatus,
): OrderPipelineStatus | null {
  const index = getStatusIndex(status);
  if (index < 0 || index >= ORDER_PIPELINE.length - 1) return null;
  return ORDER_PIPELINE[index + 1];
}

export function isTerminalStatus(status: OrderPipelineStatus): boolean {
  return status === "Доставлено";
}

export function createStatusHistory(
  status: OrderPipelineStatus,
  at = new Date().toISOString().slice(0, 10),
  note?: string,
): StatusHistoryEntry[] {
  const index = getStatusIndex(status);
  if (index < 0) {
    return [{ status, at, note }];
  }
  return ORDER_PIPELINE.slice(0, index + 1).map((step, i) => ({
    status: step,
    at,
    note: i === index ? note : undefined,
  }));
}

export function appendStatus(
  history: StatusHistoryEntry[],
  status: OrderPipelineStatus,
  note?: string,
): StatusHistoryEntry[] {
  return [
    ...history,
    {
      status,
      at: new Date().toISOString().slice(0, 10),
      note,
    },
  ];
}
