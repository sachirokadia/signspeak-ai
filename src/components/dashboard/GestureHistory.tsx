"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { History as HistoryIcon, Trash2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTime, type HistoryEntry } from "@/lib/gestures";

/**
 * GestureHistory
 * Scrollable, animated list of past recognised gestures.
 *
 * Improvements over original:
 *   - useReducedMotion: disables entry animations when OS preference is set
 *   - role="feed" + aria-label for screen reader landmark navigation
 *   - aria-setsize / aria-posinset on each entry for list context
 *   - Confidence badge colour-coded (green ≥ 90, amber 70–89, red < 70)
 *   - Optional onClear callback to wipe all entries
 *   - Dark mode uses surface/accent tokens (no hardcoded colours)
 *
 * Props
 *   entries    — array of HistoryEntry to display (newest first)
 *   className  — additional wrapper classes
 *   height     — Tailwind height class for the scroll area, e.g. "h-80"
 *   onClear    — optional; if provided, a clear-all button appears in the header
 */

function confidenceBadgeClass(confidence: number): string {
  const pct = Math.round(confidence * 100);
  if (pct >= 90) return "bg-primary/10 text-primary";
  if (pct >= 70) return "bg-amber-400/15 text-amber-700 dark:text-amber-400";
  return "bg-destructive/10 text-destructive";
}

export function GestureHistory({
  entries,
  className = "",
  height = "h-80",
  onClear,
}: {
  entries: HistoryEntry[];
  className?: string;
  height?: string;
  onClear?: () => void;
}) {
  const prefersReduced = useReducedMotion();

  function replay(entry: HistoryEntry) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(entry.phrase);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <section
      aria-label="Gesture history"
      className={`glass-panel flex flex-col overflow-hidden rounded-3xl ${className}`}
    >
      {/* ── Header ── */}
      <header className="flex items-center gap-2 border-b border-border px-6 py-4">
        <HistoryIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-sm font-semibold">Gesture history</h2>

        <span className="ml-auto text-xs text-muted-foreground">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>

        {/* Clear all — only shown when caller provides onClear */}
        {onClear && entries.length > 0 ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Clear all history"
            className="ml-1 h-7 w-7 rounded-full text-muted-foreground
                       transition-colors duration-150 hover:text-destructive
                       focus-visible:ring-2 focus-visible:ring-ring"
            onClick={onClear}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        ) : null}
      </header>

      {/* ── Scrollable entry list ── */}
      <ScrollArea className={height}>
        <ul
          role="feed"
          aria-label="Recognised phrases"
          aria-busy={false}
          className="divide-y divide-border"
        >
          <AnimatePresence initial={false}>
            {entries.map((entry, index) => (
              <motion.li
                key={entry.id}
                role="article"
                aria-label={`${entry.phrase}, ${entry.gesture}, ${formatTime(entry.at)}`}
                aria-posinset={index + 1}
                aria-setsize={entries.length}
                layout={!prefersReduced}
                initial={prefersReduced ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                {...(!prefersReduced && { exit: { opacity: 0, height: 0 } })}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-6 py-4
                           transition-colors duration-150
                           hover:bg-surface"
              >
                {/* Phrase + gesture meta */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{entry.phrase}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {entry.gesture}
                    <span className="mx-1 opacity-40">·</span>
                    {formatTime(entry.at)}
                  </p>
                </div>

                {/* Confidence badge + replay */}
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums
                                ${confidenceBadgeClass(entry.confidence)}`}
                    aria-label={`${Math.round(entry.confidence * 100)}% confidence`}
                  >
                    {Math.round(entry.confidence * 100)}%
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Replay: ${entry.phrase}`}
                    className="h-9 w-9 rounded-full transition-[transform,box-shadow] duration-[180ms]
                               hover:shadow-soft focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => replay(entry)}
                  >
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {entries.length === 0 ? (
            <li className="px-6 py-10 text-center">
              <HistoryIcon className="mx-auto h-8 w-8 text-muted-foreground/30" aria-hidden="true" />
              <p className="mt-3 text-sm text-muted-foreground">
                Recognised phrases will appear here.
              </p>
            </li>
          ) : null}
        </ul>
      </ScrollArea>
    </section>
  );
}
