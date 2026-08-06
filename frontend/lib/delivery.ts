/**
 * Delivery module (mock).
 * Methods: Самовывоз · Доставка · Курьер · Яндекс Доставка · СДЭК · Почта России
 */

export const DELIVERY_METHODS = [
  {
    id: "pickup",
    name: "Самовывоз",
    cost: 0,
    timeLabel: "сегодня / завтра",
    timeHours: 0,
    needsAddress: false,
    needsTrack: false,
    tone: "bg-[var(--mint-soft)] text-[var(--mint)]",
  },
  {
    id: "delivery",
    name: "Доставка",
    cost: 400,
    timeLabel: "1–2 дня",
    timeHours: 48,
    needsAddress: true,
    needsTrack: true,
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
  },
  {
    id: "courier",
    name: "Курьер",
    cost: 550,
    timeLabel: "2–6 часов",
    timeHours: 6,
    needsAddress: true,
    needsTrack: true,
    tone: "bg-[var(--secondary-soft)] text-[#c56a12]",
  },
  {
    id: "yandex",
    name: "Яндекс Доставка",
    cost: 390,
    timeLabel: "1–3 часа",
    timeHours: 3,
    needsAddress: true,
    needsTrack: true,
    tone: "bg-[#e8f0ff] text-[#3b6fd8]",
  },
  {
    id: "cdek",
    name: "СДЭК",
    cost: 450,
    timeLabel: "2–5 дней",
    timeHours: 120,
    needsAddress: true,
    needsTrack: true,
    tone: "bg-[#efe6d8] text-[#8a6a3d]",
  },
  {
    id: "post",
    name: "Почта России",
    cost: 320,
    timeLabel: "5–14 дней",
    timeHours: 336,
    needsAddress: true,
    needsTrack: true,
    tone: "bg-[var(--berry-soft)] text-[var(--berry)]",
  },
] as const;

export type DeliveryMethodId = (typeof DELIVERY_METHODS)[number]["id"];

export type DeliveryShipmentStatus =
  | "Ожидает отправки"
  | "В пути"
  | "В пункте выдачи"
  | "Доставлено"
  | "Самовывоз";

export const DELIVERY_SHIPMENT_STATUSES: DeliveryShipmentStatus[] = [
  "Ожидает отправки",
  "В пути",
  "В пункте выдачи",
  "Доставлено",
  "Самовывоз",
];

export const DELIVERY_SHIPMENT_TONE: Record<DeliveryShipmentStatus, string> = {
  "Ожидает отправки": "bg-[var(--secondary-soft)] text-[#c56a12]",
  "В пути": "bg-[#e8f0ff] text-[#3b6fd8]",
  "В пункте выдачи": "bg-[var(--accent-soft)] text-[var(--accent)]",
  Доставлено: "bg-[var(--mint-soft)] text-[var(--mint)]",
  Самовывоз: "bg-[var(--mint-soft)] text-[var(--mint)]",
};

export type OrderDelivery = {
  methodId: DeliveryMethodId;
  methodName: string;
  cost: number;
  timeLabel: string;
  track: string;
  status: DeliveryShipmentStatus;
  address: string;
};

export function getDeliveryMethod(id: DeliveryMethodId | string | undefined) {
  return (
    DELIVERY_METHODS.find((item) => item.id === id) ?? DELIVERY_METHODS[0]
  );
}

export function createDelivery(input: {
  methodId: DeliveryMethodId;
  address?: string;
  track?: string;
  status?: DeliveryShipmentStatus;
}): OrderDelivery {
  const method = getDeliveryMethod(input.methodId);
  const defaultStatus: DeliveryShipmentStatus =
    method.id === "pickup" ? "Самовывоз" : "Ожидает отправки";

  return {
    methodId: method.id,
    methodName: method.name,
    cost: method.cost,
    timeLabel: method.timeLabel,
    track: input.track ?? (method.needsTrack ? "" : "—"),
    status: input.status ?? defaultStatus,
    address:
      input.address?.trim() ||
      (method.needsAddress ? "Адрес уточняется" : "Самовывоз"),
  };
}

export function generateTrack(methodId: DeliveryMethodId): string {
  const prefix =
    methodId === "cdek"
      ? "CDEK"
      : methodId === "yandex"
        ? "YA"
        : methodId === "post"
          ? "RP"
          : methodId === "courier"
            ? "CR"
            : "DL";
  const num = Math.floor(100000000 + Math.random() * 899999999);
  return `${prefix}${num}`;
}

export function inferMethodFromAddress(
  address: string,
): DeliveryMethodId {
  const a = address.toLowerCase();
  if (!a || a.includes("самовывоз")) return "pickup";
  if (a.includes("сдэк") || a.includes("cdek")) return "cdek";
  if (a.includes("яндекс")) return "yandex";
  if (a.includes("почт")) return "post";
  if (a.includes("курьер")) return "courier";
  return "delivery";
}

export function formatDeliveryMoney(value: number): string {
  if (value <= 0) return "Бесплатно";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}
