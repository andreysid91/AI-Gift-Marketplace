/**
 * Customer auth — passwordless.
 * Account is created only on first order (not via a registration form).
 */

/** Active + reserved providers. VK / Apple stay disabled until wired. */
export type AuthProviderId =
  | "phone"
  | "google"
  | "email"
  | "vk"
  | "apple";

export type AuthProviderConfig = {
  id: AuthProviderId;
  label: string;
  /** Short hint under the button */
  hint: string;
  /** Shown in login UI */
  enabled: boolean;
  /** Lower = higher priority in UI */
  priority: number;
};

export type AuthIdentity = {
  provider: AuthProviderId;
  /** E.164-ish phone, email, or oauth subject */
  subject: string;
};

export type CustomerAccount = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  /** Linked OAuth subjects by provider */
  identities: AuthIdentity[];
  orderIds: string[];
  createdAt: string;
  updatedAt: string;
  /** True once created via checkout — always true for stored accounts */
  registeredViaOrder: boolean;
};

export type CustomerSession = {
  accountId: string;
  name: string;
  phone: string | null;
  email: string | null;
  provider: AuthProviderId;
  signedInAt: string;
};

export type SmsChallenge = {
  id: string;
  phone: string;
  /** Demo only — shown in UI; real SMS would never expose this */
  demoCode: string;
  expiresAt: number;
};

export type AuthErrorCode =
  | "provider_disabled"
  | "invalid_phone"
  | "invalid_email"
  | "invalid_code"
  | "challenge_expired"
  | "account_not_found"
  | "oauth_cancelled";

export type AuthResult =
  | { ok: true; session: CustomerSession; account: CustomerAccount }
  | { ok: false; code: AuthErrorCode; message: string };
