/**
 * Static-gesture classifier: rule-based templates over finger states.
 *
 * This is intentionally a *starter* classifier — transparent, testable and
 * shippable without training data. Phase 3 (Gesture Studio) adds a trainable
 * on-device classifier on the normalised landmark vectors; the rule set
 * below remains as the built-in "Essentials" pack.
 */
import { analyseFingers, pinchDistance } from "./landmarks";
import type { GestureDefinition, GestureId, RawPrediction, Vec3 } from "./types";

export const GESTURE_DEFINITIONS: GestureDefinition[] = [
  { id: "open-palm", label: "Open Palm", phraseKey: "hello", phrase: "Hello" },
  { id: "fist", label: "Fist", phraseKey: "yes", phrase: "Yes" },
  { id: "thumbs-up", label: "Thumbs Up", phraseKey: "im-okay", phrase: "I'm okay" },
  { id: "peace", label: "Peace", phraseKey: "water", phrase: "Water, please" },
  { id: "point", label: "Point", phraseKey: "that-one", phrase: "That one" },
  { id: "ok-sign", label: "OK Sign", phraseKey: "thank-you", phrase: "Thank you" },
];

const byId = new Map<string, GestureDefinition>(GESTURE_DEFINITIONS.map((g) => [g.id, g]));

export function getGestureDefinition(id: GestureId): GestureDefinition {
  const def = byId.get(id);
  if (!def) throw new Error(`Unknown gesture id: ${id}`);
  return def;
}

/**
 * Classify one frame of 21 hand landmarks. Returns null when the hand does
 * not match any known template.
 */
export function classifyLandmarks(lm: Vec3[] | null): RawPrediction | null {
  if (!lm || lm.length < 21) return null;

  const { states, crispness } = analyseFingers(lm);
  const { thumb, index, middle, ring, pinky } = states;
  const extendedCount = [thumb, index, middle, ring, pinky].filter(Boolean).length;

  let id: GestureId | null = null;
  if (extendedCount === 5) {
    id = "open-palm";
  } else if (extendedCount === 0) {
    id = "fist";
  } else if (thumb && !index && !middle && !ring && !pinky) {
    id = "thumbs-up";
  } else if (!thumb && index && middle && !ring && !pinky) {
    id = "peace";
  } else if (!thumb && index && !middle && !ring && !pinky) {
    id = "point";
  } else if (pinchDistance(lm) < 0.35 && middle && ring && pinky) {
    id = "ok-sign";
  }

  if (!id) return null;

  // Confidence is derived from finger-state crispness: a deliberately honest,
  // uncalibrated score. Never present it as a calibrated probability.
  const confidence = Math.round((0.55 + crispness * 0.45) * 100) / 100;
  return { gesture: byId.get(id)!, confidence, fingerStates: states };
}
