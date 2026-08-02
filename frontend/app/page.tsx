import Image from "next/image";
import { CategoryCards } from "../components/category-cards";
import { HomePrompt } from "../components/home-prompt";
import { PopularGifts } from "../components/popular-gifts";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_8%,#ffe0c8_0%,transparent_42%),radial-gradient(ellipse_at_88%_12%,#ffd0c4_0%,transparent_38%),radial-gradient(ellipse_at_50%_100%,#ffe8b8_0%,transparent_45%),linear-gradient(180deg,#fff4ec_0%,#ffe8da_48%,#fff1e8_100%)]"
      />

      {/* Hero */}
      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-10 pt-8 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:pb-16 lg:pt-12">
        <div className="order-2 lg:order-1">
          <p className="animate-fade-rise font-[family-name:var(--font-unbounded)] text-4xl font-semibold tracking-tight text-[var(--accent)] sm:text-5xl">
            AI Gift
          </p>

          <h1 className="animate-fade-rise-delay-1 mt-5 max-w-xl font-[family-name:var(--font-unbounded)] text-5xl font-semibold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-6xl lg:text-[64px]">
            Не знаете,
            <br />
            что подарить?
          </h1>

          <p className="animate-fade-rise-delay-1 mt-5 max-w-lg text-lg font-bold leading-snug text-[var(--muted)] sm:text-xl">
            Опишите человека или загрузите фото.
            <br />
            AI покажет готовые подарки — можно сразу заказать.
          </p>

          <div className="mt-8">
            <HomePrompt />
          </div>
        </div>

        <div className="order-1 animate-fade-rise-delay-3 lg:order-2">
          <div className="animate-float relative overflow-hidden rounded-[40px] shadow-[var(--shadow)]">
            <Image
              src="/hero-gift-scene.png"
              alt="Готовый персональный подарок: кружка, футболка, холст, коробка, открытка, шоколад и свеча"
              width={1200}
              height={900}
              priority
              className="h-auto w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2a1810]/55 to-transparent px-6 pb-6 pt-16">
              <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-white sm:text-3xl">
                Готовый подарок, а не каталог
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <h2 className="font-[family-name:var(--font-unbounded)] text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
          Кому дарим?
        </h2>
        <p className="mt-3 text-lg font-bold text-[var(--muted)] sm:text-xl">
          Выберите категорию — и сразу к идеям
        </p>
        <div className="mt-8">
          <CategoryCards />
        </div>
      </section>

      {/* Popular */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-4 lg:px-8 lg:pb-28">
        <h2 className="font-[family-name:var(--font-unbounded)] text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
          Популярные подарки
        </h2>
        <p className="mt-3 text-lg font-bold text-[var(--muted)] sm:text-xl">
          То, что чаще всего заказывают
        </p>
        <div className="mt-8">
          <PopularGifts />
        </div>
      </section>

      {/* Benefits strip */}
      <section className="relative z-10 border-t border-[var(--line)] bg-white/70">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-10 sm:grid-cols-3 lg:px-8 lg:py-12">
          <div>
            <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--foreground)]">
              Быстрый дизайн
            </p>
            <p className="mt-2 text-base font-bold text-[var(--muted)]">
              Идеи за минуты, не за часы
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--foreground)]">
              Персональные подарки
            </p>
            <p className="mt-2 text-base font-bold text-[var(--muted)]">
              Под человека, а не «на полку»
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[var(--foreground)]">
              Удобный заказ
            </p>
            <p className="mt-2 text-base font-bold text-[var(--muted)]">
              От идеи до оплаты в одном месте
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
