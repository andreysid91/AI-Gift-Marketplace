import { HomeFooter } from "../components/home/home-footer";
import { HomeHero } from "../components/home/home-hero";
import { HomePopularGifts } from "../components/home/home-popular-gifts";
import { HomeReviews } from "../components/home/home-reviews";
import { HomeScenarios } from "../components/home/home-scenarios";
import { HomeWhy } from "../components/home/home-why";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_50%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 py-6 sm:gap-20 sm:px-8 sm:py-8 lg:gap-24 lg:py-10">
        <HomeHero />
        <HomeScenarios />
        <HomePopularGifts />
        <HomeWhy />
        <HomeReviews />
        <HomeFooter />
      </div>
    </main>
  );
}
