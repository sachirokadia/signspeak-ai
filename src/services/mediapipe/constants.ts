/**
 * constants.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all MediaPipe Vision Tasks configuration values.
 *
 * Centralising these here means:
 *   - CDN / model URL changes require one edit, not a grep across service files.
 *   - Version upgrades are explicit and auditable.
 *   - Default thresholds can be tuned per-environment without touching logic.
 *
 * Nothing in this file imports from @mediapipe/tasks-vision — these are
 * plain primitive constants and a string literal type.
 */

// ─── WASM / CDN ───────────────────────────────────────────────────────────────

/**
 * MEDIAPIPE_WASM_URL
 * Base URL for the @mediapipe/tasks-vision WASM fileset served via jsDelivr CDN.
 * FilesetResolver.forVisionTasks() appends filenames automatically.
 *
 * Pinned to the exact version installed (1.0.1) so the JS bundle and WASM
 * binary are guaranteed to be byte-for-byte compatible.
 *
 * Update this when upgrading the @mediapipe/tasks-vision npm package.
 */
export const MEDIAPIPE_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm" as const;

// ─── Model ────────────────────────────────────────────────────────────────────

/**
 * HAND_MODEL_URL
 * Pre-trained float16 Hand Landmarker model hosted on Google's model storage.
 * This is the URL used in all official MediaPipe web code samples.
 *
 * float16 variant is used for the best balance of accuracy and performance
 * on typical consumer GPU / WebGL hardware.
 */
export const HAND_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task" as const;

// ─── Detection defaults ───────────────────────────────────────────────────────

/**
 * MAX_HANDS
 * Maximum number of hands tracked simultaneously.
 * 1 is the default for single-user interaction and has lower inference cost.
 * Increase to 2 if two-handed sign language vocabulary is needed.
 */
export const MAX_HANDS = 1 as const;

/**
 * MIN_HAND_DETECTION_CONFIDENCE
 * Minimum score to consider a hand "detected" in a frame.
 * Below this threshold the detector does not attempt landmark localisation.
 * Range: 0.0–1.0. MediaPipe default: 0.5.
 */
export const MIN_HAND_DETECTION_CONFIDENCE = 0.5 as const;

/**
 * MIN_HAND_PRESENCE_CONFIDENCE
 * Minimum score for the landmark model to consider the hand present.
 * Applied after detection — filters out frames where the hand is partially
 * out of frame or occluded.
 * Range: 0.0–1.0. MediaPipe default: 0.5.
 */
export const MIN_HAND_PRESENCE_CONFIDENCE = 0.5 as const;

/**
 * MIN_TRACKING_CONFIDENCE
 * Minimum score for the tracker to accept an inter-frame tracking result.
 * When tracking confidence drops below this the detector re-runs from scratch,
 * which adds latency but recovers from fast hand movements or occlusions.
 * Range: 0.0–1.0. MediaPipe default: 0.5.
 */
export const MIN_TRACKING_CONFIDENCE = 0.5 as const;

// ─── Running mode ─────────────────────────────────────────────────────────────

/**
 * RunningMode (local type alias)
 * Mirrors the upstream "IMAGE" | "VIDEO" union without requiring an import
 * of the full @mediapipe/tasks-vision bundle at this module level.
 * The HandLandmarker options object accepts this string value directly.
 */
type RunningMode = "IMAGE" | "VIDEO";

/**
 * RUNNING_MODE
 * "VIDEO" enables continuous per-frame detection with motion smoothing.
 * "IMAGE" is for single-shot detection and is not appropriate for live camera.
 */
export const RUNNING_MODE: RunningMode = "VIDEO" as const;

// ─── Hardware acceleration ────────────────────────────────────────────────────

/**
 * Delegate (local type alias)
 * Mirrors the upstream delegate option without importing the full bundle.
 */
type Delegate = "GPU" | "CPU";

/**
 * DELEGATE
 * Requests GPU-accelerated inference via WebGL.
 * MediaPipe Vision Tasks falls back to CPU automatically when WebGL is
 * unavailable (e.g. headless environments, older mobile browsers).
 */
export const DELEGATE: Delegate = "GPU" as const;
