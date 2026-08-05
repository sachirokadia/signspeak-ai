"use client";

import { Camera, CameraOff, RefreshCcw, ScanLine, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SessionBadge } from "./SessionBadge";

/**
 * CameraPlaceholder
 * Static camera panel — no real webcam access.
 * Communicates all possible camera states visually so the layout is
 * production-ready before real MediaPipe integration is wired up.
 *
 * States
 *   idle      — camera is off; prompt to start
 *   requesting — brief transition state while permissions would be requested
 *   ready     — simulates a "live" view with a dark gradient viewport
 *   error     — permission denied or hardware error
 *
 * Props
 *   active         — whether a session is running (controlled externally)
 *   onToggle       — called with the next active value
 *   permissionState — "granted" | "denied" | "prompt" | "unknown"
 *   fps            — current frames-per-second (0 when inactive)
 */

export type CameraPermissionState = "granted" | "denied" | "prompt" | "unknown";

type InternalStatus = "idle" | "requesting" | "ready" | "error";

const statusSubtitle: Record<InternalStatus, string> = {
  idle: "Camera is off",
  requesting: "Requesting permission…",
  ready: "Tracking 21 hand landmarks · on-device",
  error: "Camera access denied",
};

/* ── stat strip data ─────────────────────────────────────────── */
function statStrip(status: InternalStatus, fps: number) {
  return [
    { label: "Frame rate", value: status === "ready" ? `${fps} fps` : "—" },
    { label: "Landmarks", value: status === "ready" ? "21 / hand" : "—" },
    { label: "Processing", value: "On-device" },
  ] as const;
}

/* ── permission hint ─────────────────────────────────────────── */
function PermissionHint({ state }: { state: CameraPermissionState }) {
  if (state === "granted" || state === "unknown") return null;

  const messages: Record<string, string> = {
    denied:
      "Camera access is blocked. Open your browser's site settings and allow camera access to continue.",
    prompt:
      "Camera permission will be requested when you start a session. No data leaves your device.",
  };

  return (
    <div
      role="note"
      className="flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3"
    >
      <ShieldAlert
        className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
        aria-hidden="true"
      />
      <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">
        {messages[state]}
      </p>
    </div>
  );
}

/* ── viewport content ────────────────────────────────────────── */
function ViewportContent({
  status,
}: {
  status: InternalStatus;
}) {
  const prefersReduced = useReducedMotion();

  if (status === "ready") {
    return (
      <>
        {/* Simulated depth gradient — replaced by real video feed when webcam is wired */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,oklch(0.6_0.18_262/0.45),transparent_65%),
                      radial-gradient(circle_at_70%_75%,oklch(0.55_0.22_293/0.4),transparent_65%)]"
          aria-hidden="true"
        />

        {/* Scanning border — subtle breathing pulse */}
        {!prefersReduced && (
          <motion.div
            className="pointer-events-none absolute inset-x-10 inset-y-8 rounded-2xl border border-white/40"
            animate={{ opacity: [0.3, 0.85, 0.3] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
        )}

        {/* Scanning line */}
        {!prefersReduced && (
          <motion.div
            className="pointer-events-none absolute inset-x-10 h-px bg-white/60"
            animate={{ top: ["12%", "86%", "12%"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
        )}

        {/* Live badge overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
          Ready
        </div>

        {/* "No webcam yet" notice */}
        <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/40 px-4 py-2.5 text-xs text-white/80 backdrop-blur">
          Camera feed will appear here when webcam integration is enabled.
        </div>
      </>
    );
  }

  /* idle / requesting / error shared placeholder */
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_35%_30%,oklch(0.6_0.18_262/0.45),transparent_65%),radial-gradient(circle_at_70%_75%,oklch(0.55_0.22_293/0.4),transparent_65%)] px-8 text-center">
      <div className="max-w-xs">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur">
          <ScanLine className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm font-medium text-white">
          {status === "error"
            ? "Camera access was blocked. Enable permissions in your browser to start translating."
            : status === "requesting"
              ? "Requesting camera access…"
              : "Start a session to begin real-time translation."}
        </p>
      </div>
    </div>
  );
}

/* ── main component ──────────────────────────────────────────── */
export function CameraPlaceholder({
  active,
  onToggle,
  permissionState = "unknown",
  fps = 0,
}: {
  active: boolean;
  onToggle: (next: boolean) => void;
  permissionState?: CameraPermissionState;
  fps?: number;
}) {
  const [mirrored, setMirrored] = useState(true);

  /* Derive a display status from the active flag + permission */
  const status: InternalStatus =
    permissionState === "denied"
      ? "error"
      : active
        ? "ready"
        : "idle";

  const stats = statStrip(status, fps);

  return (
    <section
      aria-label="Camera panel"
      className="glass-panel flex flex-col overflow-hidden rounded-3xl"
    >
      {/* ── Panel header ── */}
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">Live camera</h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-0.5 truncate text-xs text-muted-foreground"
            >
              {statusSubtitle[status]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Mirror toggle — disabled when no live feed */}
          <Button
            variant="outline"
            size="icon"
            aria-label={mirrored ? "Disable mirror" : "Enable mirror"}
            aria-pressed={mirrored}
            disabled={!active}
            className="h-9 w-9 rounded-full transition-[transform,box-shadow] duration-[180ms]
                       hover:shadow-soft disabled:pointer-events-none disabled:opacity-40"
            onClick={() => setMirrored((m) => !m)}
          >
            <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>

          {/* Start / Stop */}
          <Button
            onClick={() => onToggle(!active)}
            className={[
              "h-9 rounded-full px-4 text-sm transition-[transform,box-shadow] duration-[180ms]",
              active
                ? "border border-border bg-background/70 text-foreground hover:bg-surface hover:shadow-soft"
                : "bg-brand shadow-soft hover:scale-[1.02] hover:shadow-lift",
            ].join(" ")}
            variant={active ? "outline" : "default"}
            aria-pressed={active}
          >
            {active ? (
              <>
                <CameraOff className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Stop
              </>
            ) : (
              <>
                <Camera className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Start camera
              </>
            )}
          </Button>
        </div>
      </header>

      {/* ── Viewport ── */}
      <div
        className={[
          "relative aspect-[4/3] w-full overflow-hidden bg-foreground/90",
          mirrored && active ? "scale-x-[-1]" : "",
        ].join(" ")}
        aria-label={active ? "Camera feed — placeholder" : "Camera is off"}
        role="img"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <ViewportContent status={status} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Permission hint ── */}
      {permissionState !== "granted" && permissionState !== "unknown" ? (
        <div className="border-t border-border px-5 py-3">
          <PermissionHint state={permissionState} />
        </div>
      ) : null}

      {/* ── Stat strip ── */}
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
    </section>
  );
}
