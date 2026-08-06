/**
 * Deterministic Gift Score (0–100) and star display from metrics.
 * No AI — pure weights for mock / future real counters.
 */

export type ScoreInput = {
  stars: number;
  orders: number;
  likes: number;
  saves: number;
  reviews: number;
  repeats: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function norm(value: number, cap: number) {
  return clamp(value / cap, 0, 1);
}

/**
 * Composite Gift Score 0–100.
 * Stars dominate; social proof and loyalty add weight.
 */
export function computeGiftScore(input: ScoreInput): number {
  const starPart = clamp(input.stars, 0, 5) / 5;
  const ordersPart = norm(input.orders, 500);
  const likesPart = norm(input.likes, 2000);
  const savesPart = norm(input.saves, 800);
  const reviewsPart = norm(input.reviews, 200);
  const repeatsPart = norm(input.repeats, 100);

  const raw =
    starPart * 0.35 +
    ordersPart * 0.25 +
    likesPart * 0.15 +
    savesPart * 0.1 +
    reviewsPart * 0.1 +
    repeatsPart * 0.05;

  return Math.round(raw * 100);
}

/** Round to nearest half-star for UI */
export function displayStars(stars: number): number {
  return Math.round(clamp(stars, 0, 5) * 2) / 2;
}

export function starsLabel(stars: number): string {
  const s = displayStars(stars);
  const full = Math.floor(s);
  const half = s - full >= 0.5;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
}

/** Classic five stars string (full stars only, rounded) */
export function starsRow(stars: number): string {
  const full = Math.round(clamp(stars, 0, 5));
  return "★".repeat(full) + "☆".repeat(5 - full);
}
