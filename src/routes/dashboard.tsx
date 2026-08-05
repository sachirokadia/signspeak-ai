"use client";

import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Navbar } from "@/components/site/Navbar";
import { CameraCard } from "@/components/dashboard/CameraCard";
import { GestureCard } from "@/components/dashboard/GestureCard";
import { ConfidenceCard } from "@/components/dashboard/ConfidenceCard";
import { TranscriptCard } from "@/components/dashboard/TranscriptCard";
import { VoiceCard } from "@/components/dashboard/VoiceCard";
import { GestureHistory } from "@/components/dashboard/GestureHistory";
import { SessionBadge } from "@/components/dashboard/SessionBadge";
import { GESTURE_LIBRARY, SEED_HISTORY, type HistoryEntry } from "@/lib/gestures";
import { DEBUG_MODE } from "@/lib/debug";
import type { CameraState } from "@/hooks/useCamera";
import type { DebugData } from "@/components/dashboard/DebugPanel";

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
  /* Session state — driven by camera status, not MediaPipe state */
  const [active, setActive] = useState(false);
  const [entries, setEntries] = useState<HistoryEntry[]>(SEED_HISTORY);
  const [current, setCurrent] = useState<HistoryEntry | null>(null);
  const [transcript, setTranscript] = useState("");

  /* Voice settings */
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [rate, setRate] = useState(1);

  /*
   * Debug data — populated only when DEBUG_MODE is true.
   * CameraCard assembles this and passes it up via onDebugData.
   * Dashboard is a transparent pipe: it never reads individual fields.
   */
  const [debugData, setDebugData] = useState<DebugData | null>(null);

  /* Refs to keep simulation callbacks in sync without re-creating the interval */
  const autoSpeakRef = useRef(autoSpeak);
  const rateRef = useRef(rate);
  autoSpeakRef.current = autoSpeak;
  rateRef.current = rate;

  /* Simulation loop — replaced by real gesture recognition in a future milestone */
  useEffect(() => {
    if (!active) return;

    const interval = window.setInterval(() => {
      const sample =
        GESTURE_LIBRARY[Math.floor(Math.random() * GESTURE_LIBRARY.length)]!;

      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        gesture: sample.gesture,
        phrase: sample.phrase,
        confidence: 0.84 + Math.random() * 0.15,
        at: new Date(),
      };

      setCurrent(entry);
      setEntries((prev) => [entry, ...prev].slice(0, 60));
      setTranscript((prev) =>
        prev ? `${prev} ${sample.phrase}` : sample.phrase,
      );

      if (autoSpeakRef.current && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(sample.phrase);
        utterance.rate = rateRef.current;
        window.speechSynthesis.speak(utterance);
      }
    }, 3200);

    return () => window.clearInterval(interval);
  }, [active]);

  const confidence  = current ? Math.round(current.confidence * 100) : 0;
  const badgeStatus = active ? "live" : "idle";

  /*
   * handleCameraStateChange
   * The only information Dashboard needs from the camera is whether to run
   * the simulation loop. CameraCard owns everything else.
   */
  function handleCameraStateChange(state: CameraState) {
    setActive(state.status === "live");
  }

  /* Render */
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

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            {/*
             * CameraCard owns the full pipeline:
             *   useCamera → useHandTracking → HandOverlay → DebugData
             * Dashboard receives only:
             *   - CameraState (to gate the simulation loop)
             *   - DebugData   (only when DEBUG_MODE; passed straight to DebugPanel)
             */}
            <CameraCard
              onCameraStateChange={handleCameraStateChange}
              {...(DEBUG_MODE && { onDebugData: setDebugData })}
            />

            <GestureHistory
              entries={entries}
              height="h-72"
              onClear={() => setEntries([])}
            />
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <GestureCard current={current} />
              <ConfidenceCard confidence={confidence} />
            </div>

            <TranscriptCard
              transcript={transcript}
              rate={rate}
              active={active}
              onToggle={setActive}
              onClear={() => { setTranscript(""); setCurrent(null); }}
            />

            <VoiceCard
              autoSpeak={autoSpeak}
              onAutoSpeakChange={setAutoSpeak}
              rate={rate}
              onRateChange={setRate}
            />
          </motion.div>
        </div>

        {/* Debug panel — dev only, zero production cost */}
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
