"use client";

import { createFileRoute } from "@tanstack/react-router";
import { CircleStop, FlaskConical, Mic, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { SkipLink } from "@/components/a11y/SkipLink";
import { WebcamPanel } from "@/components/dashboard/WebcamPanel";
import { Button } from "@/components/ui/button";
import { handTracker } from "@/lib/vision/handTracker";
import { vectorFromLandmarks, KnnClassifier } from "@/lib/vision/trainer";
import { deleteSamples, listGestureSamples, saveGestureSamples } from "@/lib/vision/customGestures";
import { useServiceWorker } from "@/hooks/useServiceWorker";

const title = "Gesture Studio — SignSpeak AI";
const description =
  "Teach SignSpeak your own gestures: record samples from your webcam, train an on-device classifier, and test it live.";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: StudioPage,
});

type GestureGroup = { label: string; count: number; ids: string[] };

const SAMPLES_PER_GESTURE = 30;
const SAMPLE_INTERVAL_MS = 100;

function StudioPage() {
  const [active, setActive] = useState(false);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [label, setLabel] = useState("");
  const [groups, setGroups] = useState<GestureGroup[]>([]);
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testing, setTesting] = useState(false);
  const [testPred, setTestPred] = useState<{
    label: string;
    confidence: number;
  } | null>(null);
  const [notice, setNotice] = useState("");

  useServiceWorker();

  const refresh = useCallback(async () => {
    try {
      const samples = await listGestureSamples();
      const map = new Map<string, GestureGroup>();
      for (const s of samples) {
        const g = map.get(s.label) ?? { label: s.label, count: 0, ids: [] };
        g.count += 1;
        g.ids.push(s.id);
        map.set(s.label, g);
      }
      setGroups([...map.values()].sort((a, b) => a.label.localeCompare(b.label)));
    } catch {
      setNotice("Couldn't read saved gestures in this browser.");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleVideoReady = useCallback((video: HTMLVideoElement | null) => {
    setVideoEl(video);
  }, []);

  // Recording loop: capture one sample every 100ms until the target count.
  useEffect(() => {
    if (!recording || !videoEl) return;
    let raf = 0;
    let cancelled = false;
    const vectors: number[][] = [];
    let lastCapture = 0;

    async function boot() {
      try {
        await handTracker.ensureLoaded();
      } catch {
        if (!cancelled) {
          setNotice("Hand-tracking model failed to load.");
          setRecording(false);
        }
        return;
      }
      const tick = () => {
        if (cancelled) return;
        const now = performance.now();
        const res = handTracker.detect(videoEl!);
        if (res && now - lastCapture >= SAMPLE_INTERVAL_MS) {
          lastCapture = now;
          vectors.push(vectorFromLandmarks(res.landmarks));
          setProgress(vectors.length / SAMPLES_PER_GESTURE);
        }
        if (vectors.length >= SAMPLES_PER_GESTURE) {
          void (async () => {
            try {
              await saveGestureSamples(label.trim(), vectors);
              if (!cancelled) {
                setNotice(`Saved “${label.trim()}” (${vectors.length} samples).`);
                setLabel("");
                void refresh();
              }
            } catch {
              if (!cancelled) setNotice("Couldn't save samples in this browser.");
            } finally {
              if (!cancelled) {
                setRecording(false);
                setProgress(0);
              }
            }
          })();
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      tick();
    }

    void boot();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [recording, videoEl, label, refresh]);

  // Test loop: live k-NN prediction over saved samples.
  useEffect(() => {
    if (!testing || !videoEl) {
      setTestPred(null);
      return;
    }
    let raf = 0;
    let cancelled = false;
    let lastKey = "";

    async function boot() {
      let knn: KnnClassifier | null = null;
      try {
        await handTracker.ensureLoaded();
        const samples = await listGestureSamples();
        if (samples.length === 0) {
          setNotice("Teach a gesture first, then test it.");
          setTesting(false);
          return;
        }
        knn = new KnnClassifier(samples);
      } catch {
        setTesting(false);
        return;
      }
      const tick = () => {
        if (cancelled) return;
        const res = handTracker.detect(videoEl!);
        if (res && knn) {
          const pred = knn.predict(vectorFromLandmarks(res.landmarks));
          const key = pred ? `${pred.label}:${Math.round(pred.confidence * 20)}` : "none";
          if (key !== lastKey) {
            lastKey = key;
            setTestPred(pred);
          }
        }
        raf = requestAnimationFrame(tick);
      };
      tick();
    }

    void boot();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [testing, videoEl]);

  const canRecord = active && !!videoEl && !recording && label.trim().length > 0;

  const handleDelete = useCallback(
    async (g: GestureGroup) => {
      await deleteSamples(g.ids);
      setNotice(`Deleted “${g.label}”.`);
      void refresh();
    },
    [refresh],
  );

  return (
    <div className="min-h-dvh bg-soft">
      <SkipLink />
      <Navbar />
      <main id="main-content" className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="text-2xl font-semibold sm:text-3xl">Gesture Studio</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Teach SignSpeak gestures of your own — a name sign, a family sign, anything. Samples never
          leave this browser; the classifier trains instantly on-device.
        </p>

        {notice ? (
          <p role="status" className="mt-4 text-sm text-muted-foreground">
            {notice}
          </p>
        ) : null}

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <WebcamPanel active={active} onToggle={setActive} onVideoReady={handleVideoReady} />

          <div className="flex flex-col gap-5">
            <section aria-labelledby="teach-heading" className="glass-panel rounded-3xl p-5">
              <h2 id="teach-heading" className="flex items-center gap-2 text-sm font-semibold">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Teach a new gesture
              </h2>
              <div className="mt-3 flex gap-2">
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder='e.g. "Mum", "medicine", "tired"'
                  aria-label="Gesture label"
                  disabled={recording}
                  className="h-11 min-w-0 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
                {recording ? (
                  <Button
                    variant="outline"
                    className="h-11 rounded-full px-5"
                    onClick={() => setRecording(false)}
                  >
                    <CircleStop className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    className="h-11 rounded-full px-5"
                    disabled={!canRecord}
                    onClick={() => {
                      setNotice("");
                      setProgress(0);
                      setRecording(true);
                    }}
                  >
                    <Mic className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    Record
                  </Button>
                )}
              </div>
              {recording ? (
                <div className="mt-3">
                  <div
                    className="h-2 overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-valuenow={Math.round(progress * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Recording progress"
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-[width]"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Hold the gesture steady — {Math.round(progress * 100)}%
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Start the camera, type a label, then hold the gesture for about 3 seconds while{" "}
                  {SAMPLES_PER_GESTURE} samples are captured.
                </p>
              )}
            </section>

            <section aria-labelledby="test-heading" className="glass-panel rounded-3xl p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 id="test-heading" className="flex items-center gap-2 text-sm font-semibold">
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  Test your gestures
                </h2>
                <Button
                  variant={testing ? "outline" : "default"}
                  className="h-10 rounded-full px-4"
                  disabled={!active || groups.length === 0}
                  onClick={() => setTesting((t) => !t)}
                >
                  {testing ? "Stop test" : "Start test"}
                </Button>
              </div>
              <div className="mt-3 min-h-10 text-sm" role="status" aria-live="polite">
                {!testing ? (
                  <span className="text-muted-foreground">
                    {groups.length === 0
                      ? "No custom gestures yet."
                      : "Perform a gesture you taught to see it recognised."}
                  </span>
                ) : testPred ? (
                  <span>
                    <strong>{testPred.label}</strong>
                    <span className="text-muted-foreground">
                      {" "}
                      · {Math.round(testPred.confidence * 100)}% match
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Show your hand…</span>
                )}
              </div>
            </section>

            <section aria-labelledby="saved-heading" className="glass-panel rounded-3xl p-5">
              <h2 id="saved-heading" className="text-sm font-semibold">
                Your gestures ({groups.length})
              </h2>
              {groups.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Nothing saved yet — your gestures will appear here and become available on the
                  dashboard automatically.
                </p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {groups.map((g) => (
                    <li
                      key={g.label}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-4 py-2.5"
                    >
                      <span className="text-sm">
                        <strong>{g.label}</strong>
                        <span className="text-muted-foreground"> · {g.count} samples</span>
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        aria-label={`Delete gesture ${g.label}`}
                        onClick={() => void handleDelete(g)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
