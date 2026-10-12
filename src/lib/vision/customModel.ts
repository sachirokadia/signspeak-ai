"use client";

/**
 * CustomModel — our own trained neural network for gesture recognition.
 *
 * Four trained versions are shipped (switchable in Settings → Recognition):
 * - v1 (2026-10-10): 11 classes, 88.8% on the original 402-image set.
 * - v2 (2026-10-11): 11 classes, 96.1% on the 19k-image held-out set.
 * - v3 (2026-10-11): 11 classes, 98.4% on the 19k-image held-out set.
 * - v4 (2026-10-12): 15 classes (adds vulcan, pinch, i-love-you as learned
 *   classes plus a no_gesture "that's not a sign" class). Per-gesture
 *   confidence thresholds tuned for >=95% precision. Default.
 *
 * v4's no_gesture output maps to silence (null) — firing the wrong phrase
 * is worse than firing nothing in an accessibility tool.
 *
 * All models are 200–350KB ONNX, run on-device via onnxruntime-web
 * (WASM, no server). Used as the FIRST-stage classifier: this model, then
 * MediaPipe's net as backup, geometric rules last.
 */
import { InferenceSession, Tensor } from "onnxruntime-web";
import { normaliseLandmarks } from "./landmarks";
import { getGestureDefinition } from "./classifier";
import type { RawPrediction, Vec3 } from "./types";

export type CustomModelVersion = "v1" | "v2" | "v3" | "v4";

/** Held-out test accuracy shown in Settings. */
export const CUSTOM_MODEL_VERSIONS: { id: CustomModelVersion; accuracy: string }[] = [
  { id: "v4", accuracy: "98.6%" },
  { id: "v3", accuracy: "98.4%" },
  { id: "v2", accuracy: "96.1%" },
  { id: "v1", accuracy: "82.8%" },
];

/** Gesture id the model emits for "that's not a sign" — never spoken. */
export const NO_GESTURE_ID = "no_gesture";

const DEFAULT_VERSION: CustomModelVersion = "v4";
const DEFAULT_MIN_CONFIDENCE = 0.6;

function modelUrl(version: CustomModelVersion): string {
  return `/models/gesture_mlp_${version}.onnx`;
}

function labelsUrl(version: CustomModelVersion): string {
  // v4 has 15 classes (adds vulcan/pinch/i-love-you/no_gesture);
  // v1–v3 share the 11-class labels file.
  return version === "v4" ? "/models/gesture_labels_v4.json" : "/models/gesture_labels.json";
}

function thresholdsUrl(version: CustomModelVersion): string | null {
  // Only v4 ships per-gesture precision thresholds.
  return version === "v4" ? "/models/gesture_thresholds_v4.json" : null;
}

/** The labels file may be a bare array or {"labels": [...]} — accept both. */
function parseLabels(json: unknown): string[] {
  if (Array.isArray(json)) return json as string[];
  if (json && typeof json === "object" && Array.isArray((json as { labels: unknown }).labels)) {
    return (json as { labels: string[] }).labels;
  }
  throw new Error("Unrecognised labels file format");
}

function parseThresholds(json: unknown): Record<string, number> {
  if (json && typeof json === "object") {
    const t = (json as { thresholds?: unknown }).thresholds;
    if (t && typeof t === "object") return t as Record<string, number>;
  }
  return {};
}

function readStoredVersion(): CustomModelVersion {
  try {
    const raw = localStorage.getItem("signspeak-settings-v1");
    const v = raw ? (JSON.parse(raw) as { modelVersion?: unknown }).modelVersion : null;
    return v === "v1" || v === "v2" || v === "v3" || v === "v4" ? v : DEFAULT_VERSION;
  } catch {
    return DEFAULT_VERSION;
  }
}

let currentVersion: CustomModelVersion | null = null;
let session: InferenceSession | null = null;
let labels: string[] | null = null;
let thresholds: Record<string, number> | null = null;
let loading: Promise<void> | null = null;

/**
 * Switch the active model version. Clears the cached session so the next
 * load fetches the selected version. Safe to call before any load.
 */
export function setCustomModelVersion(version: CustomModelVersion): void {
  if (currentVersion === version && session) return;
  currentVersion = version;
  session = null;
  labels = null;
  thresholds = null;
  loading = null;
}

