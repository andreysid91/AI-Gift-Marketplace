"use client";

import { FormEvent, useMemo, useState } from "react";
import { readReviewPhoto } from "../lib/reviews";
import {
  GIFT_CONSTRUCTOR_ITEMS,
} from "../lib/scenario-catalog";
import {
  appendGiftHistory,
  deleteGiftHistory,
  formatHistoryMoney,
  updateGiftHistory,
  type GiftHistoryEntry,
  type GiftRecipient,
} from "../lib/recipients";

type GiftHistoryPanelProps = {
  recipient: GiftRecipient;
  onChange: (next: GiftRecipient) => void;
};

export function GiftHistoryPanel({
  recipient,
  onChange,
}: GiftHistoryPanelProps) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const history = useMemo(
    () =>
      [...recipient.giftHistory].sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
      ),
    [recipient.giftHistory],
  );

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            История подарков
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            Чтобы никогда не дарить одно и то же дважды
          </p>
        </div>
        {!adding ? (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setAdding(true);
            }}
            className="rounded-[14px] bg-[var(--accent)] px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
          >
            + Запись
          </button>
        ) : null}
      </div>

      {adding ? (
        <div className="mt-4">
          <GiftHistoryForm
            key="new"
            onCancel={() => setAdding(false)}
            onSave={(input) => {
              const next = appendGiftHistory(recipient.id, input);
              if (next) onChange(next);
              setAdding(false);
            }}
          />
        </div>
      ) : null}

      {history.length === 0 && !adding ? (
        <p className="mt-4 rounded-[18px] bg-[var(--surface-warm)] px-4 py-5 text-sm font-bold text-[var(--muted)]">
          Пока пусто. Добавьте вручную или оформите заказ с этой карточкой —
          запись появится сама.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {history.map((entry) =>
            editingId === entry.id ? (
              <li key={entry.id}>
                <GiftHistoryForm
                  initial={entry}
                  onCancel={() => setEditingId(null)}
                  onSave={(input) => {
                    const next = updateGiftHistory(
                      recipient.id,
                      entry.id,
                      input,
                    );
                    if (next) onChange(next);
                    setEditingId(null);
                  }}
                />
              </li>
            ) : (
              <li
                key={entry.id}
                className="overflow-hidden rounded-[22px] border-2 border-[var(--line)] bg-[var(--surface-warm)]"
              >
                {entry.photoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={entry.photoDataUrl}
                    alt={entry.title}
                    className="h-40 w-full object-cover"
                  />
                ) : null}
                <div className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-extrabold text-[var(--muted)]">
                        {formatDate(entry.date)}
                      </p>
                      <h3 className="mt-1 font-[family-name:var(--font-unbounded)] text-lg font-semibold">
                        {entry.title}
                      </h3>
                    </div>
                    <p className="text-base font-extrabold text-[var(--accent)]">
                      {formatHistoryMoney(entry.cost)}
                    </p>
                  </div>

                  {entry.itemIds.length > 0 ? (
                    <p className="mt-2 text-xs font-bold text-[var(--muted)]">
                      Состав:{" "}
                      {entry.itemIds
                        .map(
                          (id) =>
                            GIFT_CONSTRUCTOR_ITEMS.find((i) => i.id === id)
                              ?.title ?? id,
                        )
                        .join(", ")}
                    </p>
                  ) : null}

                  {entry.review ? (
                    <p className="mt-3 text-sm font-bold leading-relaxed text-[var(--foreground)]">
                      «{entry.review}»
                    </p>
                  ) : (
                    <p className="mt-3 text-sm font-bold text-[var(--muted)]">
                      Отзыв не добавлен
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAdding(false);
                        setEditingId(entry.id);
                      }}
                      className="text-sm font-extrabold text-[var(--accent)] hover:underline"
                    >
                      Изменить
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirm("Удалить запись из истории?")) return;
                        const next = deleteGiftHistory(recipient.id, entry.id);
                        if (next) onChange(next);
                      }}
                      className="text-sm font-extrabold text-[var(--berry)] hover:underline"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

type FormProps = {
  initial?: GiftHistoryEntry;
  onSave: (input: {
    date: string;
    title: string;
    cost: number;
    photoDataUrl: string | null;
    review: string;
    itemIds: string[];
    orderId?: string;
  }) => void;
  onCancel: () => void;
};

function GiftHistoryForm({ initial, onSave, onCancel }: FormProps) {
  const [date, setDate] = useState(
    initial?.date || new Date().toISOString().slice(0, 10),
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [cost, setCost] = useState(
    initial?.cost ? String(initial.cost) : "",
  );
  const [review, setReview] = useState(initial?.review ?? "");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(
    initial?.photoDataUrl ?? null,
  );
  const [itemIds, setItemIds] = useState<string[]>(initial?.itemIds ?? []);
  const [error, setError] = useState("");

  const fieldClass =
    "mt-2 w-full rounded-[18px] border-2 border-[var(--line)] bg-white px-4 py-3 text-base font-bold outline-none focus:border-[var(--accent)]";

  async function onPhoto(file: File | null) {
    setError("");
    if (!file) {
      setPhotoDataUrl(null);
      return;
    }
    try {
      setPhotoDataUrl(await readReviewPhoto(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка фото");
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Укажите, что подарили");
      return;
    }
    const costNum = Number(String(cost).replace(/\s/g, "").replace(",", "."));
    onSave({
      date,
      title: title.trim(),
      cost: Number.isFinite(costNum) ? costNum : 0,
      photoDataUrl,
      review: review.trim(),
      itemIds,
      orderId: initial?.orderId,
    });
  }

  function toggleItem(id: string) {
    setItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[22px] border-2 border-[var(--accent)] bg-white p-4 sm:p-5"
    >
      <p className="text-sm font-extrabold text-[var(--accent)]">
        {initial ? "Редактирование записи" : "Новая запись в истории"}
      </p>

      <div className="mt-4">
        <label className="text-sm font-extrabold">Дата</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-extrabold">Что подарили</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Кружка с фото + чай"
          className={fieldClass}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-extrabold">Стоимость, ₽</label>
        <input
          inputMode="decimal"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="2500"
          className={fieldClass}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-extrabold">Фото</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onPhoto(e.target.files?.[0] ?? null)}
          className="mt-2 block w-full text-sm font-bold text-[var(--muted)] file:mr-3 file:rounded-[12px] file:border-0 file:bg-[var(--accent-soft)] file:px-3 file:py-2 file:font-extrabold file:text-[var(--accent)]"
        />
        {photoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoDataUrl}
            alt="Фото подарка"
            className="mt-3 max-h-40 w-full rounded-[16px] object-cover"
          />
        ) : null}
      </div>

      <div className="mt-4">
        <label className="text-sm font-extrabold">Отзыв</label>
        <textarea
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Как восприняли подарок?"
          className={fieldClass}
        />
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-extrabold">
          Состав (чтобы не повторить)
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {GIFT_CONSTRUCTOR_ITEMS.map((item) => {
            const on = itemIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`rounded-[12px] border-2 px-3 py-1.5 text-sm font-extrabold transition ${
                  on
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--line)] bg-white text-[var(--muted)]"
                }`}
              >
                {item.emoji} {item.title}
              </button>
            );
          })}
        </div>
      </fieldset>

      {error ? (
        <p className="mt-3 text-sm font-extrabold text-[var(--berry)]">{error}</p>
      ) : null}

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-[16px] bg-[var(--accent)] px-4 py-3 text-sm font-extrabold text-white"
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[16px] border-2 border-[var(--line)] px-4 py-3 text-sm font-extrabold"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}

function formatDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${m[3]}.${m[2]}.${m[1]}`;
}
