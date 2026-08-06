import type { AuthProviderConfig, AuthProviderId } from "./types";

/**
 * Registry of login methods.
 * Enable VK / Apple later by flipping `enabled` and adding a provider adapter.
 */
export const AUTH_PROVIDERS: AuthProviderConfig[] = [
  {
    id: "phone",
    label: "Телефон",
    hint: "Вход по SMS-коду, без пароля",
    enabled: true,
    priority: 1,
  },
  {
    id: "google",
    label: "Google",
    hint: "Быстрый вход через Google",
    enabled: true,
    priority: 2,
  },
  {
    id: "email",
    label: "Email",
    hint: "Код на почту, без пароля",
    enabled: true,
    priority: 3,
  },
  {
    id: "vk",
    label: "VK",
    hint: "Скоро",
    enabled: false,
    priority: 4,
  },
  {
    id: "apple",
    label: "Apple",
    hint: "Скоро",
    enabled: false,
    priority: 5,
  },
];

export function getEnabledProviders(): AuthProviderConfig[] {
  return AUTH_PROVIDERS.filter((p) => p.enabled).sort(
    (a, b) => a.priority - b.priority,
  );
}

export function getProvider(id: AuthProviderId): AuthProviderConfig | undefined {
  return AUTH_PROVIDERS.find((p) => p.id === id);
}

export function isProviderEnabled(id: AuthProviderId): boolean {
  return getProvider(id)?.enabled === true;
}
