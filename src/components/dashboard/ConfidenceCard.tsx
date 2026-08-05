"use client";

import { motion } from "motion/react";
import { Gauge } from "lucide-react";

/**
 * ConfidenceCard
 * Displays the model's recognition confidence for the current gesture.
 * The bar animates to the new percentage on every prediction update.
 * Colour coding gives users an immediate quality signal without requiring
 * them to read the number:
 *   ≥ 90% — brand gradient (high certainty)
 *   70–89% — amber        (moderate certainty)
 *   < 70%  — destructive  (low certainty)
 *
 * Props
 *   confidence — 0–100 integer; 0 means no prediction yet
 */

function barColour(confidence: number): string {
  if (confidence >= 90) return "bg-brand";
  if (confidence >= 70) return "bg-amber-400";
  if (confidence > 0) return "bg-destructive";
  return "bg-muted";
}

function contextLabel(confidence: number): string {
  if (confidence >= 90) return "High certainty — safe to speak automatically.";
  if (confidence >= 70) return "Moderate certainty — confirm before speaking.";
  if (confidence > 0) return "Low certainty — gesture may be unclear.";
  return "Waiting for a prediction.";
}

export function ConfidenceCard({ confidence }: { confidence: number }) {
  const pct = Math.max(0, Math.min(100, confidence));

  return (
    <section
      aria-label="Recognition confidence"
      className="glass-panel flex flex-col rounded-3xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"
            aria-hidden="true"
          >
            <Gauge className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold">Confidence</h2>
        </div>

        {/* Numeric readout */}
        <motion.span
          key={pct}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-2xl font-semibold text-gradient tabular-nums"
          aria-hidden="true"
        >
          {pct}%
        </motion.span>
      </div>

      {/* Bar */}
      <div
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Recognition confidence ${pct}%`}
        className="mt-5 h-2 overflow-hidden rounded-full bg-muted"
      >
        <motion.div
          className={`h-full rounded-full ${barColour(pct)}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Context label */}
      <motion.p
        key={contextLabel(pct)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="mt-3 text-xs leading-relaxed text-muted-foreground"
      >
        {contextLabel(pct)}
      </motion.p>
    </section>
  );
}
