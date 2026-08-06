"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RELATION_OPTIONS,
  createRecipient,
  updateRecipient,
  type GiftRecipient,
  type RecipientInput,
  type RecipientRelationId,
} from "../lib/recipients";

type RecipientFormProps = {
  accountId: string;
  initial?: GiftRecipient;
};

export function RecipientForm({ accountId, initial }: RecipientFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [relation, setRelation] = useState<RecipientRelationId>(
    initial?.relation ?? "friend",
  );
  const [relationCustom, setRelationCustom] = useState(
    initial?.relationCustom ?? "",
  );
  const [birthday, setBirthday] = useState(initial?.birthday ?? "");
  const [favoriteColors, setFavoriteColors] = useState(
    initial?.favoriteColors ?? "",
  );
  const [hobbies, setHobbies] = useState(initial?.hobbies ?? "");
  const [clothingSize, setClothingSize] = useState(
    initial?.clothingSize ?? "",
  );
  const [mugSize, setMugSize] = useState(initial?.mugSize ?? "");
  const [favoriteSweets, setFavoriteSweets] = useState(
    initial?.favoriteSweets ?? "",
  );
  const [favoriteDrink, setFavoriteDrink] = useState(
    initial?.favoriteDrink ?? "",
  );
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const input: RecipientInput = {
      name,
      relation,
      relationCustom,
      birthday,
      favoriteColors,
      hobbies,
      clothingSize,
      mugSize,
      favoriteSweets,
      favoriteDrink,
      comment,
    };

    const result = initial
      ? updateRecipient(initial.id, accountId, input)
      : createRecipient(accountId, input);

    setSaving(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    router.push(`/recipients/${result.id}`);
  }

  const fieldClass =
    "mt-2 w-full rounded-[22px] border-2 border-[var(--line)] bg-white px-5 py-4 text-lg font-bold outline-none focus:border-[var(--accent)]";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[32px] bg-white p-6 shadow-[var(--shadow)] sm:p-8"
    >
      <Link
        href="/recipients"
        className="text-sm font-extrabold text-[var(--accent)] hover:underline"
      >
        ← Все получатели
      </Link>

      <h1 className="mt-4 font-[family-name:var(--font-unbounded)] text-3xl font-semibold">
        {initial ? "Редактировать" : "Новый получатель"}
      </h1>
      <p className="mt-2 text-base font-bold text-[var(--muted)]">
        Карточка человека для умного подбора подарков на всём сайте
      </p>

      <div className="mt-8">
        <label htmlFor="rcp-name" className="text-base font-extrabold">
          Имя
        </label>
        <input
          id="rcp-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Анна"
          className={fieldClass}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="rcp-relation" className="text-base font-extrabold">
          Кто это
        </label>
        <select
          id="rcp-relation"
          value={relation}
          onChange={(e) =>
            setRelation(e.target.value as RecipientRelationId)
          }
          className={fieldClass}
        >
          {RELATION_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {relation === "other" ? (
        <div className="mt-5">
          <label htmlFor="rcp-custom" className="text-base font-extrabold">
            Уточните, кто это
          </label>
          <input
            id="rcp-custom"
            value={relationCustom}
            onChange={(e) => setRelationCustom(e.target.value)}
            placeholder="Крёстная, сосед…"
            className={fieldClass}
          />
        </div>
      ) : null}

      <div className="mt-5">
        <label htmlFor="rcp-bday" className="text-base font-extrabold">
          Дата рождения
        </label>
        <input
          id="rcp-bday"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="rcp-colors" className="text-base font-extrabold">
          Любимые цвета
        </label>
        <input
          id="rcp-colors"
          value={favoriteColors}
          onChange={(e) => setFavoriteColors(e.target.value)}
          placeholder="Синий, бежевый"
          className={fieldClass}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="rcp-hobbies" className="text-base font-extrabold">
          Любимые увлечения
        </label>
        <input
          id="rcp-hobbies"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          placeholder="Рыбалка, йога, книги"
          className={fieldClass}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="rcp-clothes" className="text-base font-extrabold">
            Размер одежды
          </label>
          <input
            id="rcp-clothes"
            value={clothingSize}
            onChange={(e) => setClothingSize(e.target.value)}
            placeholder="M / 48"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="rcp-mug" className="text-base font-extrabold">
            Размер кружки
          </label>
          <input
            id="rcp-mug"
            value={mugSize}
            onChange={(e) => setMugSize(e.target.value)}
            placeholder="300 мл"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="rcp-sweets" className="text-base font-extrabold">
          Любимые сладости
        </label>
        <input
          id="rcp-sweets"
          value={favoriteSweets}
          onChange={(e) => setFavoriteSweets(e.target.value)}
          placeholder="Тёмный шоколад"
          className={fieldClass}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="rcp-drink" className="text-base font-extrabold">
          Любимый напиток
        </label>
        <input
          id="rcp-drink"
          value={favoriteDrink}
          onChange={(e) => setFavoriteDrink(e.target.value)}
          placeholder="Кофе / чай"
          className={fieldClass}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="rcp-comment" className="text-base font-extrabold">
          Комментарий
        </label>
        <textarea
          id="rcp-comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Не любит сюрпризы, аллергия на орехи…"
          className={fieldClass}
        />
      </div>

      {error ? (
        <p className="mt-4 text-sm font-extrabold text-[var(--berry)]">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="mt-8 w-full rounded-[28px] bg-[var(--accent)] px-8 py-5 text-lg font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)] disabled:opacity-70"
      >
        {saving ? "Сохраняем…" : initial ? "Сохранить" : "Создать карточку"}
      </button>
    </form>
  );
}
