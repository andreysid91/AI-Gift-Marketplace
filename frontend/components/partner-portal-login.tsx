"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  authenticatePartner,
  getDemoLogins,
  savePartnerSession,
} from "../lib/partner-portal";

export function PartnerPortalLogin() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const demos = getDemoLogins().filter(
    (item) => item.partner.status !== "Отключен",
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const session = authenticatePartner(login, password);
    if (!session) {
      setError("Неверный логин или пароль");
      return;
    }
    savePartnerSession(session);
    router.push("/partner/orders");
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form
        onSubmit={onSubmit}
        className="rounded-[28px] bg-white p-6 shadow-[var(--shadow)] sm:p-8"
      >
        <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold">
          Вход для партнёра
        </h2>
        <p className="mt-2 text-sm font-bold text-[var(--muted)]">
          Видны только ваши производственные заказы
        </p>

        <label className="mt-6 block text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
          Логин
        </label>
        <input
          value={login}
          onChange={(event) => {
            setLogin(event.target.value);
            setError("");
          }}
          className="mt-2 w-full rounded-[18px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-3 text-base font-bold outline-none focus:border-[var(--accent)]"
          autoComplete="username"
        />

        <label className="mt-4 block text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
          Пароль
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          className="mt-2 w-full rounded-[18px] border-2 border-[var(--line)] bg-[var(--surface-warm)] px-4 py-3 text-base font-bold outline-none focus:border-[var(--accent)]"
          autoComplete="current-password"
        />

        {error ? (
          <p className="mt-3 text-sm font-extrabold text-[var(--berry)]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-6 w-full rounded-[18px] bg-[var(--accent)] px-5 py-4 text-lg font-extrabold text-white transition hover:bg-[var(--accent-hover)]"
        >
          Войти
        </button>
      </form>

      <div className="mt-6 rounded-[24px] bg-white/80 p-5 shadow-[var(--shadow-soft)]">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
          Демо-доступы
        </p>
        <ul className="mt-3 space-y-2">
          {demos.slice(0, 4).map((item) => (
            <li key={item.login} className="text-sm font-bold">
              <button
                type="button"
                onClick={() => {
                  setLogin(item.login);
                  setPassword(item.password);
                  setError("");
                }}
                className="text-left hover:text-[var(--accent)]"
              >
                <span className="font-extrabold">{item.partner.name}</span>
                <span className="text-[var(--muted)]">
                  {" "}
                  — {item.login} / {item.password}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
