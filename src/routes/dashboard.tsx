"use client";

import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { Navbar } from "@/components/site/Navbar";
import { CameraCard } from "@/components/dashboard/CameraCard";
import { GestureCard } from "@/components/dashboard/GestureCard";
import { ConfidenceCard } from "@/components/dashboard/ConfidenceCard";
import { TranscriptCard } from "@/components/dashboard/TranscriptCard";
import { VoiceCard } from "@/components/dashboard/VoiceCard";
import { GestureHistory } from "@/components/dashboard/GestureHistory";
import { SupportedSignsCard } from "@/components/dashboard/SupportedSignsCard";
import { SessionBadge } from "@/components/dashboard/SessionBadge";
import { SEED_HISTORY, type HistoryEntry } from "@/lib/gestures";
import { DEBUG_MODE } from "@/lib/debug";
import type { CameraState } from "@/hooks/useCamera";
import type { DebugData } from "@/components/dashboard/DebugPanel";
import type { ConfirmedGesture } from "@/services/gesture/types";

/*
 * DebugPanel is loaded as a lazy async chunk only in development.
 * When DEBUG_MODE is false (production), the conditional short-circuits and
 * the import() expression is never evaluated — zero bundle contribution.
 */
const DebugPanelLazy = DEBUG_MODE
  ? lazy(() =>
      import("@/components/dashboard/DebugPanel").then((m) => ({
        default: m.DebugPanel,
      })),
    )
  : null;

/* ─── Route meta ──────────────────────────────────────────────── */

const title = "Dashboard — SignSpeak AI";
const description =
  "Translate hand gestures in real time: live webcam feed, detected gesture, confidence score, voice output and gesture history.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Dashboard,
});

/* ─── Dashboard ───────────────────────────────────────────────── */

function Dashboard() {
  /* Session state — driven by camera status */
  const [active, setActive]   = useState(false);
  const [entries, setEntries] = useState<HistoryEntry[]>(SEED_HISTORY);
  const [current, setCurrent] = useState<HistoryEntry | null>(null);

  /* Voice settings */
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [rate, setRate]           = useState(1);

  /* Debug data — dev only */
  const [debugData, setDebugData] = useState<DebugData | null>(null);

  /*
   * Refs for voice settings — accessible inside the rAF-synchronous callback
   * without stale closure issues.
   */
  const autoSpeakRef = useRef(autoSpeak);
  const rateRef      = useRef(rate);
  autoSpeakRef.current = autoSpeak;
  rateRef.current      = rate;

  /*
   * handleGestureRecognised
   * Called synchronously by CameraCard (via useGestureRecognition) each time
   * the filter confirms a gesture. Works for both single-hand and two-hand
   * sessions — called once per confirmed hand per frame.
   *
   * Deduplication: skip if the latest entry already has the same gestureId,
   * preventing back-to-back identical entries when the user holds a pose.
   * (The filter's debounceMs also suppresses rapid repeats, but this guard
   * covers the UI layer separately.)
   */
  const handleGestureRecognised = useCallback(
    (gesture: ConfirmedGesture) => {
      const entry: HistoryEntry = {
        id:         gesture.id,
        gesture:    gesture.gestureId,
        phrase:     gesture.phrase,
        confidence: gesture.confidence,
        at:         gesture.confirmedAt,
      };

      setCurrent(entry);
      setEntries((prev) => {
        // Remove consecutive duplicate gestureId (different hands can still
        // appear back-to-back with the same ID — allow that by checking only
        // the very first item rather than any previous occurrence).
        const last = prev[0];
        if (last && last.gesture === entry.gesture) {
          // Replace the stale entry with the fresh one (higher confidence may differ).
          return [entry, ...prev.slice(1)].slice(0, 60);
        }
        return [entry, ...prev].slice(0, 60);
      });

      if (autoSpeakRef.current && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(gesture.phrase);
        utterance.rate  = rateRef.current;
        window.speechSynthesis.speak(utterance);
      }
    },
    [],
  );

  const confidence  = current ? Math.round(current.confidence * 100) : 0;
  const badgeStatus = active ? "live" : "idle";

  function handleCameraStateChange(state: CameraState) {
    setActive(state.status === "live");
  }

  /* ─── Render ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-dvh bg-soft">
      <Navbar />

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold sm:text-3xl">Translation dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in front of the camera — text and speech follow instantly.
            </p>
          </div>
          <SessionBadge status={badgeStatus} />
        </motion.header>

        {/* Responsive grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[1fr_1fr] xl:grid-cols-[480px_1fr]">

          {/* Left column: camera + history */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            <CameraCard
              onCameraStateChange={handleCameraStateChange}
              onGestureRecognised={handleGestureRecognised}
              {...(DEBUG_MODE && { onDebugData: setDebugData })}
            />

            <GestureHistory
              entries={entries}
              height="h-72"
              onClear={() => { setEntries([]); setCurrent(null); }}
            />
          </motion.div>

          {/* Right column: metrics + transcript + voice + supported signs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            {/* Gesture + confidence side by side */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <GestureCard current={current} />
              <ConfidenceCard confidence={confidence} />
            </div>

            {/*
             * TranscriptCard now receives the same `entries` array as
             * GestureHistory (newest first). It renders a structured log
             * instead of an accumulated string.
             */}
            <TranscriptCard
              entries={entries}
              rate={rate}
              active={active}
              onToggle={setActive}
              onClear={() => { setEntries([]); setCurrent(null); }}
            />

            <VoiceCard
              autoSpeak={autoSpeak}
              onAutoSpeakChange={setAutoSpeak}
              rate={rate}
              onRateChange={setRate}
            />

            {/* Supported signs — auto-populated from vocabulary service */}
            <SupportedSignsCard />
          </motion.div>
        </div>

        {/* Debug panel — dev only */}
        {DEBUG_MODE && DebugPanelLazy !== null && debugData !== null ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5"
          >
            <Suspense fallback={null}>
              <DebugPanelLazy data={debugData} />
            </Suspense>
          </motion.div>
        ) : null}

      </main>
    </div>
  );
}
