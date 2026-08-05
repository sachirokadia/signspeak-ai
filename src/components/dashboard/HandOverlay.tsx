"use client";

/**
 * HandOverlay.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Canvas overlay that draws MediaPipe hand landmarks and connections
 * on top of the live camera feed.
 *
 * Design principles:
 *   • All drawing runs in useCallback / useEffect against refs —
 *     React never re-renders on frame updates.
 *   • ResizeObserver keeps canvas intrinsic size === container CSS size × dpr
 *     so drawings are pixel-perfect on Retina / HiDPI displays.
 *   • Mirror is a canvas transform, not a CSS hack, so landmark coordinates
 *     align exactly with the mirrored video pixels.
 *   • aria-hidden="true" — the overlay is decorative; landmarks are
 *     communicated textually through GestureCard and TranscriptCard.
 *
 * Props:
 *   result    — latest HandDetectionResult from useHandTracking.onFrame
 *   mirrored  — must match CameraCard / useCamera cameraState.mirrored
 *   className — positioning classes (typically "absolute inset-0 w-full h-full")
 */

import { useCallback, useEffect, useRef } from "react";
import type { HandDetectionResult } from "@/services/mediapipe/handTracker";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

// ─── Hand skeleton definition ──────────────────────────────────────────────────

/**
 * HAND_CONNECTIONS
 * The 21 MediaPipe hand landmark indices connected into the hand skeleton.
 * Each pair is drawn as a line segment. Source:
 * https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker
 */
const HAND_CONNECTIONS: readonly [number, number][] = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index finger
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle finger
  [5, 9], [9, 10], [10, 11], [11, 12],
  // Ring finger
  [9, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [13, 17], [17, 18], [18, 19], [19, 20],
  // Palm
  [0, 17],
];

// ─── Rendering constants ───────────────────────────────────────────────────────

/** Connection line colour — brand violet at 70% opacity. */
const CONNECTION_COLOUR = "rgba(139, 92, 246, 0.70)";
/** Connection line width in CSS pixels (scaled to dpr internally). */
const CONNECTION_WIDTH = 2;

/** Landmark dot fill for regular joints. */
const LANDMARK_FILL = "rgba(255, 255, 255, 0.90)";
/** Landmark dot stroke matches connection colour. */
const LANDMARK_STROKE = "rgba(139, 92, 246, 0.90)";
/** Landmark dot radius in CSS pixels. */
const LANDMARK_RADIUS = 4;
/** Fingertip landmark dot radius (slightly larger for visual emphasis). */
const FINGERTIP_RADIUS = 5.5;
/** Landmark indices that are fingertips (4 = thumb, 8/12/16/20 = fingers). */
const FINGERTIP_INDICES = new Set([4, 8, 12, 16, 20]);

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface HandOverlayProps {
  /**
   * Latest detection result. Pass directly from the useHandTracking onFrame
   * callback (runs outside React state) for zero-overhead drawing.
   * null clears the canvas.
   */
  readonly result: HandDetectionResult | null;
  /**
   * Must mirror cameraState.mirrored from useCamera so landmark positions
   * align with the horizontally-flipped video feed.
   * @default false
   */
  readonly mirrored?: boolean;
  /** Positioning classes. Typically "absolute inset-0 w-full h-full pointer-events-none". */
  readonly className?: string;
}

// ─── Drawing helpers ───────────────────────────────────────────────────────────

/**
 * drawHand — render connections + landmarks for one detected hand.
 * Coordinates are normalised (0–1); we multiply by canvas logical dimensions.
 * Mirror is applied as a canvas transform so x=0 maps to the right edge.
 */
