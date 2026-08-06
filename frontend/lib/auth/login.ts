import {
  findAccountByEmail,
  findAccountByIdentity,
  findAccountByPhone,
  normalizeEmail,
  normalizePhone,
  upsertAccount,
} from "./accounts";
import { isProviderEnabled } from "./providers";
import {
  clearCustomerSession,
  loadCustomerSession,
  saveCustomerSession,
  signOutCustomer,
} from "./session";
import {
  startEmailChallenge,
  startSmsChallenge,
  verifyEmailCode,
  verifySmsCode,
  type EmailChallenge,
} from "./sms";
import type {
  AuthResult,
  CustomerAccount,
  CustomerSession,
  SmsChallenge,
} from "./types";

function toSession(
  account: CustomerAccount,
  provider: CustomerSession["provider"],
): CustomerSession {
  return {
    accountId: account.id,
    name: account.name,
    phone: account.phone,
    email: account.email,
    provider,
    signedInAt: new Date().toISOString(),
  };
}

function accountNotFoundMessage(): string {
  return "Аккаунт появится после первого заказа. Регистрация отдельно не нужна — оформите заявку.";
}

/** Step 1: send SMS code. Does not create an account. */
export function requestPhoneLogin(phoneRaw: string): {
  ok: true;
  challenge: SmsChallenge;
} | {
  ok: false;
  message: string;
} {
  if (!isProviderEnabled("phone")) {
    return { ok: false, message: "Вход по телефону временно недоступен" };
  }
  const phone = normalizePhone(phoneRaw);
  if (!phone) {
    return { ok: false, message: "Введите корректный номер телефона" };
  }
  const challenge = startSmsChallenge(phone);
  return { ok: true, challenge };
}

/** Step 2: verify SMS. Signs in only if account already exists (from an order). */
export function completePhoneLogin(code: string): AuthResult {
  if (!isProviderEnabled("phone")) {
    return {
      ok: false,
      code: "provider_disabled",
      message: "Вход по телефону временно недоступен",
    };
  }

  const verified = verifySmsCode(code);
  if (!verified.ok) {
    if (verified.reason === "expired" || verified.reason === "missing") {
      return {
        ok: false,
        code: "challenge_expired",
        message: "Код истёк — запросите новый",
      };
    }
    return {
      ok: false,
      code: "invalid_code",
      message: "Неверный код",
    };
  }

  const phone = verified.challenge!.phone;
  const account = findAccountByPhone(phone);
  if (!account) {
    return {
      ok: false,
      code: "account_not_found",
      message: accountNotFoundMessage(),
    };
  }

  const session = toSession(account, "phone");
  saveCustomerSession(session);
  return { ok: true, session, account };
}

export function requestEmailLogin(emailRaw: string): {
  ok: true;
  challenge: EmailChallenge;
} | {
  ok: false;
  message: string;
} {
  if (!isProviderEnabled("email")) {
    return { ok: false, message: "Вход по email временно недоступен" };
  }
  const email = normalizeEmail(emailRaw);
  if (!email) {
    return { ok: false, message: "Введите корректный email" };
  }
  const challenge = startEmailChallenge(email);
  return { ok: true, challenge };
}

export function completeEmailLogin(code: string): AuthResult {
  if (!isProviderEnabled("email")) {
    return {
      ok: false,
      code: "provider_disabled",
      message: "Вход по email временно недоступен",
    };
  }

  const verified = verifyEmailCode(code);
  if (!verified.ok) {
    if (verified.reason === "expired" || verified.reason === "missing") {
      return {
        ok: false,
        code: "challenge_expired",
        message: "Код истёк — запросите новый",
      };
    }
    return {
      ok: false,
      code: "invalid_code",
      message: "Неверный код",
    };
  }

  const email = verified.challenge!.email;
  const account = findAccountByEmail(email);
  if (!account) {
    return {
      ok: false,
      code: "account_not_found",
      message: accountNotFoundMessage(),
    };
  }

  const session = toSession(account, "email");
  saveCustomerSession(session);
  return { ok: true, session, account };
}

/**
 * Mock Google OAuth — no real Google SDK.
 * Signs in only if an account is already linked to this Google subject / email.
 */
export function loginWithGoogleMock(input?: {
  email?: string;
  name?: string;
  subject?: string;
}): AuthResult {
  if (!isProviderEnabled("google")) {
    return {
      ok: false,
      code: "provider_disabled",
      message: "Вход через Google временно недоступен",
    };
  }

  const email =
    normalizeEmail(input?.email ?? "demo.customer@gmail.com") ??
    "demo.customer@gmail.com";
  const subject = (input?.subject ?? `google:${email}`).trim();

  let account =
    findAccountByIdentity("google", subject) ?? findAccountByEmail(email);

  if (!account) {
    return {
      ok: false,
      code: "account_not_found",
      message: accountNotFoundMessage(),
    };
  }

  if (!account.identities.some((i) => i.provider === "google")) {
    account = upsertAccount({
      ...account,
      email: account.email ?? email,
      identities: [
        ...account.identities,
        { provider: "google", subject },
      ],
    });
  }

  const session = toSession(account, "google");
  saveCustomerSession(session);
  return { ok: true, session, account };
}

/** Placeholder for future VK / Apple adapters */
export function loginWithReservedProvider(
  provider: "vk" | "apple",
): AuthResult {
  return {
    ok: false,
    code: "provider_disabled",
    message:
      provider === "vk"
        ? "Вход через VK появится позже"
        : "Вход через Apple появится позже",
  };
}

export function getCurrentSession(): CustomerSession | null {
  return loadCustomerSession();
}

export { signOutCustomer, clearCustomerSession, saveCustomerSession };
