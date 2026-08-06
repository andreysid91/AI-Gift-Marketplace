/**
 * Gift recipients — people cards per customer account.
 * Used across search, express, ideas/constructor and checkout history.
 */

export const RECIPIENTS_STORAGE_KEY = "ai-gift-recipients";
export const SELECTED_RECIPIENT_KEY = "ai-gift-selected-recipient";

export type GiftHistoryEntry = {
  id: string;
  /** Linked order if created from checkout */
  orderId?: string;
  /** Дата подарка */
  date: string;
  /** Что подарили (человекочитаемо) */
  title: string;
  /** Стоимость */
  cost: number;
  /** Фото готового подарка (data URL) */
  photoDataUrl: string | null;
  /** Отзыв / впечатление */
  review: string;
  /** Catalog / constructor item ids — for «never gift the same twice» */
  itemIds: string[];
  createdAt: string;
};

/** Maps to knowledge-base relationship ids where possible */
export type RecipientRelationId =
  | "mom"
  | "dad"
  | "wife"
  | "husband"
  | "girlfriend"
  | "boyfriend"
  | "brother"
  | "sister"
  | "friend"
  | "colleague"
  | "boss"
  | "teacher"
  | "child"
  | "grandmother"
  | "grandfather"
  | "other";

export type GiftRecipient = {
  id: string;
  accountId: string;
  name: string;
  /** Кто это */
  relation: RecipientRelationId;
  /** Free label when relation === other */
  relationCustom: string;
  birthday: string;
  favoriteColors: string;
  hobbies: string;
  clothingSize: string;
  mugSize: string;
  favoriteSweets: string;
  favoriteDrink: string;
  comment: string;
  giftHistory: GiftHistoryEntry[];
  createdAt: string;
  updatedAt: string;
};

export const RELATION_OPTIONS: {
  id: RecipientRelationId;
  label: string;
  /** Phrase for gift queries: «маме», «папе»… */
  queryForm: string;
}[] = [
  { id: "mom", label: "Мама", queryForm: "маме" },
  { id: "dad", label: "Папа", queryForm: "папе" },
  { id: "wife", label: "Жена", queryForm: "жене" },
  { id: "husband", label: "Муж", queryForm: "мужу" },
  { id: "girlfriend", label: "Девушка", queryForm: "девушке" },
  { id: "boyfriend", label: "Парень", queryForm: "парню" },
  { id: "brother", label: "Брат", queryForm: "брату" },
  { id: "sister", label: "Сестра", queryForm: "сестре" },
  { id: "friend", label: "Друг / подруга", queryForm: "другу" },
  { id: "colleague", label: "Коллега", queryForm: "коллеге" },
  { id: "boss", label: "Руководитель", queryForm: "начальнику" },
  { id: "teacher", label: "Учитель", queryForm: "учителю" },
  { id: "child", label: "Ребёнок", queryForm: "ребёнку" },
  { id: "grandmother", label: "Бабушка", queryForm: "бабушке" },
  { id: "grandfather", label: "Дедушка", queryForm: "дедушке" },
  { id: "other", label: "Другое", queryForm: "" },
];

export function getRelationLabel(recipient: GiftRecipient): string {
  if (recipient.relation === "other" && recipient.relationCustom.trim()) {
    return recipient.relationCustom.trim();
  }
  return (
    RELATION_OPTIONS.find((r) => r.id === recipient.relation)?.label ??
    recipient.relation
  );
}

export function getRelationQueryForm(recipient: GiftRecipient): string {
  if (recipient.relation === "other") {
    const custom = recipient.relationCustom.trim().toLowerCase();
    return custom || recipient.name;
  }
  return (
    RELATION_OPTIONS.find((r) => r.id === recipient.relation)?.queryForm ??
    recipient.name
  );
}

function newId(): string {
  return `RCP-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;
}

function newHistoryId(): string {
  return `GH-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;
}

