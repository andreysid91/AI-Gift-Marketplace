/** Customer-facing brand (no “AI” in UI). */
export const BRAND_NAME = "Gift";

export function brandTitle(page?: string): string {
  if (!page?.trim()) return BRAND_NAME;
  return `${page.trim()} — ${BRAND_NAME}`;
}
