import mockSeed from "../../data/learning-mock.json";
import {
  LEARNING_CHANGE_EVENT,
  LEARNING_EVENTS_STORAGE_KEY,
  LEARNING_SEEDED_KEY,
  type LearningEvent,
  type LearningEventType,
  type LearningPayload,
} from "./types";

const EVENT_TYPES = new Set<LearningEventType>([
  "search",
  "filter",
  "scenario",
  "product_open",
  "cart_add",
  "bundle",
  "purchase",
]);

function isBrowser() {
  return typeof window !== "undefined";
}

function newId() {
  return `le_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function isEvent(value: unknown): value is LearningEvent {
  if (!value || typeof value !== "object") return false;
  const row = value as LearningEvent;
  return (
    typeof row.id === "string" &&
    typeof row.at === "string" &&
    EVENT_TYPES.has(row.type) &&
    row.payload != null &&
    typeof row.payload === "object"
  );
}

export function buildSeedEvents(): LearningEvent[] {
  return (mockSeed as Array<{ type: string; at: string; payload: LearningPayload }>).flatMap(
    (row, index) => {
      if (!EVENT_TYPES.has(row.type as LearningEventType)) return [];
      return [
        {
          id: `seed_${index}_${row.type}`,
          type: row.type as LearningEventType,
          at: row.at,
          payload: row.payload,
          sessionKey: "mock",
        },
      ];
    },
  );
}

export function loadLearningEvents(): LearningEvent[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(LEARNING_EVENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isEvent);
  } catch {
    return [];
  }
}

export function saveLearningEvents(events: LearningEvent[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(
    LEARNING_EVENTS_STORAGE_KEY,
    JSON.stringify(events.slice(-5000)),
  );
  window.dispatchEvent(new Event(LEARNING_CHANGE_EVENT));
}

/** First visit: seed mock analytics. */
export function ensureLearningSeeded(): LearningEvent[] {
  if (!isBrowser()) return [];
  const existing = loadLearningEvents();
  if (existing.length > 0) return existing;
  if (window.localStorage.getItem(LEARNING_SEEDED_KEY) === "1") {
    return existing;
  }
  const seeded = buildSeedEvents();
  saveLearningEvents(seeded);
  window.localStorage.setItem(LEARNING_SEEDED_KEY, "1");
  return seeded;
}

export function resetLearningToMock(): LearningEvent[] {
  if (!isBrowser()) return [];
  const seeded = buildSeedEvents();
  saveLearningEvents(seeded);
  window.localStorage.setItem(LEARNING_SEEDED_KEY, "1");
  return seeded;
}

export function appendLearningEvent(
  type: LearningEventType,
  payload: LearningPayload,
  sessionKey?: string,
): LearningEvent {
  const event: LearningEvent = {
    id: newId(),
    type,
    at: new Date().toISOString(),
    payload,
    sessionKey,
  };
  const all = ensureLearningSeeded();
  saveLearningEvents([...all, event]);
  return event;
}
