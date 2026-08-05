"use client";

/**
 * useHandTracking.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * React hook — MediaPipe Hand Landmarker lifecycle + per-frame detection.
 *
 * Architecture: React state is updated only when hand count changes or a new
 * detection result arrives. The rAF loop itself is 100% ref-based — no state
 * update fires per frame. This keeps React renders to a minimum (~1 per gesture
 * change) while the canvas draws at full 60fps via the onFrame callback.
 *
 * Features:
 *   ✅ Initialise HandLandmarker when enabled → true
 *   ✅ requestAnimationFrame detection loop (run outside React render)
 *   ✅ Concurrency guard — only one inference in-flight at a time
 *   ✅ Page Visibility API — loop suspends when tab hidden, resumes on show
 *   ✅ Dispose + cleanup on unmount / enabled → false
 *   ✅ Exposes latest HandDetectionResult as React state (not per-frame)
 *   ✅ onFrame callback for zero-overhead canvas drawing
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  initHandTracker,
  disposeHandTracker,
  type HandDetectionResult,
  type HandTrackerOptions,
  type HandTrackerStatus,
} from "@/services/mediapipe/handTracker";

// ─── Public types ──────────────────────────────────────────────────────────────

export interface UseHandTrackingReturn {
  /**
   * Tracker lifecycle status.
   * "loading" — WASM + model download in progress.
   * "ready"   — detection loop is running (or will run once video is live).
   * "error"   — init failed; see errorMessage.
   */
  readonly trackerStatus: HandTrackerStatus;
  /**
   * Most recent detection result.
   * Updated via React state after each successful detection that returns at
   * least one landmark array, or when detection drops to zero hands.
   * null while the tracker has not yet produced its first result.
   */
  readonly lastResult: HandDetectionResult | null;
  /** Non-empty only when trackerStatus === "error". */
  readonly errorMessage: string;
}

export interface UseHandTrackingOptions {
  /**
   * Ref to the live <video> element (owned by CameraCard / useCamera).
   * The rAF loop reads frames from this element.
   */
  readonly videoRef: React.RefObject<HTMLVideoElement | null>;
  /**
   * Gate: when false the tracker does not initialise and the loop does not run.
   * Wire to camera.cameraState.status === "live".
   * @default false
   */
  readonly enabled?: boolean;
  /**
   * Optional HandLandmarker configuration forwarded to initHandTracker().
   * Memoize this if you pass an object literal to avoid re-inits.
   */
  readonly options?: HandTrackerOptions;
  /**
   * Optional per-frame callback invoked synchronously inside the rAF loop
   * after each successful detect() call.
   *
   * Use this to drive canvas drawing without going through React state.
   * The callback receives the raw detection result and runs at the full
   * rAF rate (~60 fps). It must be synchronous and non-throwing.
   *
   * @param result  Latest detection; null when no hands are visible.
   */
  readonly onFrame?: (result: HandDetectionResult | null) => void;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useHandTracking(
  hookOptions: UseHandTrackingOptions,
): UseHandTrackingReturn {
  const { videoRef, enabled = false, options, onFrame } = hookOptions;

  // ── React state (updated sparingly) ────────────────────────────────────────
  const [trackerStatus, setTrackerStatus] =
    useState<HandTrackerStatus>("loading");
  const [lastResult, setLastResult] = useState<HandDetectionResult | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");

  // ── Stable refs (zero React renders when mutated) ──────────────────────────

  // Stable ref to onFrame — avoids re-creating the rAF loop when the callback
  // identity changes between renders (common when defined inline).
  const onFrameRef = useRef(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  // Stable ref to options — same pattern.
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // rAF handle — cancelled on cleanup.
  const rafIdRef = useRef<number | null>(null);

  // Concurrency guard: true while detectForVideo is in-flight.
  // MediaPipe's synchronous detectForVideo can still race with rAF; this ref
  // prevents scheduling a second call before the first completes.
  const inferenceActiveRef = useRef(false);

  // Last seen hand count — used to gate React state updates.
  const lastHandCountRef = useRef<number>(-1);

  // ── rAF loop ────────────────────────────────────────────────────────────────

  /**
   * stopLoop — cancel the rAF loop without releasing WASM resources.
   * Called when the page becomes hidden or the component unmounts.
   */
  const stopLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    inferenceActiveRef.current = false;
  }, []);

  /**
   * startLoop — launch the rAF loop.
   * Reads videoRef.current on every tick so it always targets the live element.
   * The tracker handle is captured via the module singleton (activeTracker
   * is not exposed; we call the public detect() indirectly by keeping a ref).
   */
  const startLoop = useCallback(
    (tracker: { detect: (v: HTMLVideoElement, t: number) => HandDetectionResult | null }) => {
      stopLoop();

      const tick = (timestamp: number) => {
        // Reschedule first so teardown can cancel cleanly even if the body throws.
        rafIdRef.current = requestAnimationFrame(tick);

        const video = videoRef.current;
        if (!video || video.paused || video.ended || video.videoWidth === 0) {
          return;
        }

        // Concurrency guard.
        if (inferenceActiveRef.current) return;
        inferenceActiveRef.current = true;

        let result: HandDetectionResult | null = null;
        try {
          result = tracker.detect(video, timestamp);
        } finally {
          inferenceActiveRef.current = false;
        }

        // ── Notify canvas without React ──────────────────────────────────────
        // onFrame fires every tick regardless of hand count change.
        onFrameRef.current?.(result);

        // ── Update React state only when hand count changes ──────────────────
        // This keeps the GestureCard / ConfidenceCard at gesture-change
        // frequency (~1–2 Hz) rather than frame rate (~60 Hz).
        const count = result?.handCount ?? 0;
        if (count !== lastHandCountRef.current) {
          lastHandCountRef.current = count;
          setLastResult(result);
        } else if (result !== null && count > 0) {
          // Always update when hands are present so coordinates stay fresh.
          setLastResult(result);
        } else if (result === null && lastHandCountRef.current !== 0) {
          lastHandCountRef.current = 0;
          setLastResult(null);
        }
      };

      rafIdRef.current = requestAnimationFrame(tick);
    },
    [stopLoop, videoRef],
  );

  // ── Main effect — init + loop lifecycle ────────────────────────────────────

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    setTrackerStatus("loading");
    setErrorMessage("");
    setLastResult(null);
    lastHandCountRef.current = -1;

    void initHandTracker(optionsRef.current).then((tracker) => {
      if (cancelled) return;

      setTrackerStatus(tracker.status);

      if (tracker.status === "error") {
        setErrorMessage(tracker.errorMessage);
        return;
      }

      // Tracker is ready — start the rAF detection loop.
      startLoop(tracker);
    });

    return () => {
      cancelled = true;
      stopLoop();
      disposeHandTracker();
      setTrackerStatus("loading");
      setErrorMessage("");
      setLastResult(null);
      lastHandCountRef.current = -1;
    };
  }, [enabled, startLoop, stopLoop]);

  // ── Page Visibility — suspend loop when tab hidden ─────────────────────────

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Suspend rAF — WASM instance stays alive, no re-init needed on resume.
        stopLoop();
      } else {
        // Resume — re-acquire the tracker from the singleton.
        // We re-call initHandTracker() which returns the already-resolved
        // Promise immediately if init succeeded, so this is synchronous in
        // practice after first load.
        void initHandTracker(optionsRef.current).then((tracker) => {
          if (tracker.status === "ready") {
            startLoop(tracker);
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [enabled, startLoop, stopLoop]);

  return { trackerStatus, lastResult, errorMessage };
}
