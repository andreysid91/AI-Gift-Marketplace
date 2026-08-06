"use client";

import { useEffect, useState } from "react";
import { PurchasesPanel } from "./purchases-panel";
import {
  loadWarehouse,
  saveWarehouse,
  type WarehouseItem,
} from "../lib/warehouse";

export function PurchasesPageClient() {
  const [warehouse, setWarehouse] = useState<WarehouseItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setWarehouse(loadWarehouse());
    setReady(true);
  }, []);

  if (!ready) {
    return <p className="font-bold text-[var(--muted)]">Загрузка закупок…</p>;
  }

  return (
    <PurchasesPanel
      warehouse={warehouse}
      onWarehouseChange={(next) => {
        setWarehouse(next);
        saveWarehouse(next);
      }}
    />
  );
}
