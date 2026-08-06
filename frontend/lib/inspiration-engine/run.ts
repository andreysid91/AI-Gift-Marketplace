import { INSPIRATION_CATALOG } from "./catalog";
import type {
  InspirationContext,
  InspirationEngineResult,
  InspirationIdea,
  InspirationSource,
} from "./types";

function includesLoose(hay: string, needle: string | null | undefined): boolean {
  if (!needle?.trim()) return false;
  const h = hay.toLowerCase();
  const n = needle.trim().toLowerCase();
  return h.includes(n) || n.includes(h);
}

function scoreIdea(idea: InspirationIdea, ctx: InspirationContext): number {
  let score = 0;
  const matched: InspirationSource[] = [];

  if (
    idea.category === ctx.productId ||
    idea.category === ctx.category ||
    (idea.category === "any" && idea.sources.includes("ai"))
  ) {
    score += 40;
    matched.push("category");
  }

  if (ctx.style && includesLoose(idea.style, ctx.style)) {
    score += 28;
    matched.push("style");
  }

  if (ctx.occasion && includesLoose(idea.occasion, ctx.occasion)) {
    score += 22;
    matched.push("occasion");
  }

  if (ctx.recipient && includesLoose(idea.recipient, ctx.recipient)) {
    score += 22;
    matched.push("recipient");
  }

  if (idea.sources.includes("ai")) {
    score += 12;
    matched.push("ai");
  }

  if (idea.sources.includes("popular")) {
    score += Math.min(20, idea.popularity / 5);
    matched.push("popular");
  }

  score += idea.popularity / 20;

  // Soft boost when title overlaps
  if (ctx.title && includesLoose(idea.title, ctx.title.split(" ")[0] ?? "")) {
    score += 5;
  }

  return score;
}

/**
 * Rank inspiration ideas for the current Gift Page context.
 */
export function runInspirationEngine(
  ctx: InspirationContext,
  limit = 8,
): InspirationEngineResult {
  const ranked = INSPIRATION_CATALOG.map((idea) => ({
    idea,
    score: scoreIdea(idea, ctx),
  }))
    .filter((row) => row.score >= 12)
    .sort((a, b) => b.score - a.score || b.idea.popularity - a.idea.popularity)
    .slice(0, limit)
    .map((row) => row.idea);

  // Always ensure at least a few ideas (popular + ai fallback)
  if (ranked.length < 4) {
    const extra = INSPIRATION_CATALOG.filter(
      (idea) => !ranked.some((r) => r.id === idea.id),
    )
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4 - ranked.length);
    ranked.push(...extra);
  }

  return { ideas: ranked, context: ctx };
}

/** Build create-similar URL for any idea (ensures CTA always works). */
export function inspirationCreateHref(idea: InspirationIdea): string {
  if (idea.createHref) return idea.createHref;
  const q = [idea.title, idea.recipient, idea.occasion, idea.style]
    .filter(Boolean)
    .join(" ");
  return `/ideas?q=${encodeURIComponent(q)}&from=inspiration&idea=${idea.id}`;
}
