"use client";

/**
 * useGestureRecognition.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * React hook that bridges the gesture classifier and filter into the React
 * component tree.
 *
 * Responsibilities:
 *   • Create one GestureClassifier (via createGestureClassifier) — stateless,
 *     stored in a ref so it is constructed once per hook mount.
 *   • Create one GestureFilter (via createGestureFilter) — stateful,
 *     stored in a ref for the same reason.
 *   • Expose processFrame(result) — a stable callback safe to call from the
 *     rAF hot path inside CameraCard.handleFrame without triggering renders.
 *   • Update React state (currentGesture) only when the filter confirms a
 *     gesture, keeping renders at gesture-change frequency (~1–2 Hz), not
 *     frame rate (60 Hz).
 *   • Enrich ConfirmedGesture.handedness from HandDetectionResult.handedness[]
 *     (the filter sets it to "Unknown" because GestureMatch does not carry it).
 *   • Call onGestureConfirmed callback synchronously when a gesture is confirmed.
 *   • Reset the filter on cleanup (enabled → false or unmount).
 *
 * What this hook does NOT do:
 *   ❌ MediaPipe / WASM — owned by handTracker.ts + useHandTracking.ts
 *   ❌ requestAnimationFrame — owned by useHandTracking.ts
 *   ❌ Canvas drawing — owned by HandOverlay.tsx
 *   ❌ DOM access
 *   ❌ Timers or intervals
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createGestureClassifier } from "@/services/gesture/gestureRecognizer";
import { createGestureFilter }     from "@/services/gesture/gestureFilter";
import type {
  ConfirmedGesture,
  GestureFilterOptions,
  GestureRecognizerStatus,
} from "@/services/gesture/types";
import type { CreateGestureClassifierOptions } from "@/services/gesture/gestureRecognizer";
import type { HandDetectionResult }            from "@/services/mediapipe/handTracker";

// ─── Public types ─────────────────────────────────────────────────────────────

export interface UseGestureRecognitionOptions {
  /**
   * When false the classifier and filter are still held in refs but
   * processFrame becomes a no-op. Wire to camera.cameraState.status === "live".
   * @default false
   */
  readonly enabled?: boolean;

  /**
   * Optional overrides forwarded to createGestureFilter().
   * Memoize if passing an object literal.
   */
  readonly filterOptions?: GestureFilterOptions;

  /**
   * Optional overrides forwarded to createGestureClassifier().
   * Memoize if passing an object literal.
   */
  readonly classifierOptions?: CreateGestureClassifierOptions;

  /**
   * Called synchronously when the filter confirms a gesture.
   * Runs inside the rAF loop — must be non-throwing and synchronous.
   * Use this to update history, trigger speech, etc. without going through
   * React state.
   */
  readonly onGestureConfirmed?: (gesture: ConfirmedGesture) => void;
}

export interface UseGestureRecognitionReturn {
  /**
   * Lifecycle status of the recognition pipeline.
   * "idle"  — enabled is false.
   * "ready" — enabled is true and the pipeline is processing frames.
   * "error" — reserved for future classifier init failures.
   */
  readonly status: GestureRecognizerStatus;

  /**
   * The most recently confirmed gesture, or null before the first confirmation.
   * Updated via React state — safe to read in render.
   */
  readonly currentGesture: ConfirmedGesture | null;

