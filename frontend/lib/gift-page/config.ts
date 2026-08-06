import type { GiftPageBlocksConfig } from "./types";

/** Default: all blocks on. Flip any flag to hide a section. */
export const DEFAULT_GIFT_PAGE_BLOCKS: GiftPageBlocksConfig = {
  media: true,
  hero: true,
  why: true,
  configurator: true,
  addons: true,
  reviews: true,
  clientPhotos: true,
  handoverVideo: true,
  similarIdeas: true,
  similarGifts: true,
  inspiration: true,
  popularWeek: true,
  comments: true,
  giftScore: true,
};

export function mergeGiftPageBlocks(
  override?: Partial<GiftPageBlocksConfig>,
): GiftPageBlocksConfig {
  return { ...DEFAULT_GIFT_PAGE_BLOCKS, ...override };
}
