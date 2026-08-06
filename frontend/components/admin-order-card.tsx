"use client";

import { useState } from "react";
import {
  ORDER_PIPELINE,
  formatAdminMoney,
  type OrderPipelineStatus,
} from "../lib/admin-mock";
import {
  ORDER_STATUS_TONE,
  getNextStatus,
  getStatusIndex,
  type OrderPipelineStatus as PipelineStatus,
} from "../lib/order-pipeline";
import type { AdminOrder } from "../lib/admin-mock";

type AdminOrderCardProps = {
  order: AdminOrder;
  onStatusChange: (id: string, status: OrderPipelineStatus) => void;
  onAdvance: (id: string) => void;
};

function typeLabel(type: AdminOrder["type"]): string {
  switch (type) {
    case "gift":
      return "Подарок";
    case "photo":
      return "Фотопечать";
    case "business":
      return "Бизнес";
    case "custom":
      return "Идея";
    default:
      return "Новая";
  }
}

function LineList({
  title,
  items,
  empty,
}: {
  title: string;
  items: AdminOrder["products"];
  empty: string;
}) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
        {title}
      </p>
      {items.length === 0 ? (
        <p className="mt-2 text-sm font-bold text-[var(--muted)]">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {items.map((item) => (
            <li
              key={`${item.id}-${item.title}`}
              className="flex items-center justify-between gap-3 rounded-[16px] bg-[var(--surface-warm)] px-3 py-2.5"
            >
              <span className="flex min-w-0 items-center gap-2 font-extrabold">
                {item.emoji ? (
                  <span className="text-xl" aria-hidden>
                    {item.emoji}
                  </span>
                ) : null}
                <span className="truncate">
                  {item.title}
                  {(item.qty ?? 1) > 1 ? ` × ${item.qty}` : ""}
                </span>
              </span>
              <span className="shrink-0 text-sm font-extrabold text-[var(--accent)]">
                {formatAdminMoney(item.price * (item.qty ?? 1))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PipelineTrack({ status }: { status: PipelineStatus }) {
  const current = getStatusIndex(status);
  return (
    <ol className="grid gap-1.5 sm:grid-cols-7">
      {ORDER_PIPELINE.map((step, index) => {
        const done = index <= current;
        const active = index === current;
        return (
          <li
            key={step}
            className={`rounded-[12px] px-1.5 py-2 text-center text-[10px] font-extrabold leading-tight sm:text-[11px] ${
              active
                ? ORDER_STATUS_TONE[step]
                : done
                  ? "bg-[var(--mint-soft)] text-[var(--mint)]"
                  : "bg-[var(--surface-warm)] text-[var(--muted)]"
            }`}
          >
            {step}
          </li>
        );
      })}
    </ol>
  );
}

export function AdminOrderCard({
  order,
  onStatusChange,
  onAdvance,
}: AdminOrderCardProps) {
  const [editingStatus, setEditingStatus] = useState(false);
  const [draftStatus, setDraftStatus] = useState<OrderPipelineStatus>(
    order.status,
  );
  const next = getNextStatus(order.status);

  function openStatusEditor() {
    setDraftStatus(order.status);
    setEditingStatus(true);
  }

  function applyStatus() {
    onStatusChange(order.id, draftStatus);
    setEditingStatus(false);
  }

  return (
    <article className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-extrabold text-[var(--muted)]">
              {order.id}
            </span>
            <span className="rounded-full bg-[var(--surface-warm)] px-3 py-1 text-xs font-extrabold">
              {typeLabel(order.type)}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-extrabold ${ORDER_STATUS_TONE[order.status]}`}
            >
              {order.status}
            </span>
          </div>
          <h3 className="mt-3 font-[family-name:var(--font-unbounded)] text-xl font-semibold sm:text-2xl">
            {order.title}
          </h3>
        </div>
        <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--accent)] sm:text-3xl">
          {formatAdminMoney(order.total)}
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Имя клиента" value={order.clientName || order.client} />
        <Field label="Телефон" value={order.phone || order.contact || "—"} />
        <Field label="Партнер" value={order.partner || order.partnerName || "Не назначен"} />
        {order.partnerId ? (
          <Field label="ID партнёра" value={order.partnerId} />
        ) : null}
        {order.mockup ? <Field label="Макет" value={order.mockup} /> : null}
        {order.deadline ? <Field label="Срок (дедлайн)" value={order.deadline} /> : null}
        <Field label="Адрес доставки" value={order.address || "Самовывоз / не указан"} />
        {order.delivery ? (
          <>
            <Field label="Доставка" value={order.delivery.methodName} />
            <Field
              label="Стоимость доставки"
              value={
                order.delivery.cost > 0
                  ? formatAdminMoney(order.delivery.cost)
                  : "Бесплатно"
              }
            />
            <Field label="Срок доставки" value={order.delivery.timeLabel} />
            <Field
              label="Трек"
              value={order.delivery.track || "—"}
            />
            <Field label="Статус доставки" value={order.delivery.status} />
          </>
        ) : null}
        <Field label="Статус" value={order.status} />
        <Field label="Срок изготовления" value={order.productionTime || "—"} />
      </div>

      <div className="mt-4">
        <Field
          label="Комментарий"
          value={order.comment?.trim() ? order.comment : "Без комментария"}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <LineList
          title="Выбранные товары"
          items={order.products}
          empty="Товары не указаны"
        />
        <LineList
          title="Дополнительные товары"
          items={order.addons}
          empty="Дополнений нет"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 rounded-[20px] bg-[var(--surface-warm)] px-4 py-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Итоговая стоимость
          </p>
          <p className="mt-1 font-[family-name:var(--font-unbounded)] text-3xl font-semibold text-[var(--accent)]">
            {formatAdminMoney(order.total)}
          </p>
        </div>
        <p className="text-sm font-bold text-[var(--muted)]">
          Создан: {order.createdAt}
        </p>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
          Этап обработки
        </p>
        <PipelineTrack status={order.status} />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={openStatusEditor}
          className="inline-flex items-center justify-center rounded-[18px] bg-[var(--accent)] px-6 py-3.5 text-base font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
        >
          Изменить статус
        </button>
        {next ? (
          <button
            type="button"
            onClick={() => onAdvance(order.id)}
            className="inline-flex items-center justify-center rounded-[18px] bg-[var(--foreground)] px-6 py-3.5 text-base font-extrabold text-white transition hover:opacity-90"
          >
            Далее: {next}
          </button>
        ) : (
          <span className="text-sm font-extrabold text-[var(--mint)]">
            Заказ завершён
          </span>
        )}
      </div>

      {editingStatus ? (
        <div className="mt-4 rounded-[20px] border-2 border-[var(--line)] bg-[var(--surface-warm)] p-4">
          <label className="block text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Новый статус
          </label>
          <select
            value={draftStatus}
            onChange={(event) =>
              setDraftStatus(event.target.value as OrderPipelineStatus)
            }
            className="mt-2 w-full rounded-[16px] border-2 border-[var(--line)] bg-white px-4 py-3 text-base font-bold outline-none focus:border-[var(--accent)]"
          >
            {ORDER_PIPELINE.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyStatus}
              className="rounded-[14px] bg-[var(--accent)] px-5 py-2.5 text-sm font-extrabold text-white"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => setEditingStatus(false)}
              className="rounded-[14px] bg-white px-5 py-2.5 text-sm font-extrabold text-[var(--foreground)]"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : null}

      {order.history.length > 0 ? (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-extrabold text-[var(--muted)] hover:text-[var(--accent)]">
            История статусов ({order.history.length})
          </summary>
          <ul className="mt-3 space-y-2 border-l-2 border-[var(--line)] pl-4">
            {[...order.history].reverse().map((entry, index) => (
              <li key={`${entry.status}-${entry.at}-${index}`}>
                <p className="text-sm font-extrabold">{entry.status}</p>
                <p className="text-xs font-bold text-[var(--muted)]">
                  {entry.at}
                  {entry.note ? ` · ${entry.note}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-base font-extrabold leading-snug text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}
