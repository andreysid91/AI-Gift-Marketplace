import { GIFT_SCORE_MOCK } from "./mock";
import type { GiftRanking, GiftRankingId, GiftScoreMetrics } from "./types";

function top(
  items: GiftScoreMetrics[],
  key: keyof GiftScoreMetrics,
  limit = 8,
): GiftScoreMetrics[] {
  return [...items].sort((a, b) => {
    const av = Number(a[key]);
    const bv = Number(b[key]);
    return bv - av || b.score - a.score;
  }).slice(0, limit);
}

export function getGiftRanking(id: GiftRankingId): GiftRanking {
  const all = GIFT_SCORE_MOCK;
  switch (id) {
    case "week":
      return {
        id,
        title: "Лучшие за неделю",
        description: "По заказам за 7 дней",
        items: top(all, "ordersWeek"),
      };
    case "month":
      return {
        id,
        title: "Лучшие за месяц",
        description: "По заказам за 30 дней",
        items: top(all, "ordersMonth"),
      };
    case "year":
      return {
        id,
        title: "Лучшие за год",
        description: "По заказам за год",
        items: top(all, "ordersYear"),
      };
    case "rising":
      return {
        id,
        title: "Самые быстрорастущие",
        description: "Рост заказов и сохранений",
        items: top(all, "growthRate"),
      };
    case "discussed":
      return {
        id,
        title: "Самые обсуждаемые",
        description: "Комментарии + отзывы + лайки",
        items: [...all]
          .sort(
            (a, b) =>
              b.commentsCount + b.reviews + b.likes / 10 -
              (a.commentsCount + a.reviews + a.likes / 10),
          )
          .slice(0, 8),
      };
    case "unusual":
      return {
        id,
        title: "Самые необычные",
        description: "Редкие форматы и вау-эффект",
        items: top(all, "unusualScore"),
      };
  }
}

export function getAllGiftRankings(): GiftRanking[] {
  return [
    getGiftRanking("week"),
    getGiftRanking("month"),
    getGiftRanking("year"),
    getGiftRanking("rising"),
    getGiftRanking("discussed"),
    getGiftRanking("unusual"),
  ];
}

export function getTopByGiftScore(limit = 10): GiftScoreMetrics[] {
  return top(GIFT_SCORE_MOCK, "score", limit);
}
