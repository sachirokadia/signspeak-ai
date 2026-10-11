"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { SkipLink } from "@/components/a11y/SkipLink";
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator";
import { StickerChip } from "@/components/ui/sticker-chip";
import { Sparkle, Squiggle } from "@/components/ui/doodles";
import { WebcamPanel } from "@/components/dashboard/WebcamPanel";
import { TranslationPanel } from "@/components/dashboard/TranslationPanel";
import { GestureHistory } from "@/components/dashboard/GestureHistory";
import { PerformanceHUD } from "@/components/dashboard/PerformanceHUD";
import { SentenceBuilder, type SentenceWord } from "@/components/dashboard/SentenceBuilder";
import { EmergencyPhrasebook } from "@/components/dashboard/EmergencyPhrasebook";
import { ExportHistoryButton } from "@/components/dashboard/ExportHistoryButton";
import { SEED_HISTORY, type HistoryEntry } from "@/lib/gestures";
import { useGesturePipeline } from "@/hooks/useGesturePipeline";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { useSettings } from "@/lib/settings";
import { loadHistory, saveHistory } from "@/lib/historyStore";
import { speak } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { APP_LANGS, resolvePhrase, speechLangFor } from "@/lib/i18n/phrases";
import { loadCustomPredictor, type CustomPredictor } from "@/lib/vision/customGestures";
import type { StableGesture } from "@/lib/vision/types";

const title = "Dashboard — SignSpeak AI";
const description =
  "Translate hand gestures in real time: live webcam feed, detected gesture, confidence score, voice output and gesture history.";

/**
 * Speech only fires for gestures at or above this confidence — the
 * confidence-gating half of the Decision Engine, applied at the output.
 */
const SPEAK_CONFIDENCE_THRESHOLD = 0.8;

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

const NAV_LINKS = [
  { to: "/studio", label: "Gesture Studio" },
  { to: "/learn", label: "Learn" },
  { to: "/conversation", label: "Conversation" },
  { to: "/insights", label: "Insights" },
  { to: "/privacy", label: "Privacy" },
] as const;

