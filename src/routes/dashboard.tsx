"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { WebcamPanel } from "@/components/dashboard/WebcamPanel";
import { TranslationPanel } from "@/components/dashboard/TranslationPanel";
import { GestureHistory } from "@/components/dashboard/GestureHistory";
import { GESTURE_LIBRARY, SEED_HISTORY, type HistoryEntry } from "@/lib/gestures";

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

function Dashboard() {
  const [active, setActive] = useState(false);
  const [entries, setEntries] = useState<HistoryEntry[]>(SEED_HISTORY);
  const [current, setCurrent] = useState<HistoryEntry | null>(null);
  const [transcript, setTranscript] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [rate, setRate] = useState(1);
  const autoSpeakRef = useRef(autoSpeak);
  const rateRef = useRef(rate);

  autoSpeakRef.current = autoSpeak;
  rateRef.current = rate;

  useEffect(() => {
    if (!active) return;
    const interval = window.setInterval(() => {
      const sample = GESTURE_LIBRARY[Math.floor(Math.random() * GESTURE_LIBRARY.length)]!;
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        gesture: sample.gesture,
        phrase: sample.phrase,
        confidence: 0.84 + Math.random() * 0.15,
        at: new Date(),
      };
      setCurrent(entry);
      setEntries((prev) => [entry, ...prev].slice(0, 60));
      setTranscript((prev) => (prev ? `${prev} ${sample.phrase}` : sample.phrase));

      if (autoSpeakRef.current && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(sample.phrase);
        utterance.rate = rateRef.current;
        window.speechSynthesis.speak(utterance);
      }
    }, 3200);

    return () => window.clearInterval(interval);
  }, [active]);

  return (
    <div className="min-h-dvh bg-soft">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold sm:text-3xl">Translation dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in front of the camera — text and speech follow instantly.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            {active ? "Session active" : "Session idle"}
          </span>
        </header>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <WebcamPanel active={active} onToggle={setActive} />
            <GestureHistory entries={entries} height="h-72" />
          </div>

          <TranslationPanel
            transcript={transcript}
            current={current}
            autoSpeak={autoSpeak}
            onAutoSpeakChange={setAutoSpeak}
            rate={rate}
            onRateChange={setRate}
            onClear={() => {
              setTranscript("");
              setCurrent(null);
            }}
            active={active}
            onToggle={setActive}
          />
        </div>
      </main>
    </div>
  );
}
