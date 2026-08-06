import {
  resolveGiftEngine,
  runGiftEngine,
  toGiftRecommendation,
  registerGiftEngineEnricher,
  getGiftEngineEnricher,
} from "../../../lib/gift-engine";
import { openAiGiftEngineEnricher } from "../../../lib/gift-engine/ai-enricher";

export const runtime = "nodejs";

type Body = {
  query?: string;
  recipientProfile?: string;
  excludeItemIds?: string[];
  hasPhoto?: boolean;
  city?: string;
};

function ensureEnricher() {
  if (!getGiftEngineEnricher()) {
    registerGiftEngineEnricher(openAiGiftEngineEnricher);
  }
}

/**
 * POST /api/recommend
 * Gift Engine v1: knowledge JSON first; AI enricher only if registered & needed.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const query = body.query?.trim() ?? "";
  const recipientProfile = body.recipientProfile?.trim() || null;
  const excludeItemIds = Array.isArray(body.excludeItemIds)
    ? body.excludeItemIds
    : [];
  if (!query && !recipientProfile) {
    return Response.json({ error: "query is required" }, { status: 400 });
  }

  ensureEnricher();

  const input = {
    query: query || "Подарок",
    recipientProfile,
    excludeItemIds,
    hasPhoto: Boolean(body.hasPhoto),
    city: body.city ?? null,
  };

  const knowledge = runGiftEngine(input);
  const resolved = await resolveGiftEngine(input);
  const result = toGiftRecommendation(resolved);

  return Response.json({
    ...result,
    engine: {
      params: resolved.params,
      why: resolved.why,
      leadTimeLabel: resolved.leadTimeLabel,
      estimatedCostLabel: resolved.estimatedCostLabel,
      sets: resolved.sets,
    },
    meta: {
      knowledgeMissed: knowledge.needsEnrichment,
      aiUsed: resolved.source === "ai",
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
      excludedCount: excludeItemIds.length,
      giftEngine: "v1",
    },
  });
}