function Dashboard() {
  const [active, setActive] = useState(false);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [entries, setEntries] = useState<HistoryEntry[]>(SEED_HISTORY);
  const [current, setCurrent] = useState<HistoryEntry | null>(null);
  const [transcript, setTranscript] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [rate, setRate] = useState(1);
  const [sentenceWords, setSentenceWords] = useState<SentenceWord[]>([]);
  const [customPredict, setCustomPredict] = useState<CustomPredictor | null>(null);
  const { settings, setLang } = useSettings();

  const autoSpeakRef = useRef(autoSpeak);
  const rateRef = useRef(rate);
  const settingsRef = useRef(settings);
  autoSpeakRef.current = autoSpeak;
  rateRef.current = rate;
  settingsRef.current = settings;
  useServiceWorker();

  // Restore persisted history once (after mount to avoid hydration mismatch).
  const hydrated = useRef(false);
  useEffect(() => {
    const stored = loadHistory();
    if (stored.length > 0) setEntries(stored);
    hydrated.current = true;
  }, []);
  useEffect(() => {
    if (hydrated.current) saveHistory(entries);
  }, [entries]);

  // Custom gestures taught in the Studio become available here automatically.
  useEffect(() => {
    let cancelled = false;
    loadCustomPredictor()
      .then((p) => {
        if (!cancelled && p) setCustomPredict(() => p);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStableGesture = useCallback((g: StableGesture) => {
    const lang = settingsRef.current.lang;
    const phrase = resolvePhrase(g.gesture.phraseKey, g.gesture.phrase, lang);
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      gesture: g.gesture.label,
      phrase,
      confidence: g.confidence,
      at: g.at,
    };
    setCurrent(entry);
    setEntries((prev) => [entry, ...prev].slice(0, 200));
    // Don't spam the transcript with the same phrase consecutively —
    // holding a pose shouldn't repeat the word.
    setTranscript((prev) => {
      const words = prev ? prev.split(" ") : [];
      if (words[words.length - 1] === phrase) return prev;
      return prev ? `${prev} ${phrase}` : phrase;
    });
    setSentenceWords((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.text === phrase) return prev;
      return [...prev, { id: entry.id, text: phrase }].slice(-30);
    });

    if (autoSpeakRef.current && g.confidence >= SPEAK_CONFIDENCE_THRESHOLD) {
      speak(phrase, { rate: rateRef.current, lang: speechLangFor(lang) });
    }
  }, []);

  const { live, metrics, retryModel } = useGesturePipeline(videoEl, active, {
    onStableGesture: handleStableGesture,
    customPredict: customPredict ?? undefined,
  });

  const handleVideoReady = useCallback((video: HTMLVideoElement | null) => {
    setVideoEl(video);
  }, []);

  const speakLang = speechLangFor(settings.lang);

  return (
    <div className="min-h-dvh bg-soft">
      <SkipLink />
      <OfflineIndicator />
      <Navbar />
      <main id="main-content" className="mx-auto max-w-7xl px-5 py-10">
        <header className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 overflow-hidden sm:flex sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2" aria-hidden="true">
              <StickerChip tone="yellow" tilt="left">
                #OnDevice
              </StickerChip>
              <StickerChip tone="violet" tilt="right">
                #14Gestures
              </StickerChip>
              <StickerChip tone="ghost" tilt="none">
                #NoAccount
              </StickerChip>
            </div>
            <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Get ready to{" "}
              <span className="bg-yellow text-yellow-foreground inline-block -rotate-2 rounded-xl px-2.5 shadow-sticker">
                speak
              </span>{" "}
              with your hands
            </h1>
            <p className="mt-2 flex max-w-lg items-center gap-2 text-sm text-muted-foreground">
              Sign in front of the camera — text and speech follow instantly.
              <Squiggle className="h-4 w-16 shrink-0 text-yellow" />
            </p>
          </div>
          <Sparkle className="absolute top-2 right-1/3 hidden h-6 w-6 text-yellow/60 lg:block" />
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hidden rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground md:inline-block"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-1.5" role="group" aria-label="Spoken language">
              {APP_LANGS.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id)}
                  aria-pressed={settings.lang === l.id}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    i === 0 ? "-rotate-3" : "rotate-2",
                    settings.lang === l.id
                      ? "bg-yellow text-yellow-foreground shadow-sticker"
                      : "border border-border bg-card/70 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l.id === "en" ? "EN" : "हिं"}
                </button>
              ))}
            </div>
            <StickerChip tone={active ? "yellow" : "ghost"} tilt="left">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  active ? "bg-yellow-foreground" : "bg-muted-foreground/50",
                )}
                aria-hidden="true"
              />
              {active ? "Session active" : "Session idle"}
            </StickerChip>
          </div>
        </header>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <div className="relative">
              <WebcamPanel active={active} onToggle={setActive} onVideoReady={handleVideoReady} />
              <PerformanceHUD
                metrics={metrics}
                live={live}
                active={active}
                onRetryModel={retryModel}
              />
            </div>
            <GestureHistory entries={entries} height="h-72" />
            <div className="flex justify-end">
              <ExportHistoryButton entries={entries} />
            </div>
          </div>

          <div className="flex flex-col gap-5">
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
            <EmergencyPhrasebook lang={settings.lang} />
          </div>
        </div>

        {/* Screen-reader announcements: the app must be usable without sight. */}
        <div aria-live="polite" className="sr-only">
          {current
            ? `Detected ${current.gesture}: ${current.phrase}, confidence ${Math.round(current.confidence * 100)} percent.`
            : ""}
        </div>

        <div className="mt-5">
          <SentenceBuilder
            words={sentenceWords}
            onRemoveWord={(id) => setSentenceWords((prev) => prev.filter((w) => w.id !== id))}
            onClear={() => setSentenceWords([])}
            onSpeak={() =>
              speak(sentenceWords.map((w) => w.text).join(" "), {
                rate: rateRef.current,
                lang: speakLang,
              })
            }
          />
        </div>
      </main>
    </div>
  );
}
