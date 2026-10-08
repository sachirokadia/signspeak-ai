"use client";

/**
 * HandTracker — singleton wrapper around MediaPipe's HandLandmarker
 * (Tasks Vision, VIDEO running mode, WASM delegate).
 *
 * Everything runs on-device. The WASM runtime is self-hosted: a postinstall
 * script copies it from node_modules/@mediapipe/tasks-vision into
 * public/wasm/, so it is always version-matched with the installed JS,
 * served same-origin (no CDN MIME/availability hazards), and cacheable by
 * the service worker for offline use. The hand-landmarker model still loads
 * from Google's CDN on first use; set VITE_HAND_LANDMARKER_MODEL_URL
 * (or call configureHandTracker) to self-host it as well.
 */
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import type { Vec3 } from "./types";

const DEFAULT_WASM_URL = "/wasm";
const DEFAULT_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

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
      assetConfig.modelUrl ??
      import.meta.env["VITE_HAND_LANDMARKER_MODEL_URL"] ??
      DEFAULT_MODEL_URL,
  };
}

export type TrackResult = {
  landmarks: Vec3[];
  /** Wall-clock ms spent inside detectForVideo for this frame. */
  inferenceMs: number;
} | null;

class HandTracker {
  private landmarker: HandLandmarker | null = null;
  private loading: Promise<void> | null = null;
  private lastVideoTime = -1;

  status: "idle" | "loading" | "ready" | "error" = "idle";
  error: string | null = null;

  async ensureLoaded(): Promise<void> {
    if (this.landmarker) return;
    if (this.loading) {
      await this.loading;
      return;
    }
    this.status = "loading";
    this.error = null;
    this.loading = (async () => {
      try {
        const { wasmUrl, modelUrl } = resolveAssetUrls();
        const vision = await FilesetResolver.forVisionTasks(wasmUrl);
        this.landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: modelUrl, delegate: "GPU" },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        this.status = "ready";
      } catch (e) {
        this.status = "error";
        this.error = e instanceof Error ? e.message : "Failed to load hand tracking model";
        throw e;
      } finally {
        this.loading = null;
      }
    })();
    await this.loading;
  }

  /**
   * Run detection on the current video frame. Returns null when there is no
   * new frame, no hand is visible, or the model isn't ready.
   */
  detect(video: HTMLVideoElement): TrackResult {
    if (!this.landmarker || this.status !== "ready") return null;
    if (video.readyState < 2 || video.videoWidth === 0) return null;
    // Skip duplicate frames — the camera may deliver the same frame twice.
    if (video.currentTime === this.lastVideoTime) return null;
    this.lastVideoTime = video.currentTime;

    const start = performance.now();
    try {
      const result = this.landmarker.detectForVideo(video, performance.now());
      const hand = result.landmarks?.[0];
      if (!hand) return null;
      return {
        landmarks: hand.map((p) => ({ x: p.x, y: p.y, z: p.z })),
        inferenceMs: performance.now() - start,
      };
    } catch {
      return null;
    }
  }

  dispose(): void {
    this.landmarker?.close();
    this.landmarker = null;
    this.status = "idle";
    this.lastVideoTime = -1;
  }
}

export const handTracker = new HandTracker();
