/**
 * handTracker.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * MediaPipe Hand Landmarker — initialization + frame detection service.
 *
 * Milestone 3 (init):
 *   ✅ Lazy-load @mediapipe/tasks-vision via dynamic import
 *   ✅ Resolve WASM fileset, create HandLandmarker exactly once
 *   ✅ Expose typed handle with status "ready" | "loading" | "error"
 *   ✅ Dispose cleanly via HandLandmarker.close()
 *   ✅ Map all init errors to user-friendly messages
 *
 * Milestone 4 (frame detection):
 *   ✅ detect(videoEl, timestampMs) → HandDetectionResult
 *   ✅ Returns landmarks, handedness label, per-hand confidence, processingTime
 *   ✅ Synchronous wrapper around detectForVideo (MediaPipe VIDEO mode)
 *   ✅ Guards: not-ready, video not playing, zero-size video
 *
 * Out of scope:
 *   ❌ rAF loop (owned by useHandTracking)
 *   ❌ Canvas drawing (owned by HandOverlay)
 *   ❌ Gesture recognition / translation
 */

// ─── Constants ─────────────────────────────────────────────────────────────────

import {
  MEDIAPIPE_WASM_URL,
  HAND_MODEL_URL,
  MAX_HANDS,
  MIN_HAND_DETECTION_CONFIDENCE,
  MIN_HAND_PRESENCE_CONFIDENCE,
  MIN_TRACKING_CONFIDENCE,
  RUNNING_MODE,
  DELEGATE,
} from "./constants";

// ─── Public types ──────────────────────────────────────────────────────────────

/**
 * HandTrackerStatus — lifecycle states visible to hook / UI consumers.
 * Extensible: add "paused" | "reloading" without breaking existing switch cases.
 */
export type HandTrackerStatus = "loading" | "ready" | "error";

// Re-export upstream types so consumers never import from @mediapipe/tasks-vision
// directly. All adaptation happens here.
export type {
  HandLandmarkerResult,
  NormalizedLandmark,
  Category,
} from "@mediapipe/tasks-vision";

/**
 * HandednessResult — per-hand handedness extracted from MediaPipe Category[].
 * The label field is "Left" or "Right" (from the model's perspective, which is
 * the mirror of the user's hand when the camera is in the default facing mode).
 */
export interface HandednessResult {
  /** "Left" or "Right" from the model's perspective. */
  readonly label: string;
  /** Confidence score for this handedness classification (0–1). */
  readonly score: number;
}

/**
 * HandDetectionResult — the normalised output of one detect() call.
 * Returned per video frame; consumers should treat this as immutable.
 */
export interface HandDetectionResult {
  /** Normalised landmark arrays (one per detected hand). */
  readonly landmarks: import("@mediapipe/tasks-vision").NormalizedLandmark[][];
  /** Handedness label + score per hand, aligned to landmarks[]. */
  readonly handedness: HandednessResult[];
  /**
   * Per-hand detection confidence (0–1).
   * Sourced from the highest-scoring Category in each hand's handedness array.
   */
  readonly confidence: number[];
  /** Wall-clock duration of the detectForVideo() call in milliseconds. */
  readonly processingTimeMs: number;
  /** Number of hands detected in this frame (0–MAX_HANDS). */
  readonly handCount: number;
  /** DOMHighResTimeStamp passed in by the caller (sourced from rAF). */
  readonly timestampMs: number;
}

/** Legacy alias — kept so existing HandTrackerResult imports still compile. */
export interface HandTrackerResult extends HandDetectionResult {}

/** Configuration forwarded to HandLandmarker.createFromOptions(). */
export interface HandTrackerOptions {
  /** @default MAX_HANDS (1) */
  readonly numHands?: number;
  /** @default MIN_HAND_DETECTION_CONFIDENCE (0.5) */
  readonly minHandDetectionConfidence?: number;
  /** @default MIN_HAND_PRESENCE_CONFIDENCE (0.5) */
  readonly minHandPresenceConfidence?: number;
  /** @default MIN_TRACKING_CONFIDENCE (0.5) */
  readonly minTrackingConfidence?: number;
}

/**
 * HandTracker — opaque handle returned by initHandTracker().
 * The detect() method is typed here and available when status === "ready".
 */
export interface HandTracker {
  readonly status: HandTrackerStatus;
  readonly errorMessage: string;
  /**
   * Run hand detection on a single video frame.
   *
   * @param video       The HTMLVideoElement whose current frame is processed.
   * @param timestampMs DOMHighResTimeStamp for this frame (from rAF callback).
   * @returns HandDetectionResult, or null when the tracker is not ready or the
   *          video is paused / zero-size.
   */
  detect: (
    video: HTMLVideoElement,
    timestampMs: number,
  ) => HandDetectionResult | null;
  /** Release WASM resources. Idempotent. */
  dispose: () => void;
}

// ─── Singleton guard ───────────────────────────────────────────────────────────

let initPromise: Promise<HandTracker> | null = null;
let activeTracker: HandTracker | null = null;

// ─── Error mapping ─────────────────────────────────────────────────────────────

