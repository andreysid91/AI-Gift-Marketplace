"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  loadCustomerSession,
  signOutCustomer,
  type CustomerSession,
} from "../../lib/auth";

type SiteAuthBarProps = {
  /** Extra class on the wrapper */
  className?: string;
};

export function SiteAuthBar({ className = "" }: SiteAuthBarProps) {
  const [session, setSession] = useState<CustomerSession | null>(null);

  useEffect(() => {
    function sync() {
      setSession(loadCustomerSession());
    }
    sync();
    window.addEventListener("ai-gift-auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ai-gift-auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (session) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Link
          href="/account"
          className="text-base font-extrabold text-[var(--foreground)] transition hover:text-[var(--accent)]"
        >
          {session.name}
        </Link>
        <button
          type="button"
          onClick={() => {
            signOutCustomer();
            setSession(null);
          }}
          className="rounded-[16px] border-2 border-[var(--line)] bg-white px-3 py-1.5 text-sm font-extrabold transition hover:border-[var(--accent)]"
        >
          Выйти
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className={`inline-flex items-center rounded-[18px] border-2 border-[var(--line)] bg-white px-4 py-2 text-base font-extrabold transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] ${className}`}
    >
      Войти
    </Link>
  );
}
