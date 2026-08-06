/**
 * Gift Checkout Experience (TASK-070).
 * Catalog-driven packaging, cards, and future extras.
 */

import type { GiftOrderLine } from "../gift-order";
import type { DeliveryMethodId } from "../delivery";

export const GIFT_CHECKOUT_STEP_IDS = [
  "verify",
  "packaging",
  "card",
  "message",
  "review",
] as const;

export type GiftCheckoutStepId = (typeof GIFT_CHECKOUT_STEP_IDS)[number];

/** Kind of catalog service — extend freely for new upsells */
export type CheckoutServiceKind = "packaging" | "card" | "extra";

export type CheckoutCatalogOption = {
  id: string;
  kind: CheckoutServiceKind;
  title: string;
  subtitle: string;
  price: number;
  emoji: string;
  /** Mock photo plane (gradient classes) */
  tone: string;
  /** Optional photo URL later */
  imageUrl?: string | null;
  /** Soft tags for filtering / AI */
  tags?: string[];
};

export type MessageMode = "manual" | "ai" | "none";

export type CheckoutContact = {
  name: string;
  phone: string;
  telegram: string;
  address: string;
  deliveryDate: string;
  comment: string;
  method: DeliveryMethodId;
};

export type GiftCheckoutDraft = {
  query: string;
  /** Core gift lines (products + non packing/card extras) */
  giftLines: GiftOrderLine[];
  packagingId: string;
  cardId: string;
  messageMode: MessageMode;
  messageText: string;
  /** Reserved for future add-on services */
  extraIds: string[];
  contact: CheckoutContact;
};

export type GiftCheckoutPricing = {
  giftTotal: number;
  packaging: number;
  card: number;
  extras: number;
  delivery: number;
  /** Sum before delivery */
  subtotal: number;
  total: number;
  lines: Array<{ id: string; title: string; price: number; emoji: string }>;
};
