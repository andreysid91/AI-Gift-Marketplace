import type { SmsChallenge } from "./types";

const CHALLENGE_KEY = "ai-gift-sms-challenge";
const EMAIL_CHALLENGE_KEY = "ai-gift-email-challenge";

/** Fixed demo code so QA can always enter without a real SMS gateway */
export const DEMO_OTP_CODE = "1234";

const TTL_MS = 5 * 60 * 1000;

function makeCode(): string {
  return DEMO_OTP_CODE;
}

function makeId(): string {
  return `ch-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function startSmsChallenge(phone: string): SmsChallenge {
  const challenge: SmsChallenge = {
    id: makeId(),
    phone,
    demoCode: makeCode(),
    expiresAt: Date.now() + TTL_MS,
  };
  if (typeof window !== "undefined") {
    sessionStorage.setItem(CHALLENGE_KEY, JSON.stringify(challenge));
  }
  return challenge;
}

export function loadSmsChallenge(): SmsChallenge | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CHALLENGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SmsChallenge;
  } catch {
    return null;
  }
}

export function clearSmsChallenge() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHALLENGE_KEY);
}

export function verifySmsCode(code: string): {
  ok: boolean;
  challenge: SmsChallenge | null;
  reason?: "missing" | "expired" | "mismatch";
} {
  const challenge = loadSmsChallenge();
  if (!challenge) return { ok: false, challenge: null, reason: "missing" };
  if (Date.now() > challenge.expiresAt) {
    clearSmsChallenge();
    return { ok: false, challenge: null, reason: "expired" };
  }
  const trimmed = code.replace(/\s/g, "");
  if (trimmed !== challenge.demoCode) {
    return { ok: false, challenge, reason: "mismatch" };
  }
  clearSmsChallenge();
  return { ok: true, challenge };
}

export type EmailChallenge = {
  id: string;
  email: string;
  demoCode: string;
  expiresAt: number;
};

export function startEmailChallenge(email: string): EmailChallenge {
  const challenge: EmailChallenge = {
    id: makeId(),
    email,
    demoCode: makeCode(),
    expiresAt: Date.now() + TTL_MS,
  };
  if (typeof window !== "undefined") {
    sessionStorage.setItem(EMAIL_CHALLENGE_KEY, JSON.stringify(challenge));
  }
  return challenge;
}

export function loadEmailChallenge(): EmailChallenge | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(EMAIL_CHALLENGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EmailChallenge;
  } catch {
    return null;
  }
}

export function clearEmailChallenge() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(EMAIL_CHALLENGE_KEY);
}

export function verifyEmailCode(code: string): {
  ok: boolean;
  challenge: EmailChallenge | null;
  reason?: "missing" | "expired" | "mismatch";
} {
  const challenge = loadEmailChallenge();
  if (!challenge) return { ok: false, challenge: null, reason: "missing" };
  if (Date.now() > challenge.expiresAt) {
    clearEmailChallenge();
    return { ok: false, challenge: null, reason: "expired" };
  }
  const trimmed = code.replace(/\s/g, "");
  if (trimmed !== challenge.demoCode) {
    return { ok: false, challenge, reason: "mismatch" };
  }
  clearEmailChallenge();
  return { ok: true, challenge };
}
