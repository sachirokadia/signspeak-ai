import { motion } from "motion/react";

/**
 * SessionBadge
 * Reusable pill that communicates the current session / connection state.
 * The dot pulses only when status is "live" to draw attention without noise.
 *
 * Props
 *   status  — "idle" | "starting" | "live" | "error"
 *   label   — override the auto-derived label if needed
 */

type BadgeStatus = "idle" | "starting" | "live" | "error";

const dotColour: Record<BadgeStatus, string> = {
  idle: "bg-muted-foreground/50",
  starting: "bg-amber-400",
  live: "bg-emerald-400",
  error: "bg-destructive",
};

const defaultLabels: Record<BadgeStatus, string> = {
  idle: "Session idle",
  starting: "Starting…",
  live: "Session active",
  error: "Camera error",
};

export function SessionBadge({
  status,
  label,
}: {
  status: BadgeStatus;
  label?: string;
}) {
  const text = label ?? defaultLabels[status];

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={text}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border
                 bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground
                 backdrop-blur"
    >
      {status === "live" ? (
        <span
          className={`h-2 w-2 animate-pulse rounded-full ${dotColour[status]}`}
          aria-hidden="true"
        />
      ) : (
        <span
          className={`h-2 w-2 rounded-full ${dotColour[status]}`}
          aria-hidden="true"
        />
      )}
      <motion.span
        key={text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {text}
      </motion.span>
    </span>
  );
}
