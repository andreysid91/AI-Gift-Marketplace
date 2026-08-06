/** Shared budget parsing for Gift Engine (no AI). */

const BUDGET_PATTERNS: { re: RegExp }[] = [
  { re: /до\s*(\d[\d\s]*)\s*(₽|руб|р\.?)?/i },
  { re: /бюджет\s*(\d[\d\s]*)/i },
  { re: /не\s*дороже\s*(\d[\d\s]*)/i },
  { re: /макс(?:имум)?\s*(\d[\d\s]*)/i },
];

export function parseBudgetFromQuery(query: string): number | null {
  for (const pattern of BUDGET_PATTERNS) {
    const match = query.match(pattern.re);
    if (!match?.[1]) continue;
    const value = Number(match[1].replace(/\s/g, ""));
    if (Number.isFinite(value) && value > 0) return value;
  }
  if (/без\s*лимита|wow|вау/i.test(query)) return null;
  return null;
}
