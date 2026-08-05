/**
 * gestureRecognizer.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Rule-based gesture classifier using MediaPipe hand landmark geometry.
 *
 * Design principles:
 *   • Completely synchronous — safe to call in a 60 fps rAF loop.
 *   • Never throws — all detector functions are wrapped defensively.
 *   • Zero React, zero DOM, zero MediaPipe runtime dependency.
 *   • Each gesture has exactly one named detector function.
 *   • Detectors return a score in [0, 1]; 0 means "definitely not this gesture".
 *   • The classifier evaluates ALL detectors, picks the highest score, and
 *     compares it against the configured threshold.
 *
 * MediaPipe hand landmark indices (NormalizedLandmark[21]):
 *   0  Wrist
 *   1  Thumb CMC   2  Thumb MCP   3  Thumb IP    4  Thumb Tip
 *   5  Index MCP   6  Index PIP   7  Index DIP   8  Index Tip
 *   9  Middle MCP  10 Middle PIP  11 Middle DIP  12 Middle Tip
 *   13 Ring MCP    14 Ring PIP    15 Ring DIP    16 Ring Tip
 *   17 Pinky MCP   18 Pinky PIP   19 Pinky DIP   20 Pinky Tip
 *
 * Coordinate system:
 *   x: 0 (left edge of image) → 1 (right edge)
 *   y: 0 (top edge of image)  → 1 (bottom edge)
 *   z: depth relative to wrist; negative = closer to camera
 *   All values are normalised and scale-invariant.
 *
 * NOTE: "above" in image space means a SMALLER y value (closer to 0 = top).
 */

import type { NormalizedLandmark } from "@/services/mediapipe/handTracker";
import type { GestureClassifier, GestureMatch, VocabularyEntry } from "./types";
import { getVocabulary } from "./gestureVocabulary";

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * DEFAULT_CONFIDENCE_THRESHOLD
 * Global fallback minimum score for a gesture to be returned as a match.
 * Can be overridden per-instance via createGestureClassifier options,
 * and per-gesture via VocabularyEntry.minConfidence.
 */
const DEFAULT_CONFIDENCE_THRESHOLD = 0.65;

// ─── Landmark index constants ─────────────────────────────────────────────────

const WRIST        = 0;
const THUMB_CMC    = 1;
const THUMB_MCP    = 2;
// THUMB_IP     = 3  (unused by name but accessed by index)
const THUMB_TIP    = 4;
const INDEX_MCP    = 5;
// INDEX_PIP    = 6
// INDEX_DIP    = 7
const INDEX_TIP    = 8;
const MIDDLE_MCP   = 9;
// MIDDLE_PIP   = 10
// MIDDLE_DIP   = 11
const MIDDLE_TIP   = 12;
const RING_MCP     = 13;
// RING_PIP     = 14
// RING_DIP     = 15
const RING_TIP     = 16;
const PINKY_MCP    = 17;
// PINKY_PIP    = 18
// PINKY_DIP    = 19
const PINKY_TIP    = 20;

// ─── Geometry primitives ──────────────────────────────────────────────────────

/**
 * Safe accessor — returns the landmark at index, or a zero-value fallback.
 * Prevents detector functions from throwing on malformed landmark arrays.
 */
function lm(
  landmarks: NormalizedLandmark[],
  index: number,
): NormalizedLandmark {
  return landmarks[index] ?? { x: 0, y: 0, z: 0, visibility: 0 };
}

/**
 * 2-D Euclidean distance between two landmarks (x, y only).
 * Z is excluded: normalised depth is noisier and less reliable for heuristics.
 */
