import { runInspirationEngine } from "../inspiration-engine";
import { HOME_PHOTOS } from "../home-media";
import { MOCK_IDEAS } from "../mock-ideas";
import { formatLeadTimeLabel } from "../gift-engine";
import {
  resolveUniversalProductCard,
} from "../universal-product-card";
import { mergeGiftPageBlocks } from "./config";
import {
  DEFAULT_WHY,
  EMOTION_BY_PRODUCT,
  GIFT_PAGE_ADDONS,
  mockClientPhotos,
  mockComments,
  mockHandoverVideos,
  mockPopularWeek,
  mockReviewsFor,
  mockSimilarGifts,
  mockSimilarIdeas,
} from "./mock-content";
import type {
  GiftMediaItem,
  GiftPageBlocksConfig,
  GiftPageModel,
  GiftSlotOption,
} from "./types";

const IDEA_TO_PRODUCT: Record<string, string> = {
  "idea-01": "mug",
  "idea-02": "tee",
  "idea-03": "canvas",
  "idea-04": "mug",
  "idea-05": "puzzle",
  "idea-06": "tee",
  "idea-07": "canvas",
  "idea-08": "mug",
};

const PRODUCT_PHOTOS: Record<string, [string, string, string]> = {
  mug: [HOME_PHOTOS.mugHands, HOME_PHOTOS.mugWarm, HOME_PHOTOS.packing],
  tee: [HOME_PHOTOS.teeWear, HOME_PHOTOS.smileOpen, HOME_PHOTOS.packing],
  canvas: [HOME_PHOTOS.canvasWall, HOME_PHOTOS.coupleGift, HOME_PHOTOS.packing],
  puzzle: [HOME_PHOTOS.familyTable, HOME_PHOTOS.kids, HOME_PHOTOS.packing],
  photo: [HOME_PHOTOS.photoPrint, HOME_PHOTOS.coupleGift, HOME_PHOTOS.packing],
  default: [HOME_PHOTOS.packing, HOME_PHOTOS.birthday, HOME_PHOTOS.delivery],
};

function buildSlots(hours: number | null): GiftSlotOption[] {
  const h = hours ?? 48;
  return [
    { id: "today", label: "Сегодня", available: h <= 24 },
    { id: "tomorrow", label: "Завтра", available: h <= 48 },
    {
      id: "in-two-days",
      label: "Через два дня",
      available: h <= 72 || h > 48,
    },
  ];
}

function buildMedia(
  productId: string,
  emoji: string,
  tone: string,
  title: string,
): GiftMediaItem[] {
  const photos = PRODUCT_PHOTOS[productId] ?? PRODUCT_PHOTOS.default;
  return [
    {
      id: "m1",
      kind: "image",
      tone,
      emoji,
      label: title,
      imageUrl: photos[0],
    },
    {
      id: "m2",
      kind: "image",
      tone: "from-[#ffe8da] to-[#ffc9b0]",
      emoji,
      label: "Крупный план",
      imageUrl: photos[1],
    },
    {
      id: "m3",
      kind: "image",
      tone: "from-[#fff4ec] to-[#ffd0c4]",
      emoji: "📦",
      label: "Упаковка",
      imageUrl: photos[2],
    },
    {
      id: "m4",
      kind: "video",
      tone: "from-[#2a1810] to-[#5a3a2a]",
      emoji: "🎬",
      label: "Превью вручения",
      imageUrl: HOME_PHOTOS.smileOpen,
    },
  ];
}

/**
 * Resolve Gift Page model by idea id or product id.
 */
export function resolveGiftPage(
  rawId: string | undefined,
  blocksOverride?: Partial<GiftPageBlocksConfig>,
): GiftPageModel {
  const id = (rawId ?? "mug").trim() || "mug";
  const idea = MOCK_IDEAS.find((item) => item.id === id);
  const productId =
    IDEA_TO_PRODUCT[id] ??
    (idea
      ? IDEA_TO_PRODUCT[idea.id] ?? "mug"
      : id);

  const card = resolveUniversalProductCard(productId);
  const title = idea?.title ?? card?.title ?? "Подарок";
  const emoji = idea?.emoji ?? card?.emoji ?? "🎁";
  const tone = idea?.gradient ?? card?.tone ?? "from-[#ffb4a2] to-[#ff5a3c]";
  const priceFrom = idea?.price ?? card?.priceFrom ?? 990;
  const hours = card?.leadTimeHours ?? (idea ? 48 : null);
  const emotion =
    EMOTION_BY_PRODUCT[productId] ?? EMOTION_BY_PRODUCT.default;
  const description =
    idea?.description ??
    card?.description ??
    "Персональный подарок под ваш запрос.";

  const schema = card?.schema ?? {
    productId,
    title,
    emoji,
    basePrice: priceFrom,
    params: [
      {
        id: "qty",
        label: "Количество",
        kind: "quantity" as const,
        min: 1,
        max: 50,
        defaultQty: 1,
      },
    ],
  };

  const inspiration = runInspirationEngine({
    giftId: id,
    productId,
    category: productId,
    style: idea?.style ?? null,
    occasion: idea?.occasion ?? null,
    recipient: idea?.recipient ?? null,
    title,
  }).ideas;

  return {
    id,
    productId,
    title,
    emotion,
    description,
    priceFrom,
    leadTimeLabel: idea?.leadTime ?? formatLeadTimeLabel(hours),
    leadTimeHours: hours,
    emoji,
    tone,
    schema,
    media: buildMedia(productId, emoji, tone, title),
    why: DEFAULT_WHY,
    slots: buildSlots(hours),
    addons: GIFT_PAGE_ADDONS,
    reviews: mockReviewsFor(title),
    clientPhotos: mockClientPhotos(),
    handoverVideos: mockHandoverVideos(),
    similarIdeas: mockSimilarIdeas(id),
    similarGifts: mockSimilarGifts(productId),
    inspiration,
    popularWeek: mockPopularWeek(),
    comments: mockComments(),
    orderHref: `/checkout?id=${encodeURIComponent(id)}&from=gift`,
    similarHref: `/ideas?q=${encodeURIComponent(title)}&from=similar`,
    blocks: mergeGiftPageBlocks(blocksOverride),
  };
}
