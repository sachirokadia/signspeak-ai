"use client";

/**
 * DebugPanel.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Developer-only landmark and performance debug panel.
 *
 * Architecture contract:
 *   • Receives plain props only — no refs, no hooks, no DOM access.
 *   • Never calls useHandTracking, useCamera, navigator.*, or document.*.
 *   • CameraCard is the sole owner of camera + tracking state; it assembles
 *     DebugData and passes it up via its onDebugData callback.
 *   • Dashboard passes DebugData straight through — it never inspects it.
 *
 * Rendered only when DEBUG_MODE === true (src/lib/debug.ts).
 */

import type { CameraState } from "@/hooks/useCamera";
import type {
  HandDetectionResult,
  HandTrackerStatus,
} from "@/services/mediapipe/handTracker";

// ─── DebugData ─────────────────────────────────────────────────────────────────

/**
 * DebugData — plain serialisable snapshot assembled by CameraCard.
 *
 * All values are primitives or plain objects — no refs, no class instances.
 * This makes the data safe to pass as React props without special handling
 * and trivial to serialise for future logging / recording features.
 */
export interface DebugData {
  /** Full camera lifecycle state from useCamera. */
  readonly cameraState: CameraState;
  /**
   * Actual stream resolution read from the video element inside CameraCard.
   * Pre-formatted as "1280 × 720" or "—" when no stream is active.
   * CameraCard reads videoWidth/videoHeight; DebugPanel never touches the DOM.
   */
  readonly resolution: string;
  /**
   * Latest detection result from useHandTracking.lastResult.
   * null when no hands are visible or the tracker is not ready.
   */
  readonly lastResult: HandDetectionResult | null;
  /** Tracker lifecycle status from useHandTracking.trackerStatus. */
  readonly trackerStatus: HandTrackerStatus;
}

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface DebugPanelProps {
  /** Flat debug snapshot — assembled and owned by CameraCard. */
  readonly data: DebugData;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[0.625rem] font-semibold tracking-widest text-primary/70 uppercase">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-[0.6875rem] text-muted-foreground">
        {label}
      </span>
      <span
        className={[
          "truncate text-right font-mono text-[0.6875rem] tabular-nums",
          highlight ? "font-semibold text-primary" : "text-foreground",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <hr className="border-border/60" aria-hidden="true" />;
}

// ─── Coordinate helpers ────────────────────────────────────────────────────────

function coord(v: number | undefined): string {
  return v !== undefined ? v.toFixed(3) : "—";
}

function xyzStr(lm: { x: number; y: number; z: number } | undefined): string {
  if (!lm) return "—";
  return `${coord(lm.x)}, ${coord(lm.y)}, ${coord(lm.z)}`;
}

// MediaPipe hand landmark indices
// https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker
const IDX_WRIST = 0;
const IDX_THUMB_TIP = 4;
const IDX_INDEX_TIP = 8;

// ─── Component ─────────────────────────────────────────────────────────────────

export function DebugPanel({ data }: DebugPanelProps) {
  const { cameraState, resolution, lastResult, trackerStatus } = data;

  const timestampStr =
    lastResult !== null
      ? `${lastResult.timestampMs.toFixed(0)} ms`
      : "—";

  const hands = lastResult?.landmarks ?? [];

  return (
    <aside
      aria-label="Developer debug panel"
      role="complementary"
      className="glass-panel rounded-3xl p-5 font-mono"
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
        <h2 className="text-xs font-semibold tracking-wide text-amber-600 dark:text-amber-400">
          DEBUG MODE
        </h2>
        <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-0.5 text-[0.625rem] font-semibold text-amber-700 dark:text-amber-400">
          Dev only
        </span>
      </div>

      <div className="space-y-4">
        {/* Performance */}
        <Section title="Performance">
          <Row
            label="Camera FPS"
            value={cameraState.fps > 0 ? `${cameraState.fps} fps` : "—"}
            highlight={cameraState.fps >= 55}
          />
          <Row
            label="Processing"
            value={
              lastResult !== null
                ? `${lastResult.processingTimeMs.toFixed(1)} ms`
                : "—"
            }
          />
        </Section>

        <Divider />

        {/* Detection */}
        <Section title="Detection">
          <Row
            label="Hands detected"
            value={lastResult?.handCount ?? 0}
            highlight={(lastResult?.handCount ?? 0) > 0}
          />
          {lastResult !== null && lastResult.handCount > 0
            ? lastResult.handedness.map((h, i) => (
                <Row
                  key={i}
                  label={`Hand ${i + 1} — ${h.label}`}
                  value={`${(h.score * 100).toFixed(1)}%`}
                />
              ))
            : null}
          {(lastResult?.handCount ?? 0) === 0 ? (
            <Row label="Confidence" value="—" />
          ) : null}
        </Section>

        <Divider />

        {/* Camera */}
        <Section title="Camera">
          {/* resolution is pre-formatted by CameraCard — no DOM reads here */}
          <Row label="Resolution" value={resolution} />
          <Row label="Facing" value={cameraState.facingMode} />
          <Row label="Mirrored" value={cameraState.mirrored ? "yes" : "no"} />
          <Row label="Camera status" value={cameraState.status} />
          <Row label="Timestamp" value={timestampStr} />
        </Section>

        <Divider />

        {/* Tracker */}
        <Section title="Tracker">
          <Row
            label="Status"
            value={trackerStatus}
            highlight={trackerStatus === "ready"}
          />
        </Section>

        {/* Landmarks */}
        {hands.length > 0 ? (
          <>
            <Divider />
            {hands.map((landmarks, handIdx) => (
              <Section key={handIdx} title={`Landmarks — Hand ${handIdx + 1}`}>
                <Row label="Wrist (0)"      value={xyzStr(landmarks[IDX_WRIST])} />
                <Row label="Thumb tip (4)"  value={xyzStr(landmarks[IDX_THUMB_TIP])} />
                <Row label="Index tip (8)"  value={xyzStr(landmarks[IDX_INDEX_TIP])} />
              </Section>
            ))}
          </>
        ) : null}
      </div>
    </aside>
  );
}
