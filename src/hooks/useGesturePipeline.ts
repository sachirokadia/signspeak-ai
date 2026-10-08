"use client";

import { useEffect, useRef, useState } from "react";
import { handTracker } from "@/lib/vision/handTracker";
import { classifyLandmarks } from "@/lib/vision/classifier";
import { GestureDecisionEngine } from "@/lib/vision/decisionEngine";
import type { PipelineMetrics, RawPrediction, StableGesture, Vec3 } from "@/lib/vision/types";

export type PipelineOptions = {
  onStableGesture?: (gesture: StableGesture) => void;
  /** Fallback classifier consulted when the built-in rules match nothing. */
  customPredict?: ((landmarks: Vec3[]) => RawPrediction | null) | undefined;
  stabilityFrames?: number;
  minConfidence?: number;
  cooldownMs?: number;
};

const ADAPTIVE_LATENCY_MS = 90;
const ADAPTIVE_SLOW_WINDOWS = 3;

/**
 * Wires camera → hand tracker → classifier → decision engine.
 * Runs a single requestAnimationFrame loop; exposes the live per-frame
 * prediction plus FPS / latency telemetry for the Performance HUD.
 */
export function useGesturePipeline(
  video: HTMLVideoElement | null,
  active: boolean,
  opts: PipelineOptions = {},
) {
  const [live, setLive] = useState<RawPrediction | null>(null);
  const [metrics, setMetrics] = useState<PipelineMetrics>({
    fps: 0,
    latencyMs: 0,
    modelStatus: "idle",
    degraded: false,
  });

  const cbRef = useRef(opts.onStableGesture);
  cbRef.current = opts.onStableGesture;
  const optsRef = useRef(opts);
  optsRef.current = opts;
  // Avoid re-rendering 30×/s: only publish when the visible state changes.
  const lastLiveKey = useRef<string>("");

  useEffect(() => {
    if (!active || !video) {
      setLive(null);
      lastLiveKey.current = "";
      return;
    }

    let raf = 0;
    let cancelled = false;
    const o = optsRef.current;
    const engine = new GestureDecisionEngine({
      stabilityFrames: o.stabilityFrames ?? 8,
      minConfidence: o.minConfidence ?? 0.75,
      cooldownMs: o.cooldownMs ?? 1500,
    });

    let frames = 0;
    let windowStart = performance.now();
    let latencyEma = 0;
    let slowWindows = 0;
    let degraded = false;

    setMetrics((m) => ({
      ...m,
      modelStatus: handTracker.status === "ready" ? "ready" : "loading",
      modelError: undefined,
    }));

    function maybeDegradeQuality() {
      if (degraded) return;
      const track = (video!.srcObject as MediaStream | null)?.getVideoTracks()[0];
      if (!track?.applyConstraints) return;
      degraded = true;
      track.applyConstraints({ width: { ideal: 640 }, height: { ideal: 360 } }).catch(() => {});
      setMetrics((m) => ({ ...m, degraded: true }));
    }

    function loop() {
      if (cancelled) return;
      const result = handTracker.detect(video!);
      if (result) {
        latencyEma =
          latencyEma === 0 ? result.inferenceMs : latencyEma * 0.8 + result.inferenceMs * 0.2;

        const currentOpts = optsRef.current;
        const pred =
          classifyLandmarks(result.landmarks) ??
          currentOpts.customPredict?.(result.landmarks) ??
          null;
        const key = pred ? `${pred.gesture.id}:${Math.round(pred.confidence * 20)}` : "none";
        if (key !== lastLiveKey.current) {
          lastLiveKey.current = key;
          setLive(pred);
        }

        const stable = engine.push(pred);
        if (stable) cbRef.current?.(stable);
        frames += 1;
      }

      const now = performance.now();
      if (now - windowStart >= 1000) {
        const fps = Math.round((frames * 1000) / (now - windowStart));
        const latencyMs = Math.round(latencyEma);
        setMetrics((m) => ({ ...m, fps, latencyMs }));
        // Adaptive quality: sustained slow inference → step the camera down.
        slowWindows = latencyMs > ADAPTIVE_LATENCY_MS ? slowWindows + 1 : 0;
        if (slowWindows >= ADAPTIVE_SLOW_WINDOWS) {
          slowWindows = 0;
          maybeDegradeQuality();
        }
        frames = 0;
        windowStart = now;
      }
      raf = requestAnimationFrame(loop);
    }

    async function boot() {
      try {
        await handTracker.ensureLoaded();
        if (cancelled) return;
        setMetrics((m) => ({ ...m, modelStatus: "ready" }));
        loop();
      } catch {
        if (!cancelled) {
          setMetrics((m) => ({
            ...m,
            modelStatus: "error",
            modelError: handTracker.error ?? "Model failed to load",
          }));
        }
      }
    }

    void boot();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
    // Intentionally keyed on identity of video/active only.
  }, [active, video]);

  return { live, metrics };
}
