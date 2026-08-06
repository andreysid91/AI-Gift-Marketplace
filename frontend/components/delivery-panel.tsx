"use client";

import { useMemo, useState } from "react";
import type { AdminOrder } from "../lib/admin-mock";
import {
  DELIVERY_METHODS,
  DELIVERY_SHIPMENT_STATUSES,
  DELIVERY_SHIPMENT_TONE,
  createDelivery,
  formatDeliveryMoney,
  generateTrack,
  getDeliveryMethod,
  type DeliveryMethodId,
  type DeliveryShipmentStatus,
  type OrderDelivery,
} from "../lib/delivery";

type DeliveryPanelProps = {
  orders: AdminOrder[];
  onUpdateDelivery: (orderId: string, delivery: OrderDelivery) => void;
};

export function DeliveryPanel({
  orders,
  onUpdateDelivery,
}: DeliveryPanelProps) {
  const [filter, setFilter] = useState<DeliveryMethodId | "all">("all");

  const withDelivery = useMemo(
    () =>
      orders.map((order) => ({
        order,
        delivery:
          order.delivery ??
          createDelivery({
            methodId: "delivery",
            address: order.address,
          }),
      })),
    [orders],
  );

  const visible = withDelivery.filter(
    (row) => filter === "all" || row.delivery.methodId === filter,
  );

  const counts = useMemo(() => {
    const map = Object.fromEntries(
      DELIVERY_METHODS.map((m) => [m.id, 0]),
    ) as Record<DeliveryMethodId, number>;
    for (const row of withDelivery) {
      map[row.delivery.methodId] = (map[row.delivery.methodId] ?? 0) + 1;
    }
    return map;
  }, [withDelivery]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DELIVERY_METHODS.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() =>
              setFilter((prev) => (prev === method.id ? "all" : method.id))
            }
            className={`rounded-[22px] px-4 py-4 text-left transition ${method.tone} ${
              filter === method.id ? "ring-2 ring-[var(--foreground)]/20" : ""
            }`}
          >
            <p className="font-extrabold">{method.name}</p>
            <p className="mt-2 text-sm font-bold opacity-90">
              {formatDeliveryMoney(method.cost)} · {method.timeLabel}
            </p>
            <p className="mt-3 font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
              {counts[method.id]}
            </p>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]">
        <div className="border-b border-[var(--line)] px-5 py-4">
          <h3 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold">
            Доставки по заказам
          </h3>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            Способ · стоимость · время · трек
          </p>
        </div>

        {visible.length === 0 ? (
          <p className="px-5 py-10 text-center font-bold text-[var(--muted)]">
            Нет заказов с этим способом доставки
          </p>
        ) : (
          visible.map(({ order, delivery }) => (
            <DeliveryOrderRow
              key={order.id}
              order={order}
              delivery={delivery}
              onChange={(next) => onUpdateDelivery(order.id, next)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function DeliveryOrderRow({
  order,
  delivery,
  onChange,
}: {
  order: AdminOrder;
  delivery: OrderDelivery;
  onChange: (next: OrderDelivery) => void;
}) {
  const method = getDeliveryMethod(delivery.methodId);

  return (
    <article className="border-b border-[var(--line)] px-5 py-5 last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-[var(--muted)]">
            {order.id} · {order.clientName}
          </p>
          <h4 className="mt-1 font-[family-name:var(--font-unbounded)] text-lg font-semibold">
            {order.title}
          </h4>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold ${DELIVERY_SHIPMENT_TONE[delivery.status]}`}
        >
          {delivery.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Способ
          </span>
          <select
            value={delivery.methodId}
            onChange={(event) => {
              const methodId = event.target.value as DeliveryMethodId;
              const nextMethod = getDeliveryMethod(methodId);
              onChange(
                createDelivery({
                  methodId,
                  address: delivery.address,
                  track:
                    nextMethod.needsTrack && !delivery.track
                      ? generateTrack(methodId)
                      : nextMethod.needsTrack
                        ? delivery.track
                        : "—",
                  status:
                    methodId === "pickup" ? "Самовывоз" : delivery.status === "Самовывоз"
                      ? "Ожидает отправки"
                      : delivery.status,
                }),
              );
            }}
            className="mt-1 w-full rounded-[14px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-3 py-2 text-sm font-extrabold"
          >
            {DELIVERY_METHODS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <Field
          label="Стоимость"
          value={formatDeliveryMoney(delivery.cost || method.cost)}
        />
        <Field label="Время" value={delivery.timeLabel || method.timeLabel} />

        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Статус доставки
          </span>
          <select
            value={delivery.status}
            onChange={(event) =>
              onChange({
                ...delivery,
                status: event.target.value as DeliveryShipmentStatus,
              })
            }
            className="mt-1 w-full rounded-[14px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-3 py-2 text-sm font-extrabold"
          >
            {DELIVERY_SHIPMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Адрес
          </span>
          <input
            value={delivery.address}
            onChange={(event) =>
              onChange({ ...delivery, address: event.target.value })
            }
            className="mt-1 w-full rounded-[14px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-3 py-2 text-sm font-extrabold"
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            Трек
          </span>
          <div className="mt-1 flex gap-2">
            <input
              value={delivery.track}
              onChange={(event) =>
                onChange({ ...delivery, track: event.target.value })
              }
              placeholder="Номер отслеживания"
              className="w-full rounded-[14px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-3 py-2 text-sm font-extrabold"
            />
            {method.needsTrack ? (
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...delivery,
                    track: generateTrack(delivery.methodId),
                  })
                }
                className="shrink-0 rounded-[14px] bg-[var(--foreground)] px-3 py-2 text-xs font-extrabold text-white"
              >
                Сгенерировать
              </button>
            ) : null}
          </div>
        </label>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-base font-extrabold">{value}</p>
    </div>
  );
}
