import {
  ORDER_PIPELINE,
  appendStatus,
  createStatusHistory,
  type OrderPipelineStatus,
  type StatusHistoryEntry,
} from "./order-pipeline";
import {
  createDelivery,
  inferMethodFromAddress,
  type OrderDelivery,
} from "./delivery";

export { ORDER_PIPELINE };
export type { OrderPipelineStatus };
export type { OrderDelivery };

/** @deprecated Use ORDER_PIPELINE */
export const ORDER_STATUSES = ORDER_PIPELINE;
export type OrderStatus = OrderPipelineStatus;

export type OrderType =
  | "gift"
  | "photo"
  | "business"
  | "custom"
  | "new";

export type OrderLineItem = {
  id: string;
  title: string;
  price: number;
  emoji?: string;
  qty?: number;
};

export type AdminOrder = {
  id: string;
  type: OrderType;
  title: string;
  /** @deprecated use clientName */
  client: string;
  clientName: string;
  /** @deprecated use phone */
  contact: string;
  phone: string;
  comment: string;
  /** Comment visible to partner (production note) */
  productionComment?: string;
  products: OrderLineItem[];
  addons: OrderLineItem[];
  summary: string;
  total: number;
  address: string;
  delivery?: OrderDelivery;
  /** @deprecated use partner */
  partnerName?: string;
  partner: string;
  partnerId?: string;
  /** Partner-facing status (synced with pipeline) */
  partnerStatus?:
    | "Получен"
    | "В работе"
    | "Готов"
    | "Выдан курьеру";
  mockup?: string;
  deadline?: string;
  status: OrderPipelineStatus;
  productionTime: string;
  createdAt: string;
  history: StatusHistoryEntry[];
};

export type AdminPartner = {
  id: string;
  name: string;
  city: string;
  technologies: string;
  status: "Активный" | "Проверяется" | "Отключен";
};

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  active: boolean;
};

function line(
  id: string,
  title: string,
  price: number,
  emoji?: string,
  qty = 1,
): OrderLineItem {
  return { id, title, price, emoji, qty };
}

function order(
  partial: Omit<
    AdminOrder,
    | "history"
    | "clientName"
    | "phone"
    | "partner"
    | "comment"
    | "products"
    | "addons"
    | "address"
    | "delivery"
    | "productionTime"
    | "summary"
  > &
    Partial<
      Pick<
        AdminOrder,
        | "clientName"
        | "phone"
        | "partner"
        | "comment"
        | "products"
        | "addons"
        | "address"
        | "delivery"
        | "productionTime"
        | "partnerName"
        | "summary"
        | "partnerId"
        | "partnerStatus"
        | "mockup"
        | "deadline"
        | "productionComment"
      >
    > & { history?: StatusHistoryEntry[] },
): AdminOrder {
  const clientName = partial.clientName ?? partial.client;
  const phone = partial.phone ?? partial.contact;
  const partner = partial.partner ?? partial.partnerName ?? "";
  const products = partial.products ?? [];
  const addons = partial.addons ?? [];
  const summary =
    partial.summary ||
    [...products, ...addons].map((item) => item.title).join(" + ") ||
    partial.title;

  return {
    ...partial,
    client: clientName,
    clientName,
    contact: phone,
    phone,
    comment: partial.comment ?? "",
    productionComment: partial.productionComment ?? partial.comment ?? "",
    products,
    addons,
    summary,
    address: partial.address ?? "",
    delivery:
      partial.delivery ??
      createDelivery({
        methodId: inferMethodFromAddress(partial.address ?? ""),
        address: partial.address ?? "",
      }),
    partnerName: partner || undefined,
    partner,
    partnerId: partial.partnerId,
    partnerStatus: partial.partnerStatus,
    mockup: partial.mockup ?? "Макет / файл вложения",
    deadline: partial.deadline ?? partial.productionTime ?? "1–2 дня",
    productionTime: partial.productionTime ?? "1–2 дня",
    history:
      partial.history ??
      createStatusHistory(partial.status, partial.createdAt),
  };
}

