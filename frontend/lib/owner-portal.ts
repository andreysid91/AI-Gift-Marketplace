import {
  INITIAL_PRODUCTS,
  formatAdminMoney,
  loadAdminOrders,
  type AdminOrder,
  type AdminProduct,
  type OrderPipelineStatus,
} from "./admin-mock";
import { giftKnowledgeBase } from "./knowledge";
import { ORDER_PIPELINE } from "./order-pipeline";
import { PARTNERS, type PartnerProfile } from "./partners";

export const OWNER_SESSION_KEY = "ai-gift-owner-session";
export const OWNER_PRICES_KEY = "ai-gift-owner-prices";
export const OWNER_AI_KEY = "ai-gift-owner-ai";
export const OWNER_PARTNERS_KEY = "ai-gift-owner-partners";
export const OWNER_EXPENSES_KEY = "ai-gift-owner-expenses";

export const OWNER_LOGIN = "owner";
export const OWNER_PASSWORD = "owner123";

export type OwnerSession = {
  role: "owner";
  name: string;
  login: string;
};

export type OwnerClient = {
  id: string;
  name: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: string;
};

export type OwnerExpense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
};

export type OwnerAiSettings = {
  enabled: boolean;
  fallbackOnly: boolean;
  model: string;
  openaiConfigured: boolean;
  notes: string;
};

export type OwnerStats = {
  ordersTotal: number;
  ordersActive: number;
  revenue: number;
  partnerCost: number;
  expenses: number;
  profit: number;
  clients: number;
  partnersActive: number;
  avgCheck: number;
  byStatus: Record<OrderPipelineStatus, number>;
};

export type PriceRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  active: boolean;
};

const DEFAULT_EXPENSES: OwnerExpense[] = [
  {
    id: "EXP-01",
    title: "Реклама VK / Telegram",
    category: "Маркетинг",
    amount: 18000,
    date: "2026-08-01",
  },
  {
    id: "EXP-02",
    title: "Хостинг и домены",
    category: "Инфраструктура",
    amount: 4200,
    date: "2026-08-01",
  },
  {
    id: "EXP-03",
    title: "Упаковка и расходники",
    category: "Операции",
    amount: 6500,
    date: "2026-08-02",
  },
  {
    id: "EXP-04",
    title: "Курьерская служба",
    category: "Логистика",
    amount: 9100,
    date: "2026-08-03",
  },
  {
    id: "EXP-05",
    title: "OpenAI API (оценка)",
    category: "AI",
    amount: 2800,
    date: "2026-08-04",
  },
];

const DEFAULT_AI: OwnerAiSettings = {
  enabled: true,
  fallbackOnly: true,
  model: "gpt-4o-mini",
  openaiConfigured: false,
  notes: "AI включается только если база знаний не нашла решение.",
};

const PARTNER_COST_RATE = 0.58;

export function authenticateOwner(
  login: string,
  password: string,
): OwnerSession | null {
  if (
    login.trim().toLowerCase() === OWNER_LOGIN &&
    password === OWNER_PASSWORD
  ) {
    return { role: "owner", name: "Владелец AI Gift", login: OWNER_LOGIN };
  }
  return null;
}

export function saveOwnerSession(session: OwnerSession) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(OWNER_SESSION_KEY, JSON.stringify(session));
}

export function loadOwnerSession(): OwnerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(OWNER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OwnerSession;
  } catch {
    return null;
  }
}

export function clearOwnerSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(OWNER_SESSION_KEY);
}

export function deriveClients(orders: AdminOrder[]): OwnerClient[] {
  const map = new Map<string, OwnerClient>();
  for (const order of orders) {
    const key = `${order.clientName}|${order.phone}`;
    const prev = map.get(key);
    if (!prev) {
      map.set(key, {
        id: `CLI-${map.size + 1}`,
        name: order.clientName,
        phone: order.phone,
        ordersCount: 1,
        totalSpent: order.total,
        lastOrderAt: order.createdAt,
      });
    } else {
      prev.ordersCount += 1;
      prev.totalSpent += order.total;
      if (order.createdAt > prev.lastOrderAt) prev.lastOrderAt = order.createdAt;
    }
  }
  return [...map.values()].sort((a, b) => b.totalSpent - a.totalSpent);
}

export function loadExpenses(): OwnerExpense[] {
  if (typeof window === "undefined") return DEFAULT_EXPENSES;
  try {
    const raw = localStorage.getItem(OWNER_EXPENSES_KEY);
    if (!raw) return DEFAULT_EXPENSES;
    return JSON.parse(raw) as OwnerExpense[];
  } catch {
    return DEFAULT_EXPENSES;
  }
}

export function saveExpenses(expenses: OwnerExpense[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OWNER_EXPENSES_KEY, JSON.stringify(expenses));
}

