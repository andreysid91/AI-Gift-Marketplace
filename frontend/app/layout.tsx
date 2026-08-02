import type { Metadata } from "next";
import { Nunito, Unbounded } from "next/font/google";
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
  title: "AI Gift — персональные подарки",
  description:
    "Опишите человека или загрузите фото — AI покажет готовые подарки, которые можно сразу заказать.",
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
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
