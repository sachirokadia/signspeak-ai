"use client";

import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, RotateCcw, Trophy } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { SkipLink } from "@/components/a11y/SkipLink";
import { WebcamPanel } from "@/components/dashboard/WebcamPanel";
import { PerformanceHUD } from "@/components/dashboard/PerformanceHUD";
import { Button } from "@/components/ui/button";
import { useGesturePipeline } from "@/hooks/useGesturePipeline";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { GESTURE_DEFINITIONS } from "@/lib/vision/classifier";
import {
  loadCustomPredictor,
  listGestureSamples,
  type CustomPredictor,
} from "@/lib/vision/customGestures";

const title = "Learn mode — SignSpeak AI";
const description = "Practice hand gestures with live feedback: hold each sign steady to score.";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LearnPage,
});

type Target = {
  id: string;
  label: string;
  hint: string;
};

const HINTS: Record<string, string> = {
  "open-palm": "Spread all five fingers wide, palm facing the camera.",
  fist: "Close your hand into a tight fist.",
  "thumbs-up": "Thumb pointing up, other fingers curled in.",
  peace: "Index and middle fingers up in a V, the rest curled.",
  point: "Index finger extended toward the camera, the rest curled.",
  "ok-sign": "Touch your thumb tip to your index fingertip, other fingers up.",
};

const BEST_KEY = "signspeak-learn-best-v1";
const DWELL_MS = 2000;

function loadBest(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) ?? "{}") as Record<string, number>;
  } catch {
    return {};
  }
}

function LearnPage() {
  const [active, setActive] = useState(false);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [targets, setTargets] = useState<Target[]>(() =>
    GESTURE_DEFINITIONS.map((g) => ({
      id: g.id,
      label: g.label,
      hint: HINTS[g.id] ?? "Perform the gesture steadily.",
    })),
  );
  const [targetId, setTargetId] = useState<string>(GESTURE_DEFINITIONS[0]!.id);
  const [dwell, setDwell] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [best, setBest] = useState<Record<string, number>>({});
  const [customPredict, setCustomPredict] = useState<CustomPredictor | undefined>(undefined);

  useServiceWorker();

  const target = useMemo(
    () => targets.find((t) => t.id === targetId) ?? targets[0]!,
    [targets, targetId],
  );

  // Load custom gestures as extra practice targets.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [samples, predictor] = await Promise.all([
          listGestureSamples(),
          loadCustomPredictor(),
        ]);
        if (cancelled) return;
        if (predictor) setCustomPredict(() => predictor);
        const labels = [...new Set(samples.map((s) => s.label))];
        if (labels.length > 0) {
          setTargets((prev) => [
            ...prev,
            ...labels
              .filter((l) => !prev.some((t) => t.id === `custom-${l}`))
              .map((l) => ({
                id: `custom-${l}`,
                label: l,
                hint: "Perform the gesture exactly as you taught it.",
              })),
          ]);
        }
      } catch {
        // Custom gestures unavailable — built-ins still work.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setBest(loadBest());
  }, []);

  const { live, metrics } = useGesturePipeline(videoEl, active, {
    customPredict,
  });

  const handleVideoReady = useCallback((video: HTMLVideoElement | null) => {
    setVideoEl(video);
  }, []);

  // Dwell scoring: hold the target gesture steady to fill the ring.
  const dwellRef = useRef({ ms: 0, confSum: 0, confN: 0 });
  useEffect(() => {
    if (!active) return;
    const interval = window.setInterval(() => {
      const d = dwellRef.current;
      if (live?.gesture.id === target.id) {
        d.ms += 100;
        d.confSum += live.confidence;
        d.confN += 1;
        if (d.ms >= DWELL_MS) {
          const score = Math.round((d.confSum / Math.max(d.confN, 1)) * 100);
          setLastScore(score);
          setBest((prev) => {
            const next = { ...prev, [target.id]: Math.max(prev[target.id] ?? 0, score) };
            try {
              localStorage.setItem(BEST_KEY, JSON.stringify(next));
            } catch {
              // ignore
            }
            return next;
          });
          d.ms = 0;
          d.confSum = 0;
          d.confN = 0;
        }
      } else {
        d.ms = Math.max(0, d.ms - 200);
      }
      setDwell(d.ms / DWELL_MS);
    }, 100);
    return () => window.clearInterval(interval);
  }, [active, live, target.id]);

  const selectTarget = (id: string) => {
    setTargetId(id);
    dwellRef.current = { ms: 0, confSum: 0, confN: 0 };
    setDwell(0);
    setLastScore(null);
  };

  const progress = Math.min(1, dwell);

  return (
    <div className="min-h-dvh bg-soft">
      <SkipLink />
      <Navbar />
      <main id="main-content" className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="flex items-center gap-2 text-2xl font-semibold sm:text-3xl">
          <GraduationCap className="h-7 w-7" aria-hidden="true" />
          Learn mode
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Pick a gesture, then hold it steady in front of the camera until the ring fills. Your best
          scores are saved on this device.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="relative">
            <WebcamPanel active={active} onToggle={setActive} onVideoReady={handleVideoReady} />
            <PerformanceHUD metrics={metrics} live={live} active={active} />
          </div>

          <div className="flex flex-col gap-5">
            <section
              aria-labelledby="practice-heading"
              className="glass-panel rounded-3xl p-6 text-center"
            >
              <h2 id="practice-heading" className="text-sm font-semibold text-muted-foreground">
                Now practising
              </h2>
              <p className="mt-1 text-3xl font-bold">{target.label}</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{target.hint}</p>

              <div
                className="relative mx-auto mt-5 h-36 w-36"
                role="progressbar"
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Hold progress for ${target.label}`}
              >
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    strokeWidth="10"
                    className="stroke-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="stroke-primary transition-[stroke-dashoffset]"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - progress)}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="text-2xl font-bold tabular-nums">
                    {Math.round(progress * 100)}%
                  </span>
                </div>
              </div>

              <div className="mt-4 flex min-h-8 items-center justify-center gap-4 text-sm">
                {lastScore !== null ? (
                  <span role="status">
                    Last attempt: <strong>{lastScore}</strong>
                  </span>
                ) : null}
                {best[target.id] ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <Trophy className="h-4 w-4" aria-hidden="true" />
                    Best: <strong>{best[target.id]}</strong>
                  </span>
                ) : null}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-2 rounded-full"
                onClick={() => {
                  dwellRef.current = { ms: 0, confSum: 0, confN: 0 };
                  setDwell(0);
                  setLastScore(null);
                }}
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Reset attempt
              </Button>
            </section>

            <section aria-labelledby="pick-heading" className="glass-panel rounded-3xl p-5">
              <h2 id="pick-heading" className="text-sm font-semibold">
                Choose a gesture ({targets.length})
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {targets.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => selectTarget(t.id)}
                    aria-pressed={t.id === targetId}
                    className={`rounded-2xl border px-3 py-2.5 text-left text-sm transition-colors ${
                      t.id === targetId
                        ? "border-primary bg-primary/10 font-semibold"
                        : "border-border bg-background/60 hover:border-primary/50"
                    }`}
                  >
                    <span className="block truncate">{t.label}</span>
                    {best[t.id] ? (
                      <span className="text-xs text-amber-600 dark:text-amber-400">
                        Best {best[t.id]}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not tried</span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
