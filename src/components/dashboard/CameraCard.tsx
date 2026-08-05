"use client";

import {
  Camera,
  CameraOff,
  FlipHorizontal,
  RefreshCcw,
  ScanLine,
  ShieldAlert,
  WifiOff,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  useCamera,
  type CameraState,
  type CameraPermissionState,
} from "@/hooks/useCamera";
import { useHandTracking } from "@/hooks/useHandTracking";
import { useGestureRecognition } from "@/hooks/useGestureRecognition";
import { HandOverlay } from "@/components/dashboard/HandOverlay";
import type { DebugData } from "@/components/dashboard/DebugPanel";
import type { HandDetectionResult } from "@/services/mediapipe/handTracker";
import type { ConfirmedGesture } from "@/services/gesture/types";

/**
 * CameraCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Owns the full camera + hand-tracking + overlay pipeline.
 * The route (Dashboard) never holds camera or MediaPipe state directly.
 *
 * Ownership:
 *   useCamera        — stream, status, fps, mirror, facingMode
 *   useHandTracking  — MediaPipe lifecycle, rAF detection loop
 *   HandOverlay      — canvas landmark drawing (zero React renders/frame)
 *   DebugData        — assembled here, emitted via onDebugData
 *
 * Props:
 *   onCameraStateChange — called on every CameraState change; used by Dashboard
 *                         to gate the simulation loop (status === "live").
 *   onDebugData         — called on every detection frame when DEBUG_MODE is
 *                         true. Dashboard passes the data straight to DebugPanel.
 *                         Omit in production — no overhead when absent.
 */

// ─── Sub-components ────────────────────────────────────────────────────────────

const statusSubtitle: Record<CameraState["status"], string> = {
  idle:        "Camera is off",
  requesting:  "Requesting permission…",
  live:        "Tracking 21 hand landmarks · on-device",
  error:       "Camera access denied",
  unavailable: "Camera unavailable",
};

function PermissionHint({
  permissionState,
  errorMessage,
  status,
}: {
  permissionState: CameraPermissionState;
  errorMessage: string;
  status: CameraState["status"];
}) {
  const shouldShow =
    permissionState === "denied" ||
    permissionState === "prompt" ||
    ((status === "error" || status === "unavailable") && errorMessage !== "");

  if (!shouldShow) return null;

  const isWarning = permissionState === "prompt";
  const message =
    permissionState === "denied"
      ? "Camera access is blocked. Open your browser's site settings and allow camera access to continue."
      : permissionState === "prompt"
        ? "Camera permission will be requested when you start a session. No data leaves your device."
        : errorMessage;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden border-t border-border"
    >
      <div
        role="note"
        className={[
          "flex items-start gap-2 px-5 py-3",
          isWarning ? "bg-amber-400/10" : "bg-destructive/10",
        ].join(" ")}
      >
        <ShieldAlert
          className={[
            "mt-0.5 h-4 w-4 shrink-0",
            isWarning ? "text-amber-500" : "text-destructive",
          ].join(" ")}
          aria-hidden="true"
        />
        <p
          className={[
            "text-xs leading-relaxed",
            isWarning ? "text-amber-700 dark:text-amber-400" : "text-destructive",
          ].join(" ")}
        >
          {message}
        </p>
      </div>
    </motion.div>
  );
}

function OfflineOverlay({
  status,
}: {
  status: Exclude<CameraState["status"], "live">;
}) {
  const icons: Record<typeof status, React.ReactNode> = {
    idle:        <ScanLine className="h-5 w-5" aria-hidden="true" />,
    requesting:  <ScanLine className="h-5 w-5 animate-pulse" aria-hidden="true" />,
    error:       <ShieldAlert className="h-5 w-5" aria-hidden="true" />,
    unavailable: <WifiOff className="h-5 w-5" aria-hidden="true" />,
  };
  const messages: Record<typeof status, string> = {
    idle:        "Start a session to begin real-time translation.",
    requesting:  "Requesting camera access…",
    error:       "Camera access was denied. Enable camera permission in your browser settings.",
    unavailable: "Camera is unavailable. Check that a camera is connected and the page is served over HTTPS.",
  };

  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_35%_30%,oklch(0.6_0.18_262/0.45),transparent_65%),radial-gradient(circle_at_70%_75%,oklch(0.55_0.22_293/0.4),transparent_65%)] px-8 text-center">
      <div className="max-w-xs">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur">
          {icons[status]}
        </span>
        <p className="mt-4 text-sm font-medium leading-relaxed text-white">
          {messages[status]}
        </p>
      </div>
    </div>
  );
}

