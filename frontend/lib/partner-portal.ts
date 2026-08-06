import {
  loadAdminOrders,
  saveAdminOrders,
  setOrderStatus,
  type AdminOrder,
  type OrderLineItem,
} from "./admin-mock";
import type { OrderPipelineStatus } from "./order-pipeline";
import { PARTNERS, getPartnerById, type PartnerProfile } from "./partners";

/** Partner-facing production statuses */
export const PARTNER_WORK_STATUSES = [
  "Получен",
  "В работе",
  "Готов",
  "Выдан курьеру",
] as const;

export type PartnerWorkStatus = (typeof PARTNER_WORK_STATUSES)[number];

export const PARTNER_WORK_STATUS_TONE: Record<PartnerWorkStatus, string> = {
  Получен: "bg-[#e8f0ff] text-[#3b6fd8]",
  "В работе": "bg-[var(--berry-soft)] text-[var(--berry)]",
  Готов: "bg-[var(--mint-soft)] text-[var(--mint)]",
  "Выдан курьеру": "bg-[#efe6d8] text-[#8a6a3d]",
};

/** Partner status → admin pipeline status */
export const PARTNER_TO_ADMIN_STATUS: Record<
  PartnerWorkStatus,
  OrderPipelineStatus
> = {
  Получен: "Передано партнеру",
  "В работе": "Изготавливается",
  Готов: "Готово",
  "Выдан курьеру": "Передано в доставку",
};

export function adminStatusToPartner(
  status: OrderPipelineStatus,
): PartnerWorkStatus | null {
  switch (status) {
    case "Передано партнеру":
      return "Получен";
    case "Изготавливается":
      return "В работе";
    case "Готово":
      return "Готов";
    case "Передано в доставку":
    case "Доставлено":
      return "Выдан курьеру";
    default:
      return null;
  }
}

export type PartnerCredentials = {
  partnerId: string;
  login: string;
  password: string;
};

/** Demo logins — mock only, no backend */
export const PARTNER_CREDENTIALS: PartnerCredentials[] = [
  { partnerId: "P-01", login: "printhouse", password: "print123" },
  { partnerId: "P-02", login: "laser", password: "laser123" },
  { partnerId: "P-03", login: "embroidery", password: "embro123" },
  { partnerId: "P-04", login: "photolab", password: "photo123" },
  { partnerId: "P-05", login: "textile", password: "textile123" },
  { partnerId: "P-06", login: "uvnorth", password: "uv123" },
];

export const PARTNER_SESSION_KEY = "ai-gift-partner-session";

export type PartnerSession = {
  partnerId: string;
  login: string;
  name: string;
};

/** Sanitized work order — no PII, no client price, no margin */
export type PartnerWorkOrder = {
  id: string;
  title: string;
  items: Array<{
    title: string;
    qty: number;
    emoji?: string;
  }>;
  mockup: string;
  deadline: string;
  comment: string;
  status: PartnerWorkStatus;
};

export function authenticatePartner(
  login: string,
  password: string,
): PartnerSession | null {
  const match = PARTNER_CREDENTIALS.find(
    (item) =>
      item.login.toLowerCase() === login.trim().toLowerCase() &&
      item.password === password,
  );
  if (!match) return null;
  const partner = getPartnerById(match.partnerId);
  if (!partner || partner.status === "Отключен") return null;
  return {
    partnerId: match.partnerId,
    login: match.login,
    name: partner.name,
  };
}

export function savePartnerSession(session: PartnerSession) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PARTNER_SESSION_KEY, JSON.stringify(session));
}

export function loadPartnerSession(): PartnerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PARTNER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PartnerSession;
  } catch {
    return null;
  }
}

export function clearPartnerSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PARTNER_SESSION_KEY);
}

function resolvePartnerId(order: AdminOrder): string | undefined {
  if (order.partnerId) return order.partnerId;
  if (!order.partner && !order.partnerName) return undefined;
  const name = order.partner || order.partnerName || "";
  return PARTNERS.find((p) => p.name === name)?.id;
}

function toWorkItems(order: AdminOrder) {
  const lines: OrderLineItem[] = [...order.products, ...order.addons];
  return lines.map((item) => ({
    title: item.title,
    qty: item.qty ?? 1,
    emoji: item.emoji,
  }));
}

/**
 * Strip everything partners must not see:
 * client name/phone/address, client total, margin, other partners.
 */
export function toPartnerWorkOrder(order: AdminOrder): PartnerWorkOrder | null {
  const partnerStatus =
    order.partnerStatus ?? adminStatusToPartner(order.status);
  if (!partnerStatus) return null;

  return {
    id: order.id,
    title: order.title,
    items: toWorkItems(order),
    mockup: order.mockup || "Макет не приложен",
    deadline: order.deadline || order.productionTime || "уточняется",
    comment: order.productionComment || order.comment || "Без комментария",
    status: partnerStatus,
  };
}

export function getPartnerWorkOrders(partnerId: string): PartnerWorkOrder[] {
  return loadAdminOrders()
    .filter((order) => resolvePartnerId(order) === partnerId)
    .map(toPartnerWorkOrder)
    .filter((item): item is PartnerWorkOrder => item != null)
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** Partner updates status → admin order status updates automatically */
export function updatePartnerOrderStatus(
  partnerId: string,
  orderId: string,
  status: PartnerWorkStatus,
): PartnerWorkOrder | null {
  const orders = loadAdminOrders();
  const index = orders.findIndex((order) => order.id === orderId);
  if (index < 0) return null;

  const order = orders[index];
  if (resolvePartnerId(order) !== partnerId) return null;

  const adminStatus = PARTNER_TO_ADMIN_STATUS[status];
  const updated = setOrderStatus(
    {
      ...order,
      partnerId,
      partnerStatus: status,
    },
    adminStatus,
    `Партнёр обновил статус: ${status}`,
  );
  updated.partnerStatus = status;

  const next = [...orders];
  next[index] = updated;
  saveAdminOrders(next);

  return toPartnerWorkOrder(updated);
}

export function getDemoLogins(): Array<{
  partner: PartnerProfile;
  login: string;
  password: string;
}> {
  return PARTNER_CREDENTIALS.map((cred) => ({
    partner: getPartnerById(cred.partnerId)!,
    login: cred.login,
    password: cred.password,
  })).filter((item) => item.partner);
}
