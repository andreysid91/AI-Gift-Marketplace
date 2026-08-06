import { HomeFooter } from "../components/home/home-footer";
import { HomeForWhom } from "../components/home/home-for-whom";
import { HomeHero } from "../components/home/home-hero";
import { HomeLatestOrders } from "../components/home/home-latest-orders";
import { HomePopularGifts } from "../components/home/home-popular-gifts";
import { HomeReviews } from "../components/home/home-reviews";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_50%,#fff1e8_100%)]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-5 sm:gap-16 sm:px-6 sm:py-8 lg:gap-20 lg:px-8 lg:py-10">
        <HomeHero />
        <HomeLatestOrders />
        <HomePopularGifts />
        <HomeForWhom />
        <HomeReviews />
        <HomeFooter />
      </div>
    </main>
  );
}
