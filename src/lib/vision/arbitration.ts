/**
 * Pipeline arbitration — which classifier stage wins each frame.
 *
 * Order (highest priority first):
 *   1. Custom ONNX model — covers the most gestures at the highest
 *      accuracy (v4: 14 sign classes + no_gesture).
 *   2. MediaPipe's neural net — backup for gestures it knows, and a
 *      second opinion when the custom model is silent.
 *   3. Geometric rules — deterministic fallback for crisp poses.
 *   4. User-taught k-NN predictor (Studio) — personal custom gestures.
 *
 * The custom model outranks MediaPipe because MediaPipe only knows 8
 * gestures and misfires on the rest (e.g. Victory for "three", ILoveYou
 * for "rock on", Open_Palm for "four"/"vulcan"). A wrong phrase is worse
 * than falling through to a later stage.
 *
 * Special case: when the custom model confidently predicts no_gesture
 * ("that's not a sign"), lower stages are suppressed entirely — the
 * model knows "not a sign" better than the rules, and firing a wrong
 * phrase is worse than silence.
 */
import { NO_GESTURE_ID } from "./customModel";
import type { RawPrediction } from "./types";

export type ArbitrationStages = {
  custom: RawPrediction | null;
  neural: RawPrediction | null;
  rules: RawPrediction | null;
  customFallback: RawPrediction | null;
};

export function arbitratePredictions(stages: ArbitrationStages): RawPrediction | null {
  if (stages.custom?.gesture.id === NO_GESTURE_ID) return null;
  return stages.custom ?? stages.neural ?? stages.rules ?? stages.customFallback ?? null;
}
