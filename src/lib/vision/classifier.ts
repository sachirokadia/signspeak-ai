/**
 * Static-gesture classifier: geometric templates over finger curl angles.
 *
 * Each finger's curl is measured from actual joint angles (0 = straight,
 * 1 = fully curled), not just tip distances. Gestures are defined as
 * curl ranges per finger plus special conditions (pinch distance, etc.).
 * A hand-sanity check rejects garbage landmark sets before classification,
 * which kills most false positives from background objects.
 */
import { analyseFingers, fingerCurl, handSanity, pinchDistance } from "./landmarks";
import type {
  GestureDefinition,
  GestureId,
  MediaPipeGestureName,
  RawPrediction,
  Vec3,
} from "./types";

export const GESTURE_DEFINITIONS: GestureDefinition[] = [
  { id: "open-palm", label: "Open Palm", phraseKey: "hello", phrase: "Hello" },
  { id: "fist", label: "Fist", phraseKey: "yes", phrase: "Yes" },
  { id: "thumbs-up", label: "Thumbs Up", phraseKey: "im-okay", phrase: "I'm okay" },
  { id: "peace", label: "Peace", phraseKey: "water", phrase: "Water, please" },
  { id: "point", label: "Point", phraseKey: "that-one", phrase: "That one" },
  { id: "ok-sign", label: "OK Sign", phraseKey: "thank-you", phrase: "Thank you" },
  { id: "i-love-you", label: "I Love You", phraseKey: "i-love-you", phrase: "I love you" },
  { id: "call-me", label: "Call Me", phraseKey: "call", phrase: "Please call someone" },
  { id: "three", label: "Three", phraseKey: "three", phrase: "Three" },
  { id: "four", label: "Four", phraseKey: "four", phrase: "Four" },
];

const byId = new Map<string, GestureDefinition>(GESTURE_DEFINITIONS.map((g) => [g.id, g]));

export function getGestureDefinition(id: GestureId): GestureDefinition {
  const def = byId.get(id);
  if (!def) throw new Error(`Unknown gesture id: ${id}`);
  return def;
}

/** Curl ranges: [min, max] per finger. null = don't care. */
type CurlTemplate = {
  thumb: [number, number] | null;
  index: [number, number] | null;
  middle: [number, number] | null;
  ring: [number, number] | null;
  pinky: [number, number] | null;
};

const STRAIGHT: [number, number] = [0, 0.35];
const CURLED: [number, number] = [0.65, 1];

const TEMPLATES: Record<string, CurlTemplate> = {
  "open-palm": {
    thumb: STRAIGHT,
    index: STRAIGHT,
    middle: STRAIGHT,
    ring: STRAIGHT,
    pinky: STRAIGHT,
  },
  fist: { thumb: CURLED, index: CURLED, middle: CURLED, ring: CURLED, pinky: CURLED },
  "thumbs-up": { thumb: STRAIGHT, index: CURLED, middle: CURLED, ring: CURLED, pinky: CURLED },
  peace: { thumb: CURLED, index: STRAIGHT, middle: STRAIGHT, ring: CURLED, pinky: CURLED },
  point: { thumb: CURLED, index: STRAIGHT, middle: CURLED, ring: CURLED, pinky: CURLED },
  "i-love-you": { thumb: STRAIGHT, index: STRAIGHT, middle: CURLED, ring: CURLED, pinky: STRAIGHT },
  "call-me": { thumb: STRAIGHT, index: CURLED, middle: CURLED, ring: CURLED, pinky: STRAIGHT },
  three: { thumb: STRAIGHT, index: STRAIGHT, middle: STRAIGHT, ring: CURLED, pinky: CURLED },
  four: { thumb: CURLED, index: STRAIGHT, middle: STRAIGHT, ring: STRAIGHT, pinky: STRAIGHT },
};

/**
 * Classify one frame of 21 hand landmarks. Returns null when the hand
 * fails sanity checks or doesn't match any known template.
 */
