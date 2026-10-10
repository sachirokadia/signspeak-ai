/**
 * Shared types for the on-device gesture-recognition pipeline.
 *
 * Pipeline: webcam → HandLandmarker (21 landmarks) → normalisation →
 * static-gesture classifier → GestureDecisionEngine → stable gesture event.
 */

export type Vec3 = { x: number; y: number; z: number };

export type FingerName = "thumb" | "index" | "middle" | "ring" | "pinky";

/** True = extended, false = folded. */
export type FingerStates = Record<FingerName, boolean>;

export type GestureId =
  | "open-palm"
  | "fist"
  | "thumbs-up"
  | "peace"
  | "point"
  | "ok-sign"
  | "i-love-you"
  | "call-me"
  | "three"
  | "four";

export type GestureDefinition = {
  /** Built-ins use the GestureId union; custom gestures use `custom-<label>`. */
  id: string;
  label: string;
  /** Key into the i18n phrase packs (src/lib/i18n/phrases.ts). */
  phraseKey: string;
  /** Spoken/written phrase this gesture communicates (English default). */
  phrase: string;
};

/** Per-frame classifier output, before temporal smoothing. */
export type RawPrediction = {
  gesture: GestureDefinition;
  /** 0..1 — derived from finger-state crispness, not a calibrated probability. */
  confidence: number;
  fingerStates: FingerStates;
};

/** A gesture confirmed by the decision engine. */
export type StableGesture = {
  gesture: GestureDefinition;
  phrase: string;
  confidence: number;
  at: Date;
};

export type ModelStatus = "idle" | "loading" | "ready" | "error";

export type PipelineMetrics = {
  fps: number;
  /** Exponential moving average of per-frame inference time. */
  latencyMs: number;
  modelStatus: ModelStatus;
  modelError?: string | undefined;
  /** True once adaptive quality has stepped the camera down. */
  degraded: boolean;
};
