"use client";

import { AnimatePresence, motion } from "motion/react";
import { Hand } from "lucide-react";
import type { HistoryEntry } from "@/lib/gestures";
import { formatTime } from "@/lib/gestures";

/**
 * GestureCard
 * Displays the most-recently detected gesture name and its recognition time.
 * The gesture text animates in/out with a vertical slide so transitions
 * feel responsive without being distracting.
 *
 * Props
 *   current — the latest HistoryEntry, or null when no gesture is detected
 */
export function GestureCard({ current }: { current: HistoryEntry | null }) {
  return (
    <section
      aria-label="Detected gesture"
      className="glass-panel flex flex-col rounded-3xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"
          aria-hidden="true"
        >
          <Hand className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-semibold">Detected gesture</h2>
      </div>

      {/* Animated gesture name */}
      <div className="mt-4 flex-1" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          <motion.p
            key={current?.id ?? "none"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-2xl font-semibold leading-tight"
          >
            {current?.gesture ?? (
              <span className="text-muted-foreground/50">—</span>
            )}
          </motion.p>
        </AnimatePresence>

        {/* Translated phrase */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`phrase-${current?.id ?? "none"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="mt-1 text-sm text-muted-foreground"
          >
            {current?.phrase ?? "No gesture in frame"}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Timestamp */}
      <p className="mt-4 text-xs text-muted-foreground/60">
        {current
          ? `Recognised at ${formatTime(current.at)}`
          : "Waiting for a sign…"}
      </p>
    </section>
  );
}