/** Normalize legacy history rows from older storage */
export function normalizeHistoryEntry(
  raw: Partial<GiftHistoryEntry> & { title?: string; total?: number },
): GiftHistoryEntry {
  return {
    id: raw.id || newHistoryId(),
    orderId: raw.orderId,
    date: raw.date || new Date().toISOString().slice(0, 10),
    title: raw.title || "Подарок",
    cost: typeof raw.cost === "number" ? raw.cost : (raw.total ?? 0),
    photoDataUrl: raw.photoDataUrl ?? null,
    review: raw.review ?? "",
    itemIds: Array.isArray(raw.itemIds) ? raw.itemIds : [],
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

function normalizeRecipient(raw: GiftRecipient): GiftRecipient {
  return {
    ...raw,
    giftHistory: (raw.giftHistory ?? []).map((h) =>
      normalizeHistoryEntry(h as GiftHistoryEntry & { total?: number }),
    ),
  };
}

export function loadAllRecipients(): GiftRecipient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECIPIENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GiftRecipient[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeRecipient);
  } catch {
    return [];
  }
}

function saveAllRecipients(list: GiftRecipient[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(RECIPIENTS_STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("ai-gift-recipients-change"));
}

export function getRecipientsForAccount(accountId: string): GiftRecipient[] {
  return loadAllRecipients()
    .filter((r) => r.accountId === accountId)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getRecipientById(id: string): GiftRecipient | null {
  return loadAllRecipients().find((r) => r.id === id) ?? null;
}

export type RecipientInput = {
  name: string;
  relation: RecipientRelationId;
  relationCustom?: string;
  birthday?: string;
  favoriteColors?: string;
  hobbies?: string;
  clothingSize?: string;
  mugSize?: string;
  favoriteSweets?: string;
  favoriteDrink?: string;
  comment?: string;
};

export function createRecipient(
  accountId: string,
  input: RecipientInput,
): GiftRecipient | { error: string } {
  const name = input.name.trim();
  if (!name) return { error: "Укажите имя" };

  const now = new Date().toISOString();
  const recipient: GiftRecipient = {
    id: newId(),
    accountId,
    name,
    relation: input.relation,
    relationCustom: (input.relationCustom ?? "").trim(),
    birthday: input.birthday ?? "",
    favoriteColors: (input.favoriteColors ?? "").trim(),
    hobbies: (input.hobbies ?? "").trim(),
    clothingSize: (input.clothingSize ?? "").trim(),
    mugSize: (input.mugSize ?? "").trim(),
    favoriteSweets: (input.favoriteSweets ?? "").trim(),
    favoriteDrink: (input.favoriteDrink ?? "").trim(),
    comment: (input.comment ?? "").trim(),
    giftHistory: [],
    createdAt: now,
    updatedAt: now,
  };

  const list = loadAllRecipients();
  list.unshift(recipient);
  saveAllRecipients(list);
  return recipient;
}

export function updateRecipient(
  id: string,
  accountId: string,
  input: RecipientInput,
): GiftRecipient | { error: string } {
  const list = loadAllRecipients();
  const idx = list.findIndex((r) => r.id === id && r.accountId === accountId);
  if (idx < 0) return { error: "Получатель не найден" };

  const name = input.name.trim();
  if (!name) return { error: "Укажите имя" };

  const next: GiftRecipient = {
    ...list[idx],
    name,
    relation: input.relation,
    relationCustom: (input.relationCustom ?? "").trim(),
    birthday: input.birthday ?? "",
    favoriteColors: (input.favoriteColors ?? "").trim(),
    hobbies: (input.hobbies ?? "").trim(),
    clothingSize: (input.clothingSize ?? "").trim(),
    mugSize: (input.mugSize ?? "").trim(),
    favoriteSweets: (input.favoriteSweets ?? "").trim(),
    favoriteDrink: (input.favoriteDrink ?? "").trim(),
    comment: (input.comment ?? "").trim(),
    updatedAt: new Date().toISOString(),
  };
  list[idx] = next;
  saveAllRecipients(list);
  return next;
}

export function deleteRecipient(id: string, accountId: string): boolean {
  const list = loadAllRecipients();
  const next = list.filter((r) => !(r.id === id && r.accountId === accountId));
  if (next.length === list.length) return false;
  saveAllRecipients(next);
  const selected = loadSelectedRecipientId();
  if (selected === id) clearSelectedRecipient();
  return true;
}

export type GiftHistoryInput = {
  date: string;
  title: string;
  cost: number;
  photoDataUrl?: string | null;
  review?: string;
  itemIds?: string[];
  orderId?: string;
};

export function appendGiftHistory(
  recipientId: string,
  entry: GiftHistoryInput | GiftHistoryEntry,
): GiftRecipient | null {
  const list = loadAllRecipients();
  const idx = list.findIndex((r) => r.id === recipientId);
  if (idx < 0) return null;

  const normalized = normalizeHistoryEntry({
    ...entry,
    id: "id" in entry && entry.id ? entry.id : newHistoryId(),
    createdAt:
      "createdAt" in entry && entry.createdAt
        ? entry.createdAt
        : new Date().toISOString(),
  });

  if (!normalized.title.trim()) return null;

  let history = [...list[idx].giftHistory];
  if (normalized.orderId) {
    history = history.filter((h) => h.orderId !== normalized.orderId);
  }
  history.unshift(normalized);
  list[idx] = {
    ...list[idx],
    giftHistory: history,
    updatedAt: new Date().toISOString(),
  };
  saveAllRecipients(list);
  return list[idx];
}

export function updateGiftHistory(
  recipientId: string,
  entryId: string,
  patch: Partial<GiftHistoryInput>,
): GiftRecipient | null {
  const list = loadAllRecipients();
  const idx = list.findIndex((r) => r.id === recipientId);
  if (idx < 0) return null;
  const history = list[idx].giftHistory.map((h) => {
    if (h.id !== entryId) return h;
    return normalizeHistoryEntry({
      ...h,
      ...patch,
      id: h.id,
      createdAt: h.createdAt,
    });
  });
  list[idx] = {
    ...list[idx],
    giftHistory: history,
    updatedAt: new Date().toISOString(),
  };
  saveAllRecipients(list);
  return list[idx];
}

export function deleteGiftHistory(
  recipientId: string,
  entryId: string,
): GiftRecipient | null {
  const list = loadAllRecipients();
  const idx = list.findIndex((r) => r.id === recipientId);
  if (idx < 0) return null;
  list[idx] = {
    ...list[idx],
    giftHistory: list[idx].giftHistory.filter((h) => h.id !== entryId),
    updatedAt: new Date().toISOString(),
  };
  saveAllRecipients(list);
  return list[idx];
}

/** Product/addon ids already gifted to this person */
export function getGiftedItemIds(recipient: GiftRecipient): string[] {
  const ids = new Set<string>();
  for (const entry of recipient.giftHistory) {
    for (const id of entry.itemIds) {
      if (id) ids.add(id);
    }
  }
  return [...ids];
}

/** Titles already gifted (for soft duplicate warnings) */
export function getGiftedTitles(recipient: GiftRecipient): string[] {
  return recipient.giftHistory
    .map((h) => h.title.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Returns overlapping item ids that were already gifted.
 * Used to block / warn before checkout.
 */
export function findDuplicateGiftItems(
  recipient: GiftRecipient,
  itemIds: string[],
): string[] {
  const gifted = new Set(getGiftedItemIds(recipient));
  // Packaging / card are ok to repeat
  const ALLOW_REPEAT = new Set(["box", "card", "pack", "postcard"]);
  return itemIds.filter((id) => gifted.has(id) && !ALLOW_REPEAT.has(id));
}

export function formatHistoryMoney(value: number): string {
  if (value <= 0) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Active recipient for gift matching across the site */
export function saveSelectedRecipientId(id: string | null) {
  if (typeof window === "undefined") return;
  if (!id) {
    sessionStorage.removeItem(SELECTED_RECIPIENT_KEY);
  } else {
    sessionStorage.setItem(SELECTED_RECIPIENT_KEY, id);
  }
  window.dispatchEvent(new Event("ai-gift-recipients-change"));
}

export function loadSelectedRecipientId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SELECTED_RECIPIENT_KEY);
}

export function loadSelectedRecipient(): GiftRecipient | null {
  const id = loadSelectedRecipientId();
  if (!id) return null;
  return getRecipientById(id);
}

export function clearSelectedRecipient() {
  saveSelectedRecipientId(null);
}

/**
 * Short search query from a card: «Подарок маме Анне»
 */
export function buildRecipientSearchQuery(recipient: GiftRecipient): string {
  const whom = getRelationQueryForm(recipient);
  return `Подарок ${whom} ${recipient.name}`.replace(/\s+/g, " ").trim();
}

/**
 * Full profile text merged into recommendation engine.
 */
export function buildRecipientProfileText(recipient: GiftRecipient): string {
  const parts: string[] = [
    buildRecipientSearchQuery(recipient),
  ];

  if (recipient.hobbies) parts.push(`Увлечения: ${recipient.hobbies}`);
  if (recipient.favoriteColors) {
    parts.push(`Любимые цвета: ${recipient.favoriteColors}`);
  }
  if (recipient.clothingSize) {
    parts.push(`Размер одежды: ${recipient.clothingSize}`);
  }
  if (recipient.mugSize) {
    parts.push(`Размер кружки: ${recipient.mugSize}`);
  }
  if (recipient.favoriteSweets) {
    parts.push(`Любимые сладости: ${recipient.favoriteSweets}`);
  }
  if (recipient.favoriteDrink) {
    parts.push(`Любимый напиток: ${recipient.favoriteDrink}`);
  }
  if (recipient.birthday) {
    const near = isBirthdaySoon(recipient.birthday, 45);
    parts.push(
      near
        ? `Скоро день рождения (${recipient.birthday})`
        : `Дата рождения: ${recipient.birthday}`,
    );
  }
  if (recipient.comment) parts.push(recipient.comment);

  const gifted = getGiftedItemIds(recipient);
  if (gifted.length > 0 || recipient.giftHistory.length > 0) {
    const titles = recipient.giftHistory
      .map((h) => h.title)
      .filter(Boolean)
      .slice(0, 8);
    if (titles.length > 0) {
      parts.push(`Уже дарили (не повторять): ${titles.join(", ")}`);
    }
  }

  return parts.join(". ");
}

/** Merge user query with selected recipient profile for matching */
export function enrichQueryWithRecipient(
  query: string,
  recipient: GiftRecipient | null | undefined,
): string {
  if (!recipient) return query.trim();
  const profile = buildRecipientProfileText(recipient);
  const q = query.trim();
  if (!q) return profile;
  // Avoid doubling if query already is the short recipient query
  if (profile.toLowerCase().includes(q.toLowerCase())) return profile;
  return `${q}. ${profile}`;
}

export function isBirthdaySoon(birthday: string, withinDays: number): boolean {
  const m = birthday.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return false;
  const month = Number(m[2]);
  const day = Number(m[3]);
  const now = new Date();
  const year = now.getFullYear();
  let next = new Date(year, month - 1, day);
  if (next < now) next = new Date(year + 1, month - 1, day);
  const diff = (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= withinDays;
}

export function formatBirthdayDisplay(birthday: string): string {
  if (!birthday) return "—";
  const m = birthday.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return birthday;
  return `${m[3]}.${m[2]}.${m[1]}`;
}
