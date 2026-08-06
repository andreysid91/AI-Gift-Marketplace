export type {
  AuthErrorCode,
  AuthIdentity,
  AuthProviderConfig,
  AuthProviderId,
  AuthResult,
  CustomerAccount,
  CustomerSession,
  SmsChallenge,
} from "./types";

export {
  AUTH_PROVIDERS,
  getEnabledProviders,
  getProvider,
  isProviderEnabled,
} from "./providers";

export {
  ACCOUNTS_STORAGE_KEY,
  ensureAccountFromOrder,
  findAccountByEmail,
  findAccountByPhone,
  formatPhoneDisplay,
  getAccountById,
  loadAccounts,
  normalizeEmail,
  normalizePhone,
} from "./accounts";

export {
  CUSTOMER_SESSION_KEY,
  clearCustomerSession,
  loadCustomerSession,
  saveCustomerSession,
  signOutCustomer,
} from "./session";

export {
  DEMO_OTP_CODE,
  startSmsChallenge,
  verifySmsCode,
} from "./sms";

export {
  completeEmailLogin,
  completePhoneLogin,
  getCurrentSession,
  loginWithGoogleMock,
  loginWithReservedProvider,
  requestEmailLogin,
  requestPhoneLogin,
} from "./login";
