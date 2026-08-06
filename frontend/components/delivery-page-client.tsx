"use client";

import { useEffect, useState } from "react";
import { DeliveryPanel } from "./delivery-panel";
import {
  loadAdminOrders,
  saveAdminOrders,
  type AdminOrder,
} from "../lib/admin-mock";
import type { OrderDelivery } from "../lib/delivery";

export function DeliveryPageClient() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrders(loadAdminOrders());
    setReady(true);
  }, []);

  function updateDelivery(orderId: string, delivery: OrderDelivery) {
    const next = orders.map((order) =>
      order.id === orderId
        ? { ...order, delivery, address: delivery.address }
        : order,
    );
    setOrders(next);
    saveAdminOrders(next);
  }

  if (!ready) {
    return <p className="font-bold text-[var(--muted)]">Загрузка доставок…</p>;
  }

  return <DeliveryPanel orders={orders} onUpdateDelivery={updateDelivery} />;
}