function describeInitError(err: unknown): string {
  if (err instanceof Error) {
    if (
      err.message.includes("fetch") ||
      err.message.includes("Failed to load") ||
      err.message.includes("NetworkError")
    ) {
      return "Could not download the hand tracking model. Check your internet connection and try again.";
    }
    if (
      err.message.includes("WebAssembly") ||
      err.message.includes("wasm") ||
      err.message.includes("compile")
    ) {
      return "WebAssembly is not available in this browser. Hand tracking requires a modern browser.";
    }
    if (
      err.message.includes("SharedArrayBuffer") ||
      err.message.includes("cross-origin")
    ) {
      return "Hand tracking requires cross-origin isolation headers (COOP/COEP). Contact the site administrator.";
    }
  }
  return "Failed to initialise the hand tracking model. Please reload the page and try again.";
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * initHandTracker
 * Lazily loads @mediapipe/tasks-vision and creates a HandLandmarker instance.
 * Concurrent calls share one Promise — init runs exactly once.
 * Never throws: returns HandTracker with status "error" on failure.
 */
export async function initHandTracker(
  options?: HandTrackerOptions,
): Promise<HandTracker> {
  if (initPromise !== null) return initPromise;

  initPromise = _doInit(options);
  activeTracker = await initPromise;
  return activeTracker;
}

/**
 * disposeHandTracker
 * Releases WASM resources and resets the singleton for a clean reinit.
 * Idempotent — safe to call if init never ran.
 */
export function disposeHandTracker(): void {
  activeTracker?.dispose();
  activeTracker = null;
  initPromise = null;
}

// ─── Internal init ─────────────────────────────────────────────────────────────

async function _doInit(options?: HandTrackerOptions): Promise<HandTracker> {
  // 1. Lazy-load the MediaPipe JS bundle (code-split by Vite).
  let FilesetResolver: typeof import("@mediapipe/tasks-vision").FilesetResolver;
  let HandLandmarker: typeof import("@mediapipe/tasks-vision").HandLandmarker;

  try {
    const vision = await import("@mediapipe/tasks-vision");
    FilesetResolver = vision.FilesetResolver;
    HandLandmarker = vision.HandLandmarker;
  } catch (err) {
    return _errorTracker(describeInitError(err));
  }

  // 2. Resolve the Vision WASM fileset from CDN.
  let wasmFileset: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>;
  try {
    wasmFileset = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
  } catch (err) {
    return _errorTracker(describeInitError(err));
  }

  // 3. Create the HandLandmarker in VIDEO mode (required for continuous frames).
  let landmarker: import("@mediapipe/tasks-vision").HandLandmarker;
  try {
    landmarker = await HandLandmarker.createFromOptions(wasmFileset, {
      baseOptions: {
        modelAssetPath: HAND_MODEL_URL,
        delegate: DELEGATE,
      },
      runningMode: RUNNING_MODE,
      numHands: options?.numHands ?? MAX_HANDS,
      minHandDetectionConfidence:
        options?.minHandDetectionConfidence ?? MIN_HAND_DETECTION_CONFIDENCE,
      minHandPresenceConfidence:
        options?.minHandPresenceConfidence ?? MIN_HAND_PRESENCE_CONFIDENCE,
      minTrackingConfidence:
        options?.minTrackingConfidence ?? MIN_TRACKING_CONFIDENCE,
    });
  } catch (err) {
    return _errorTracker(describeInitError(err));
  }

  // 4. Build and return the ready handle.
  let disposed = false;

  const tracker: HandTracker = {
    status: "ready",
    errorMessage: "",

    detect(video: HTMLVideoElement, timestampMs: number): HandDetectionResult | null {
      // Guard: don't call into WASM after dispose or on a non-playing video.
      if (disposed) return null;
      if (video.paused || video.ended) return null;
      if (video.videoWidth === 0 || video.videoHeight === 0) return null;

      const t0 = performance.now();
      let raw: import("@mediapipe/tasks-vision").HandLandmarkerResult;

      try {
        raw = landmarker.detectForVideo(video, timestampMs);
      } catch {
        // detectForVideo can throw if the video frame is unavailable mid-frame.
        // Treat as zero-detection rather than crashing the rAF loop.
        return null;
      }

      const processingTimeMs = performance.now() - t0;

      // Extract per-hand handedness + confidence from Category[][].
      const handedness: HandednessResult[] = (raw.handedness ?? []).map(
        (categories) => {
          // Each inner array is sorted descending by score; index 0 is the winner.
          const top = categories[0];
          return {
            label: top?.displayName ?? top?.categoryName ?? "Unknown",
            score: top?.score ?? 0,
          };
        },
      );

      const confidence: number[] = handedness.map((h) => h.score);

      return {
        landmarks: raw.landmarks,
        handedness,
        confidence,
        processingTimeMs,
        handCount: raw.landmarks.length,
        timestampMs,
      };
    },

    dispose() {
      if (disposed) return;
      disposed = true;
      try {
        landmarker.close();
      } catch {
        // Defensive — close() should never throw.
      }
    },
  };

  return tracker;
}

// ─── Helper ────────────────────────────────────────────────────────────────────

function _errorTracker(errorMessage: string): HandTracker {
  return {
    status: "error",
    errorMessage,
    detect: () => null,
    dispose() { /* nothing to release */ },
  };
}
