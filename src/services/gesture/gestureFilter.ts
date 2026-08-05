/**
 * gestureFilter.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Temporal filter that converts raw per-frame GestureMatch candidates from
 * the classifier into stable, de-bounced ConfirmedGesture events.
 *
 * Design principles:
 *   • All state is encapsulated inside the returned GestureFilter object.
 *   • Fully synchronous — safe to call in a 60 fps rAF loop.
 *   • Never throws — all branches are guarded defensively.
 *   • Zero React, zero DOM dependencies.
 *   • nowMs is accepted as a parameter so the filter is deterministic
 *     and fully testable without mocking Date or performance.now().
 *
 * Three conditions must ALL be satisfied before a gesture is confirmed:
 *   1. Confidence ≥ minConfidence (per-frame gate).
 *   2. Same gestureId must appear for holdFrames consecutive frames.
 *   3. The same gestureId must not have been confirmed within debounceMs.
 *
 * Note on handedness:
 *   GestureMatch does not carry handedness — that field lives one level up
 *   in HandDetectionResult.handedness[]. The filter therefore sets
 *   ConfirmedGesture.handedness to "Unknown". The future useGestureRecognition
 *   hook will enrich this value from the HandDetectionResult before emitting
 *   the gesture to the dashboard. This keeps the filter pure and independent
 *   of the detection layer.
 */

import type {
  ConfirmedGesture,
  GestureFilter,
  GestureFilterOptions,
  GestureMatch,
} from "./types";

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_HOLD_FRAMES    = 3;
const DEFAULT_DEBOUNCE_MS    = 800;
const DEFAULT_MIN_CONFIDENCE = 0.75;

// ─── Internal state shape ────────────────────────────────────────────────────

/**
 * FilterState holds all mutable state for one filter instance.
 * Kept as a plain object rather than class fields so the shape is
 * transparent and easy to verify in reset().
 */
interface FilterState {
  /**
   * The gestureId currently accumulating consecutive frame hits.
   * null when no qualifying gesture appeared in the last frame.
   */
  pendingId: string | null;

  /**
   * Running phrase for the pending gesture — captured from the first
   * qualifying match so it stays consistent across the hold window.
   */
  pendingPhrase: string;

  /**
   * Running max confidence seen during the current hold window.
   * Using the max rather than the last frame's score gives a more
   * representative confidence value for the ConfirmedGesture.
   */
  pendingMaxConfidence: number;

  /**
   * How many consecutive qualifying frames the current pendingId has
   * appeared in. Increments on each qualifying match, resets to 0
   * when the gestureId changes or a null / low-confidence frame arrives.
   */
  holdCount: number;

  /**
   * Per-gestureId last-confirmation timestamps (ms).
   * Key: gestureId  Value: the nowMs value passed to process() when that
   * gesture was last confirmed.
   * Different gestureIds are tracked independently — confirming "open_palm"
   * does not debounce "fist_nod".
   */
  lastConfirmedAt: Map<string, number>;
}

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * createGestureFilter
 * Returns a stateful GestureFilter that implements hold-frame accumulation
 * and per-gesture debounce.
 *
 * Usage:
 *   const filter = createGestureFilter({ holdFrames: 4, debounceMs: 1000 });
 *   // inside rAF loop:
 *   const confirmed = filter.process(classifierOutput, performance.now());
 *   if (confirmed) { ... }
 *
 * @param options  Optional overrides for holdFrames, debounceMs, minConfidence.
 */
