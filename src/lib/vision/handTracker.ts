"use client";

/**
 * HandTracker — singleton wrapper around MediaPipe's GestureRecognizer
 * (Tasks Vision, VIDEO running mode).
 *
 * This is a TRAINED NEURAL NETWORK (by Google) that recognizes 8 hand
 * gestures directly from video: Closed_Fist, Open_Palm, Pointing_Up,
 * Thumb_Down, Thumb_Up, Victory, ILoveYou, plus None.
 *
 * Everything runs on-device. The WASM runtime is self-hosted: a postinstall
 * script copies it from node_modules/@mediapipe/tasks-vision into
 * public/wasm/. The gesture model is self-hosted at /models/gesture_recognizer.task.
 *
 * For gestures the neural net doesn't know (OK sign, Three, Four, Call Me),
 * the pipeline falls back to the geometric rule-based classifier using the
 * landmarks the recognizer also returns.
 */
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import type { MediaPipeGestureName, Vec3 } from "./types";

const DEFAULT_WASM_URL = "/wasm";
const DEFAULT_MODEL_URL = "/models/gesture_recognizer.task";

export type TrackerAssetConfig = {
  wasmUrl?: string;
  modelUrl?: string;
};

let assetConfig: TrackerAssetConfig = {};

export function configureHandTracker(config: TrackerAssetConfig): void {
  assetConfig = { ...assetConfig, ...config };
}

function resolveAssetUrls(): { wasmUrl: string; modelUrl: string } {
  return {
    wasmUrl: assetConfig.wasmUrl ?? import.meta.env["VITE_MEDIAPIPE_WASM_URL"] ?? DEFAULT_WASM_URL,
    modelUrl:
      assetConfig.modelUrl ?? import.meta.env["VITE_GESTURE_MODEL_URL"] ?? DEFAULT_MODEL_URL,
  };
}

export type NeuralPrediction = {
  /** Raw MediaPipe category name. */
  name: MediaPipeGestureName;
  /** 0..1 confidence from the neural net. */
  score: number;
};

export type TrackResult = {
  landmarks: Vec3[];
  /** Neural-net gesture prediction (null when no hand visible). */
  neural: NeuralPrediction | null;
  /** Wall-clock ms spent inside recognizeForVideo for this frame. */
  inferenceMs: number;
} | null;

class HandTracker {
  private recognizer: GestureRecognizer | null = null;
  private loading: Promise<void> | null = null;
  private lastVideoTime = -1;

  status: "idle" | "loading" | "ready" | "error" = "idle";
  error: string | null = null;

  /** Maximum time to wait for WASM + model download before giving up. */
  static LOAD_TIMEOUT_MS = 45000;

  async ensureLoaded(): Promise<void> {
    if (this.recognizer) return;
    if (this.loading) {
      await this.loading;
      return;
    }
    this.status = "loading";
    this.error = null;
    this.loading = (async () => {
      try {
        const { wasmUrl, modelUrl } = resolveAssetUrls();
        const timeout = (label: string) =>
          new Promise<never>((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(`${label} timed out after ${HandTracker.LOAD_TIMEOUT_MS / 1000}s`),
                ),
              HandTracker.LOAD_TIMEOUT_MS,
            ),
          );
        const vision = await Promise.race([
          FilesetResolver.forVisionTasks(wasmUrl),
          timeout("WASM runtime download"),
        ]);
        this.recognizer = await Promise.race([
          GestureRecognizer.createFromOptions(vision, {
            baseOptions: { modelAssetPath: modelUrl, delegate: "GPU" },
            runningMode: "VIDEO",
            numHands: 1,
            minHandDetectionConfidence: 0.7,
            minHandPresenceConfidence: 0.7,
            minTrackingConfidence: 0.7,
            cannedGesturesClassifierOptions: {
              scoreThreshold: 0.5,
            },
          }),
          timeout("Gesture model download"),
        ]);
        this.status = "ready";
      } catch (e) {
        this.status = "error";
        this.error = e instanceof Error ? e.message : "Failed to load gesture model";
        throw e;
      } finally {
        this.loading = null;
      }
    })();
    await this.loading;
  }

  /**
   * Run recognition on the current video frame. Returns null when there is
   * no new frame, no hand is visible, or the model isn't ready.
   */
  detect(video: HTMLVideoElement): TrackResult {
    if (!this.recognizer || this.status !== "ready") return null;
    if (video.readyState < 2 || video.videoWidth === 0) return null;
    // Skip duplicate frames — the camera may deliver the same frame twice.
    if (video.currentTime === this.lastVideoTime) return null;
    this.lastVideoTime = video.currentTime;

    const start = performance.now();
    try {
      const result = this.recognizer.recognizeForVideo(video, performance.now());
      const hand = result.landmarks?.[0];
      if (!hand) return null;

      const gesture = result.gestures?.[0]?.[0];
      const neural: NeuralPrediction | null = gesture
        ? {
            name: gesture.categoryName as MediaPipeGestureName,
            score: gesture.score,
          }
        : null;

      return {
        landmarks: hand.map((p) => ({ x: p.x, y: p.y, z: p.z })),
        neural,
        inferenceMs: performance.now() - start,
      };
    } catch {
      return null;
    }
  }

  dispose(): void {
    this.recognizer?.close();
    this.recognizer = null;
    this.status = "idle";
    this.lastVideoTime = -1;
  }
}

export const handTracker = new HandTracker();
