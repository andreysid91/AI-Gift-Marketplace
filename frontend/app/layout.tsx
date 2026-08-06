import type { Metadata } from "next";
import { Nunito, Unbounded } from "next/font/google";
import { GiftHubNav } from "../components/gift-hub/gift-hub-nav";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800", "900"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Gift — кому подарок?",
  description:
    "Выберите, кому подарок — подберём готовые идеи под повод и бюджет.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${nunito.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <GiftHubNav />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
