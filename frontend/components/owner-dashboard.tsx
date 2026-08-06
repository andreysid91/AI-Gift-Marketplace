"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ORDER_STATUS_TONE,
  type OrderPipelineStatus,
} from "../lib/order-pipeline";
import {
  ORDER_PIPELINE,
  authenticateOwner,
  clearOwnerSession,
  computeOwnerStats,
  deriveClients,
  filterOrders,
  formatAdminMoney,
  getAllHistory,
  getKnowledgeOverview,
  loadAiSettings,
  loadAdminOrders,
  loadExpenses,
  loadManagedPartners,
  loadManagedPrices,
  loadOwnerSession,
  saveAiSettings,
  saveExpenses,
  saveManagedPartners,
  saveManagedPrices,
  saveOwnerSession,
  type AdminOrder,
  type OwnerAiSettings,
  type OwnerExpense,
  type OwnerSession,
  type PartnerProfile,
  type PriceRow,
} from "../lib/owner-portal";
import { giftKnowledgeBase, type KnowledgeEntity } from "../lib/knowledge";
import { AdminOrderCard } from "./admin-order-card";
import {
  advanceOrderStatus,
  saveAdminOrders,
  setOrderStatus,
} from "../lib/admin-mock";
import {
  getWarehouseAlerts,
  loadWarehouse,
  saveWarehouse,
  type WarehouseItem,
} from "../lib/warehouse";
import { WarehousePanel } from "./warehouse-panel";
import { PurchasesPanel } from "./purchases-panel";
import { DeliveryPanel } from "./delivery-panel";
import { getPurchaseList } from "../lib/purchases";
import { LearningInsightsPanel } from "./learning-insights-panel";

type SectionId =
  | "overview"
  | "clients"
  | "partners"
  | "orders"
  | "finance"
  | "statuses"
  | "history"
  | "prices"
  | "knowledge"
  | "products"
  | "warehouse"
  | "purchases"
  | "delivery"
  | "ai"
  | "learning";

const SECTIONS: Array<{ id: SectionId; label: string }> = [
  { id: "overview", label: "Обзор" },
  { id: "clients", label: "Клиенты" },
  { id: "partners", label: "Партнёры" },
  { id: "orders", label: "Все заказы" },
  { id: "finance", label: "Прибыль / расходы" },
  { id: "warehouse", label: "Склад" },
  { id: "purchases", label: "Закупки" },
  { id: "delivery", label: "Доставка" },
  { id: "statuses", label: "Статусы" },
  { id: "history", label: "История" },
  { id: "prices", label: "Цены" },
  { id: "knowledge", label: "База знаний" },
  { id: "learning", label: "Аналитика" },
  { id: "products", label: "Товары" },
  { id: "ai", label: "AI" },
];

