"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { saveGiftOrder, type GiftOrderLine } from "../lib/gift-order";
import {
  GIFT_CONSTRUCTOR_ITEMS,
  formatRub,
  type ReadyGiftSet,
} from "../lib/scenario-catalog";
import {
  getAnyGiftSetById,
  getAnyGiftSetItemIds,
} from "../lib/occasions";
import { loadExpressPick } from "../lib/express-gift";
import {
  getGiftEngineConstructorIds,
  runGiftEngineAsRecommendation,
} from "../lib/gift-engine";
import { type GiftRecommendation } from "../lib/knowledge/recommend";
import { RecipientPicker } from "./recipient-picker";
import { UniversalProductConfigurator } from "./universal-product-configurator";
import {
  defaultSelections,
  getProductSchema,
  hasProductConfigurator,
  priceProduct,
  type ProductSelections,
} from "../lib/product-configurator";
import {
  buildRecipientProfileText,
  findDuplicateGiftItems,
  getGiftedItemIds,
  getRecipientById,
  loadSelectedRecipient,
  loadSelectedRecipientId,
  saveSelectedRecipientId,
} from "../lib/recipients";
import {
  trackBundle,
  trackCartAdd,
  trackProductOpen,
  trackPurchase,
} from "../lib/learning";

type GiftPickerViewProps = {
  query: string;
  hasPhoto: boolean;
  setId?: string;
  recipientId?: string;
};

function resolveRecipient(recipientId?: string) {
  const id = recipientId || loadSelectedRecipientId();
  return id ? getRecipientById(id) : loadSelectedRecipient();
}

function resolveProfile(recipientId?: string): string | null {
  const person = resolveRecipient(recipientId);
  return person ? buildRecipientProfileText(person) : null;
}

function resolveExcludeIds(recipientId?: string): string[] {
  const person = resolveRecipient(recipientId);
  return person ? getGiftedItemIds(person) : [];
}