export function classifyLandmarks(lm: Vec3[] | null): RawPrediction | null {
  if (!lm || lm.length < 21) return null;

  // Reject garbage landmark sets (false hand detections on background).
  if (!handSanity(lm)) return null;

  const curls = {
    thumb: fingerCurl(lm, "thumb"),
    index: fingerCurl(lm, "index"),
    middle: fingerCurl(lm, "middle"),
    ring: fingerCurl(lm, "ring"),
    pinky: fingerCurl(lm, "pinky"),
  };

  // Special case: OK sign needs pinch distance check (curl alone is ambiguous).
  if (pinchDistance(lm) < 0.35) {
    const { middle, ring, pinky } = curls;
    if (middle < 0.5 && ring < 0.5 && pinky < 0.5) {
      return makePrediction("ok-sign", curls, 0.85);
    }
  }

  let bestId: string | null = null;
  let bestScore = 0;

  for (const [id, template] of Object.entries(TEMPLATES)) {
    const score = matchTemplate(curls, template);
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  // Require a decisive match — ambiguous poses return null instead of guessing.
  // The 0.8 threshold plus the veto rule (one wrong finger = no match) makes
  // false positives rare.
  if (!bestId || bestScore < 0.8) return null;

  return makePrediction(bestId, curls, bestScore);
}

function matchTemplate(curls: Record<string, number>, template: CurlTemplate): number {
  let total = 0;
  let count = 0;
  for (const [finger, range] of Object.entries(template)) {
    if (!range) continue;
    const curl = curls[finger]!;
    const [min, max] = range;
    // Score: 1.0 if inside range, decaying to 0 at 0.15 outside.
    // A finger completely outside its range (score 0) vetoes the template.
    let s: number;
    if (curl >= min && curl <= max) {
      s = 1;
    } else {
      const d = curl < min ? min - curl : curl - max;
      s = Math.max(0, 1 - d / 0.15);
    }
    if (s === 0) return 0; // Veto: one wrong finger kills the match.
    total += s;
    count++;
  }
  return count > 0 ? total / count : 0;
}

function makePrediction(id: string, curls: Record<string, number>, score: number): RawPrediction {
  // Convert curls back to binary states for the fingerStates field.
  const { states } = analyseFingersFromCurls(curls);
  const confidence = Math.round((0.6 + score * 0.4) * 100) / 100;
  return { gesture: byId.get(id)!, confidence, fingerStates: states };
}

function analyseFingersFromCurls(curls: Record<string, number>) {
  const states = {
    thumb: curls["thumb"]! < 0.5,
    index: curls["index"]! < 0.5,
    middle: curls["middle"]! < 0.5,
    ring: curls["ring"]! < 0.5,
    pinky: curls["pinky"]! < 0.5,
  };
  return { states };
}

// Re-export for tests that import from classifier.
export { analyseFingers };

/**
 * Map MediaPipe's neural-net gesture categories to our gesture definitions.
 * Returns null for "None", "Thumb_Down" (not in our vocabulary), or scores
 * below threshold — the pipeline then falls back to the rule-based classifier.
 */
const NEURAL_MAP: Record<string, string> = {
  Closed_Fist: "fist",
  Open_Palm: "open-palm",
  Pointing_Up: "point",
  Thumb_Up: "thumbs-up",
  Victory: "peace",
  ILoveYou: "i-love-you",
};

export function neuralToPrediction(
  name: MediaPipeGestureName,
  score: number,
  fingerStates?: RawPrediction["fingerStates"],
): RawPrediction | null {
  if (score < 0.5) return null;
  const id = NEURAL_MAP[name];
  if (!id) return null;
  const gesture = byId.get(id);
  if (!gesture) return null;
  return {
    gesture,
    confidence: Math.round(score * 100) / 100,
    fingerStates: fingerStates ?? {
      thumb: false,
      index: false,
      middle: false,
      ring: false,
      pinky: false,
    },
  };
}