export function getCustomModelVersion(): CustomModelVersion {
  return currentVersion ?? DEFAULT_VERSION;
}

export async function ensureCustomModelLoaded(): Promise<void> {
  if (currentVersion === null) currentVersion = readStoredVersion();
  if (session && labels) return;
  if (loading) {
    await loading;
    return;
  }
  const version = currentVersion;
  loading = (async () => {
    const tUrl = thresholdsUrl(version);
    const [sessionResult, labelsResult, thresholdsResult] = await Promise.all([
      InferenceSession.create(modelUrl(version), { executionProviders: ["wasm"] }),
      fetch(labelsUrl(version)).then(async (r) => parseLabels(await r.json())),
      tUrl
        ? fetch(tUrl)
            .then(async (r) => parseThresholds(await r.json()))
            .catch(() => null)
        : Promise.resolve(null),
    ]);
    // If the version was switched mid-load, discard this stale session.
    if (currentVersion !== version) return;
    session = sessionResult;
    labels = labelsResult;
    thresholds = thresholdsResult;
  })();
  await loading;
  loading = null;
}

/**
 * Pure per-frame classification given an already-loaded session.
 * Exported for the accuracy test harness (no module state, no fetch).
 *
 * When the model confidently predicts no_gesture, returns a RawPrediction
 * with the NO_GESTURE_ID — the arbitrator treats this as "confidently not
 * a sign" and suppresses lower stages (a wrong phrase is worse than
 * silence). Below threshold, returns null (falls through to backup stages).
 *
 * @param labelList  index -> gesture id (from the version's labels file)
 * @param thresholdMap per-gesture min confidence, or null for a flat gate
 * @param fallbackMinConfidence flat gate used when no per-gesture entry exists
 */
export async function predictWithSession(
  sess: InferenceSession,
  labelList: string[],
  thresholdMap: Record<string, number> | null,
  lm: Vec3[],
  fallbackMinConfidence = DEFAULT_MIN_CONFIDENCE,
): Promise<RawPrediction | null> {
  if (!lm || lm.length < 21) return null;
  try {
    const vector = normaliseLandmarks(lm);
    const input = new Tensor("float32", Float32Array.from(vector), [1, 63]);
    const results = await sess.run({ [sess.inputNames[0]!]: input });

    const labelOutput = results["label"];
    const probOutput = results["probabilities"];
    if (!labelOutput || !probOutput) return null;

    const labelIdx = Number(labelOutput.data[0]);
    const probs = probOutput.data as Float32Array | number[];
    const confidence = Number(probs[labelIdx]);

    const gestureId = labelList[labelIdx];
    if (!gestureId) return null;

    const gate = thresholdMap?.[gestureId] ?? fallbackMinConfidence;
    if (confidence < gate) return null;

    // Confident "that's not a sign" — the arbitrator will suppress
    // lower stages rather than letting them guess a phrase.
    if (gestureId === NO_GESTURE_ID) {
      return {
        gesture: {
          id: NO_GESTURE_ID,
          label: "No Gesture",
          phraseKey: "",
          phrase: "",
        },
        confidence: Math.round(confidence * 100) / 100,
        fingerStates: { thumb: false, index: false, middle: false, ring: false, pinky: false },
      };
    }

    const gesture = getGestureDefinition(gestureId as never);
    return {
      gesture,
      confidence: Math.round(confidence * 100) / 100,
      fingerStates: { thumb: false, index: false, middle: false, ring: false, pinky: false },
    };
  } catch {
    return null;
  }
}

/**
 * Classify landmarks with the custom ONNX model.
 * Returns null when the model isn't loaded or confidence is too low.
 */
export async function classifyWithCustomModel(
  lm: Vec3[],
  minConfidence = DEFAULT_MIN_CONFIDENCE,
): Promise<RawPrediction | null> {
  if (!session || !labels) return null;
  return predictWithSession(session, labels, thresholds, lm, minConfidence);
}

/** Preload the model in the background (call after camera starts). */
export function preloadCustomModel(): void {
  void ensureCustomModelLoaded().catch(() => {
    // Model is optional — pipeline falls back to rules.
  });
}
