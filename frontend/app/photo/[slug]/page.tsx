import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoProductView } from "../../../components/photo-product-view";
import {
  PHOTO_PRODUCTS,
  getPhotoProduct,
} from "../../../lib/photo-products";

type PhotoProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PHOTO_PRODUCTS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PhotoProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getPhotoProduct(slug);
  if (!product) {
    return { title: "Фотопечать — Gift" };
  }
  return {
    title: `${product.title} — фотопечать | Gift`,
    description: product.description,
  };
}

export default async function PhotoProductPage({
  params,
}: PhotoProductPageProps) {
  const { slug } = await params;
  const product = getPhotoProduct(slug);
  if (!product) notFound();

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,#e8f0ff_0%,transparent_42%),radial-gradient(ellipse_at_90%_8%,#ffe0c8_0%,transparent_36%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_50%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:py-10">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/photo"
            className="inline-flex items-center gap-2 text-base font-extrabold text-[var(--accent)] transition hover:gap-3"
          >
            <span aria-hidden>←</span>
            К выбору продуктов
          </Link>
        </div>

        <header className="mt-8 max-w-3xl animate-fade-rise">
          <p className="text-5xl" aria-hidden>
            {product.icon}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-unbounded)] text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            {product.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-bold leading-snug text-[var(--muted)] sm:text-xl">
            {product.description}
          </p>
        </header>

        <div className="mt-10 animate-fade-rise-delay-1 sm:mt-12">
          <PhotoProductView product={product} />
        </div>
      </div>
    </main>
  );
}
