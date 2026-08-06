"use client";

import { useEffect, useRef } from "react";
import { Copy, Pause, Play, Trash2, Volume2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { formatTime, type HistoryEntry } from "@/lib/gestures";

/**
 * TranscriptCard
 * Structured translation log — newest entry at the top of a fixed-height
 * scrollable container. Each row shows:
 *   timestamp · gesture name (bold) · translated phrase · confidence %
 *
 * Props
 *   entries  — HistoryEntry[] newest-first (same array as GestureHistory)
 *   rate     — speech rate for Speak action
 *   active   — whether the session is running
 *   onToggle — toggle session on/off
 *   onClear  — wipe entries and current gesture
 */
export function TranscriptCard({
  entries,
  rate,
  active,
  onToggle,
  onClear,
}: {
  entries: HistoryEntry[];
  rate: number;
  active: boolean;
  onToggle: (next: boolean) => void;
  onClear: () => void;
}) {
  const prefersReduced = useReducedMotion();

  // Auto-scroll to the top (newest entry) whenever entries change.
  const scrollTopRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollTopRef.current?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
  }, [entries, prefersReduced]);

  // Build full phrase string from entries for Speak / Copy actions.
  const fullTranscript = entries
    .slice()
    .reverse()
    .map((e) => e.phrase)
    .join(" ");

  function speak() {
    if (!fullTranscript.trim()) {
      toast("Nothing to speak yet", { description: "Start signing to build a sentence." });
      return;
    }
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast("Speech output unavailable", {
        description: "This browser doesn't support speech synthesis.",
      });
      return;
    }
    const utterance = new SpeechSynthesisUtterance(fullTranscript);
    utterance.rate = rate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function copy() {
    if (!fullTranscript.trim()) {
      toast("Nothing to copy yet");
      return;
    }
    navigator.clipboard?.writeText(fullTranscript).then(() => toast("Copied to clipboard"));
  }

  return (
    <section
      aria-label="Live translation transcript"
      className="glass-panel flex flex-col rounded-3xl p-6"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">Live translation</h2>
          <p className="truncate text-xs text-muted-foreground">
            {entries.length === 0
              ? "Waiting for your first gesture…"
              : `${entries.length} translation${entries.length === 1 ? "" : "s"}`}
          </p>
        </div>

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
            <><Pause className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />Pause</>
          ) : (
            <><Play className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />Resume</>
          )}
        </Button>
      </div>

      {/* ── Entry list ── */}
      <ScrollArea className="mt-4 h-52 rounded-2xl border border-border bg-background/60">
        {/* Scroll sentinel — sits at the top so auto-scroll works (newest-first) */}
        <div ref={scrollTopRef} aria-hidden="true" />

        <ul
          aria-live="polite"
          aria-atomic="false"
          aria-label="Translation output"
          className="divide-y divide-border/60"
        >
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.li
                key={entry.id}
                initial={prefersReduced ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="px-4 py-3"
              >
                {/* Timestamp */}
                <p className="text-[0.625rem] tabular-nums text-muted-foreground/60 uppercase tracking-wide">
                  {formatTime(entry.at)}
                </p>

                {/* Gesture name */}
                <p className="mt-0.5 text-xs font-bold tracking-wide text-foreground/80 uppercase">
                  {entry.gesture.replace(/_/g, " ")}
                </p>

                {/* Phrase */}
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {entry.phrase}
                </p>

                {/* Confidence */}
                <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                  Confidence: {Math.round(entry.confidence * 100)}%
                </p>
              </motion.li>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {entries.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground/50">
              Recognised translations will appear here.
            </li>
          )}
        </ul>
      </ScrollArea>

      {/* ── Actions ── */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={speak}
          className="bg-brand h-11 rounded-full px-5
                     transition-[transform,box-shadow] duration-[180ms]
                     hover:scale-[1.02] hover:shadow-lift
                     focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Speak full transcript aloud"
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
          aria-label="Clear all translations"
        >
          <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Clear
        </Button>
      </div>
    </section>
  );
}