function dist2d(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * isFingerExtended
 * Returns true when a finger's tip is clearly above (smaller y) its MCP
 * knuckle in image space, indicating the finger is open/extended.
 * margin adds a small tolerance buffer to avoid false negatives near neutral.
 */
function isFingerExtended(
  landmarks: NormalizedLandmark[],
  tipIdx: number,
  mcpIdx: number,
  margin = 0.02,
): boolean {
  return lm(landmarks, tipIdx).y < lm(landmarks, mcpIdx).y - margin;
}

/**
 * isFingerCurled
 * Returns true when a finger's tip is clearly below (larger y) its MCP
 * knuckle, indicating the finger is bent/curled into a fist.
 */
function isFingerCurled(
  landmarks: NormalizedLandmark[],
  tipIdx: number,
  mcpIdx: number,
  margin = 0.01,
): boolean {
  return lm(landmarks, tipIdx).y > lm(landmarks, mcpIdx).y + margin;
}

/**
 * fingerExtendedScore
 * Continuous version of isFingerExtended — returns a 0–1 score based on how
 * far above the MCP the tip is. Used for smooth confidence blending.
 * scale controls the steepness of the sigmoid-like transition.
 */
function fingerExtendedScore(
  landmarks: NormalizedLandmark[],
  tipIdx: number,
  mcpIdx: number,
  scale = 10,
): number {
  const diff = lm(landmarks, mcpIdx).y - lm(landmarks, tipIdx).y; // positive = extended
  return Math.max(0, Math.min(1, 0.5 + diff * scale));
}

/**
 * fingerCurledScore
 * Continuous version of isFingerCurled — 0–1, higher means more curled.
 */
function fingerCurledScore(
  landmarks: NormalizedLandmark[],
  tipIdx: number,
  mcpIdx: number,
  scale = 10,
): number {
  const diff = lm(landmarks, tipIdx).y - lm(landmarks, mcpIdx).y; // positive = curled
  return Math.max(0, Math.min(1, 0.5 + diff * scale));
}

/**
 * palmWidth
 * Approximate palm width as the distance between index MCP and pinky MCP.
 * Used to normalise proximity scores so they are scale-invariant.
 */
function palmWidth(landmarks: NormalizedLandmark[]): number {
  const w = dist2d(lm(landmarks, INDEX_MCP), lm(landmarks, PINKY_MCP));
  return w > 0.001 ? w : 0.1; // guard against degenerate frames
}

// ─── Per-gesture detector functions ──────────────────────────────────────────
// Each returns a score in [0, 1].
// 0 = definitely not this gesture.
// 1 = perfect match.
// These are pure functions — no state, no side effects.

/**
 * detectOpenPalm
 * All four fingers extended + thumb somewhat extended + fingers spread.
 * "Hello"
 */
function detectOpenPalm(landmarks: NormalizedLandmark[]): number {
  const indexExt  = fingerExtendedScore(landmarks, INDEX_TIP,  INDEX_MCP);
  const middleExt = fingerExtendedScore(landmarks, MIDDLE_TIP, MIDDLE_MCP);
  const ringExt   = fingerExtendedScore(landmarks, RING_TIP,   RING_MCP);
  const pinkyExt  = fingerExtendedScore(landmarks, PINKY_TIP,  PINKY_MCP);
  const thumbExt  = fingerExtendedScore(landmarks, THUMB_TIP,  THUMB_MCP);

  // All five should be reasonably extended
  const allExtended = (indexExt + middleExt + ringExt + pinkyExt + thumbExt) / 5;

  // Fingers should be spread: index-to-pinky tip distance > half palm width
  const spread = dist2d(lm(landmarks, INDEX_TIP), lm(landmarks, PINKY_TIP));
  const pw = palmWidth(landmarks);
  const spreadScore = Math.min(1, spread / (pw * 1.2));

  return allExtended * 0.7 + spreadScore * 0.3;
}

/**
 * detectFistNod
 * All four fingers curled + thumb tucked (tip close to index MCP).
 * "Yes"
 */
function detectFistNod(landmarks: NormalizedLandmark[]): number {
  const indexCurl  = fingerCurledScore(landmarks, INDEX_TIP,  INDEX_MCP);
  const middleCurl = fingerCurledScore(landmarks, MIDDLE_TIP, MIDDLE_MCP);
  const ringCurl   = fingerCurledScore(landmarks, RING_TIP,   RING_MCP);
  const pinkyCurl  = fingerCurledScore(landmarks, PINKY_TIP,  PINKY_MCP);

  const allCurled = (indexCurl + middleCurl + ringCurl + pinkyCurl) / 4;

  // Thumb tip should be near index MCP (tucked over fist)
  const thumbDist   = dist2d(lm(landmarks, THUMB_TIP), lm(landmarks, INDEX_MCP));
  const pw          = palmWidth(landmarks);
  const thumbTucked = Math.max(0, 1 - thumbDist / (pw * 1.5));

  return allCurled * 0.7 + thumbTucked * 0.3;
}

/**
 * detectThumbOut
 * Thumb tip far laterally from wrist, all other fingers curled.
 * "I'm okay"
 */
function detectThumbOut(landmarks: NormalizedLandmark[]): number {
  const indexCurl  = fingerCurledScore(landmarks, INDEX_TIP,  INDEX_MCP);
  const middleCurl = fingerCurledScore(landmarks, MIDDLE_TIP, MIDDLE_MCP);
  const ringCurl   = fingerCurledScore(landmarks, RING_TIP,   RING_MCP);
  const pinkyCurl  = fingerCurledScore(landmarks, PINKY_TIP,  PINKY_MCP);

  const fingersCurled = (indexCurl + middleCurl + ringCurl + pinkyCurl) / 4;

  // Thumb should be extended: tip meaningfully above thumb CMC
  const thumbExtY = lm(landmarks, THUMB_CMC).y - lm(landmarks, THUMB_TIP).y;
  const thumbScore = Math.max(0, Math.min(1, 0.5 + thumbExtY * 8));

  // Thumb tip should also be laterally away from index MCP
  const thumbLateral = Math.abs(
    lm(landmarks, THUMB_TIP).x - lm(landmarks, INDEX_MCP).x,
  );
  const pw = palmWidth(landmarks);
  const lateralScore = Math.min(1, thumbLateral / (pw * 0.8));

  return fingersCurled * 0.5 + thumbScore * 0.3 + lateralScore * 0.2;
}

/**
 * detectPointForward
 * Index finger extended, other three fingers curled, thumb relaxed.
 * "That one"
 */
function detectPointForward(landmarks: NormalizedLandmark[]): number {
  const indexExt   = fingerExtendedScore(landmarks, INDEX_TIP,  INDEX_MCP);
  const middleCurl = fingerCurledScore(landmarks, MIDDLE_TIP, MIDDLE_MCP);
  const ringCurl   = fingerCurledScore(landmarks, RING_TIP,   RING_MCP);
  const pinkyCurl  = fingerCurledScore(landmarks, PINKY_TIP,  PINKY_MCP);

  // Index should be clearly extended, others clearly curled
  const selectivity = (middleCurl + ringCurl + pinkyCurl) / 3;

  return indexExt * 0.5 + selectivity * 0.5;
}

/**
 * detectWave
 * All fingers extended, hand roughly horizontal (wrist and middle MCP
 * at similar y values), spread fingers.
 * "Goodbye"
 */
function detectWave(landmarks: NormalizedLandmark[]): number {
  const indexExt  = fingerExtendedScore(landmarks, INDEX_TIP,  INDEX_MCP);
  const middleExt = fingerExtendedScore(landmarks, MIDDLE_TIP, MIDDLE_MCP);
  const ringExt   = fingerExtendedScore(landmarks, RING_TIP,   RING_MCP);
  const pinkyExt  = fingerExtendedScore(landmarks, PINKY_TIP,  PINKY_MCP);

  const allExtended = (indexExt + middleExt + ringExt + pinkyExt) / 4;

  // Wrist-to-middle-MCP vector: for a raised open hand (wave) the hand
  // points roughly upward, meaning middle MCP is clearly above wrist.
  const wristToMidY = lm(landmarks, WRIST).y - lm(landmarks, MIDDLE_MCP).y;
  const verticalScore = Math.max(0, Math.min(1, 0.5 + wristToMidY * 6));

  // Fingers spread (same as open palm but without thumb requirement)
  const spread = dist2d(lm(landmarks, INDEX_TIP), lm(landmarks, PINKY_TIP));
  const pw = palmWidth(landmarks);
  const spreadScore = Math.min(1, spread / (pw * 1.0));

  // Wave differs from open_palm by having a more vertical hand orientation.
  // Both detectors will fire; wave scores higher when the hand is more upright.
  return allExtended * 0.5 + verticalScore * 0.3 + spreadScore * 0.2;
}

/**
 * detectPinchDraw
 * Thumb tip and index tip very close together; other fingers loosely extended.
 * "How are you?"
 */
function detectPinchDraw(landmarks: NormalizedLandmark[]): number {
  const pinchDist = dist2d(lm(landmarks, THUMB_TIP), lm(landmarks, INDEX_TIP));
  const pw        = palmWidth(landmarks);

  // Close pinch: tips within 25% of palm width
  const pinchScore = Math.max(0, 1 - pinchDist / (pw * 0.25));

  // Other fingers should be at least somewhat open (not fully fisted)
  const middleExt = fingerExtendedScore(landmarks, MIDDLE_TIP, MIDDLE_MCP, 5);
  const ringExt   = fingerExtendedScore(landmarks, RING_TIP,   RING_MCP,   5);

  return pinchScore * 0.6 + (middleExt + ringExt) / 2 * 0.4;
}

/**
 * detectFlatHandChin
 * All fingers extended AND palm is held approximately horizontally
 * (wrist and middle MCP at similar y, hand not pointing straight up).
 * "Thank you"
 */
function detectFlatHandChin(landmarks: NormalizedLandmark[]): number {
  const indexExt  = fingerExtendedScore(landmarks, INDEX_TIP,  INDEX_MCP);
  const middleExt = fingerExtendedScore(landmarks, MIDDLE_TIP, MIDDLE_MCP);
  const ringExt   = fingerExtendedScore(landmarks, RING_TIP,   RING_MCP);
  const pinkyExt  = fingerExtendedScore(landmarks, PINKY_TIP,  PINKY_MCP);
  const thumbExt  = fingerExtendedScore(landmarks, THUMB_TIP,  THUMB_MCP);

  const allExtended = (indexExt + middleExt + ringExt + pinkyExt + thumbExt) / 5;

  // For a flat horizontal hand the wrist-to-middle-MCP vector points mostly
  // sideways, so the y difference is small.
  const wristToMidY = Math.abs(
    lm(landmarks, WRIST).y - lm(landmarks, MIDDLE_MCP).y,
  );
  // Small y diff → score closer to 1 (horizontal); large y diff → closer to 0
  const horizontalScore = Math.max(0, 1 - wristToMidY * 6);

  return allExtended * 0.6 + horizontalScore * 0.4;
}

/**
 * detectIndexMiddleTap
 * Index and middle fingers extended (V shape), ring and pinky curled.
 * "Water, please"
 */
function detectIndexMiddleTap(landmarks: NormalizedLandmark[]): number {
  const indexExt   = fingerExtendedScore(landmarks, INDEX_TIP,  INDEX_MCP);
  const middleExt  = fingerExtendedScore(landmarks, MIDDLE_TIP, MIDDLE_MCP);
  const ringCurl   = fingerCurledScore(landmarks, RING_TIP,   RING_MCP);
  const pinkyCurl  = fingerCurledScore(landmarks, PINKY_TIP,  PINKY_MCP);

  return (indexExt + middleExt) / 2 * 0.5 + (ringCurl + pinkyCurl) / 2 * 0.5;
}

/**
 * detectTwoHandsRise
 * Single-hand approximation: all fingers extended AND palm facing upward
 * (all finger tips above wrist with a large y gap). This is inherently a
 * two-handed gesture; the single-hand score is intentionally capped at 0.75
 * so it doesn't outcompete clearer single-hand gestures.
 * "I need help"
 */
function detectTwoHandsRise(landmarks: NormalizedLandmark[]): number {
  const indexExt  = fingerExtendedScore(landmarks, INDEX_TIP,  INDEX_MCP);
  const middleExt = fingerExtendedScore(landmarks, MIDDLE_TIP, MIDDLE_MCP);
  const ringExt   = fingerExtendedScore(landmarks, RING_TIP,   RING_MCP);
  const pinkyExt  = fingerExtendedScore(landmarks, PINKY_TIP,  PINKY_MCP);

  const allExtended = (indexExt + middleExt + ringExt + pinkyExt) / 4;

  // Palm rising: wrist significantly below middle MCP (wrist.y > middle_mcp.y)
  const risingY = lm(landmarks, WRIST).y - lm(landmarks, MIDDLE_MCP).y;
  const risingScore = Math.max(0, Math.min(1, 0.5 + risingY * 5));

  // Cap at 0.75 — this gesture requires two hands for full intent
  return Math.min(0.75, allExtended * 0.5 + risingScore * 0.5);
}

/**
 * detectCuppedHand
 * All fingers moderately curled (not fully fisted, not fully extended).
 * Approximated as each finger tip between MCP and fully extended.
 * "Can you repeat that?"
 */
function detectCuppedHand(landmarks: NormalizedLandmark[]): number {
  // For a cupped hand, tips are above the MCP (like open palm) but much less so.
  // We target a mild extension: tip.y is slightly above MCP.y but not as much
  // as a fully extended finger.

  function mildExtensionScore(tipIdx: number, mcpIdx: number): number {
    const tipY = lm(landmarks, tipIdx).y;
    const mcpY = lm(landmarks, mcpIdx).y;
    const diff  = mcpY - tipY; // positive = extended
    // Peak score when diff ≈ 0.04 (slightly extended), drops for fully extended
    // or fully curled. Modelled as a bell around diff=0.04, width ~0.05.
    const target = 0.04;
    const width  = 0.05;
    return Math.exp(-Math.pow((diff - target) / width, 2));
  }

  const s1 = mildExtensionScore(INDEX_TIP,  INDEX_MCP);
  const s2 = mildExtensionScore(MIDDLE_TIP, MIDDLE_MCP);
  const s3 = mildExtensionScore(RING_TIP,   RING_MCP);
  const s4 = mildExtensionScore(PINKY_TIP,  PINKY_MCP);

  return (s1 + s2 + s3 + s4) / 4;
}

// ─── Detector registry ────────────────────────────────────────────────────────

/**
 * GestureDetector
 * Associates a gestureId with its scoring function.
 * The registry is a plain array — ordered from most to least discriminative
 * to provide a natural early-exit priority hint to readers (the actual
 * iteration always scores all detectors).
 */
interface GestureDetector {
  readonly gestureId: string;
  readonly detect: (landmarks: NormalizedLandmark[]) => number;
}

const DETECTORS: readonly GestureDetector[] = [
  { gestureId: "open_palm",         detect: detectOpenPalm       },
  { gestureId: "fist_nod",          detect: detectFistNod        },
  { gestureId: "thumb_out",         detect: detectThumbOut       },
  { gestureId: "point_forward",     detect: detectPointForward   },
  { gestureId: "wave",              detect: detectWave           },
  { gestureId: "pinch_draw",        detect: detectPinchDraw      },
  { gestureId: "flat_hand_chin",    detect: detectFlatHandChin   },
  { gestureId: "index_middle_tap",  detect: detectIndexMiddleTap },
  { gestureId: "two_hands_rise",    detect: detectTwoHandsRise   },
  { gestureId: "cupped_hand",       detect: detectCuppedHand     },
];

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * CreateGestureClassifierOptions
 * Optional overrides for the classifier instance.
 */
export interface CreateGestureClassifierOptions {
  /**
   * Minimum score for a gesture to be returned as a GestureMatch.
   * Per-gesture VocabularyEntry.minConfidence takes precedence when set.
   * @default DEFAULT_CONFIDENCE_THRESHOLD (0.65)
   */
  readonly confidenceThreshold?: number;
  /**
   * Vocabulary to use for phrase lookup and per-gesture threshold overrides.
   * Defaults to the active vocabulary from gestureVocabulary.getVocabulary().
   * Pass a custom array in tests to isolate classifier behaviour.
   */
  readonly vocabulary?: readonly VocabularyEntry[];
}

/**
 * createGestureClassifier
 * Returns a GestureClassifier that evaluates all 10 built-in gesture detectors
 * on each call to classify().
 *
 * Usage:
 *   const classifier = createGestureClassifier();
 *   const match = classifier.classify(landmarks, "Right", timestamp);
 *
 * The returned classifier object is stateless — it is safe to call from
 * multiple places and to reuse across sessions without re-creating it.
 *
 * @param options  Optional confidence threshold and vocabulary overrides.
 */
export function createGestureClassifier(
  options: CreateGestureClassifierOptions = {},
): GestureClassifier {
  const {
    confidenceThreshold = DEFAULT_CONFIDENCE_THRESHOLD,
    vocabulary = getVocabulary(),
  } = options;

  // Pre-build a Map for O(1) phrase and per-gesture threshold lookup.
  const vocabMap = new Map<string, VocabularyEntry>(
    vocabulary.map((e) => [e.gestureId, e]),
  );

  return {
    classify(
      landmarks: NormalizedLandmark[],
      _handedness: string,
      timestampMs: number,
    ): GestureMatch | null {
      // Guard: we need at least 21 landmarks for meaningful geometry.
      // Return null immediately to avoid undefined-access errors in detectors.
      if (landmarks.length < 21) return null;

      let bestGestureId = "";
      let bestScore     = 0;

      // Evaluate every detector. All detectors always run — this guarantees
      // the true highest-scoring gesture is always selected regardless of
      // array ordering, and prevents a fast early-exit from masking ties.
      for (const detector of DETECTORS) {
        let score = 0;
        try {
          score = detector.detect(landmarks);
        } catch {
          // Defensive: a malformed landmark frame must not crash the rAF loop.
          score = 0;
        }

        if (score > bestScore) {
          bestScore     = score;
          bestGestureId = detector.gestureId;
        }
      }

      if (bestGestureId === "") return null;

      // Look up the vocabulary entry for phrase and per-gesture threshold.
      const entry     = vocabMap.get(bestGestureId);
      const threshold = entry?.minConfidence ?? confidenceThreshold;

      if (bestScore < threshold) return null;

      return {
        gestureId:   bestGestureId,
        phrase:      entry?.phrase ?? bestGestureId,
        confidence:  bestScore,
        handIndex:   0, // classify() operates on one hand's landmarks at a time
        timestampMs,
      };
    },
  };
}
