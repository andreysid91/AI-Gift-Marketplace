/**
 * Gift Score — unified rating system (TASK-068).
 */

export type GiftScoreMetrics = {
  giftId: string;
  title: string;
  emoji: string;
  tone: string;
  href: string;
  /** Display stars 1–5 (can be .5) */
  stars: number;
  orders: number;
  likes: number;
  saves: number;
  reviews: number;
  repeats: number;
  /** Ranking helpers (mock) */
  ordersWeek: number;
  ordersMonth: number;
  ordersYear: number;
  growthRate: number;
  commentsCount: number;
  unusualScore: number;
  /** Computed 0–100 composite */
  score: number;
};

export type GiftRankingId =
  | "week"
  | "month"
  | "year"
  | "rising"
  | "discussed"
  | "unusual";

export type GiftRanking = {
  id: GiftRankingId;
  title: string;
  description: string;
  items: GiftScoreMetrics[];
};
