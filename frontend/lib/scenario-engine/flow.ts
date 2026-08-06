import { getScenarioDefinition } from "./registry";
import type {
  ScenarioAnswers,
  ScenarioFlowState,
  ScenarioId,
  ScenarioStep,
} from "./types";

export function createFlowState(scenarioId: ScenarioId): ScenarioFlowState {
  return {
    scenarioId,
    stepIndex: 0,
    answers: {},
    done: false,
  };
}

export function getCurrentStep(state: ScenarioFlowState): ScenarioStep {
  const def = getScenarioDefinition(state.scenarioId);
  const step = def.steps[state.stepIndex] ?? def.steps[def.steps.length - 1];
  return step;
}

export function getStepProgress(state: ScenarioFlowState): {
  current: number;
  total: number;
} {
  const def = getScenarioDefinition(state.scenarioId);
  const actionable = def.steps.filter((s) => s.kind !== "done");
  const currentDone = Math.min(state.stepIndex, actionable.length);
  return { current: currentDone + 1, total: actionable.length };
}

export function answerCurrentStep(
  state: ScenarioFlowState,
  value: string | number | boolean | null,
): ScenarioFlowState {
  const def = getScenarioDefinition(state.scenarioId);
  const step = getCurrentStep(state);
  if (step.kind === "done") {
    return { ...state, done: true };
  }

  const answers: ScenarioAnswers = {
    ...state.answers,
    [step.field]: value,
  };

  let nextIndex = state.stepIndex + 1;
  while (nextIndex < def.steps.length && def.steps[nextIndex].kind === "done") {
    return {
      scenarioId: state.scenarioId,
      stepIndex: nextIndex,
      answers,
      done: true,
    };
  }

  if (nextIndex >= def.steps.length) {
    return { scenarioId: state.scenarioId, stepIndex: nextIndex - 1, answers, done: true };
  }

  return {
    scenarioId: state.scenarioId,
    stepIndex: nextIndex,
    answers,
    done: def.steps[nextIndex]?.kind === "done",
  };
}

export function skipOptionalStep(state: ScenarioFlowState): ScenarioFlowState {
  const step = getCurrentStep(state);
  if (!step.optional) return state;
  return answerCurrentStep(state, null);
}

export function goBackStep(state: ScenarioFlowState): ScenarioFlowState {
  if (state.stepIndex <= 0) return state;
  return {
    ...state,
    stepIndex: state.stepIndex - 1,
    done: false,
  };
}

/** Build a Gift Engine query string from wizard answers. */
export function answersToQuery(
  scenarioId: ScenarioId,
  answers: ScenarioAnswers,
  originalQuery = "",
): string {
  const def = getScenarioDefinition(scenarioId);
  const parts: string[] = [];

  if (originalQuery.trim()) parts.push(originalQuery.trim());

  const recipient = answers.recipient;
  if (typeof recipient === "string" && recipient) {
    parts.push(`подарок ${recipient}`);
  }

  const occasion = answers.occasion;
  if (typeof occasion === "string" && occasion) parts.push(occasion);

  const budget = answers.budget;
  if (typeof budget === "string" && budget) parts.push(budget);

  const product = answers.product;
  if (typeof product === "string" && product) parts.push(product);

  const what = answers.what;
  if (typeof what === "string" && what) parts.push(what);

  const interests = answers.interests;
  if (typeof interests === "string" && interests) parts.push(interests);

  const material = answers.material;
  if (typeof material === "string" && material) parts.push(material);

  const style = answers.style;
  if (typeof style === "string" && style) parts.push(`стиль ${style}`);

  const qty = answers.quantity;
  if (qty != null && qty !== "") parts.push(`${qty} шт`);

  const deadline = answers.deadline;
  if (typeof deadline === "string" && deadline) parts.push(deadline);

  const city = answers.city;
  if (typeof city === "string" && city && city !== "другой") {
    parts.push(city);
  }

  if (answers.hasLogo === true) parts.push("логотип есть");
  if (answers.hasPhoto === true) parts.push("есть фото");

  const details = answers.details;
  if (typeof details === "string" && details.trim()) {
    parts.push(details.trim());
  }

  parts.push(def.label);

  return [...new Set(parts.filter(Boolean))].join(". ");
}

export function answersHasPhoto(answers: ScenarioAnswers, fallback = false): boolean {
  if (typeof answers.hasPhoto === "boolean") return answers.hasPhoto;
  return fallback;
}
