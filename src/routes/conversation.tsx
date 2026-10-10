"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { SkipLink } from "@/components/a11y/SkipLink";
import { WebcamPanel } from "@/components/dashboard/WebcamPanel";
import { PerformanceHUD } from "@/components/dashboard/PerformanceHUD";
import { Button } from "@/components/ui/button";
import { useGesturePipeline } from "@/hooks/useGesturePipeline";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { speak } from "@/lib/speech";
import type { StableGesture } from "@/lib/vision/types";

const title = "Conversation mode — SignSpeak AI";
const description =
  "Two-way communication: sign language to speech on one side, spoken replies transcribed on the other.";

export const Route = createFileRoute("/conversation")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ConversationPage,
});

type LogEntry = {
  id: string;
  speaker: "signer" | "partner";
  text: string;
  at: Date;
};

function ConversationPage() {
  const [active, setActive] = useState(false);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const logRef = useRef<HTMLDivElement | null>(null);

  useServiceWorker();

  const pushLog = useCallback((speaker: LogEntry["speaker"], text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLog((prev) => [
      ...prev.slice(-49),
      { id: crypto.randomUUID(), speaker, text: trimmed, at: new Date() },
    ]);
  }, []);

  const handleStableGesture = useCallback(
    (g: StableGesture) => pushLog("signer", g.phrase),
    [pushLog],
  );

  const { live, metrics, retryModel } = useGesturePipeline(videoEl, active, {
    onStableGesture: handleStableGesture,
  });

  const rec = useSpeechRecognition({
    onFinal: useCallback((text: string) => pushLog("partner", text), [pushLog]),
  });

  const handleVideoReady = useCallback((video: HTMLVideoElement | null) => {
    setVideoEl(video);
  }, []);

  // Keep the latest message in view.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const lastSignerMessage = [...log].reverse().find((e) => e.speaker === "signer");

  return (
    <div className="min-h-dvh bg-soft">
      <SkipLink />
      <Navbar />
      <main id="main-content" className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="text-2xl font-semibold sm:text-3xl">Conversation mode</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          You sign, they speak — both sides land in one shared transcript.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="relative">
            <WebcamPanel active={active} onToggle={setActive} onVideoReady={handleVideoReady} />
            <PerformanceHUD
              metrics={metrics}
              live={live}
              active={active}
              onRetryModel={retryModel}
            />
          </div>

          <section
            aria-labelledby="partner-heading"
            className="glass-panel flex flex-col rounded-3xl p-5"
          >
            <h2 id="partner-heading" className="text-sm font-semibold">
              Conversation partner
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {rec.supported
                ? "Tap the microphone and speak — your words are transcribed live."
                : "Speech recognition isn't supported in this browser. Try Chrome or Edge."}
            </p>
            <div className="mt-4 flex items-center gap-3">
              {rec.status === "listening" ? (
                <Button variant="outline" className="h-11 rounded-full px-5" onClick={rec.stop}>
                  <MicOff className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Stop listening
                </Button>
              ) : (
                <Button
                  className="h-11 rounded-full px-5"
                  disabled={!rec.supported}
                  onClick={rec.start}
                >
                  <Mic className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Start listening
                </Button>
              )}
              <span className="text-xs text-muted-foreground" role="status">
                {rec.status === "listening"
                  ? rec.interim || "Listening…"
                  : rec.status === "error"
                    ? `Mic error: ${rec.error || "unknown"}`
                    : "Mic idle"}
              </span>
            </div>
            <div className="mt-4 flex-1" />
            <Button
              variant="outline"
              className="h-11 self-start rounded-full px-5"
              disabled={!lastSignerMessage}
              onClick={() => {
                if (lastSignerMessage) speak(lastSignerMessage.text);
              }}
            >
              <Volume2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Voice last signed message
            </Button>
          </section>
        </div>

        <section aria-labelledby="log-heading" className="mt-5">
          <h2 id="log-heading" className="sr-only">
            Conversation transcript
          </h2>
          <div
            ref={logRef}
            aria-live="polite"
            className="glass-panel h-72 overflow-y-auto rounded-3xl p-5"
          >
            {log.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing said yet — sign or speak to begin the conversation.
              </p>
            ) : (
              <ol className="flex flex-col gap-3">
                {log.map((e) => (
                  <li
                    key={e.id}
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      e.speaker === "signer" ? "self-start bg-primary/10" : "self-end bg-muted"
                    }`}
                  >
                    <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {e.speaker === "signer" ? "Signed" : "Spoken"}
                    </span>
                    {e.text}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