export function GiftPickerView({
  query,
  hasPhoto,
  setId,
  recipientId,
}: GiftPickerViewProps) {
  const router = useRouter();
  const [profileTick, setProfileTick] = useState(0);
  const [readySet, setReadySet] = useState<ReadyGiftSet | undefined>(() =>
    getAnyGiftSetById(setId),
  );
  const displayQuery =
    query.trim() || readySet?.query || "Подарок на любой случай";
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const fromSet = getAnyGiftSetItemIds(setId);
    if (fromSet) return fromSet;
    const q =
      query.trim() ||
      getAnyGiftSetById(setId)?.query ||
      "Подарок на любой случай";
    return getGiftEngineConstructorIds({
      query: q,
      recipientProfile: resolveProfile(recipientId),
      excludeItemIds: resolveExcludeIds(recipientId),
    });
  });
  const [recommendation, setRecommendation] =
    useState<GiftRecommendation | null>(() => {
      if (setId || !query.trim()) return null;
      return runGiftEngineAsRecommendation({
        query,
        recipientProfile: resolveProfile(recipientId),
        excludeItemIds: resolveExcludeIds(recipientId),
      });
    });
  const [aiLoading, setAiLoading] = useState(false);
  const [configs, setConfigs] = useState<Record<string, ProductSelections>>({});
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);

  const duplicates = useMemo(() => {
    const person = resolveRecipient(recipientId);
    if (!person) return [] as string[];
    return findDuplicateGiftItems(person, selectedIds);
  }, [selectedIds, recipientId, profileTick]);

  useEffect(() => {
    if (recipientId) saveSelectedRecipientId(recipientId);
  }, [recipientId]);

  useEffect(() => {
    const fromExpress = loadExpressPick(setId);
    if (!fromExpress) return;
    setReadySet(fromExpress);
    const exclude = new Set(resolveExcludeIds(recipientId));
    setSelectedIds(fromExpress.itemIds.filter((id) => !exclude.has(id)));
  }, [setId, recipientId]);

  useEffect(() => {
    if (setId || !query.trim()) {
      setRecommendation(null);
      setAiLoading(false);
      return;
    }

    const opts = {
      query,
      recipientProfile: resolveProfile(recipientId),
      excludeItemIds: resolveExcludeIds(recipientId),
    };
    const kb = runGiftEngineAsRecommendation(opts);
    setRecommendation(kb);

    if (!kb.needsAi) {
      setSelectedIds(kb.readySet.itemIds);
      setAiLoading(false);
      return;
    }

    let cancelled = false;
    setAiLoading(true);

    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: opts.query,
        recipientProfile: opts.recipientProfile,
        excludeItemIds: opts.excludeItemIds,
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("recommend failed");
        return (await response.json()) as GiftRecommendation;
      })
      .then((result) => {
        if (cancelled) return;
        setRecommendation(result);
        if (result.readySet.itemIds.length > 0) {
          setSelectedIds(result.readySet.itemIds);
        }
      })
      .catch(() => {
        if (cancelled) return;
      })
      .finally(() => {
        if (!cancelled) setAiLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, setId, recipientId, profileTick]);

  const catalogById = useMemo(() => {
    const map = new Map<string, (typeof GIFT_CONSTRUCTOR_ITEMS)[number]>();
    for (const item of GIFT_CONSTRUCTOR_ITEMS) {
      map.set(item.id, item);
    }
    return map;
  }, []);

  const lines: GiftOrderLine[] = selectedIds.flatMap((id) => {
    const item = catalogById.get(id);
    if (!item) return [];
    if (hasProductConfigurator(id)) {
      const priced = priceProduct(id, configs[id] ?? null);
      if (priced) {
        const line: GiftOrderLine = {
          id,
          title: item.title,
          price: priced.lineTotal,
          emoji: item.emoji,
          kind: "product",
          qty: priced.qty,
          unitPrice: priced.unitPrice,
          configSummary: priced.summary,
          selections: priced.selections,
        };
        return [line];
      }
    }
    const line: GiftOrderLine = {
      id: item.id,
      title: item.title,
      price: item.price,
      emoji: item.emoji,
      kind: "product",
      qty: 1,
    };
    return [line];
  });

  const total = lines.reduce((sum, item) => sum + item.price, 0);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  function toggle(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (activeConfigId === id) setActiveConfigId(null);
        return prev.filter((item) => item !== id);
      }
      trackCartAdd(id);
      trackProductOpen(id);
      const next = [...prev, id];
      trackBundle(next);
      const schema = getProductSchema(id);
      if (schema) {
        setConfigs((c) =>
          c[id] ? c : { ...c, [id]: defaultSelections(schema) },
        );
        setActiveConfigId(id);
      }
      return next;
    });
  }

  function checkout() {
    if (lines.length === 0) return;
    trackPurchase(selectedIds);
    trackBundle(selectedIds);
    saveGiftOrder({
      query: displayQuery,
      items: lines,
      total,
      createdAt: new Date().toISOString(),
    });
    const params = new URLSearchParams({ from: "gift", q: displayQuery });
    const rid = loadSelectedRecipientId() || recipientId;
    if (rid) params.set("recipient", rid);
    router.push(`/checkout?${params.toString()}`);
  }

  const sourceLabel =
    recommendation?.source === "ai"
      ? "Уточнение подбора"
      : recommendation?.source === "knowledge"
        ? "Gift Engine · база знаний"
        : aiLoading
          ? "Gift Engine уточняет подбор…"
          : null;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,#ffe0c8_0%,transparent_40%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <Link
          href="/"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← Изменить запрос
        </Link>

        <header className="mt-6 rounded-[28px] bg-white px-5 py-5 shadow-[var(--shadow-soft)] sm:px-7 sm:py-6">
          <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">
            {readySet ? "Готовый набор" : "Ваш запрос"}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            {readySet ? readySet.title : displayQuery}
          </h1>
          <div className="mt-4">
            <RecipientPicker
              onSelect={() => setProfileTick((n) => n + 1)}
            />
          </div>
          {duplicates.length > 0 ? (
            <p className="mt-3 rounded-[16px] bg-[var(--berry-soft)] px-4 py-3 text-sm font-extrabold text-[var(--berry)]">
              Уже дарили этому человеку:{" "}
              {duplicates
                .map(
                  (id) =>
                    GIFT_CONSTRUCTOR_ITEMS.find((i) => i.id === id)?.title ?? id,
                )
                .join(", ")}
              . Уберите из набора, чтобы не повторять.
            </p>
          ) : resolveExcludeIds(recipientId).length > 0 ? (
            <p className="mt-3 rounded-[16px] bg-[var(--mint-soft)] px-4 py-3 text-sm font-extrabold text-[var(--mint)]">
              Учитываем историю подарков — уже подаренное не предлагаем
            </p>
          ) : null}
          {sourceLabel ? (
            <p
              className={`mt-2 text-sm font-extrabold ${
                recommendation?.source === "ai" || aiLoading
                  ? "text-[var(--berry)]"
                  : "text-[var(--mint)]"
              }`}
            >
              {sourceLabel}
            </p>
          ) : null}
          {readySet ? (
            <p className="mt-2 text-base font-bold text-[var(--muted)]">
              {readySet.subtitle} · можно изменить состав
            </p>
          ) : null}
          {recommendation && recommendation.chain.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {recommendation.chain.map((step, index) => (
                <span key={`${step}-${index}`} className="contents">
                  {index > 0 ? (
                    <span className="text-sm font-extrabold text-[var(--muted)]">
                      →
                    </span>
                  ) : null}
                  <span className="rounded-[14px] bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-extrabold text-[var(--accent)]">
                    {step}
                  </span>
                </span>
              ))}
            </div>
          ) : null}
          {recommendation && recommendation.products.length > 0 ? (
            <p className="mt-3 text-base font-bold text-[var(--muted)]">
              Лучшие товары:{" "}
              {recommendation.products
                .slice(0, 4)
                .map((row) => row.product.name)
                .join(" · ")}
            </p>
          ) : null}
          {hasPhoto ? (
            <p className="mt-2 text-base font-bold text-[var(--mint)]">
              Фотография учтена в подборе
            </p>
          ) : null}
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div>
            {/* Scene */}
            <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#ffb4a2] via-[#ff8f6b] to-[#ff5a3c] p-6 shadow-[var(--shadow)] sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.4),transparent_42%),radial-gradient(circle_at_85%_75%,rgba(42,24,16,0.14),transparent_40%)]"
              />
              <p className="relative font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-white sm:text-3xl">
                {readySet
                  ? "Ваш готовый набор"
                  : recommendation
                    ? recommendation.readySet.title
                    : "Конструктор подарка"}
              </p>
              <p className="relative mt-2 text-base font-bold text-white/90">
                {recommendation
                  ? `${recommendation.readySet.subtitle} — можно изменить`
                  : "Добавляйте, убирайте или заменяйте позиции — цена обновится сразу"}
              </p>

              <div className="relative mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {GIFT_CONSTRUCTOR_ITEMS.map((item) => {
                  const on = selectedSet.has(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggle(item.id)}
                      className={`flex aspect-square flex-col items-center justify-center rounded-[22px] transition ${
                        on
                          ? "bg-white/40 ring-2 ring-white"
                          : "bg-white/10 opacity-45"
                      }`}
                      aria-pressed={on}
                    >
                      <span className="text-3xl sm:text-4xl" aria-hidden>
                        {item.emoji}
                      </span>
                      <span className="mt-1 px-1 text-center text-[10px] font-extrabold text-white sm:text-xs">
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Checkboxes */}
            <section className="mt-8 rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-7">
              <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl">
                Состав набора
              </h2>
              <p className="mt-2 text-base font-bold text-[var(--muted)]">
                Отмечайте позиции — стоимость пересчитается сразу
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {GIFT_CONSTRUCTOR_ITEMS.map((item) => {
                  const checked = selectedSet.has(item.id);
                  const alreadyGifted = resolveExcludeIds(recipientId).includes(
                    item.id,
                  );
                  const configurable = hasProductConfigurator(item.id);
                  const livePrice =
                    checked && configurable
                      ? priceProduct(item.id, configs[item.id] ?? null)
                          ?.lineTotal
                      : item.price;
                  return (
                    <li key={item.id}>
                      <div
                        className={`rounded-[20px] border-2 transition ${
                          alreadyGifted && checked
                            ? "border-[var(--berry)] bg-[var(--berry-soft)]"
                            : checked
                              ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                              : alreadyGifted
                                ? "border-dashed border-[var(--berry)] bg-[var(--surface-warm)] opacity-70"
                                : "border-[var(--line)] bg-[var(--surface-warm)] hover:border-[var(--accent)]"
                        }`}
                      >
                        <label className="flex cursor-pointer items-center gap-4 px-4 py-4">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(item.id)}
                            className="size-6 accent-[var(--accent)]"
                          />
                          <span className="text-2xl" aria-hidden>
                            {item.emoji}
                          </span>
                          <span className="flex-1 font-[family-name:var(--font-unbounded)] text-lg font-semibold">
                            {item.title}
                            {alreadyGifted ? (
                              <span className="mt-0.5 block text-xs font-extrabold text-[var(--berry)]">
                                уже дарили
                              </span>
                            ) : configurable ? (
                              <span className="mt-0.5 block text-xs font-extrabold text-[var(--muted)]">
                                есть параметры
                              </span>
                            ) : null}
                          </span>
                          <span className="text-base font-extrabold text-[var(--accent)]">
                            {formatRub(livePrice ?? item.price)}
                          </span>
                        </label>
                        {checked && configurable ? (
                          <div className="border-t border-[var(--line)] px-3 pb-3 pt-2">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveConfigId(
                                  activeConfigId === item.id ? null : item.id,
                                )
                              }
                              className="mb-2 text-sm font-extrabold text-[var(--accent)] hover:underline"
                            >
                              {activeConfigId === item.id
                                ? "Скрыть параметры"
                                : "Настроить параметры"}
                            </button>
                            {activeConfigId === item.id ? (
                              <UniversalProductConfigurator
                                productId={item.id}
                                value={configs[item.id]}
                                compact
                                onChange={(sel) => {
                                  setConfigs((prev) => ({
                                    ...prev,
                                    [item.id]: sel,
                                  }));
                                }}
                              />
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-[28px] bg-white p-6 shadow-[var(--shadow)]">
              <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
                Ваш набор
              </h2>

              {lines.length === 0 ? (
                <p className="mt-4 text-base font-bold text-[var(--muted)]">
                  Отметьте хотя бы одну позицию
                </p>
              ) : (
                <ul className="mt-5 space-y-3">
                  {lines.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-3 border-b border-[var(--line)] pb-3"
                    >
                      <span className="text-base font-extrabold">
                        <span aria-hidden>{item.emoji} </span>
                        {item.title}
                        {item.configSummary ? (
                          <span className="mt-0.5 block text-xs font-bold text-[var(--muted)]">
                            {item.configSummary}
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-base font-extrabold text-[var(--accent)]">
                        {formatRub(item.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex items-end justify-between gap-3">
                <span className="text-base font-extrabold text-[var(--muted)]">
                  Итого
                </span>
                <span className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold text-[var(--foreground)]">
                  {formatRub(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={checkout}
                disabled={lines.length === 0}
                className="mt-6 w-full rounded-[22px] bg-[var(--accent)] px-5 py-4 text-lg font-extrabold text-white transition hover:bg-[var(--accent-hover)] disabled:pointer-events-none disabled:opacity-45"
              >
                Оформить заказ
              </button>
            </div>
          </aside>
        </div>

        <section className="mt-14 max-w-3xl pb-10 sm:mt-16">
          <h2 className="font-[family-name:var(--font-unbounded)] text-3xl font-semibold sm:text-4xl">
            Не нашли нужный вариант?
          </h2>
          <Link
            href="/contact"
            className="mt-5 inline-flex w-full items-center justify-center rounded-[26px] bg-[var(--foreground)] px-8 py-5 text-xl font-extrabold text-white transition hover:opacity-90 sm:w-auto sm:min-w-[320px] sm:text-2xl"
          >
            Опишите свою идею
          </Link>
        </section>
      </div>
    </main>
  );
}
