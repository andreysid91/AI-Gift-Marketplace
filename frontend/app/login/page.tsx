import Link from "next/link";
import { LoginPanel } from "../../components/auth/login-panel";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const redirectTo =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,#ffe0c8_0%,transparent_42%),radial-gradient(ellipse_at_90%_0%,#ffd0c4_0%,transparent_36%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-md px-5 py-10 sm:py-14">
        <Link
          href="/"
          className="inline-flex text-base font-extrabold text-[var(--accent)] hover:underline"
        >
          ← Gift
        </Link>

        <div className="mt-8">
          <LoginPanel redirectTo={redirectTo} />
        </div>
      </div>
    </main>
  );
}
