/**
 * Trust System — public social proof (TASK-074).
 * Shape mirrors a future API: GET /api/trust → TrustSnapshot.
 */

export type TrustMetrics = {
  /** All-time completed orders */
  totalOrders: number;
  /** Completed today (local calendar day) */
  ordersToday: number;
  /** Average star rating 1–5 */
  averageRating: number;
  /** Published reviews count */
  reviewCount: number;
  /** Share of repeat customers 0–1 */
  repeatRate: number;
  /** Cities / regions served (display) */
  citiesLabel: string;
};

export type TrustOrderStatusStep = {
  label: string;
  at: string;
  done: boolean;
};

/** Completed order card for «Последние заказы» */
export type TrustOrder = {
  id: string;
  giftId: string;
  giftTitle: string;
  giftHref: string;
  orderSameHref: string;
  recipientName: string;
  recipientRole: string;
  total: number;
  completedAt: string;
  completedLabel: string;
  photoUrl: string;
  photoCaption: string;
  history: TrustOrderStatusStep[];
  previewReview?: {
    author: string;
    text: string;
    emotion: string;
  };
};

/** Review always points at a Gift Page */
export type TrustReview = {
  id: string;
  author: string;
  text: string;
  emotion: string;
  rating: number;
  giftId: string;
  giftTitle: string;
  giftHref: string;
  photoUrl: string;
  createdAt: string;
  createdLabel: string;
};

export type TrustPopularGift = {
  giftId: string;
  title: string;
  href: string;
  imageUrl: string;
  /** How many people ordered this gift */
  orderCount: number;
  rating: number;
};

/** Customer photo of the real gift / handover */
export type TrustClientPhoto = {
  id: string;
  imageUrl: string;
  caption: string;
  author: string;
  giftId: string;
  giftHref: string;
  giftTitle: string;
};

/** Longer customer story */
export type TrustStory = {
  id: string;
  title: string;
  body: string;
  author: string;
  recipientRole: string;
  imageUrl: string;
  giftId: string;
  giftHref: string;
  giftTitle: string;
  rating: number;
};

/**
 * Full trust payload — one round-trip for the home trust surface.
 * Future: replace `getTrustSnapshot()` body with fetch('/api/trust').
 */
export type TrustSnapshot = {
  metrics: TrustMetrics;
  latestOrders: TrustOrder[];
  reviews: TrustReview[];
  popularGifts: TrustPopularGift[];
  clientPhotos: TrustClientPhoto[];
  stories: TrustStory[];
  /** ISO timestamp of last aggregation */
  updatedAt: string;
};
