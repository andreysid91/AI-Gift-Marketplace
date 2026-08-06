"use client";

import { useEffect, useState } from "react";
import { WarehousePanel } from "./warehouse-panel";
import {
  loadWarehouse,
  saveWarehouse,
  type WarehouseItem,
} from "../lib/warehouse";

export function WarehousePageClient() {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadWarehouse());
    setReady(true);
  }, []);

  if (!ready) {
    return <p className="font-bold text-[var(--muted)]">Загрузка склада…</p>;
  }

  return (
    <WarehousePanel
      items={items}
      onChange={(next) => {
        setItems(next);
        saveWarehouse(next);
      }}
    />
  );
}
