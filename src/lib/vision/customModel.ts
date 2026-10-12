"use client";

/**
 * CustomModel — our own trained neural network for gesture recognition.
 *
 * Three trained versions are shipped (switchable in Settings → Recognition):
 * - v1 (2026-10-10): trained on 1,004 HaGRID vectors, 11 classes.
 *   88.8% on the original 402-image held-out set.
 * - v2 (2026-10-11): trained on 2,304 vectors pooled from the 34-class set.
 *   96.1% on the large 19,055-image held-out set.
 * - v3 (2026-10-11): trained on 47,636 vectors from the 500k-image
 *   HaGRIDv2 sample. 98.4% on the 19,055-image held-out set, every class
 *   ≥96.8% (old weak spots fixed: call-me 97.6%, three 98.0%). Default.
 *
 * All three share the same 63-dim input, label order and opset, so they are
 * drop-in interchangeable. 205–235KB ONNX models, run on-device via
 * onnxruntime-web (WASM, no server).
 *
 * Used as the second-stage classifier: MediaPipe's net first, this model
 * for gestures MediaPipe doesn't know, rules as final fallback.
 */
import { InferenceSession, Tensor } from "onnxruntime-web";
import { normaliseLandmarks } from "./landmarks";
import { getGestureDefinition } from "./classifier";
import type { RawPrediction, Vec3 } from "./types";

export type CustomModelVersion = "v1" | "v2" | "v3";

/** Held-out test accuracy shown in Settings (large 19,055-image set). */
export const CUSTOM_MODEL_VERSIONS: { id: CustomModelVersion; accuracy: string }[] = [
  { id: "v3", accuracy: "98.4%" },
  { id: "v2", accuracy: "96.1%" },
  { id: "v1", accuracy: "82.8%" },
];

const DEFAULT_VERSION: CustomModelVersion = "v3";
const LABELS_URL = "/models/gesture_labels.json";

function modelUrl(version: CustomModelVersion): string {
  return `/models/gesture_mlp_${version}.onnx`;
}

function readStoredVersion(): CustomModelVersion {
  try {
    const raw = localStorage.getItem("signspeak-settings-v1");
    const v = raw ? (JSON.parse(raw) as { modelVersion?: unknown }).modelVersion : null;
    return v === "v1" || v === "v2" || v === "v3" ? v : DEFAULT_VERSION;
  } catch {
    return DEFAULT_VERSION;
  }
}

let currentVersion: CustomModelVersion | null = null;
let session: InferenceSession | null = null;
let labels: string[] | null = null;
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
    const [sessionResult, labelsResult] = await Promise.all([
      InferenceSession.create(modelUrl(version), { executionProviders: ["wasm"] }),
      fetch(LABELS_URL).then((r) => r.json() as Promise<string[]>),
    ]);
    // If the version was switched mid-load, discard this stale session.
    if (currentVersion !== version) return;
    session = sessionResult;
    labels = labelsResult;
  })();
  await loading;
  loading = null;
}

/**
 * Classify landmarks with the custom ONNX model.
 * Returns null when the model isn't loaded or confidence is too low.
 */
export async function classifyWithCustomModel(
  lm: Vec3[],
  minConfidence = 0.6,
): Promise<RawPrediction | null> {
  if (!session || !labels) return null;
  if (!lm || lm.length < 21) return null;

  try {
    const vector = normaliseLandmarks(lm);
    const input = new Tensor("float32", Float32Array.from(vector), [1, 63]);
    const results = await session.run({ [session.inputNames[0]!]: input });

    const labelOutput = results["label"];
    const probOutput = results["probabilities"];
    if (!labelOutput || !probOutput) return null;

    const labelIdx = Number(labelOutput.data[0]);
    const probs = probOutput.data as Float32Array | number[];
    const confidence = Number(probs[labelIdx]);

    if (confidence < minConfidence) return null;

    const gestureId = labels[labelIdx];
    if (!gestureId) return null;

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

/** Preload the model in the background (call after camera starts). */
export function preloadCustomModel(): void {
  void ensureCustomModelLoaded().catch(() => {
    // Model is optional — pipeline falls back to rules.
  });
}