export function createGestureFilter(
  options: GestureFilterOptions = {},
): GestureFilter {
  const holdFrames    = options.holdFrames    ?? DEFAULT_HOLD_FRAMES;
  const debounceMs    = options.debounceMs    ?? DEFAULT_DEBOUNCE_MS;
  const minConfidence = options.minConfidence ?? DEFAULT_MIN_CONFIDENCE;

  // ── Internal state ────────────────────────────────────────────────────────

  const state: FilterState = {
    pendingId:           null,
    pendingPhrase:       "",
    pendingMaxConfidence: 0,
    holdCount:           0,
    lastConfirmedAt:     new Map(),
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Reset the pending-gesture accumulator without touching debounce records. */
  function clearPending(): void {
    state.pendingId           = null;
    state.pendingPhrase       = "";
    state.pendingMaxConfidence = 0;
    state.holdCount           = 0;
  }

  // ── GestureFilter implementation ──────────────────────────────────────────

  return {
    /**
     * process
     * Feed one frame's classifier output into the filter.
     *
     * Decision tree:
     *
     *   match is null
     *     → clearPending(), return null
     *
     *   match.confidence < minConfidence
     *     → clearPending(), return null          (low-confidence frame)
     *
     *   match.gestureId ≠ pendingId
     *     → clearPending(), start new accumulation window, return null
     *
     *   match.gestureId === pendingId
     *     → increment holdCount
     *     → if holdCount < holdFrames: return null   (still building hold)
     *     → holdCount === holdFrames (just crossed threshold):
     *         check debounce:
     *           if within debounceMs: return null     (too soon to re-confirm)
     *           else: record timestamp, clearPending, return ConfirmedGesture
     */
    process(match: GestureMatch | null, nowMs: number): ConfirmedGesture | null {
      try {
        // ── Gate 1: null match — no gesture detected this frame ───────────
        if (match === null) {
          clearPending();
          return null;
        }

        // ── Gate 2: confidence below threshold ────────────────────────────
        if (match.confidence < minConfidence) {
          clearPending();
          return null;
        }

        // ── Gate 3: gestureId continuity ──────────────────────────────────
        // If the gesture changed, restart the accumulation window from
        // scratch with the new gesture (frame 1 of its hold window).
        if (match.gestureId !== state.pendingId) {
          clearPending();
          state.pendingId           = match.gestureId;
          state.pendingPhrase       = match.phrase;
          state.pendingMaxConfidence = match.confidence;
          state.holdCount           = 1;
          return null;
        }

        // ── Same gesture as last frame: accumulate ────────────────────────
        state.holdCount           += 1;
        state.pendingMaxConfidence = Math.max(
          state.pendingMaxConfidence,
          match.confidence,
        );

        // Still building up to the required hold length.
        if (state.holdCount < holdFrames) {
          return null;
        }

        // ── Hold threshold reached — check debounce ───────────────────────
        // We check on exactly holdFrames and every subsequent frame while the
        // same gesture is still being held. This lets the filter re-fire if
        // the user re-makes the same gesture after the debounce window has
        // passed without them needing to drop to zero frames first.
        const lastAt = state.lastConfirmedAt.get(match.gestureId) ?? 0;
        if (nowMs - lastAt < debounceMs) {
          // Still within the debounce window — do not re-confirm.
          return null;
        }

        // ── All conditions satisfied: emit ConfirmedGesture ───────────────
        const confirmed: ConfirmedGesture = {
          // crypto.randomUUID is available in all modern browsers and in the
          // Node.js runtime used during SSR. It produces a v4 UUID string.
          id:          crypto.randomUUID(),
          gestureId:   match.gestureId,
          phrase:      state.pendingPhrase,
          confidence:  state.pendingMaxConfidence,
          // Handedness is not available at the filter level (GestureMatch does
          // not carry it). The future useGestureRecognition hook will enrich
          // this field from HandDetectionResult.handedness[] before emitting.
          handedness:  "Unknown",
          confirmedAt: new Date(nowMs),
        };

        // Record the confirmation time for this gestureId's debounce window.
        state.lastConfirmedAt.set(match.gestureId, nowMs);

        // Clear the hold accumulator so the same gesture requires a fresh
        // holdFrames window before it can be confirmed again.
        clearPending();

        return confirmed;
      } catch {
        // Defensive: no error condition in the logic above should ever throw,
        // but guard the rAF loop against any unforeseen edge case.
        clearPending();
        return null;
      }
    },

    /**
     * reset
     * Clears all internal state: hold accumulator AND all debounce records.
     * Call when the camera session stops so the next session starts fresh.
     * Idempotent — safe to call multiple times.
     */
    reset(): void {
      clearPending();
      state.lastConfirmedAt.clear();
    },
  };
}
