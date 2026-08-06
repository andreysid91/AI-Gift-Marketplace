import { HomeAbout, HomeHow, HomeStory, HomeTrust } from "../components/home/home-story";
import {
  HomeCategories,
  HomeIdeasWeek,
} from "../components/home/home-catalog-blocks";
import { HomeForWhom } from "../components/home/home-for-whom";
import { HomeHero } from "../components/home/home-hero";
import { HomeLatestOrders } from "../components/home/home-latest-orders";
import { HomePopularGifts } from "../components/home/home-popular-gifts";
import { HomeReviews } from "../components/home/home-reviews";
import { HomeWhy } from "../components/home/home-why";
import { TrustClientPhotos } from "../components/trust/trust-client-photos";
import { TrustMetricsBar } from "../components/trust/trust-metrics-bar";
import { TrustStories } from "../components/trust/trust-stories";
import { getTrustSnapshot } from "../lib/trust";

export default function Home() {
  const trust = getTrustSnapshot();

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_50%,#fff1e8_100%)]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-5 sm:gap-16 sm:px-6 sm:py-8 lg:gap-20 lg:px-8 lg:py-10">
        <HomeHero />
        <TrustMetricsBar metrics={trust.metrics} />
        <HomeStory />
        <HomeTrust />
        <HomeHow />
        <HomeLatestOrders />
        <HomePopularGifts />
        <TrustClientPhotos photos={trust.clientPhotos} />
        <TrustStories stories={trust.stories} />
        <HomeCategories />
        <HomeIdeasWeek />
        <HomeForWhom />
        <HomeReviews />
        <HomeWhy />
        <HomeAbout />
      </div>
    </main>
  );
}
