"use client";

/**
 * CustomModel — our own trained neural network for gesture recognition.
 *
 * Trained on 1,004 HaGRID hand images (11 gesture classes) using the app's
 * exact landmark normalisation. 88.8% test accuracy. 230KB ONNX model,
 * runs on-device via onnxruntime-web (WASM, no server).
 *
 * Used as the second-stage classifier: MediaPipe's net first, this model
 * for gestures MediaPipe doesn't know, rules as final fallback.
 */
import { InferenceSession, Tensor } from "onnxruntime-web";
import { normaliseLandmarks } from "./landmarks";
import { getGestureDefinition } from "./classifier";
import type { RawPrediction, Vec3 } from "./types";

const MODEL_URL = "/models/gesture_mlp.onnx";
const LABELS_URL = "/models/gesture_labels.json";

let session: InferenceSession | null = null;
let labels: string[] | null = null;
let loading: Promise<void> | null = null;

export async function ensureCustomModelLoaded(): Promise<void> {
  if (session && labels) return;
  if (loading) {
    await loading;
    return;
  }
  loading = (async () => {
    const [sessionResult, labelsResult] = await Promise.all([
      InferenceSession.create(MODEL_URL, { executionProviders: ["wasm"] }),
      fetch(LABELS_URL).then((r) => r.json() as Promise<string[]>),
    ]);
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
