import { GIFT_CONSTRUCTOR_ITEMS } from "../scenario-catalog";
import {
  type BundlePayload,
  type BundleRow,
  type CountRow,
  type FilterPayload,
  type LearningEvent,
  type LearningInsights,
  type ProductPayload,
  type PurchasePayload,
  type ScenarioPayload,
  type SearchPayload,
} from "./types";

const PRODUCT_LABELS: Map<string, string> = new Map(
  GIFT_CONSTRUCTOR_ITEMS.map((item) => [item.id, `${item.emoji} ${item.title}`]),
);

const SCENARIO_LABELS: Record<string, string> = {
  gift: "Подарок",
  photo: "Фотопечать",
  business: "Корпоративный",
  corporate: "Корпоратив",
  print_3d: "3D печать",
  laser: "Лазерная гравировка",
  embroidery: "Вышивка",
  unsure: "Не знаю что подарить",
  custom: "Свой вариант",
};

function bump(map: Map<string, number>, key: string, by = 1) {
  map.set(key, (map.get(key) ?? 0) + by);
}

function normalizeQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

function toCountRows(
  map: Map<string, number>,
  labelOf: (key: string) => string,
  limit = 12,
): CountRow[] {
  return [...map.entries()]
    .map(([key, count]) => ({ key, label: labelOf(key), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "ru"))
    .slice(0, limit);
}

function pairKey(a: string, b: string) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

function productLabel(id: string) {
  return PRODUCT_LABELS.get(id) ?? id;
}

/**
 * Deterministic aggregates from the event log (no AI).
 */
export function aggregateLearningInsights(
  events: LearningEvent[],
  options?: { catalogIds?: string[]; coldOpenMax?: number },
): LearningInsights {
  const searches = new Map<string, number>();
  const purchases = new Map<string, number>();
  const opens = new Map<string, number>();
  const scenarios = new Map<string, number>();
  const filters = new Map<string, number>();
  const pairs = new Map<string, number>();

  for (const event of events) {
    switch (event.type) {
      case "search": {
        const q = normalizeQuery((event.payload as SearchPayload).query ?? "");
        if (q) bump(searches, q);
        break;
      }
      case "filter": {
        const p = event.payload as FilterPayload;
        if (p.dimension && p.value) {
          bump(filters, `${p.dimension}:${p.value}`);
        }
        break;
      }
      case "scenario": {
        const s = (event.payload as ScenarioPayload).scenario;
        if (s) bump(scenarios, s);
        break;
      }
      case "product_open": {
        const id = (event.payload as ProductPayload).productId;
        if (id) bump(opens, id);
        break;
      }
      case "bundle": {
        const ids = [
          ...new Set((event.payload as BundlePayload).productIds ?? []),
        ].filter(Boolean);
        for (let i = 0; i < ids.length; i += 1) {
          for (let j = i + 1; j < ids.length; j += 1) {
            bump(pairs, pairKey(ids[i], ids[j]));
          }
        }
        break;
      }
      case "purchase": {
        const ids = (event.payload as PurchasePayload).productIds ?? [];
        for (const id of ids) {
          if (id) bump(purchases, id);
        }
        for (let i = 0; i < ids.length; i += 1) {
          for (let j = i + 1; j < ids.length; j += 1) {
            bump(pairs, pairKey(ids[i], ids[j]), 2);
          }
        }
        break;
      }
      default:
        break;
    }
  }

  const topBundles: BundleRow[] = [...pairs.entries()]
    .map(([key, count]) => {
      const [a, b] = key.split("|");
      return {
        key,
        a,
        b,
        label: `${productLabel(a)} + ${productLabel(b)}`,
        count,
      };
    })
    .sort((x, y) => y.count - x.count || x.label.localeCompare(y.label, "ru"))
    .slice(0, 12);

  const repeatPurchases = toCountRows(purchases, productLabel, 50).filter(
    (row) => row.count >= 2,
  );

  const catalogIds =
    options?.catalogIds ?? GIFT_CONSTRUCTOR_ITEMS.map((item) => item.id);
  const coldMax = options?.coldOpenMax ?? 1;
  const coldProducts: CountRow[] = catalogIds
    .map((id) => ({
      key: id,
      label: productLabel(id),
      count: opens.get(id) ?? 0,
    }))
    .filter((row) => row.count <= coldMax)
    .sort((a, b) => a.count - b.count || a.label.localeCompare(b.label, "ru"));

  return {
    eventCount: events.length,
    topSearches: toCountRows(searches, (k) => k),
    topPurchases: toCountRows(purchases, productLabel),
    topBundles,
    topScenarios: toCountRows(
      scenarios,
      (k) => SCENARIO_LABELS[k] ?? k,
    ),
    topFilters: toCountRows(filters, (k) => k.replace(":", " · ")),
    repeatPurchases: repeatPurchases.slice(0, 12),
    coldProducts,
  };
}