export const INITIAL_ORDERS: AdminOrder[] = [
  order({
    id: "ORD-1042",
    type: "new",
    title: "Подарок брату",
    client: "Анна К.",
    contact: "+7 900 111-22-33",
    comment: "Нужно к субботе, без острого юмора на принте",
    products: [
      line("mug", "Кружка", 990, "☕"),
      line("tee", "Футболка", 1690, "👕"),
    ],
    addons: [line("box", "Подарочная коробка", 450, "🎁")],
    summary: "Кружка + футболка + упаковка",
    total: 3130,
    address: "г. Красноярск, ул. Ленина, 45, кв. 12",
    delivery: createDelivery({
      methodId: "yandex",
      address: "г. Красноярск, ул. Ленина, 45, кв. 12",
      track: "YA100200300",
      status: "Ожидает отправки",
    }),
    partner: "",
    status: "Новая заявка",
    productionTime: "1–2 дня",
    createdAt: "2026-08-04",
  }),
  order({
    id: "ORD-1041",
    type: "new",
    title: "Не знаю что подарить",
    client: "Игорь М.",
    contact: "+7 900 000-11-22",
    comment: "Бюджет до 3000, человеку нравится рыбалка",
    products: [],
    addons: [],
    summary: "Запрос с главной",
    total: 0,
    address: "",
    status: "Новая заявка",
    productionTime: "уточняется",
    createdAt: "2026-08-04",
  }),
  order({
    id: "ORD-1038",
    type: "gift",
    title: "Подарок жене",
    client: "Дмитрий С.",
    contact: "+7 903 555-10-20",
    comment: "Сделать романтично, добавить свечу",
    products: [line("canvas", "Холст", 2490, "🖼️")],
    addons: [
      line("candle", "Свеча", 490, "🕯️"),
      line("chocolate", "Шоколад", 320, "🍫"),
    ],
    total: 3300,
    address: "г. Красноярск, пр. Мира, 10",
    status: "Ожидает подтверждения",
    productionTime: "2–3 дня",
    createdAt: "2026-08-03",
  }),
  order({
    id: "ORD-1035",
    type: "gift",
    title: "Подарок маме",
    client: "Елена В.",
    contact: "+7 912 444-33-22",
    comment: "Можно без коробки",
    products: [line("frame", "Фоторамка", 890, "🖼️")],
    addons: [
      line("tea", "Чай", 280, "🍵"),
      line("card", "Открытка", 250, "💌"),
    ],
    total: 1420,
    address: "Самовывоз · ТЦ Планета",
    delivery: createDelivery({
      methodId: "pickup",
      address: "Самовывоз · ТЦ Планета",
      status: "Самовывоз",
    }),
    partner: "PrintHouse Красноярск",
    partnerId: "P-01",
    partnerStatus: "В работе",
    mockup: "frame-mom-v2.jpg",
    deadline: "2026-08-06",
    productionComment: "Фоторамка + чай, без коробки",
    status: "Изготавливается",
    productionTime: "24 часа",
    createdAt: "2026-08-02",
  }),
  order({
    id: "ORD-1029",
    type: "photo",
    title: "Холст 40×50",
    client: "Ольга П.",
    contact: "+7 913 111-22-33",
    comment: "Стиль Pixar, фото приложено",
    products: [line("canvas", "Холст 40×50", 2490, "🖼️")],
    addons: [line("box", "Подарочная коробка", 450, "🎁")],
    total: 2940,
    address: "г. Красноярск, ул. Красной Армии, 8",
    partner: "PrintHouse Красноярск",
    partnerId: "P-01",
    partnerStatus: "Получен",
    mockup: "canvas-pixar-olga.png",
    deadline: "2026-08-05",
    productionComment: "Холст 40×50, стиль Pixar",
    status: "Передано партнеру",
    productionTime: "2 дня",
    createdAt: "2026-08-01",
  }),
  order({
    id: "ORD-1024",
    type: "photo",
    title: "Магниты набор",
    client: "Сергей Л.",
    contact: "+7 999 100-20-30",
    comment: "",
    products: [line("magnet", "Магнит", 350, "🧲", 6)],
    addons: [line("card", "Открытка", 250, "💌")],
    total: 2350,
    address: "г. Красноярск, ул. Дубровинского, 1",
    partner: "PrintHouse Красноярск",
    partnerId: "P-01",
    partnerStatus: "Готов",
    mockup: "magnets-set-6.pdf",
    deadline: "2026-08-01",
    productionComment: "6 магнитов, реализм",
    status: "Готово",
    productionTime: "12 часов",
    createdAt: "2026-07-30",
  }),
  order({
    id: "ORD-1020",
    type: "business",
    title: "80 футболок",
    client: "ООО «Север»",
    contact: "+7 391 200-30-40",
    comment: "Логотип в векторе отправим на почту",
    products: [line("tee", "Футболка", 1690, "👕", 80)],
    addons: [],
    total: 120000,
    address: "г. Красноярск, ул. Заводская, 5 · склад",
    status: "Ожидает подтверждения",
    productionTime: "7–10 дней",
    createdAt: "2026-08-03",
  }),
  order({
    id: "ORD-1015",
    type: "business",
    title: "Welcome-box × 20",
    client: "АО «Кристалл»",
    contact: "+7 391 200-00-11",
    comment: "Нужно к онбордингу 12 августа",
    products: [
      line("mug", "Кружка", 990, "☕", 20),
      line("notebook", "Блокнот", 690, "📓", 20),
    ],
    addons: [line("card", "Открытка", 250, "💌", 20)],
    total: 58000,
    address: "г. Красноярск, ул. Карла Маркса, 62",
    partner: "Textile Pro",
    partnerId: "P-05",
    partnerStatus: "Получен",
    mockup: "welcome-box-kristall.zip",
    deadline: "2026-08-12",
    productionComment: "Welcome-box × 20 к онбордингу",
    status: "Передано партнеру",
    productionTime: "5 дней",
    createdAt: "2026-07-28",
  }),
  order({
    id: "ORD-1011",
    type: "custom",
    title: "Шахматы с лицами друзей",
    client: "Никита Р.",
    contact: "+7 900 555-66-77",
    comment: "Можно ли сделать 3D-фигурки?",
    products: [line("figurine-3d", "3D фигурка", 3990, "🧍", 16)],
    addons: [line("box", "Подарочная коробка", 450, "🎁")],
    total: 0,
    address: "",
    status: "Новая заявка",
    productionTime: "уточняется",
    createdAt: "2026-08-04",
  }),
  order({
    id: "ORD-1008",
    type: "custom",
    title: "Деревянная карта мира",
    client: "Мария Т.",
    contact: "+7 950 777-88-99",
    comment: "Пример во вложении",
    products: [line("laser-engraving", "Лазерная гравировка", 1590, "✦")],
    addons: [],
    total: 0,
    address: "г. Красноярск, ул. Авиаторов, 19",
    partner: "LaserCraft",
    partnerId: "P-02",
    partnerStatus: "В работе",
    mockup: "wood-world-map-ref.jpg",
    deadline: "2026-08-08",
    productionComment: "Деревянная карта мира, пример во вложении",
    status: "Изготавливается",
    productionTime: "4–5 дней",
    createdAt: "2026-08-02",
  }),
  order({
    id: "ORD-1005",
    type: "gift",
    title: "Экспресс набор папе",
    client: "Артём К.",
    contact: "+7 900 222-33-44",
    comment: "Доставить сегодня вечером",
    products: [line("mug", "Кружка", 990, "☕")],
    addons: [
      line("coffee", "Кофе", 350, "☕"),
      line("card", "Открытка", 250, "💌"),
    ],
    total: 1590,
    address: "г. Красноярск, ул. Молокова, 7, кв. 41",
    delivery: createDelivery({
      methodId: "courier",
      address: "г. Красноярск, ул. Молокова, 7, кв. 41",
      track: "CR998877665",
      status: "В пути",
    }),
    partner: "PrintHouse Красноярск",
    partnerId: "P-01",
    partnerStatus: "Выдан курьеру",
    mockup: "mug-dad-express.png",
    deadline: "2026-07-29",
    productionComment: "Экспресс, кружка готова к выдаче курьеру",
    status: "Передано в доставку",
    productionTime: "24 часа",
    createdAt: "2026-07-29",
  }),
  order({
    id: "ORD-1001",
    type: "gift",
    title: "Подарок коллеге",
    client: "Павел Н.",
    contact: "+7 913 222-11-00",
    comment: "Спасибо!",
    products: [line("mug", "Кружка", 990, "☕")],
    addons: [line("chocolate", "Шоколад", 320, "🍫")],
    total: 1380,
    address: "г. Красноярск, ул. Взлётная, 3",
    delivery: createDelivery({
      methodId: "cdek",
      address: "г. Красноярск, ул. Взлётная, 3",
      track: "CDEK123456789",
      status: "Доставлено",
    }),
    partner: "PrintHouse Красноярск",
    partnerId: "P-01",
    partnerStatus: "Выдан курьеру",
    mockup: "mug-colleague.png",
    deadline: "2026-07-26",
    productionComment: "Заказ закрыт",
    status: "Доставлено",
    productionTime: "1 день",
    createdAt: "2026-07-25",
  }),
];

