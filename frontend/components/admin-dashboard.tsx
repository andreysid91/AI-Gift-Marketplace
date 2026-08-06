"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_ORDERS_STORAGE_KEY,
  INITIAL_PRODUCTS,
  ORDER_PIPELINE,
  advanceOrderStatus,
  formatAdminMoney,
  loadAdminOrders,
  saveAdminOrders,
  setOrderStatus,
  type AdminOrder,
  type OrderPipelineStatus,
} from "../lib/admin-mock";
import { PARTNERS } from "../lib/partners";
import { ORDER_STATUS_TONE, isTerminalStatus } from "../lib/order-pipeline";
import { AdminOrderCard } from "./admin-order-card";
import { PartnerCard } from "./partner-card";

type SectionId =
  | "new"
  | "orders"
  | "pipeline"
  | "partners"
  | "products"
  | "photo"
  | "business"
  | "custom";

const SECTIONS: Array<{ id: SectionId; label: string }> = [
  { id: "new", label: "Новые заявки" },
  { id: "orders", label: "Заказы" },
  { id: "pipeline", label: "Обработка" },
  { id: "partners", label: "Партнеры" },
  { id: "products", label: "Товары" },
  { id: "photo", label: "Фотопечать" },
  { id: "business", label: "Корпоративные" },
  { id: "custom", label: "Свободные идеи" },
];

function matchesSection(order: AdminOrder, section: SectionId): boolean {
  switch (section) {
    case "new":
      return order.status === "Новая заявка";
    case "orders":
    case "pipeline":
      return true;
    case "photo":
      return order.type === "photo";
    case "business":
      return order.type === "business";
    case "custom":
      return order.type === "custom";
    default:
      return false;
  }
}

export function AdminDashboard() {
  const [section, setSection] = useState<SectionId>("new");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products] = useState(INITIAL_PRODUCTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setOrders(loadAdminOrders());
    setHydrated(true);

    function sync() {
      setOrders(loadAdminOrders());
    }
    function onStorage(event: StorageEvent) {
      if (event.key === ADMIN_ORDERS_STORAGE_KEY) sync();
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", sync);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveAdminOrders(orders);
  }, [orders, hydrated]);

  const visibleOrders = useMemo(
    () => orders.filter((order) => matchesSection(order, section)),
    [orders, section],
  );

  function updateStatus(id: string, status: OrderPipelineStatus) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? setOrderStatus(order, status) : order,
      ),
    );
  }

  function advance(id: string) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? advanceOrderStatus(order) : order,
      ),
    );
  }

  const newCount = orders.filter(
    (order) => order.status === "Новая заявка",
  ).length;

  const pipelineCounts = useMemo(() => {
    const counts = Object.fromEntries(
      ORDER_PIPELINE.map((status) => [status, 0]),
    ) as Record<OrderPipelineStatus, number>;
    for (const order of orders) {
      counts[order.status] = (counts[order.status] ?? 0) + 1;
    }
    return counts;
  }, [orders]);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
      <aside className="h-fit rounded-[28px] bg-white p-4 shadow-[var(--shadow-soft)] lg:sticky lg:top-6">
        <p className="px-3 pt-2 text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
          Разделы
        </p>
        <nav className="mt-3 space-y-1">
          {SECTIONS.map((item) => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left text-base font-extrabold transition ${
                  active
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--foreground)] hover:bg-[var(--surface-warm)]"
                }`}
              >
                <span>{item.label}</span>
                {item.id === "new" ? (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[var(--accent-soft)] text-[var(--accent)]"
                    }`}
                  >
                    {newCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
              {SECTIONS.find((item) => item.id === section)?.label}
            </h2>
            <p className="mt-2 text-base font-bold text-[var(--muted)]">
              Внутренняя обработка · mock · без backend
            </p>
          </div>
        </header>

        {section === "pipeline" ? (
          <PipelineBoard counts={pipelineCounts} />
        ) : null}

        {section === "partners" ? (
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-base font-bold text-[var(--muted)]">
                {PARTNERS.length} партнёров · mock
              </p>
              <a
                href="/partners"
                className="text-base font-extrabold text-[var(--accent)] hover:underline"
              >
                Открыть страницу партнёров →
              </a>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {PARTNERS.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        ) : null}

        {section === "products" ? (
          <ProductsTable products={products} />
        ) : null}

        {section !== "partners" &&
        section !== "products" &&
        section !== "pipeline" ? (
          <OrdersTable
            orders={visibleOrders}
            emptyLabel={emptyLabel(section)}
            onStatusChange={updateStatus}
            onAdvance={advance}
          />
        ) : null}

        {section === "pipeline" ? (
          <div className="mt-6">
            <OrdersTable
              orders={orders.filter((o) => !isTerminalStatus(o.status))}
              emptyLabel="Активных заказов нет"
              onStatusChange={updateStatus}
              onAdvance={advance}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}

function emptyLabel(section: SectionId): string {
  switch (section) {
    case "new":
      return "Новых заявок нет";
    case "photo":
      return "Заявок на фотопечать нет";
    case "business":
      return "Корпоративных заказов нет";
    case "custom":
      return "Свободных идей нет";
    default:
      return "Заказов пока нет";
  }
}

function PipelineBoard({
  counts,
}: {
  counts: Record<OrderPipelineStatus, number>;
}) {
  return (
    <div className="mb-2 overflow-x-auto rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
        Воронка статусов
      </p>
      <div className="mt-4 flex min-w-[720px] items-stretch gap-2">
        {ORDER_PIPELINE.map((status, index) => (
          <div key={status} className="flex flex-1 items-stretch gap-2">
            <div
              className={`flex flex-1 flex-col justify-between rounded-[20px] px-3 py-4 ${ORDER_STATUS_TONE[status]}`}
            >
              <p className="text-xs font-extrabold leading-snug">{status}</p>
              <p className="mt-3 font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
                {counts[status]}
              </p>
            </div>
            {index < ORDER_PIPELINE.length - 1 ? (
              <div className="flex items-center text-lg font-black text-[var(--muted)]">
                →
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersTable({
  orders,
  emptyLabel,
  onStatusChange,
  onAdvance,
}: {
  orders: AdminOrder[];
  emptyLabel: string;
  onStatusChange: (id: string, status: OrderPipelineStatus) => void;
  onAdvance: (id: string) => void;
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-[28px] bg-white px-6 py-12 text-center shadow-[var(--shadow-soft)]">
        <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          {emptyLabel}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <AdminOrderCard
          key={order.id}
          order={order}
          onStatusChange={onStatusChange}
          onAdvance={onAdvance}
        />
      ))}
    </div>
  );
}

function ProductsTable({
  products,
}: {
  products: typeof INITIAL_PRODUCTS;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]">
      <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-3 border-b border-[var(--line)] px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-[var(--muted)] sm:px-6">
        <span>Товар</span>
        <span>Категория</span>
        <span>Цена</span>
        <span>Статус</span>
      </div>
      {products.map((product) => (
        <div
          key={product.id}
          className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-3 border-b border-[var(--line)] px-5 py-4 last:border-b-0 sm:px-6"
        >
          <span className="font-extrabold">{product.name}</span>
          <span className="font-bold text-[var(--muted)]">{product.category}</span>
          <span className="font-extrabold text-[var(--accent)]">
            {formatAdminMoney(product.price)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-extrabold ${
              product.active
                ? "bg-[var(--mint-soft)] text-[var(--mint)]"
                : "bg-[#efe6d8] text-[#6b5344]"
            }`}
          >
            {product.active ? "Активен" : "Скрыт"}
          </span>
        </div>
      ))}
    </div>
  );
}
