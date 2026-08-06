"use client";

import Link from "next/link";

const POPULAR_CATEGORIES = [
  { label: "Маме", href: "/create?scenario=gift&recipient=маме&q=" + encodeURIComponent("Подарок маме") },
  { label: "Папе", href: "/create?scenario=gift&recipient=папе&q=" + encodeURIComponent("Подарок папе") },
  { label: "Жене", href: "/create?scenario=gift&recipient=жене&q=" + encodeURIComponent("Подарок жене") },
  { label: "Мужу", href: "/create?scenario=gift&recipient=мужу&q=" + encodeURIComponent("Подарок мужу") },
  { label: "Ребёнку", href: "/create?scenario=gift&recipient=ребёнку&q=" + encodeURIComponent("Подарок ребёнку") },
  { label: "Начальнику", href: "/create?scenario=gift&recipient=начальнику&q=" + encodeURIComponent("Подарок начальнику") },
  { label: "Другу", href: "/create?scenario=gift&recipient=другу&q=" + encodeURIComponent("Подарок другу") },
  { label: "Кружки", href: "/gift?id=mug" },
  { label: "Холсты", href: "/gift?id=canvas" },
] as const;

export function PopularCategories() {
  return (
    <div className="flex flex-wrap gap-3">
      {POPULAR_CATEGORIES.map((category) => (
        <Link
          key={category.label}
          href={category.href}
          className="rounded-[18px] bg-white px-4 py-2.5 text-sm font-extrabold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] sm:px-5 sm:py-3 sm:text-base"
        >
          {category.label}
        </Link>
      ))}
    </div>
  );
}