function LiveOverlay() {
  const prefersReduced = useReducedMotion();
  return (
    <>
      {!prefersReduced && (
        <motion.div
          className="pointer-events-none absolute inset-x-10 inset-y-8 rounded-2xl border border-white/40"
          animate={{ opacity: [0.3, 0.85, 0.3] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}
      {!prefersReduced && (
        <motion.div
          className="pointer-events-none absolute inset-x-10 h-px bg-white/60"
          animate={{ top: ["12%", "86%", "12%"] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
        Live
      </div>
    </>
  );
}

function StatStrip({ status, fps }: { status: CameraState["status"]; fps: number }) {
  const isLive = status === "live";
  const stats = [
    { label: "Frame rate",  value: isLive ? `${fps} fps` : "—" },
    { label: "Landmarks",   value: isLive ? "21 / hand"  : "—" },
    { label: "Processing",  value: "On-device" },
  ] as const;

  return (
    <div
      className="grid grid-cols-3 divide-x divide-border border-t border-border text-center"
      aria-label="Camera statistics"
    >
      {stats.map(({ label, value }) => (
        <div key={label} className="px-3 py-4">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── CameraCard ────────────────────────────────────────────────────────────────

export interface CameraCardProps {
  /**
   * Called on every CameraState change.
   * Dashboard uses this only to set `active` (status === "live").
   */
  onCameraStateChange?: (state: CameraState) => void;
  /**
   * Called on every detection frame when the caller wants debug data.
   * Pass only when DEBUG_MODE is true; omit in production.
   * CameraCard assembles DebugData here — the dashboard never reads raw
   * camera or tracking state.
   */
  onDebugData?: (data: DebugData) => void;
  /**
   * Called once per confirmed gesture (after hold + debounce conditions pass).
   * Fired synchronously inside the rAF loop — must be non-throwing.
   * Dashboard uses this to update history, transcript, and trigger speech.
   * Omit to keep gesture recognition running silently in the background.
   */
  onGestureRecognised?: (gesture: ConfirmedGesture) => void;
}

export function CameraCard({ onCameraStateChange, onDebugData, onGestureRecognised }: CameraCardProps) {
  // ── Camera ──────────────────────────────────────────────────────────────────
  const camera = useCamera(
    onCameraStateChange !== undefined ? { onCameraStateChange } : {},
  );
  const { cameraState, videoRef, start, stop, toggleMirror, switchCamera } = camera;
  const { status, fps, permissionState, mirrored, errorMessage } = cameraState;

  const isLive   = status === "live";
  const isActive = status === "live" || status === "requesting";
  const canStart = status === "idle" || status === "error";

  // ── Gesture recognition ────────────────────────────────────────────────────
  // Enabled only when the camera is live. processFrame is a stable ref-based
  // callback (empty useCallback deps in the hook) — its identity never changes,
  // so including it in handleFrame's dep array causes no churn.
  const gestureRecognition = useGestureRecognition({
    enabled: isLive,
    ...(onGestureRecognised !== undefined && {
      onGestureConfirmed: onGestureRecognised,
    }),
  });

  // ── Stable ref to latest cameraState ───────────────────────────────────────
  // Used inside onFrame (rAF loop) without capturing a stale closure.
  const cameraStateRef = useRef(cameraState);
  cameraStateRef.current = cameraState;

  // ── Hand tracking overlay ref ───────────────────────────────────────────────
  // Holds the latest detection result for the HandOverlay draw path.
  const overlayResultRef = useRef<HandDetectionResult | null>(null);

  // ── Stable ref for trackerStatus ────────────────────────────────────────────
  // Read inside handleFrame (rAF loop) without a stale closure.
  // useHandTracking is declared after handleFrame; this ref bridges the gap.
  const trackerStatusRef = useRef<import("@/services/mediapipe/handTracker").HandTrackerStatus>("loading");

  // ── onFrame — hot path, runs at ~60 fps ────────────────────────────────────
  // 1. Forward result to HandOverlay (canvas draw — no React state).
  // 2. If the caller wants debug data, assemble and emit it.
  // Must be stable across renders: useCallback with empty deps, reads via refs.
  const handleFrame = useCallback(
    (result: HandDetectionResult | null) => {
      // Update the overlay ref (HandOverlay reads this on next draw).
      overlayResultRef.current = result;

      // ── Gesture recognition ──────────────────────────────────────────────
      // Called after hand detection, before debug assembly.
      // processFrame is a no-op when the camera is not live (enabled=false).
      gestureRecognition.processFrame(result);

      // Debug data: assembled entirely inside CameraCard from owned state.
      // onDebugData is called only when the prop is provided — zero overhead
      // in production where the prop is not passed.
      if (onDebugData !== undefined) {
        const video = videoRef.current;
        const w = video?.videoWidth  ?? 0;
        const h = video?.videoHeight ?? 0;
        const resolution = w > 0 ? `${w} × ${h}` : "—";

        onDebugData({
          cameraState:   cameraStateRef.current,
          resolution,
          lastResult:    result,
          trackerStatus: trackerStatusRef.current,
        });
      }
    },
    // gestureRecognition.processFrame is stable (empty useCallback deps in hook).
    // onDebugData and videoRef are the other meaningful deps.
    [gestureRecognition.processFrame, onDebugData, videoRef],
  );

  // ── Hand tracking ───────────────────────────────────────────────────────────
  // useHandTracking is owned here — Dashboard never sees it.
  const trackingResult = useHandTracking({
    videoRef,
    enabled: isLive,
    onFrame: handleFrame,
  });

  // Keep trackerStatusRef in sync for use inside handleFrame.
  trackerStatusRef.current = trackingResult.trackerStatus;

  function handleToggle() {
    if (isActive) stop();
    else void start();
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      aria-label="Camera panel"
      className="glass-panel flex flex-col overflow-hidden rounded-3xl"
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">Live camera</h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-0.5 truncate text-xs text-muted-foreground"
            >
              {statusSubtitle[status]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label={mirrored ? "Disable mirror" : "Enable mirror"}
            aria-pressed={mirrored}
            disabled={!isLive}
            onClick={toggleMirror}
            className="h-9 w-9 rounded-full transition-[transform,box-shadow] duration-[180ms] hover:shadow-soft disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FlipHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>

          {isLive && (
            <Button
              variant="outline"
              size="icon"
              aria-label="Switch camera"
              onClick={() => void switchCamera()}
              className="h-9 w-9 rounded-full transition-[transform,box-shadow] duration-[180ms] hover:shadow-soft focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          )}

          <Button
            onClick={handleToggle}
            disabled={status === "requesting" || status === "unavailable"}
            aria-pressed={isActive}
            aria-label={isActive ? "Stop camera" : "Start camera"}
            className={[
              "h-9 rounded-full px-4 text-sm",
              "transition-[transform,box-shadow] duration-[180ms]",
              "disabled:pointer-events-none disabled:opacity-50",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "border border-border bg-background/70 text-foreground hover:bg-surface hover:shadow-soft"
                : "bg-brand shadow-soft hover:scale-[1.02] hover:shadow-lift",
            ].join(" ")}
            variant={isActive ? "outline" : "default"}
          >
            {isActive ? (
              <><CameraOff className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />Stop</>
            ) : (
              <><Camera className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />{canStart ? "Start camera" : "Starting…"}</>
            )}
          </Button>
        </div>
      </header>

      {/* Viewport */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/90"
        role="img"
        aria-label={isLive ? "Live camera feed" : "Camera is off"}
      >
        {/* Video element — always mounted so videoRef is stable */}
        <video
          ref={videoRef}
          playsInline
          muted
          aria-hidden="true"
          className={[
            "absolute inset-0 h-full w-full object-cover",
            "transition-opacity duration-500",
            isLive  ? "opacity-100" : "opacity-0",
            mirrored ? "scale-x-[-1]" : "",
          ].join(" ")}
        />

        {/*
         * HandOverlay — canvas landmark drawing.
         * Driven via useHandTracking's onFrame callback (no React renders/frame).
         * result prop is passed from trackingResult.lastResult for the
         * prop-driven path (e.g. initial render after first detection).
         */}
        {isLive && (
          <HandOverlay
            result={trackingResult.lastResult}
            mirrored={mirrored}
            className="absolute inset-0 h-full w-full"
          />
        )}

        {/* State overlays */}
        <AnimatePresence mode="wait">
          {isLive ? (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <LiveOverlay />
            </motion.div>
          ) : (
            <motion.div
              key={status}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <OfflineOverlay status={status as Exclude<CameraState["status"], "live">} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Permission / error hint */}
      <AnimatePresence>
        {(permissionState === "denied" ||
          permissionState === "prompt" ||
          ((status === "error" || status === "unavailable") && errorMessage !== "")) ? (
          <PermissionHint
            key="hint"
            permissionState={permissionState}
            errorMessage={errorMessage}
            status={status}
          />
        ) : null}
      </AnimatePresence>

      {/* Stat strip */}
      <StatStrip status={status} fps={fps} />
    </section>
  );
}
