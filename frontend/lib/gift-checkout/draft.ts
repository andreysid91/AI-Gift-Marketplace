import type { GiftOrderLine, GiftOrderPayload } from "../gift-order";
import type { DeliveryMethodId } from "../delivery";
import {
  CARD_LEGACY_IDS,
  getCardOption,
  getPackagingOption,
  PACKAGING_LEGACY_IDS,
} from "./catalog";
import { isPackagingOrCardLineId } from "./price";
import type {
  CheckoutContact,
  GiftCheckoutDraft,
  MessageMode,
} from "./types";

export function defaultContact(
  overrides?: Partial<CheckoutContact>,
): CheckoutContact {
  return {
    name: "",
    phone: "",
    telegram: "",
    address: "",
    deliveryDate: "",
    comment: "",
    method: "pickup",
    ...overrides,
  };
}

function mapLegacyPackaging(id: string): string {
  if (id === "box" || id === "pack") return "pack-box";
  if (PACKAGING_LEGACY_IDS.has(id) && id.startsWith("pack-")) return id;
  return "pack-box";
}

function mapLegacyCard(id: string): string {
  if (id === "card" || id === "postcard") return "card-classic";
  if (CARD_LEGACY_IDS.has(id) && id.startsWith("card-")) return id;
  return "card-classic";
}

export function createDraftFromGiftOrder(
  order: GiftOrderPayload,
  contact?: Partial<CheckoutContact>,
): GiftCheckoutDraft {
  const giftLines = order.items.filter(
    (line) => !isPackagingOrCardLineId(line.id),
  );

  let packagingId = "pack-box";
  let cardId = "card-none";
  let messageMode: MessageMode = "none";

  for (const line of order.items) {
    if (PACKAGING_LEGACY_IDS.has(line.id)) {
      packagingId = mapLegacyPackaging(line.id);
    }
    if (CARD_LEGACY_IDS.has(line.id)) {
      cardId = mapLegacyCard(line.id);
      messageMode = "manual";
    }
  }

  return {
    query: order.query || "Подарочный набор",
    giftLines:
      giftLines.length > 0
        ? giftLines
        : [
            {
              id: "gift",
              title: order.query || "Подарок",
              price: order.total,
              emoji: "🎁",
              kind: "product",
            },
          ],
    packagingId,
    cardId,
    messageMode,
    messageText: "",
    extraIds: [],
    contact: defaultContact(contact),
  };
}

export function createDraftFromIdea(input: {
  id: string;
  title: string;
  price: number;
  emoji: string;
  query?: string;
  contact?: Partial<CheckoutContact>;
}): GiftCheckoutDraft {
  const giftLines: GiftOrderLine[] = [
    {
      id: input.id,
      title: input.title,
      price: input.price,
      emoji: input.emoji,
      kind: "product",
    },
  ];

  return {
    query: input.query || input.title,
    giftLines,
    packagingId: "pack-box",
    cardId: "card-classic",
    messageMode: "manual",
    messageText: "",
    extraIds: [],
    contact: defaultContact(input.contact),
  };
}

export function effectiveCardId(draft: GiftCheckoutDraft): string {
  if (draft.messageMode === "none") return "card-none";
  return draft.cardId === "card-none" ? "card-classic" : draft.cardId;
}

export function applyMessageMode(
  draft: GiftCheckoutDraft,
  mode: MessageMode,
): GiftCheckoutDraft {
  if (mode === "none") {
    return {
      ...draft,
      messageMode: "none",
      messageText: "",
      cardId: "card-none",
    };
  }
  const cardId =
    draft.cardId === "card-none" ? "card-classic" : draft.cardId;
  return {
    ...draft,
    messageMode: mode,
    cardId,
  };
}

export function applyCardSelection(
  draft: GiftCheckoutDraft,
  cardId: string,
): GiftCheckoutDraft {
  if (cardId === "card-none") {
    return {
      ...draft,
      cardId: "card-none",
      messageMode: "none",
      messageText: "",
    };
  }
  return {
    ...draft,
    cardId,
    messageMode: draft.messageMode === "none" ? "manual" : draft.messageMode,
  };
}

export function previewSummary(draft: GiftCheckoutDraft) {
  const packaging = getPackagingOption(draft.packagingId);
  const card = getCardOption(effectiveCardId(draft));
  return { packaging, card };
}

export function setDeliveryMethod(
  draft: GiftCheckoutDraft,
  method: DeliveryMethodId,
): GiftCheckoutDraft {
  return {
    ...draft,
    contact: { ...draft.contact, method },
  };
}