export const INITIAL_PARTNERS: AdminPartner[] = [
  {
    id: "P-01",
    name: "PrintHouse Красноярск",
    city: "Красноярск",
    technologies: "Сублимация, текстиль, фотопечать",
    status: "Активный",
  },
  {
    id: "P-02",
    name: "LaserCraft",
    city: "Красноярск",
    technologies: "Лазерная гравировка, дерево",
    status: "Активный",
  },
  {
    id: "P-03",
    name: "Embroidery Lab",
    city: "Красноярск",
    technologies: "Вышивка",
    status: "Проверяется",
  },
];

export const INITIAL_PRODUCTS: AdminProduct[] = [
  { id: "PRD-01", name: "Кружка", category: "Сублимация", price: 990, active: true },
  { id: "PRD-02", name: "Футболка", category: "Текстиль", price: 1690, active: true },
  { id: "PRD-03", name: "Холст", category: "Фотопечать", price: 2490, active: true },
  { id: "PRD-04", name: "Магнит", category: "Фотопечать", price: 350, active: true },
  { id: "PRD-05", name: "Пазл", category: "Фотопечать", price: 1500, active: true },
  { id: "PRD-06", name: "Открытка", category: "Полиграфия", price: 250, active: true },
  { id: "PRD-07", name: "Подарочная коробка", category: "Упаковка", price: 450, active: true },
  { id: "PRD-08", name: "Фоторамка", category: "Дополнение", price: 890, active: false },
];

