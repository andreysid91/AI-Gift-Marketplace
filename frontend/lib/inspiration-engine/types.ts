/**
 * Inspiration Engine — contextual ideas inside Gift Page (TASK-069).
 * No standalone gallery. Each idea → create similar gift.
 */

export type InspirationContext = {
  giftId: string;
  productId: string;
  category: string;
  style?: string | null;
  occasion?: string | null;
  recipient?: string | null;
  title?: string;
};

export type InspirationSource =
  | "category"
  | "style"
  | "occasion"
  | "recipient"
  | "ai"
  | "popular";

export type InspirationIdea = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  tone: string;
  /** Why it showed up */
  sources: InspirationSource[];
  category: string;
  style: string;
  occasion: string;
  recipient: string;
  popularity: number;
  /** Direct path to create a similar gift */
  createHref: string;
};

export type InspirationEngineResult = {
  ideas: InspirationIdea[];
  context: InspirationContext;
};
