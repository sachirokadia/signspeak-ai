/**
 * types.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Gesture recognition domain types.
 *
 * Rules enforced by this file:
 *   • Type declarations only — no runtime code, no side effects.
 *   • No React imports. No DOM API references.
 *   • NormalizedLandmark is imported from the project's own handTracker.ts
 *     re-export, never directly from @mediapipe/tasks-vision, keeping the
 *     MediaPipe abstraction boundary intact throughout the codebase.
 *
 * Consumers of this file:
 *   src/services/gesture/gestureRecognizer.ts   (future)
 *   src/services/gesture/gestureVocabulary.ts   (future)
 *   src/services/gesture/gestureFilter.ts       (future)
 *   src/hooks/useGestureRecognition.ts           (future)
 */

import type { NormalizedLandmark } from "@/services/mediapipe/handTracker";

// ─── Lifecycle ────────────────────────────────────────────────────────────────

/**
 * GestureRecognizerStatus
 * Lifecycle states of the gesture recognition service, visible to hook and
 * UI consumers.
 *
 * idle    — recognition has not been started (camera is off / session not begun)
 * ready   — classifier and filter are initialised; processFrame() is accepting input
 * error   — unrecoverable initialisation failure; errorMessage is populated
 */
export type GestureRecognizerStatus = "idle" | "ready" | "error";

// ─── Vocabulary ───────────────────────────────────────────────────────────────

/**
 * VocabularyEntry
 * A single gesture definition in the active vocabulary.
 *
 * gestureId       — machine-readable stable identifier, e.g. "open_palm".
 *                   Used as a key for deduplication, debounce tracking, and
 *                   future Firebase custom-gesture records.
 * displayName     — human-readable gesture label shown in the UI, e.g. "Open Palm".
 * phrase          — the natural-language string emitted when this gesture is
 *                   confirmed, e.g. "Hello". Passed to speech synthesis.
 * minConfidence   — optional per-gesture confidence threshold override (0–1).
 *                   When absent, the global GestureFilterOptions.minConfidence
 *                   is used instead.
 */
export interface VocabularyEntry {
  readonly gestureId: string;
  readonly displayName: string;
  readonly phrase: string;
  readonly minConfidence?: number;
}

// ─── Classification ───────────────────────────────────────────────────────────

/**
 * GestureMatch
 * A candidate gesture produced by the classifier on a single video frame.
 * This is NOT a confirmed gesture — it may be below threshold, not yet held
 * for the required number of consecutive frames, or within the debounce window.
 *
 * gestureId     — matched vocabulary entry identifier.
 * phrase        — convenience copy of VocabularyEntry.phrase at match time.
 * confidence    — raw classifier score for this frame (0–1).
 * handIndex     — index into HandDetectionResult.landmarks[] (0 = first hand).
 * timestampMs   — DOMHighResTimeStamp of the source rAF frame.
 */
export interface GestureMatch {
  readonly gestureId: string;
  readonly phrase: string;
  readonly confidence: number;
  readonly handIndex: number;
  readonly timestampMs: number;
}

/**
 * ConfirmedGesture
 * A gesture that has passed all filter conditions (hold count + confidence
 * threshold + debounce interval). Safe to emit to the UI, append to history,
 * and pass to speech synthesis.
 *
 * id            — unique identifier (crypto.randomUUID()) for React key / DB record.
 * gestureId     — stable vocabulary identifier; used for deduplication.
 * phrase        — natural-language string ready for display and speech output.
 * confidence    — classifier score at the moment of confirmation.
 * handedness    — "Left" | "Right" from MediaPipe's perspective at confirmation time.
 * confirmedAt   — wall-clock Date when the gesture crossed the confirmation threshold.
 *                 Used as the `at` field when constructing a HistoryEntry.
 */
export interface ConfirmedGesture {
  readonly id: string;
  readonly gestureId: string;
  readonly phrase: string;
  readonly confidence: number;
  readonly handedness: string;
  readonly confirmedAt: Date;
}

// ─── Filtering ────────────────────────────────────────────────────────────────

