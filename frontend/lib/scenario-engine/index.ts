/**
 * Scenario Engine v1 — TASK-060
 * Classify request → independent question flow per scenario.
 */

export type {
  ClassifyOptions,
  GiftOrderType,
  ScenarioAnswers,
  ScenarioClassification,
  ScenarioDefinition,
  ScenarioFlowState,
  ScenarioId,
  ScenarioOption,
  ScenarioStep,
  StepKind,
} from "./types";

export { SCENARIO_IDS } from "./types";

export {
  SCENARIO_REGISTRY,
  getScenarioDefinition,
  getScenarioLabel,
  isScenarioId,
  listScenarios,
  normalizeScenarioId,
} from "./registry";

export {
  classifyScenario,
  resolveScenarioId,
} from "./classify";

export {
  answerCurrentStep,
  answersHasPhoto,
  answersToQuery,
  createFlowState,
  getCurrentStep,
  getStepProgress,
  goBackStep,
  skipOptionalStep,
} from "./flow";
