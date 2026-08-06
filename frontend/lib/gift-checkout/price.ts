import { getDeliveryMethod, type DeliveryMethodId } from "../delivery";
import {
  CARD_LEGACY_IDS,
  EXTRA_OPTIONS,
  getCardOption,
  getExtraOption,
  getPackagingOption,
  PACKAGING_LEGACY_IDS,
} from "./catalog";
import type {
  GiftCheckoutDraft,
  GiftCheckoutPricing,
  GiftCheckoutStepId,
} from "./types";
import { GIFT_CHECKOUT_STEP_IDS } from "./types";

export const STEP_META: Record<
  GiftCheckoutStepId,
  { index: number; title: string; hint: string }
> = {
  verify: {
    index: 1,
    title: "Проверка подарка",
    hint: "Состав верный? Оплаты на сайте нет — заявка, затем подтверждение",
  },
  packaging: {
    index: 2,
    title: "Упаковка",
    hint: "Выберите оформление",
  },
  card: {
    index: 3,
    title: "Дизайн открытки",
    hint: "Как будет выглядеть открытка",
  },
  message: {
    index: 4,
    title: "Поздравление",
    hint: "Свой текст, автотекст или без открытки",
  },
  review: {
    index: 5,
    title: "Финальная проверка",
    hint: "Контакты и превью заказа",
  },
};

export function getStepIndex(step: GiftCheckoutStepId): number {
  return GIFT_CHECKOUT_STEP_IDS.indexOf(step);
}

export function nextStep(step: GiftCheckoutStepId): GiftCheckoutStepId | null {
  const i = getStepIndex(step);
  if (i < 0 || i >= GIFT_CHECKOUT_STEP_IDS.length - 1) return null;
  return GIFT_CHECKOUT_STEP_IDS[i + 1];
}

export function prevStep(step: GiftCheckoutStepId): GiftCheckoutStepId | null {
  const i = getStepIndex(step);
  if (i <= 0) return null;
  return GIFT_CHECKOUT_STEP_IDS[i - 1];
}

export function isPackagingOrCardLineId(id: string): boolean {
  return PACKAGING_LEGACY_IDS.has(id) || CARD_LEGACY_IDS.has(id);
}

export function calculateCheckoutPricing(
  draft: GiftCheckoutDraft,
  deliveryMethodId?: DeliveryMethodId,
): GiftCheckoutPricing {
  const methodId = deliveryMethodId ?? draft.contact.method;
  const delivery = getDeliveryMethod(methodId).cost;

  const giftTotal = draft.giftLines.reduce((sum, line) => sum + line.price, 0);

  const packagingOpt = getPackagingOption(draft.packagingId);
  const packaging = packagingOpt.price;

  const noCard =
    draft.messageMode === "none" || draft.cardId === "card-none";
  const cardOpt = getCardOption(noCard ? "card-none" : draft.cardId);
  const card = noCard ? 0 : cardOpt.price;

  let extras = 0;
  const extraLines: GiftCheckoutPricing["lines"] = [];
  for (const id of draft.extraIds) {
    const opt = getExtraOption(id) ?? EXTRA_OPTIONS.find((e) => e.id === id);
    if (!opt) continue;
    extras += opt.price;
    extraLines.push({
      id: opt.id,
      title: opt.title,
      price: opt.price,
      emoji: opt.emoji,
    });
  }

  const lines: GiftCheckoutPricing["lines"] = [
    ...draft.giftLines.map((line) => ({
      id: line.id,
      title: line.title,
      price: line.price,
      emoji: line.emoji,
    })),
  ];

  if (packaging > 0 || packagingOpt.id !== "pack-none") {
    lines.push({
      id: packagingOpt.id,
      title: packagingOpt.title,
      price: packaging,
      emoji: packagingOpt.emoji,
    });
  }

  if (!noCard && cardOpt.id !== "card-none") {
    lines.push({
      id: cardOpt.id,
      title: cardOpt.title,
      price: card,
      emoji: cardOpt.emoji,
    });
  }

  lines.push(...extraLines);

  const subtotal = giftTotal + packaging + card + extras;
  return {
    giftTotal,
    packaging,
    card,
    extras,
    delivery,
    subtotal,
    total: subtotal + delivery,
    lines,
  };
}