/**
 * GestureFilterOptions
 * Configuration for the temporal filter that converts raw per-frame
 * GestureMatch candidates into confirmed gestures.
 *
 * holdFrames      — number of consecutive frames the same gestureId must appear
 *                   before it is confirmed. At 60 fps, 3 frames ≈ 50 ms hold.
 *                   Prevents single-frame false positives from triggering output.
 *                   @default 3
 *
 * debounceMs      — minimum time (ms) between two confirmed gestures of the same
 *                   gestureId. Prevents a held hand from flooding the history.
 *                   Different gestures are NOT debounced against each other.
 *                   @default 800
 *
 * minConfidence   — global minimum classifier score required for a frame to
 *                   increment the hold counter. Frames below this are treated
 *                   as null (no gesture detected).
 *                   Overridden per-gesture by VocabularyEntry.minConfidence.
 *                   @default 0.75
 */
export interface GestureFilterOptions {
  readonly holdFrames?: number;
  readonly debounceMs?: number;
  readonly minConfidence?: number;
}

// ─── Service interfaces ───────────────────────────────────────────────────────

/**
 * GestureClassifier
 * Contract for the classification engine.
 * The concrete implementation (rule-based geometry or ML model) lives in
 * gestureRecognizer.ts and is injected via createGestureClassifier().
 * Callers depend only on this interface — swapping implementations requires
 * no changes outside gestureRecognizer.ts.
 *
 * classify()
 *   Called synchronously inside the rAF loop (~60 fps).
 *   Must never throw — the rAF loop does not have a try/catch at this level.
 *   Must complete in < 2 ms to avoid dropping frames.
 *
 *   @param landmarks    21 NormalizedLandmark points for one detected hand,
 *                       sourced from HandDetectionResult.landmarks[handIndex].
 *   @param handedness   "Left" | "Right" string from MediaPipe handedness result.
 *                       May be used by position-sensitive gesture detectors.
 *   @param timestampMs  rAF timestamp of the current frame. Passed through to
 *                       GestureMatch so the filter can compute elapsed time.
 *   @returns            Best-matching GestureMatch if confidence ≥ any threshold,
 *                       or null when no gesture is recognised.
 */
export interface GestureClassifier {
  classify(
    landmarks: NormalizedLandmark[],
    handedness: string,
    timestampMs: number,
  ): GestureMatch | null;
}

/**
 * GestureFilter
 * Contract for the temporal filter that accumulates per-frame GestureMatch
 * candidates and emits ConfirmedGesture only when all conditions are met.
 *
 * process()
 *   Called once per rAF frame with the classifier's output (or null).
 *   Maintains internal hold-counter and debounce timer state.
 *   Must never throw.
 *
 *   @param match   Output of GestureClassifier.classify(), or null when no hand
 *                  is detected or classifier returned null.
 *   @param nowMs   Current time in milliseconds (performance.now() or rAF timestamp).
 *                  Passed explicitly so the filter is deterministic and testable.
 *   @returns       ConfirmedGesture when all conditions are satisfied, otherwise null.
 *
 * reset()
 *   Clears internal hold counter and debounce state.
 *   Called when the session stops or the camera is turned off.
 *   Idempotent — safe to call multiple times.
 */
export interface GestureFilter {
  process(match: GestureMatch | null, nowMs: number): ConfirmedGesture | null;
  reset(): void;
}

// ─── Aggregate state ──────────────────────────────────────────────────────────

/**
 * GestureRecognitionState
 * The complete observable state of the gesture recognition pipeline.
 * Returned by useGestureRecognition() as React state.
 *
 * All fields are plain primitives or plain objects — no refs, no class
 * instances, no functions. Safe to pass as React props, serialise to JSON,
 * or store in Firebase without transformation.
 *
 * status          — current lifecycle of the recognition service.
 * currentGesture  — the most recently confirmed gesture, or null when no
 *                   gesture has been confirmed since the session started
 *                   (or since the last reset).
 * errorMessage    — human-readable description when status === "error".
 *                   Empty string otherwise.
 */
export interface GestureRecognitionState {
  readonly status: GestureRecognizerStatus;
  readonly currentGesture: ConfirmedGesture | null;
  readonly errorMessage: string;
}
