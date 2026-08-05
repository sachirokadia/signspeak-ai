"use client";

import { Copy, Pause, Play, Trash2, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * TranscriptCard
 * Displays the accumulated translation transcript.
 * Responsibilities:
 *   - aria-live region so screen readers announce new phrases
 *   - Speak (Web Speech API), Copy to clipboard, Clear actions
 *   - Pause / Resume session toggle
 *
 * Props
 *   transcript  — full accumulated text string
 *   rate        — speech rate multiplier (0.5–1.8)
 *   active      — whether the session is running
 *   onToggle    — toggle session on/off
 *   onClear     — clear transcript and current gesture
 */
export function TranscriptCard({
  transcript,
  rate,
  active,
  onToggle,
  onClear,
}: {
  transcript: string;
  rate: number;
  active: boolean;
  onToggle: (next: boolean) => void;
  onClear: () => void;
}) {
  function speak() {
    if (!transcript.trim()) {
      toast("Nothing to speak yet", {
        description: "Start signing to build a sentence.",
      });
      return;
    }
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast("Speech output unavailable", {
        description: "This browser doesn't support speech synthesis.",
      });
      return;
    }
    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.rate = rate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function copy() {
    if (!transcript.trim()) {
      toast("Nothing to copy yet");
      return;
    }
    navigator.clipboard?.writeText(transcript).then(() => {
      toast("Copied to clipboard");
    });
  }

  return (
    <section
      aria-label="Live translation transcript"
      className="glass-panel flex flex-col rounded-3xl p-6"
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">Live translation</h2>
          <p className="truncate text-xs text-muted-foreground">
            Updates as each sign is recognised
          </p>
        </div>

        {/* Pause / Resume */}
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 rounded-full transition-[transform,box-shadow] duration-[180ms]
                     hover:shadow-soft focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onToggle(!active)}
          aria-pressed={active}
          aria-label={active ? "Pause session" : "Resume session"}
        >
          {active ? (
            <>
              <Pause className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Resume
            </>
          )}
        </Button>
      </div>

      {/* Transcript area — aria-live announces new phrases to screen readers */}
      <div
        aria-live="polite"
        aria-atomic="false"
        aria-label="Translation output"
        className="mt-5 min-h-32 rounded-2xl border border-border bg-background/60 p-5
                   transition-colors duration-200"
      >
        <AnimatePresence mode="wait">
          {transcript ? (
            <motion.p
              key="has-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-display text-xl font-medium leading-relaxed text-pretty"
            >
              {transcript}
            </motion.p>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-display text-xl font-medium text-muted-foreground/50"
            >
              Waiting for your first gesture…
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Action row */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={speak}
          className="bg-brand h-11 rounded-full px-5
                     transition-[transform,box-shadow] duration-[180ms]
                     hover:scale-[1.02] hover:shadow-lift
                     focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Speak transcript aloud"
        >
          <Volume2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Speak
        </Button>

        <Button
          variant="outline"
          className="h-11 rounded-full px-5
                     transition-[transform,box-shadow] duration-[180ms]
                     hover:shadow-soft
                     focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={copy}
          aria-label="Copy transcript to clipboard"
        >
          <Copy className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Copy
        </Button>

        <Button
          variant="ghost"
          className="h-11 rounded-full px-5
                     transition-colors duration-150
                     focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={onClear}
          aria-label="Clear transcript"
        >
          <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Clear
        </Button>
      </div>
    </section>
  );
}