  /**
   * Call this from the rAF hot path (e.g. CameraCard.handleFrame) with each
   * HandDetectionResult. It is a stable useCallback reference — its identity
   * never changes, so passing it as a prop or callback dep is safe.
   *
   * Behaviour:
   *   • Ignores null results and frames with handCount === 0.
   *   • Classifies each detected hand independently.
   *   • Passes the highest-confidence match to the filter.
   *   • If the filter confirms a gesture, updates currentGesture and calls
   *     onGestureConfirmed.
   *   • Never throws.
   */
  readonly processFrame: (result: HandDetectionResult | null) => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGestureRecognition(
  options: UseGestureRecognitionOptions = {},
): UseGestureRecognitionReturn {
  const {
    enabled = false,
    filterOptions,
    classifierOptions,
    onGestureConfirmed,
  } = options;

  // ── React state ──────────────────────────────────────────────────────────
  // Updated only on confirmed gestures — not on every frame.

  const [status, setStatus] = useState<GestureRecognizerStatus>("idle");
  const [currentGesture, setCurrentGesture] = useState<ConfirmedGesture | null>(null);

  // ── Service refs ─────────────────────────────────────────────────────────
  // Classifier and filter are created once and held for the lifetime of the
  // hook. They are NOT recreated when filterOptions / classifierOptions change
  // (options are captured at creation time). If reconfiguration is needed, the
  // caller should unmount and remount the consuming component.

  const classifierRef = useRef(createGestureClassifier(classifierOptions));
  const filterRef     = useRef(createGestureFilter(filterOptions));

  // ── Stable ref for onGestureConfirmed ────────────────────────────────────
  // Stored in a ref so processFrame (a useCallback with empty deps) always
  // calls the latest version without being recreated when the prop changes.

  const onConfirmedRef = useRef(onGestureConfirmed);
  useEffect(() => {
    onConfirmedRef.current = onGestureConfirmed;
  }, [onGestureConfirmed]);

  // ── Lifecycle effect — sync status, reset on disable ─────────────────────

  useEffect(() => {
    if (enabled) {
      setStatus("ready");
    } else {
      setStatus("idle");
      // Reset the filter so hold counters and debounce records don't carry
      // over from a previous session.
      filterRef.current.reset();
    }
  }, [enabled]);

  // Cleanup on unmount: reset filter state.
  useEffect(() => {
    return () => {
      filterRef.current.reset();
    };
  }, []);

  // ── processFrame ─────────────────────────────────────────────────────────
  // Stable callback — empty dep array means its identity is fixed for the
  // lifetime of the hook. All dynamic values are read via refs.

  const processFrame = useCallback(
    (result: HandDetectionResult | null): void => {
      // Ignore null results and frames with no detected hands.
      if (!result || result.handCount === 0) return;

      const classifier = classifierRef.current;
      const filter     = filterRef.current;
      const nowMs      = result.timestampMs;

      // ── Classify each detected hand ───────────────────────────────────────
      // We call the classifier once per hand and collect the best match across
      // all hands in this frame. Using the per-hand handedness string lets
      // position-sensitive detectors make better decisions.
      let bestMatch = null as ReturnType<typeof classifier.classify>;

      for (let i = 0; i < result.landmarks.length; i++) {
        const handLandmarks = result.landmarks[i];
        if (!handLandmarks) continue;

        const handednessLabel = result.handedness[i]?.label ?? "Unknown";

        const match = classifier.classify(handLandmarks, handednessLabel, nowMs);

        // Keep the highest-confidence match across hands.
        if (
          match !== null &&
          (bestMatch === null || match.confidence > bestMatch.confidence)
        ) {
          bestMatch = { ...match, handIndex: i };
        }
      }

      // ── Feed best match into the filter ───────────────────────────────────
      const confirmed = filter.process(bestMatch, nowMs);

      if (confirmed === null) return;

      // ── Enrich handedness ─────────────────────────────────────────────────
      // The filter sets handedness to "Unknown" because GestureMatch does not
      // carry it. We have the information here from HandDetectionResult, so
      // we replace it before emitting.
      const handIdx         = bestMatch?.handIndex ?? 0;
      const enrichedHandedness = result.handedness[handIdx]?.label ?? "Unknown";

      const enriched: ConfirmedGesture = {
        ...confirmed,
        handedness: enrichedHandedness,
      };

      // ── Update React state (one render per confirmed gesture) ─────────────
      setCurrentGesture(enriched);

      // ── Notify caller via callback (outside React render cycle) ──────────
      onConfirmedRef.current?.(enriched);
    },
    // Empty deps: processFrame identity is stable for the hook's lifetime.
    // All state reads go through refs (classifierRef, filterRef, onConfirmedRef).
    [],
  );

  return { status, currentGesture, processFrame };
}