export function OwnerDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<OwnerSession | null>(null);
  const [ready, setReady] = useState(false);
  const [section, setSection] = useState<SectionId>("overview");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [expenses, setExpenses] = useState<OwnerExpense[]>([]);
  const [partners, setPartners] = useState<PartnerProfile[]>([]);
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [warehouse, setWarehouse] = useState<WarehouseItem[]>([]);
  const [ai, setAi] = useState<OwnerAiSettings | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderPipelineStatus | "all">(
    "all",
  );
  const [typeFilter, setTypeFilter] = useState<AdminOrder["type"] | "all">(
    "all",
  );
  const [kbKey, setKbKey] = useState<keyof typeof giftKnowledgeBase>("products");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const current = loadOwnerSession();
    setSession(current);
    if (current) hydrate();
    setReady(true);
  }, []);

  function hydrate() {
    setOrders(loadAdminOrders());
    setExpenses(loadExpenses());
    setPartners(loadManagedPartners());
    setPrices(loadManagedPrices());
    setWarehouse(loadWarehouse());
    setAi(loadAiSettings());
  }

  function persistOrders(next: AdminOrder[]) {
    setOrders(next);
    saveAdminOrders(next);
  }

  const stats = useMemo(
    () => computeOwnerStats(orders, expenses, partners),
    [orders, expenses, partners],
  );
  const clients = useMemo(() => deriveClients(orders), [orders]);
  const filteredOrders = useMemo(
    () => filterOrders(orders, query, statusFilter, typeFilter),
    [orders, query, statusFilter, typeFilter],
  );
  const history = useMemo(() => getAllHistory(orders), [orders]);
  const knowledge = getKnowledgeOverview();
  const warehouseAlerts = useMemo(
    () => getWarehouseAlerts(warehouse),
    [warehouse],
  );
  const purchaseCount = useMemo(
    () => getPurchaseList(warehouse).length,
    [warehouse],
  );

  function onLogin(event: FormEvent) {
    event.preventDefault();
    const next = authenticateOwner(login, password);
    if (!next) {
      setLoginError("Доступ только для владельца");
      return;
    }
    saveOwnerSession(next);
    setSession(next);
    hydrate();
  }

  function logout() {
    clearOwnerSession();
    setSession(null);
    router.push("/owner");
  }

  if (!ready) {
    return <p className="font-bold text-[var(--muted)]">Загрузка…</p>;
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md">
        <form
          onSubmit={onLogin}
          className="rounded-[28px] bg-white p-6 shadow-[var(--shadow)] sm:p-8"
        >
          <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Owner Dashboard
          </h2>
          <p className="mt-2 text-sm font-bold text-[var(--muted)]">
            Полный доступ только для владельца
          </p>
          <label className="mt-6 block text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Логин
          </label>
          <input
            value={login}
            onChange={(e) => {
              setLogin(e.target.value);
              setLoginError("");
            }}
            className="mt-2 w-full rounded-[18px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-3 font-bold outline-none focus:border-[var(--accent)]"
          />
          <label className="mt-4 block text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Пароль
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginError("");
            }}
            className="mt-2 w-full rounded-[18px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-3 font-bold outline-none focus:border-[var(--accent)]"
          />
          {loginError ? (
            <p className="mt-3 text-sm font-extrabold text-[var(--berry)]">
              {loginError}
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-6 w-full rounded-[18px] bg-[var(--foreground)] px-5 py-4 text-lg font-extrabold text-white"
          >
            Войти
          </button>
          <p className="mt-4 text-sm font-bold text-[var(--muted)]">
            Демо: owner / owner123
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <aside className="h-fit rounded-[28px] bg-white p-4 shadow-[var(--shadow-soft)] lg:sticky lg:top-6">
        <p className="px-3 pt-2 text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
          Owner
        </p>
        <p className="mt-1 px-3 font-extrabold">{session.name}</p>
        <nav className="mt-4 space-y-1">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`flex w-full items-center gap-2 rounded-[16px] px-4 py-3 text-left text-sm font-extrabold transition ${
                section === item.id
                  ? "bg-[var(--foreground)] text-white"
                  : "hover:bg-[var(--surface-warm)]"
              }`}
            >
              <span>{item.label}</span>
              {item.id === "purchases" && purchaseCount > 0 ? (
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-xs font-black ${
                    section === item.id
                      ? "bg-white/20 text-white"
                      : "bg-[var(--accent-soft)] text-[var(--accent)]"
                  }`}
                >
                  {purchaseCount}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-4">
          <Link
            href="/warehouse"
            className="block rounded-[16px] px-4 py-2 text-sm font-extrabold text-[var(--accent)]"
          >
            Склад →
          </Link>
          <Link
            href="/admin"
            className="block rounded-[16px] px-4 py-2 text-sm font-extrabold text-[var(--accent)]"
          >
            Admin →
          </Link>
          <Link
            href="/partner"
            className="block rounded-[16px] px-4 py-2 text-sm font-extrabold text-[var(--accent)]"
          >
            Partner Portal →
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-[16px] px-4 py-2 text-left text-sm font-extrabold text-[var(--muted)]"
          >
            Выйти
          </button>
        </div>
      </aside>

      <section className="min-w-0">
        <header className="mb-5">
          <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
            {SECTIONS.find((s) => s.id === section)?.label}
          </h2>
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            Полный доступ · mock · без backend
          </p>
        </header>

        {section === "overview" ? (
          <Overview
            stats={stats}
            warehouseNeedBuy={warehouseAlerts.needBuy.length}
            warehouseEmpty={warehouseAlerts.empty.length}
          />
        ) : null}

        {section === "clients" ? <ClientsPanel clients={clients} /> : null}

        {section === "partners" ? (
          <PartnersPanel
            partners={partners}
            onChange={(next) => {
              setPartners(next);
              saveManagedPartners(next);
            }}
          />
        ) : null}

        {section === "orders" ? (
          <OrdersPanel
            query={query}
            setQuery={setQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            orders={filteredOrders}
            onStatusChange={(id, status) => {
              persistOrders(
                orders.map((o) =>
                  o.id === id ? setOrderStatus(o, status) : o,
                ),
              );
            }}
            onAdvance={(id) => {
              persistOrders(
                orders.map((o) => (o.id === id ? advanceOrderStatus(o) : o)),
              );
            }}
          />
        ) : null}

        {section === "finance" ? (
          <FinancePanel
            stats={stats}
            expenses={expenses}
            onExpensesChange={(next) => {
              setExpenses(next);
              saveExpenses(next);
            }}
          />
        ) : null}

        {section === "warehouse" ? (
          <WarehousePanel
            items={warehouse}
            onChange={(next) => {
              setWarehouse(next);
              saveWarehouse(next);
            }}
          />
        ) : null}

        {section === "purchases" ? (
          <PurchasesPanel
            warehouse={warehouse}
            onWarehouseChange={(next) => {
              setWarehouse(next);
              saveWarehouse(next);
            }}
          />
        ) : null}

        {section === "delivery" ? (
          <DeliveryPanel
            orders={orders}
            onUpdateDelivery={(orderId, delivery) => {
              persistOrders(
                orders.map((order) =>
                  order.id === orderId
                    ? {
                        ...order,
                        delivery,
                        address: delivery.address,
                      }
                    : order,
                ),
              );
            }}
          />
        ) : null}

        {section === "statuses" ? <StatusesPanel stats={stats} /> : null}

        {section === "history" ? <HistoryPanel history={history} /> : null}

        {section === "prices" || section === "products" ? (
          <PricesPanel
            prices={prices}
            title={section === "products" ? "Управление товарами" : "Управление ценами"}
            onChange={(next) => {
              setPrices(next);
              saveManagedPrices(next);
            }}
          />
        ) : null}

        {section === "knowledge" ? (
          <KnowledgePanel
            overview={knowledge}
            kbKey={kbKey}
            setKbKey={setKbKey}
          />
        ) : null}

        {section === "learning" ? <LearningInsightsPanel /> : null}

        {section === "ai" && ai ? (
          <AiPanel
            settings={ai}
            onChange={(next) => {
              setAi(next);
              saveAiSettings(next);
            }}
          />
        ) : null}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "good" | "warn";
}) {
  const color =
    tone === "good"
      ? "text-[var(--mint)]"
      : tone === "warn"
        ? "text-[var(--berry)]"
        : "text-[var(--foreground)]";
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p
        className={`mt-2 font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl ${color}`}
      >
        {value}
      </p>
    </div>
  );
}

function Overview({
  stats,
  warehouseNeedBuy,
  warehouseEmpty,
}: {
  stats: ReturnType<typeof computeOwnerStats>;
  warehouseNeedBuy: number;
  warehouseEmpty: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Заказы" value={String(stats.ordersTotal)} />
      <StatCard label="Активные" value={String(stats.ordersActive)} />
      <StatCard label="Клиенты" value={String(stats.clients)} />
      <StatCard label="Партнёры" value={String(stats.partnersActive)} />
      <StatCard label="Выручка" value={formatAdminMoney(stats.revenue)} />
      <StatCard
        label="Расходы партнёрам"
        value={formatAdminMoney(stats.partnerCost)}
        tone="warn"
      />
      <StatCard
        label="Опер. расходы"
        value={formatAdminMoney(stats.expenses)}
        tone="warn"
      />
      <StatCard
        label="Прибыль"
        value={formatAdminMoney(stats.profit)}
        tone={stats.profit >= 0 ? "good" : "warn"}
      />
      <StatCard label="Средний чек" value={formatAdminMoney(stats.avgCheck)} />
      <StatCard
        label="Склад · нужно купить"
        value={String(warehouseNeedBuy)}
        tone={warehouseNeedBuy > 0 ? "warn" : "good"}
      />
      <StatCard
        label="Склад · закончилось"
        value={String(warehouseEmpty)}
        tone={warehouseEmpty > 0 ? "warn" : "good"}
      />
    </div>
  );
}

function ClientsPanel({
  clients,
}: {
  clients: ReturnType<typeof deriveClients>;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]">
      <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-3 border-b border-[var(--line)] px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
        <span>Клиент</span>
        <span>Телефон</span>
        <span>Заказы</span>
        <span>Сумма</span>
      </div>
      {clients.map((client) => (
        <div
          key={client.id}
          className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-3 border-b border-[var(--line)] px-5 py-4 last:border-0"
        >
          <div>
            <p className="font-extrabold">{client.name}</p>
            <p className="text-xs font-bold text-[var(--muted)]">
              {client.lastOrderAt}
            </p>
          </div>
          <p className="font-bold">{client.phone}</p>
          <p className="font-extrabold">{client.ordersCount}</p>
          <p className="font-extrabold text-[var(--accent)]">
            {formatAdminMoney(client.totalSpent)}
          </p>
        </div>
      ))}
    </div>
  );
}

function PartnersPanel({
  partners,
  onChange,
}: {
  partners: PartnerProfile[];
  onChange: (next: PartnerProfile[]) => void;
}) {
  return (
    <div className="space-y-4">
      {partners.map((partner) => (
        <article
          key={partner.id}
          className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-[var(--muted)]">
                {partner.id}
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-unbounded)] text-xl font-semibold">
                {partner.name}
              </h3>
              <p className="mt-2 text-sm font-bold text-[var(--muted)]">
                {partner.contact}
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                {partner.address}
              </p>
            </div>
            <select
              value={partner.status}
              onChange={(event) => {
                const status = event.target.value as PartnerProfile["status"];
                onChange(
                  partners.map((p) =>
                    p.id === partner.id ? { ...p, status } : p,
                  ),
                );
              }}
              className="rounded-[14px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-2 text-sm font-extrabold"
            >
              <option value="Активный">Активный</option>
              <option value="Проверяется">Проверяется</option>
              <option value="Отключен">Отключен</option>
            </select>
          </div>
          <p className="mt-3 text-sm font-bold">
            Срок до {partner.maxProductionDays} дн. · мин. заказ{" "}
            {partner.minOrder} · {partner.pricing}
          </p>
        </article>
      ))}
    </div>
  );
}

function OrdersPanel({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  orders,
  onStatusChange,
  onAdvance,
}: {
  query: string;
  setQuery: (v: string) => void;
  statusFilter: OrderPipelineStatus | "all";
  setStatusFilter: (v: OrderPipelineStatus | "all") => void;
  typeFilter: AdminOrder["type"] | "all";
  setTypeFilter: (v: AdminOrder["type"] | "all") => void;
  orders: AdminOrder[];
  onStatusChange: (id: string, status: OrderPipelineStatus) => void;
  onAdvance: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-5 grid gap-3 rounded-[24px] bg-white p-4 shadow-[var(--shadow-soft)] sm:grid-cols-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск: клиент, заказ, партнёр…"
          className="rounded-[16px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-3 font-bold outline-none focus:border-[var(--accent)] sm:col-span-1"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as OrderPipelineStatus | "all")
          }
          className="rounded-[16px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-3 font-bold"
        >
          <option value="all">Все статусы</option>
          {ORDER_PIPELINE.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value as AdminOrder["type"] | "all")
          }
          className="rounded-[16px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-3 font-bold"
        >
          <option value="all">Все типы</option>
          <option value="gift">Подарок</option>
          <option value="photo">Фото</option>
          <option value="business">Бизнес</option>
          <option value="custom">Идея</option>
          <option value="new">Новая</option>
        </select>
      </div>
      <p className="mb-4 text-sm font-bold text-[var(--muted)]">
        Найдено: {orders.length}
      </p>
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
    </div>
  );
}

function FinancePanel({
  stats,
  expenses,
  onExpensesChange,
}: {
  stats: ReturnType<typeof computeOwnerStats>;
  expenses: OwnerExpense[];
  onExpensesChange: (next: OwnerExpense[]) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Выручка" value={formatAdminMoney(stats.revenue)} />
        <StatCard
          label="Партнёрам"
          value={formatAdminMoney(stats.partnerCost)}
          tone="warn"
        />
        <StatCard
          label="Расходы"
          value={formatAdminMoney(stats.expenses)}
          tone="warn"
        />
        <StatCard
          label="Прибыль"
          value={formatAdminMoney(stats.profit)}
          tone={stats.profit >= 0 ? "good" : "warn"}
        />
      </div>
      <div className="overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]">
        <div className="border-b border-[var(--line)] px-5 py-4">
          <h3 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
            Расходы
          </h3>
        </div>
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-4 last:border-0"
          >
            <div>
              <p className="font-extrabold">{expense.title}</p>
              <p className="text-sm font-bold text-[var(--muted)]">
                {expense.category} · {expense.date}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={expense.amount}
                onChange={(e) => {
                  const amount = Number(e.target.value) || 0;
                  onExpensesChange(
                    expenses.map((item) =>
                      item.id === expense.id ? { ...item, amount } : item,
                    ),
                  );
                }}
                className="w-28 rounded-[12px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-3 py-2 text-right font-extrabold"
              />
              <span className="font-extrabold text-[var(--accent)]">₽</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusesPanel({
  stats,
}: {
  stats: ReturnType<typeof computeOwnerStats>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {ORDER_PIPELINE.map((status) => (
        <div
          key={status}
          className={`rounded-[22px] px-4 py-5 ${ORDER_STATUS_TONE[status]}`}
        >
          <p className="text-sm font-extrabold">{status}</p>
          <p className="mt-3 font-[family-name:var(--font-unbounded)] text-4xl font-semibold">
            {stats.byStatus[status]}
          </p>
        </div>
      ))}
    </div>
  );
}

function HistoryPanel({
  history,
}: {
  history: ReturnType<typeof getAllHistory>;
}) {
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)]">
      <ul className="space-y-3">
        {history.slice(0, 40).map((entry, index) => (
          <li
            key={`${entry.orderId}-${entry.status}-${entry.at}-${index}`}
            className="border-b border-[var(--line)] pb-3 last:border-0"
          >
            <p className="font-extrabold">
              {entry.orderId} · {entry.status}
            </p>
            <p className="text-sm font-bold text-[var(--muted)]">
              {entry.at} · {entry.client} · {entry.title}
              {entry.note ? ` · ${entry.note}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricesPanel({
  prices,
  title,
  onChange,
}: {
  prices: PriceRow[];
  title: string;
  onChange: (next: PriceRow[]) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]">
      <div className="border-b border-[var(--line)] px-5 py-4">
        <h3 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
          {title}
        </h3>
      </div>
      {prices.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-[var(--line)] px-5 py-4 last:border-0 sm:grid-cols-[1fr_1fr_auto_auto]"
        >
          <div>
            <p className="font-extrabold">{row.name}</p>
            <p className="text-sm font-bold text-[var(--muted)]">{row.category}</p>
          </div>
          <input
            type="number"
            value={row.price}
            onChange={(e) => {
              const price = Number(e.target.value) || 0;
              onChange(
                prices.map((item) =>
                  item.id === row.id ? { ...item, price } : item,
                ),
              );
            }}
            className="w-28 rounded-[12px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-3 py-2 font-extrabold"
          />
          <button
            type="button"
            onClick={() =>
              onChange(
                prices.map((item) =>
                  item.id === row.id
                    ? { ...item, active: !item.active }
                    : item,
                ),
              )
            }
            className={`rounded-full px-3 py-1 text-xs font-extrabold ${
              row.active
                ? "bg-[var(--mint-soft)] text-[var(--mint)]"
                : "bg-[#efe6d8] text-[#6b5344]"
            }`}
          >
            {row.active ? "Активен" : "Скрыт"}
          </button>
        </div>
      ))}
    </div>
  );
}