export function loadAiSettings(): OwnerAiSettings {
  if (typeof window === "undefined") return DEFAULT_AI;
  try {
    const raw = localStorage.getItem(OWNER_AI_KEY);
    if (!raw) return DEFAULT_AI;
    return JSON.parse(raw) as OwnerAiSettings;
  } catch {
    return DEFAULT_AI;
  }
}

export function saveAiSettings(settings: OwnerAiSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OWNER_AI_KEY, JSON.stringify(settings));
}

export function loadManagedPrices(): PriceRow[] {
  const base: PriceRow[] = INITIAL_PRODUCTS.map((p: AdminProduct) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    active: p.active,
  }));

  if (typeof window === "undefined") return base;
  try {
    const raw = localStorage.getItem(OWNER_PRICES_KEY);
    if (!raw) return base;
    const stored = JSON.parse(raw) as PriceRow[];
    const byId = new Map(base.map((item) => [item.id, item]));
    for (const row of stored) byId.set(row.id, row);
    return [...byId.values()];
  } catch {
    return base;
  }
}

export function saveManagedPrices(rows: PriceRow[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OWNER_PRICES_KEY, JSON.stringify(rows));
}

export function loadManagedPartners(): PartnerProfile[] {
  if (typeof window === "undefined") return PARTNERS;
  try {
    const raw = localStorage.getItem(OWNER_PARTNERS_KEY);
    if (!raw) return PARTNERS;
    return JSON.parse(raw) as PartnerProfile[];
  } catch {
    return PARTNERS;
  }
}

export function saveManagedPartners(partners: PartnerProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OWNER_PARTNERS_KEY, JSON.stringify(partners));
}

export function computeOwnerStats(
  orders: AdminOrder[],
  expenses: OwnerExpense[],
  partners: PartnerProfile[],
): OwnerStats {
  const revenue = orders.reduce((sum, o) => sum + (o.total > 0 ? o.total : 0), 0);
  const paidOrders = orders.filter((o) => o.total > 0);
  const partnerCost = Math.round(revenue * PARTNER_COST_RATE);
  const expenseSum = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byStatus = Object.fromEntries(
    ORDER_PIPELINE.map((s) => [s, 0]),
  ) as Record<OrderPipelineStatus, number>;
  for (const order of orders) {
    byStatus[order.status] = (byStatus[order.status] ?? 0) + 1;
  }

  const activeStatuses = new Set([
    "Новая заявка",
    "Ожидает подтверждения",
    "Передано партнеру",
    "Изготавливается",
    "Готово",
    "Передано в доставку",
  ]);

  return {
    ordersTotal: orders.length,
    ordersActive: orders.filter((o) => activeStatuses.has(o.status)).length,
    revenue,
    partnerCost,
    expenses: expenseSum,
    profit: revenue - partnerCost - expenseSum,
    clients: deriveClients(orders).length,
    partnersActive: partners.filter((p) => p.status === "Активный").length,
    avgCheck:
      paidOrders.length > 0 ? Math.round(revenue / paidOrders.length) : 0,
    byStatus,
  };
}

export function getKnowledgeOverview() {
  return [
    { key: "occasions", label: "Поводы", count: giftKnowledgeBase.occasions.length },
    {
      key: "relationships",
      label: "Отношения",
      count: giftKnowledgeBase.relationships.length,
    },
    { key: "hobbies", label: "Хобби", count: giftKnowledgeBase.hobbies.length },
    {
      key: "professions",
      label: "Профессии",
      count: giftKnowledgeBase.professions.length,
    },
    { key: "products", label: "Товары KB", count: giftKnowledgeBase.products.length },
    { key: "addons", label: "Дополнения", count: giftKnowledgeBase.addons.length },
    { key: "styles", label: "Стили", count: giftKnowledgeBase.styles.length },
    { key: "materials", label: "Материалы", count: giftKnowledgeBase.materials.length },
    {
      key: "productionMethods",
      label: "Технологии",
      count: giftKnowledgeBase.productionMethods.length,
    },
  ] as const;
}

export function getAllHistory(orders: AdminOrder[]) {
  return orders
    .flatMap((order) =>
      order.history.map((entry) => ({
        orderId: order.id,
        title: order.title,
        status: entry.status,
        at: entry.at,
        note: entry.note,
        client: order.clientName,
      })),
    )
    .sort(
      (a, b) => b.at.localeCompare(a.at) || b.orderId.localeCompare(a.orderId),
    );
}

export function filterOrders(
  orders: AdminOrder[],
  query: string,
  status: OrderPipelineStatus | "all",
  type: AdminOrder["type"] | "all",
): AdminOrder[] {
  const q = query.trim().toLowerCase();
  return orders.filter((order) => {
    if (status !== "all" && order.status !== status) return false;
    if (type !== "all" && order.type !== type) return false;
    if (!q) return true;
    const hay = [
      order.id,
      order.title,
      order.clientName,
      order.phone,
      order.partner,
      order.summary,
      order.comment,
      order.status,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export { formatAdminMoney, loadAdminOrders, ORDER_PIPELINE };
export type { AdminOrder, PartnerProfile };