export const ADMIN_ORDERS_STORAGE_KEY = "ai-gift-admin-orders";

export function formatAdminMoney(value: number): string {
  if (value <= 0) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function advanceOrderStatus(
  order: AdminOrder,
  note?: string,
): AdminOrder {
  const index = ORDER_PIPELINE.indexOf(order.status);
  if (index < 0 || index >= ORDER_PIPELINE.length - 1) return order;
  const next = ORDER_PIPELINE[index + 1];
  return {
    ...order,
    status: next,
    history: appendStatus(order.history, next, note),
  };
}

export function setOrderStatus(
  order: AdminOrder,
  status: OrderPipelineStatus,
  note?: string,
): AdminOrder {
  if (order.status === status) return order;
  return {
    ...order,
    status,
    history: appendStatus(order.history, status, note),
  };
}

function normalizeOrder(item: Partial<AdminOrder> & Pick<AdminOrder, "id" | "status" | "createdAt" | "title" | "type" | "total">): AdminOrder {
  const clientName = item.clientName ?? item.client ?? "Клиент";
  const phone = item.phone ?? item.contact ?? "—";
  const partner = item.partner ?? item.partnerName ?? "";
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    client: clientName,
    clientName,
    contact: phone,
    phone,
    comment: item.comment ?? "",
    productionComment: item.productionComment ?? item.comment ?? "",
    products: item.products ?? [],
    addons: item.addons ?? [],
    summary: item.summary ?? item.title,
    total: item.total,
    address: item.address ?? "",
    delivery:
      item.delivery ??
      createDelivery({
        methodId: inferMethodFromAddress(item.address ?? ""),
        address: item.address ?? "",
      }),
    partnerName: partner || undefined,
    partner,
    partnerId: item.partnerId,
    partnerStatus: item.partnerStatus,
    mockup: item.mockup ?? "Макет / файл вложения",
    deadline: item.deadline ?? item.productionTime ?? "1–2 дня",
    status: item.status,
    productionTime: item.productionTime ?? "1–2 дня",
    createdAt: item.createdAt,
    history:
      item.history ?? createStatusHistory(item.status, item.createdAt),
  };
}

