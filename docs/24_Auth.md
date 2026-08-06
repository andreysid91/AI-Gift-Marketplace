# Авторизация клиентов

Passwordless. Отдельной регистрации нет.

## Правила

1. Вход без формы «Зарегистрироваться».
2. Аккаунт создаётся **только** при оформлении заказа (`ensureAccountFromOrder`).
3. После первого заказа пользователь сразу в сессии.
4. Повторный вход: телефон (SMS) → Google → Email. Паролей нет.
5. VK и Apple зарезервированы в `AUTH_PROVIDERS` (`enabled: false`).

## Способы входа

| Провайдер | Статус | Механика |
|-----------|--------|----------|
| phone | приоритет, включён | SMS OTP (mock код `1234`) |
| google | включён | mock OAuth, ищет аккаунт по email / identity |
| email | включён | код на почту (тот же mock `1234`) |
| vk | позже | `loginWithReservedProvider` |
| apple | позже | `loginWithReservedProvider` |

## Ключевые пути

- `lib/auth/` — типы, провайдеры, аккаунты, SMS, сессия, login API
- `/login` — UI входа
- `/account` — кабинет
- Checkout → `ensureAccountFromOrder` + `saveCustomerSession`

## Хранение (mock)

- Аккаунты: `localStorage` → `ai-gift-customer-accounts`
- Сессия: `sessionStorage` → `ai-gift-customer-session`