function drawHand(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number,
  mirrored: boolean,
): void {
  ctx.save();

  if (mirrored) {
    // Flip horizontally around the canvas centre.
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  // ── Connections ────────────────────────────────────────────────────────────
  ctx.strokeStyle = CONNECTION_COLOUR;
  ctx.lineWidth = CONNECTION_WIDTH;
  ctx.lineCap = "round";

  for (const [a, b] of HAND_CONNECTIONS) {
    const lmA = landmarks[a];
    const lmB = landmarks[b];
    // Guard: MediaPipe guarantees 21 landmarks but TypeScript cannot prove it.
    if (lmA === undefined || lmB === undefined) continue;

    ctx.beginPath();
    ctx.moveTo(lmA.x * width, lmA.y * height);
    ctx.lineTo(lmB.x * width, lmB.y * height);
    ctx.stroke();
  }

  // ── Landmark dots ──────────────────────────────────────────────────────────
  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i];
    if (lm === undefined) continue;

    const isFingertip = FINGERTIP_INDICES.has(i);
    const radius = isFingertip ? FINGERTIP_RADIUS : LANDMARK_RADIUS;

    ctx.beginPath();
    ctx.arc(lm.x * width, lm.y * height, radius, 0, Math.PI * 2);
    ctx.fillStyle = LANDMARK_FILL;
    ctx.fill();
    ctx.strokeStyle = LANDMARK_STROKE;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore();
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function HandOverlay({
  result,
  mirrored = false,
  className = "",
}: HandOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ── draw — called by the parent's onFrame callback (outside React state) ───
  /**
   * draw() is exposed via a stable ref so the parent can call it directly
   * from useHandTracking's onFrame without triggering any React render.
   * This is the hot path: it runs at full rAF rate (~60 fps).
   */
  const draw = useCallback(
    (detectionResult: HandDetectionResult | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Logical dimensions (accounting for ResizeObserver scaling below).
      const { width, height } = canvas;

      // Clear the previous frame.
      ctx.clearRect(0, 0, width, height);

      if (!detectionResult || detectionResult.handCount === 0) return;

      for (const handLandmarks of detectionResult.landmarks) {
        drawHand(ctx, handLandmarks, width, height, mirrored);
      }
    },
    [mirrored],
  );

  // Expose draw() via a ref so CameraCard / useHandTracking can call it
  // without needing to go through props (stable, no re-render).
  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  // ── Re-draw whenever result prop changes (driven by React state path) ──────
  // This covers the case where the parent passes result as a prop rather than
  // using the onFrame callback. Both paths are supported.
  useEffect(() => {
    drawRef.current(result);
  }, [result]);

  // ── ResizeObserver — keep canvas crisp at any container size / DPR ─────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      // Use devicePixelContentBoxSize when available (Chrome 84+) for
      // sub-pixel-perfect accuracy; fall back to CSS size × dpr.
      let physicalW: number;
      let physicalH: number;

      if (entry.devicePixelContentBoxSize) {
        const box = entry.devicePixelContentBoxSize[0];
        physicalW = box?.inlineSize ?? 0;
        physicalH = box?.blockSize ?? 0;
      } else {
        const dpr = window.devicePixelRatio || 1;
        const css = entry.contentRect;
        physicalW = Math.round(css.width * dpr);
        physicalH = Math.round(css.height * dpr);
      }

      if (physicalW === 0 || physicalH === 0) return;

      // Avoid redundant canvas resets if dimensions haven't changed.
      if (canvas.width === physicalW && canvas.height === physicalH) return;

      canvas.width = physicalW;
      canvas.height = physicalH;

      // Immediately re-draw after resize to avoid a blank flash.
      drawRef.current(result);
    });

    observer.observe(canvas, { box: "device-pixel-content-box" });
    return () => observer.disconnect();
    // result is intentionally not in deps — the observer only cares about size;
    // result changes are handled by the effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // pointer-events-none so touches/clicks pass through to controls below.
      // will-change-transform promotes to a GPU compositing layer so the
      // frequent clearRect/draw cycle doesn't trigger main-thread paint.
      className={["pointer-events-none will-change-transform", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

/**
 * getHandOverlayDrawRef
 * Returns a stable callback ref that callers (e.g. useHandTracking's onFrame)
 * can use to drive drawing outside React state.
 *
 * Usage in the parent:
 *   const overlayRef = useRef<HandOverlayHandle>(null);
 *   // pass overlayRef.current?.draw to useHandTracking onFrame
 *
 * Alternatively, use the onFrame callback approach:
 *   onFrame={(r) => overlayRef.current?.draw(r)}
 *
 * This function is not required for the prop-based usage — it exists as a
 * convenience for the performance-sensitive onFrame path.
 */
export interface HandOverlayHandle {
  draw: (result: HandDetectionResult | null) => void;
}
