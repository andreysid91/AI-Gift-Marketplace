import Link from "next/link";
import { PHOTO_PRODUCTS } from "../lib/photo-products";

export function PhotoCatalog() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {PHOTO_PRODUCTS.map((item, index) => (
        <Link
          key={item.slug}
          href={`/photo/${item.slug}`}
          className={`group relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-[24px] px-4 py-5 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow)] sm:min-h-[180px] sm:px-5 sm:py-6 ${item.tone} ${
            index === 0
              ? "animate-fade-rise-delay-1"
              : index === 1
                ? "animate-fade-rise-delay-2"
                : "animate-fade-rise-delay-3"
          }`}
        >
          <span
            className="text-4xl transition duration-300 group-hover:scale-110 sm:text-5xl"
            aria-hidden
          >
            {item.icon}
          </span>
          <div>
            <span className="block font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-tight sm:text-xl">
              {item.title}
            </span>
            <span className="mt-1 block text-sm font-extrabold opacity-75">
              {item.short}
            </span>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold opacity-0 transition group-hover:gap-2 group-hover:opacity-100">
            Открыть <span aria-hidden>→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
