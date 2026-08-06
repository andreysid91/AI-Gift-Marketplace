import type { AuthIdentity, CustomerAccount } from "./types";

export const ACCOUNTS_STORAGE_KEY = "ai-gift-customer-accounts";

function newId(): string {
  return `U-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

export function loadAccounts(): CustomerAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomerAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: CustomerAccount[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

export function getAccountById(id: string): CustomerAccount | null {
  return loadAccounts().find((a) => a.id === id) ?? null;
}

export function findAccountByPhone(phone: string): CustomerAccount | null {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  return (
    loadAccounts().find(
      (a) => a.phone && normalizePhone(a.phone) === normalized,
    ) ?? null
  );
}

export function findAccountByEmail(email: string): CustomerAccount | null {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  return (
    loadAccounts().find(
      (a) => a.email && normalizeEmail(a.email) === normalized,
    ) ?? null
  );
}

export function findAccountByIdentity(
  provider: AuthIdentity["provider"],
  subject: string,
): CustomerAccount | null {
  const sub = subject.trim().toLowerCase();
  return (
    loadAccounts().find((a) =>
      a.identities.some(
        (i) =>
          i.provider === provider && i.subject.trim().toLowerCase() === sub,
      ),
    ) ?? null
  );
}

export function upsertAccount(account: CustomerAccount): CustomerAccount {
  const list = loadAccounts();
  const idx = list.findIndex((a) => a.id === account.id);
  const next = { ...account, updatedAt: new Date().toISOString() };
  if (idx >= 0) list[idx] = next;
  else list.push(next);
  saveAccounts(list);
  return next;
}

/**
 * Creates (or updates) a customer account after the first order.
 * This is the only registration path — no separate sign-up form.
 */
export function ensureAccountFromOrder(input: {
  name: string;
  phone: string;
  email?: string | null;
  orderId: string;
}): CustomerAccount {
  const phone = normalizePhone(input.phone) ?? input.phone.trim();
  const email = input.email ? normalizeEmail(input.email) : null;
  const now = new Date().toISOString();

  let account =
    (phone ? findAccountByPhone(phone) : null) ??
    (email ? findAccountByEmail(email) : null);

  if (!account) {
    const identities: AuthIdentity[] = [];
    if (phone) identities.push({ provider: "phone", subject: phone });
    if (email) identities.push({ provider: "email", subject: email });

    account = {
      id: newId(),
      name: input.name.trim() || "Клиент",
      phone: phone || null,
      email,
      identities,
      orderIds: [input.orderId],
      createdAt: now,
      updatedAt: now,
      registeredViaOrder: true,
    };
  } else {
    const orderIds = account.orderIds.includes(input.orderId)
      ? account.orderIds
      : [...account.orderIds, input.orderId];
    const identities = [...account.identities];
    if (phone && !identities.some((i) => i.provider === "phone")) {
      identities.push({ provider: "phone", subject: phone });
    }
    if (email && !identities.some((i) => i.provider === "email")) {
      identities.push({ provider: "email", subject: email });
    }
    account = {
      ...account,
      name: input.name.trim() || account.name,
      phone: phone || account.phone,
      email: email || account.email,
      identities,
      orderIds,
      updatedAt: now,
      registeredViaOrder: true,
    };
  }

  return upsertAccount(account);
}

/** Digits only; prefers +7… for RU mobiles */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) return null;
  let local = digits;
  if (local.length === 11 && (local.startsWith("8") || local.startsWith("7"))) {
    local = local.slice(1);
  }
  if (local.length === 10) return `+7${local}`;
  if (digits.startsWith("7") && digits.length >= 11) {
    return `+${digits.slice(0, 11)}`;
  }
  return `+${digits}`;
}

export function normalizeEmail(raw: string): string | null {
  const value = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
  return value;
}

export function formatPhoneDisplay(phone: string): string {
  const n = normalizePhone(phone) ?? phone;
  const m = n.match(/^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (!m) return n;
  return `+7 (${m[1]}) ${m[2]}-${m[3]}-${m[4]}`;
}
