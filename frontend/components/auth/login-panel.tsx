"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEMO_OTP_CODE,
  completeEmailLogin,
  completePhoneLogin,
  formatPhoneDisplay,
  getEnabledProviders,
  loginWithGoogleMock,
  loginWithReservedProvider,
  requestEmailLogin,
  requestPhoneLogin,
  type AuthProviderId,
} from "../../lib/auth";

type Step =
  | "choose"
  | "phone"
  | "phone-code"
  | "email"
  | "email-code"
  | "google";

type LoginPanelProps = {
  /** Where to go after successful sign-in */
  redirectTo?: string;
  compact?: boolean;
};

export function LoginPanel({
  redirectTo = "/account",
  compact = false,
}: LoginPanelProps) {
  const router = useRouter();
  const providers = useMemo(() => getEnabledProviders(), []);
  const reserved = useMemo(
    () =>
      (
        [
          { id: "vk" as const, label: "VK" },
          { id: "apple" as const, label: "Apple" },
        ] as const
      ),
    [],
  );

  const [step, setStep] = useState<Step>("choose");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [googleEmail, setGoogleEmail] = useState("demo.customer@gmail.com");
  const [code, setCode] = useState("");
  const [demoHint, setDemoHint] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function goSuccess() {
    router.push(redirectTo);
    router.refresh();
  }

  function onPick(id: AuthProviderId) {
    setError("");
    setCode("");
    setDemoHint("");
    if (id === "phone") setStep("phone");
    else if (id === "email") setStep("email");
    else if (id === "google") setStep("google");
  }

  function onGoogle(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = loginWithGoogleMock({ email: googleEmail });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    goSuccess();
  }

  function onSendPhone(event: FormEvent) {
    event.preventDefault();
    setError("");
    const result = requestPhoneLogin(phone);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setDemoHint(
      `Демо-код: ${result.challenge.demoCode} (SMS-шлюз пока mock)`,
    );
    setPhone(result.challenge.phone);
    setStep("phone-code");
  }

  function onVerifyPhone(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = completePhoneLogin(code);
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    goSuccess();
  }

  function onSendEmail(event: FormEvent) {
    event.preventDefault();
    setError("");
    const result = requestEmailLogin(email);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setDemoHint(`Демо-код: ${result.challenge.demoCode}`);
    setEmail(result.challenge.email);
    setStep("email-code");
  }

  function onVerifyEmail(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = completeEmailLogin(code);
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    goSuccess();
  }

  const fieldClass =
    "mt-2 w-full rounded-[22px] border-2 border-[var(--line)] bg-white px-5 py-4 text-lg font-bold text-[var(--foreground)] outline-none transition placeholder:font-semibold placeholder:text-[var(--muted)] focus:border-[var(--accent)]";

  const btnPrimary =
    "mt-6 w-full rounded-[28px] bg-[var(--accent)] px-8 py-4 text-lg font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--accent-hover)] disabled:opacity-70";

  const btnGhost =
    "w-full rounded-[22px] border-2 border-[var(--line)] bg-white px-5 py-4 text-left transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]";

  return (
    <div
      className={`rounded-[32px] bg-white shadow-[var(--shadow)] ${
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8"
      }`}
    >
      {step === "choose" ? (
        <>
          <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl">
            Вход
          </h2>
          <p className="mt-2 text-base font-bold text-[var(--muted)]">
            Без регистрации и пароля. Аккаунт создаётся автоматически при
            первом заказе.
          </p>

          <div className="mt-6 space-y-3">
            {providers.map((provider) => (
              <button
                key={provider.id}
                type="button"
                disabled={busy}
                onClick={() => onPick(provider.id)}
                className={btnGhost}
              >
                <span className="block text-lg font-extrabold">
                  {provider.id === "phone"
                    ? "📱 Телефон"
                    : provider.id === "google"
                      ? "G  Google"
                      : "✉️ Email"}
                  {provider.id === "phone" ? (
                    <span className="ml-2 text-sm font-extrabold text-[var(--accent)]">
                      приоритет
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block text-sm font-bold text-[var(--muted)]">
                  {provider.hint}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 border-t border-[var(--line)] pt-5">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
              Позже
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {reserved.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    const result = loginWithReservedProvider(item.id);
                    setError(result.ok ? "" : result.message);
                  }}
                  className="rounded-[16px] border border-dashed border-[var(--line)] px-4 py-2 text-sm font-extrabold text-[var(--muted)]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {step === "google" ? (
        <form onSubmit={onGoogle}>
          <button
            type="button"
            onClick={() => {
              setStep("choose");
              setError("");
            }}
            className="text-sm font-extrabold text-[var(--accent)] hover:underline"
          >
            ← Все способы
          </button>
          <h2 className="mt-4 font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Google
          </h2>
          <p className="mt-2 text-sm font-bold text-[var(--muted)]">
            Mock OAuth: укажите email, который был в заказе.
          </p>
          <label
            htmlFor="auth-google"
            className="mt-5 block text-base font-extrabold"
          >
            Google email
          </label>
          <input
            id="auth-google"
            type="email"
            required
            value={googleEmail}
            onChange={(e) => setGoogleEmail(e.target.value)}
            className={fieldClass}
          />
          <button type="submit" disabled={busy} className={btnPrimary}>
            {busy ? "Входим…" : "Продолжить с Google"}
          </button>
        </form>
      ) : null}

      {step === "phone" ? (
        <form onSubmit={onSendPhone}>
          <button
            type="button"
            onClick={() => {
              setStep("choose");
              setError("");
            }}
            className="text-sm font-extrabold text-[var(--accent)] hover:underline"
          >
            ← Все способы
          </button>
          <h2 className="mt-4 font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Телефон
          </h2>
          <p className="mt-2 text-sm font-bold text-[var(--muted)]">
            Пришлём SMS-код. Пароль не нужен.
          </p>
          <label htmlFor="auth-phone" className="mt-5 block text-base font-extrabold">
            Номер
          </label>
          <input
            id="auth-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 9…"
            className={fieldClass}
          />
          <button type="submit" className={btnPrimary}>
            Получить код
          </button>
        </form>
      ) : null}

      {step === "phone-code" ? (
        <form onSubmit={onVerifyPhone}>
          <button
            type="button"
            onClick={() => {
              setStep("phone");
              setCode("");
              setError("");
            }}
            className="text-sm font-extrabold text-[var(--accent)] hover:underline"
          >
            ← Изменить номер
          </button>
          <h2 className="mt-4 font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Код из SMS
          </h2>
          <p className="mt-2 text-sm font-bold text-[var(--muted)]">
            Отправили на {formatPhoneDisplay(phone)}
          </p>
          {demoHint ? (
            <p className="mt-3 rounded-[16px] bg-[var(--mint-soft)] px-4 py-3 text-sm font-extrabold text-[var(--mint)]">
              {demoHint}
            </p>
          ) : null}
          <label htmlFor="auth-sms" className="mt-5 block text-base font-extrabold">
            Код
          </label>
          <input
            id="auth-sms"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={DEMO_OTP_CODE}
            className={fieldClass}
          />
          <button type="submit" disabled={busy} className={btnPrimary}>
            {busy ? "Проверяем…" : "Войти"}
          </button>
        </form>
      ) : null}

      {step === "email" ? (
        <form onSubmit={onSendEmail}>
          <button
            type="button"
            onClick={() => {
              setStep("choose");
              setError("");
            }}
            className="text-sm font-extrabold text-[var(--accent)] hover:underline"
          >
            ← Все способы
          </button>
          <h2 className="mt-4 font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Email
          </h2>
          <p className="mt-2 text-sm font-bold text-[var(--muted)]">
            Код на почту, без пароля.
          </p>
          <label htmlFor="auth-email" className="mt-5 block text-base font-extrabold">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@mail.ru"
            className={fieldClass}
          />
          <button type="submit" className={btnPrimary}>
            Получить код
          </button>
        </form>
      ) : null}

      {step === "email-code" ? (
        <form onSubmit={onVerifyEmail}>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError("");
            }}
            className="text-sm font-extrabold text-[var(--accent)] hover:underline"
          >
            ← Изменить email
          </button>
          <h2 className="mt-4 font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
            Код из письма
          </h2>
          <p className="mt-2 text-sm font-bold text-[var(--muted)]">
            Отправили на {email}
          </p>
          {demoHint ? (
            <p className="mt-3 rounded-[16px] bg-[var(--mint-soft)] px-4 py-3 text-sm font-extrabold text-[var(--mint)]">
              {demoHint}
            </p>
          ) : null}
          <label htmlFor="auth-email-code" className="mt-5 block text-base font-extrabold">
            Код
          </label>
          <input
            id="auth-email-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={DEMO_OTP_CODE}
            className={fieldClass}
          />
          <button type="submit" disabled={busy} className={btnPrimary}>
            {busy ? "Проверяем…" : "Войти"}
          </button>
        </form>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm font-extrabold text-[var(--berry)]">{error}</p>
      ) : null}

      {step === "choose" || error.includes("первого заказа") ? (
        <p className="mt-5 text-sm font-bold text-[var(--muted)]">
          Ещё нет аккаунта?{" "}
          <Link href="/ideas" className="text-[var(--accent)] hover:underline">
            Оформите заказ
          </Link>
          {" — "}регистрация произойдёт сама.
        </p>
      ) : null}
    </div>
  );
}
