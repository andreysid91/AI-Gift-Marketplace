import { MOCK_IDEAS } from "./mock-ideas";
import { saveGiftOrder, type GiftOrderPayload } from "./gift-order";
import { resolveGiftPage } from "./gift-page";

/**
 * Prefill checkout cart from a known gift/product id (UX: «Заказать такой же»).
 */
export function buildOrderSamePayload(
  giftId: string,
  queryExtra = "",
): GiftOrderPayload {
  const model = resolveGiftPage(giftId);
  const idea = MOCK_IDEAS.find((item) => item.id === giftId);
  const title = idea?.title ?? model.title;
  const price = idea?.price ?? model.priceFrom;
  const emoji = idea?.emoji ?? model.emoji;

  return {
    query: queryExtra || title,
    items: [
      {
        id: model.productId || giftId,
        title,
        price,
        emoji,
        kind: "product",
        qty: 1,
        unitPrice: price,
      },
    ],
    total: price,
    createdAt: new Date().toISOString(),
  };
}

export function saveOrderSame(giftId: string, queryExtra = "") {
  const payload = buildOrderSamePayload(giftId, queryExtra);
  saveGiftOrder(payload);
  return payload;
}

export function orderSameCheckoutHref(giftId: string): string {
  const params = new URLSearchParams({
    from: "gift",
    id: giftId,
    same: "1",
  });
  return `/checkout?${params.toString()}`;
}
