import type { CustomerSession } from "./types";
import { getAccountById } from "./accounts";

export const CUSTOMER_SESSION_KEY = "ai-gift-customer-session";

export function saveCustomerSession(session: CustomerSession) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("ai-gift-auth-change"));
}

export function loadCustomerSession(): CustomerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CUSTOMER_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as CustomerSession;
    if (!session?.accountId) return null;
    // Drop stale sessions if account was cleared
    if (!getAccountById(session.accountId)) {
      clearCustomerSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearCustomerSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
  window.dispatchEvent(new Event("ai-gift-auth-change"));
}

export function signOutCustomer() {
  clearCustomerSession();
}