function KnowledgePanel({
  overview,
  kbKey,
  setKbKey,
}: {
  overview: ReturnType<typeof getKnowledgeOverview>;
  kbKey: keyof typeof giftKnowledgeBase;
  setKbKey: (key: keyof typeof giftKnowledgeBase) => void;
}) {
  const entities = giftKnowledgeBase[kbKey] as KnowledgeEntity[];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {overview.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() =>
              setKbKey(item.key as keyof typeof giftKnowledgeBase)
            }
            className={`rounded-[22px] px-4 py-4 text-left shadow-[var(--shadow-soft)] ${
              kbKey === item.key
                ? "bg-[var(--foreground)] text-white"
                : "bg-white"
            }`}
          >
            <p className="text-xs font-extrabold uppercase tracking-wide opacity-80">
              {item.label}
            </p>
            <p className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
              {item.count}
            </p>
          </button>
        ))}
      </div>
      <div className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)]">
        <h3 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
          {overview.find((i) => i.key === kbKey)?.label}
        </h3>
        <ul className="mt-4 max-h-[480px] space-y-3 overflow-y-auto">
          {entities.map((entity) => (
            <li
              key={entity.id}
              className="rounded-[16px] bg-[var(--surface-warm)] px-4 py-3"
            >
              <p className="font-extrabold">
                {entity.emoji ? `${entity.emoji} ` : ""}
                {entity.name}
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--muted)]">
                {entity.description}
              </p>
              {entity.averagePrice > 0 ? (
                <p className="mt-1 text-sm font-extrabold text-[var(--accent)]">
                  {formatAdminMoney(entity.averagePrice)}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AiPanel({
  settings,
  onChange,
}: {
  settings: OwnerAiSettings;
  onChange: (next: OwnerAiSettings) => void;
}) {
  return (
    <div className="max-w-2xl space-y-4 rounded-[28px] bg-white p-6 shadow-[var(--shadow-soft)]">
      <label className="flex items-center justify-between gap-4 font-extrabold">
        AI включён
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) =>
            onChange({ ...settings, enabled: e.target.checked })
          }
          className="size-5 accent-[var(--accent)]"
        />
      </label>
      <label className="flex items-center justify-between gap-4 font-extrabold">
        Только как fallback после базы знаний
        <input
          type="checkbox"
          checked={settings.fallbackOnly}
          onChange={(e) =>
            onChange({ ...settings, fallbackOnly: e.target.checked })
          }
          className="size-5 accent-[var(--accent)]"
        />
      </label>
      <label className="block text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
        Модель
      </label>
      <input
        value={settings.model}
        onChange={(e) => onChange({ ...settings, model: e.target.value })}
        className="w-full rounded-[16px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-3 font-bold"
      />
      <label className="mt-2 block text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
        Заметки
      </label>
      <textarea
        value={settings.notes}
        onChange={(e) => onChange({ ...settings, notes: e.target.value })}
        rows={4}
        className="w-full rounded-[16px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-3 font-bold"
      />
      <p className="text-sm font-bold text-[var(--muted)]">
        OPENAI_API_KEY задаётся в `.env` на сервере. Без ключа работает локальный
        AI-fallback по каталогу.
      </p>
    </div>
  );
}