export function loadAdminOrders(): AdminOrder[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ADMIN_ORDERS_STORAGE_KEY);
    if (!raw) return INITIAL_ORDERS;
    const stored = JSON.parse(raw) as Partial<AdminOrder>[];
    if (!Array.isArray(stored)) return INITIAL_ORDERS;
    const byId = new Map(INITIAL_ORDERS.map((item) => [item.id, item]));
    for (const item of stored) {
      if (!item?.id || !item.status || !item.createdAt || !item.title) continue;
      byId.set(
        item.id,
        normalizeOrder(
          item as Partial<AdminOrder> &
            Pick<AdminOrder, "id" | "status" | "createdAt" | "title" | "type" | "total">,
        ),
      );
    }
    return [...byId.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveAdminOrders(orders: AdminOrder[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function estimateProductionTime(productCount: number): string {
  if (productCount <= 1) return "12–24 часа";
  if (productCount <= 3) return "1–2 дня";
  return "2–3 дня";
}

export function createMockOrderFromCheckout(input: {
  title: string;
  clientName: string;
  phone: string;
  comment?: string;
  products: OrderLineItem[];
  addons: OrderLineItem[];
  total: number;
  address?: string;
  type?: OrderType;
  productionTime?: string;
  deliveryMethodId?: import("./delivery").DeliveryMethodId;
  track?: string;
}): AdminOrder {
  const id = `ORD-${Date.now().toString().slice(-6)}`;
  const createdAt = new Date().toISOString().slice(0, 10);
  const status: OrderPipelineStatus = "Новая заявка";
  const summary = [...input.products, ...input.addons]
    .map((item) => item.title)
    .join(" + ");
  const methodId =
    input.deliveryMethodId ??
    inferMethodFromAddress(input.address ?? "");

  return order({
    id,
    type: input.type ?? "gift",
    title: input.title,
    client: input.clientName,
    clientName: input.clientName,
    contact: input.phone,
    phone: input.phone,
    comment: input.comment ?? "",
    products: input.products,
    addons: input.addons,
    summary: summary || input.title,
    total: input.total,
    address: input.address ?? "",
    delivery: createDelivery({
      methodId,
      address: input.address ?? "",
      track: input.track,
    }),
    partner: "",
    status,
    productionTime:
      input.productionTime ??
      estimateProductionTime(input.products.length + input.addons.length),
    createdAt,
    history: createStatusHistory(status, createdAt, "Создано после оформления"),
  });
}

export function pushCheckoutOrder(orderItem: AdminOrder) {
  const current = loadAdminOrders();
  saveAdminOrders([
    orderItem,
    ...current.filter((item) => item.id !== orderItem.id),
  ]);
}
