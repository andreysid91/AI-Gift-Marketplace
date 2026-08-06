/**
 * Gift Page — modular blocks (TASK-067).
 * Each block can be toggled independently via GiftPageBlocksConfig.
 */

import type { InspirationIdea } from "../inspiration-engine";
import type { ProductConfigSchema } from "../product-configurator";

export const GIFT_PAGE_BLOCK_IDS = [
  "media",
  "hero",
  "why",
  "configurator",
  "addons",
  "reviews",
  "clientPhotos",
  "handoverVideo",
  "similarIdeas",
  "similarGifts",
  "inspiration",
  "popularWeek",
  "comments",
  "giftScore",
] as const;

export type GiftPageBlockId = (typeof GIFT_PAGE_BLOCK_IDS)[number];

export type GiftPageBlocksConfig = Record<GiftPageBlockId, boolean>;

export type GiftMediaItem = {
  id: string;
  kind: "image" | "video";
  /** Gradient + emoji stand-in until real assets */
  tone: string;
  emoji: string;
  label?: string;
  /** Realistic product photo when available */
  imageUrl?: string;
};

export type GiftWhyReason = {
  id: string;
  label: string;
};

export type GiftAddonOption = {
  id: string;
  title: string;
  price: number;
  emoji: string;
};

export type GiftReviewCard = {
  id: string;
  name: string;
  rating: number;
  text: string;
  occasion: string;
  emoji: string;
  tone: string;
};

export type GiftClientPhoto = {
  id: string;
  emoji: string;
  tone: string;
  caption: string;
};

export type GiftHandoverVideo = {
  id: string;
  title: string;
  emoji: string;
  tone: string;
};

export type GiftLinkCard = {
  id: string;
  title: string;
  href: string;
  emoji: string;
  tone: string;
  subtitle?: string;
};

export type GiftComment = {
  id: string;
  author: string;
  text: string;
  at: string;
};

export type GiftSlotOption = {
  id: "today" | "tomorrow" | "in-two-days";
  label: string;
  available: boolean;
};

export type GiftPageModel = {
  id: string;
  productId: string;
  title: string;
  emotion: string;
  description: string;
  priceFrom: number;
  leadTimeLabel: string;
  leadTimeHours: number | null;
  emoji: string;
  tone: string;
  schema: ProductConfigSchema;
  media: GiftMediaItem[];
  why: GiftWhyReason[];
  slots: GiftSlotOption[];
  addons: GiftAddonOption[];
  reviews: GiftReviewCard[];
  clientPhotos: GiftClientPhoto[];
  handoverVideos: GiftHandoverVideo[];
  similarIdeas: GiftLinkCard[];
  similarGifts: GiftLinkCard[];
  inspiration: InspirationIdea[];
  popularWeek: GiftLinkCard[];
  comments: GiftComment[];
  orderHref: string;
  similarHref: string;
  blocks: GiftPageBlocksConfig;
};
