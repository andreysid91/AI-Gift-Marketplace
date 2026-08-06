/**
 * Scenario Engine — TASK-060
 * Independent scenarios with their own question flows.
 */

export const SCENARIO_IDS = [
  "gift",
  "photo",
  "corporate",
  "print_3d",
  "laser",
  "embroidery",
  "unsure",
  "custom",
] as const;

export type ScenarioId = (typeof SCENARIO_IDS)[number];

/** Maps to Gift Engine order type (narrower). */
export type GiftOrderType = "gift" | "photo" | "business" | "custom";

export type StepKind = "choice" | "text" | "number" | "boolean" | "done";

export type ScenarioOption = {
  value: string;
  label: string;
};

export type ScenarioStep = {
  id: string;
  /** Question shown to the user */
  prompt: string;
  kind: Exclude<StepKind, "done"> | "done";
  /** Answer field key in ScenarioAnswers */
  field: string;
  options?: ScenarioOption[];
  placeholder?: string;
  optional?: boolean;
  /** Hint under the question */
  hint?: string;
};

export type ScenarioDefinition = {
  id: ScenarioId;
  label: string;
  description: string;
  /** Gift Engine / learning bridge */
  orderType: GiftOrderType;
  /** Classifier keywords (substring, case-insensitive) */
  keywords: string[];
  patterns?: string[];
  /** Relative classifier weight */
  weight: number;
  /** Ordered question flow; last step should be kind "done" */
  steps: ScenarioStep[];
};

export type ScenarioAnswers = Record<string, string | number | boolean | null>;

export type ScenarioClassification = {
  scenarioId: ScenarioId;
  label: string;
  confidence: number;
  scores: Partial<Record<ScenarioId, number>>;
  matched: string[];
  isFallback: boolean;
};

export type ScenarioFlowState = {
  scenarioId: ScenarioId;
  stepIndex: number;
  answers: ScenarioAnswers;
  done: boolean;
};

export type ClassifyOptions = {
  force?: ScenarioId | string | null;
  hasPhoto?: boolean;
};
