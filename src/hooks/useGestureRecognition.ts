"use client";

/**
 * useGestureRecognition.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * React hook that bridges the gesture classifier and filter into the React
 * component tree.
 *
 * Responsibilities:
 *   • Create one shared GestureClassifier — stateless, used for all hands.
 *   • Create one GestureFilter per detected hand (keyed by hand index 0/1).
 *     This allows both hands to confirm gestures simultaneously and
 *     independently — neither hand blocks the other.
 *   • Expose processFrame(result) — stable callback, safe in the rAF hot path.
 *   • Update React state (currentGesture) only when a gesture is confirmed.
 *   • Enrich ConfirmedGesture.handedness from HandDetectionResult.
 *   • Call onGestureConfirmed for EACH confirmed hand per frame.
 *   • Reset all filters on cleanup.
 *
 * Two-hand behaviour:
 *   • Both hands are classified and filtered independently every frame.
 *   • If hand 0 confirms "wave" and hand 1 confirms "fist_nod" in the same
 *     frame, BOTH gestures are emitted (hand 0 first, hand 1 second).
 *   • currentGesture is updated to whichever hand confirmed last in that frame.
 *   • Single-hand behaviour is completely unchanged — no regression.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createGestureClassifier } from "@/services/gesture/gestureRecognizer";
import { createGestureFilter }     from "@/services/gesture/gestureFilter";
import type {
  ConfirmedGesture,
  GestureFilter,
  GestureFilterOptions,
  GestureRecognizerStatus,
} from "@/services/gesture/types";
import type { CreateGestureClassifierOptions } from "@/services/gesture/gestureRecognizer";
import type { HandDetectionResult }            from "@/services/mediapipe/handTracker";

// ─── Constants ─────────────────────────────────────────────────────────────────

/** Maximum number of simultaneous hands MediaPipe can return (matches MAX_HANDS). */
const MAX_TRACKED_HANDS = 2;

// ─── Public types ─────────────────────────────────────────────────────────────

export interface UseGestureRecognitionOptions {
  /**
   * When false processFrame is a no-op.
   * Wire to camera.cameraState.status === "live".
   * @default false
   */
  readonly enabled?: boolean;

  /** Forwarded to createGestureFilter() for all per-hand filters. */
  readonly filterOptions?: GestureFilterOptions;

  /** Forwarded to createGestureClassifier(). */
  readonly classifierOptions?: CreateGestureClassifierOptions;

  /**
   * Called synchronously once per confirmed gesture, per hand, per frame.
   * Runs inside the rAF loop — must be non-throwing and synchronous.
   */
  readonly onGestureConfirmed?: (gesture: ConfirmedGesture) => void;
}

export interface UseGestureRecognitionReturn {
  readonly status: GestureRecognizerStatus;
  /** The most recently confirmed gesture across all hands. */
  readonly currentGesture: ConfirmedGesture | null;
  readonly processFrame: (result: HandDetectionResult | null) => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGestureRecognition(
  options: UseGestureRecognitionOptions = {},
): UseGestureRecognitionReturn {
  const { enabled = false, filterOptions, classifierOptions, onGestureConfirmed } = options;

  const [status, setStatus]               = useState<GestureRecognizerStatus>("idle");
  const [currentGesture, setCurrentGesture] = useState<ConfirmedGesture | null>(null);

  // One shared stateless classifier.
  const classifierRef = useRef(createGestureClassifier(classifierOptions));

  // One filter per hand slot, lazily created as hands appear.
  // Index 0 = first hand, index 1 = second hand.
  const filtersRef = useRef<(GestureFilter | null)[]>(
    Array.from({ length: MAX_TRACKED_HANDS }, () => null),
  );

  /**
   * getOrCreateFilter — returns the filter for hand index i, creating it
   * with the current filterOptions if it does not yet exist.
   */
  function getOrCreateFilter(i: number): GestureFilter {
    let filter = filtersRef.current[i] ?? null;
    if (filter === null) {
      filter = createGestureFilter(filterOptions);
      filtersRef.current[i] = filter;
    }
    return filter;
  }

  /** Reset all per-hand filters. */
  function resetAllFilters(): void {
    for (const f of filtersRef.current) {
      f?.reset();
    }
  }

  // Stable ref for the callback so processFrame never needs to be recreated.
  const onConfirmedRef = useRef(onGestureConfirmed);
  useEffect(() => {
    onConfirmedRef.current = onGestureConfirmed;
  }, [onGestureConfirmed]);

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (enabled) {
      setStatus("ready");
    } else {
      setStatus("idle");
      resetAllFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    return () => {
      resetAllFilters();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── processFrame ──────────────────────────────────────────────────────────
  // Empty dep array — identity is stable. All reads via refs.

  const processFrame = useCallback(
    (result: HandDetectionResult | null): void => {
      if (!result || result.handCount === 0) return;

      const classifier = classifierRef.current;
      const nowMs      = result.timestampMs;

      // Process each detected hand independently.
      for (let i = 0; i < result.landmarks.length; i++) {
        const handLandmarks = result.landmarks[i];
        if (!handLandmarks) continue;

        const handednessLabel = result.handedness[i]?.label ?? "Unknown";

        // Classify this hand.
        const match = classifier.classify(handLandmarks, handednessLabel, nowMs);

        // Each hand has its own filter — no cross-hand interference.
        const filter = getOrCreateFilter(i);
        const confirmed = filter.process(match, nowMs);

        if (confirmed === null) continue;

        // Enrich handedness (filter sets it to "Unknown"; we have it here).
        const enriched: ConfirmedGesture = {
          ...confirmed,
          handedness: handednessLabel,
        };

        // Update React state — triggers a render for each confirmed gesture.
        // In the typical case (one hand) this is identical to the previous
        // behaviour. With two hands it may fire twice in one rAF tick; React
        // batches state updates inside the same synchronous callstack.
        setCurrentGesture(enriched);

        onConfirmedRef.current?.(enriched);
      }
    },
    [],
  );

  return { status, currentGesture, processFrame };
}
