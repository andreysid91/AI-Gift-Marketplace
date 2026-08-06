/**
 * Compatibility adapter — prefer `lib/trust` for new code.
 * Maps Trust Snapshot → legacy showcase shape.
 */

import { getTrustSnapshot } from "./trust";

export type ShowcaseHistoryStep = {
  label: string;
  at: string;
  done: boolean;
};

export type ShowcaseReview = {
  id: string;
  author: string;
  text: string;
  emotion: string;
};

export type ShowcaseOrder = {
  id: string;
  recipient: string;
  recipientRole: string;
  giftTitle: string;
  giftId: string;
  emoji: string;
  tone: string;
  photoUrl: string;
  photoLabel: string;
  total: number;
  date: string;
  dateLabel: string;
  history: ShowcaseHistoryStep[];
  reviews: ShowcaseReview[];
  orderSameHref: string;
  giftHref: string;
};

export function getShowcaseOrders(): ShowcaseOrder[] {
  return getTrustSnapshot().latestOrders.map((order) => ({
    id: order.id,
    recipient: order.recipientName,
    recipientRole: order.recipientRole,
    giftTitle: order.giftTitle,
    giftId: order.giftId,
    emoji: "🎁",
    tone: "from-[#ffb4a2] to-[#ff5a3c]",
    photoUrl: order.photoUrl,
    photoLabel: order.photoCaption,
    total: order.total,
    date: order.completedAt,
    dateLabel: order.completedLabel,
    history: order.history,
    reviews: order.previewReview
      ? [
          {
            id: `${order.id}-rev`,
            author: order.previewReview.author,
            text: order.previewReview.text,
            emotion: order.previewReview.emotion,
          },
        ]
      : [],
    orderSameHref: order.orderSameHref,
    giftHref: order.giftHref,
  }));
}

/** @deprecated use getShowcaseOrders() */
export const SHOWCASE_ORDERS = getShowcaseOrders();

export function getShowcaseReviews() {
  return getTrustSnapshot().reviews.map((review) => ({
    id: review.id,
    author: review.author,
    text: review.text,
    emotion: review.emotion,
    giftTitle: review.giftTitle,
    giftHref: review.giftHref,
    recipientRole: "",
    emoji: "🎁",
    tone: "from-[#ffb4a2] to-[#ff5a3c]",
    photoUrl: review.photoUrl,
    orderId: review.id,
  }));
}
