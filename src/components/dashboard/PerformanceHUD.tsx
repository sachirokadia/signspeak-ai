"use client";

import { Activity } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { PipelineMetrics, RawPrediction } from "@/lib/vision/types";
import { cn } from "@/lib/utils";

function statusTone(status: PipelineMetrics["modelStatus"], reduced: boolean): string {
  switch (status) {
    case "ready":
      return "bg-emerald-400";
    case "loading":
      return reduced ? "bg-amber-400" : "bg-amber-400 animate-pulse";
    case "error":
      return "bg-rose-500";
    default:
      return "bg-muted-foreground/40";
  }
}

/**
 * Live telemetry overlay for the gesture pipeline: FPS, inference latency,
 * model state and the current per-frame prediction. These are the numbers to
 * quote in interviews — measured, never estimated.
 */
export function PerformanceHUD({
  metrics,
  live,
  active,
}: {
  metrics: PipelineMetrics;
  live: RawPrediction | null;
  active: boolean;
}) {
  const reducedMotion = useReducedMotion();
  if (!active) return null;

  return (
    <div
      className="pointer-events-none absolute left-3 top-3 z-10 rounded-2xl border border-white/15 bg-black/55 px-3 py-2 text-white backdrop-blur-md"
      role="status"
      aria-label="Pipeline performance"
    >
      <div className="flex items-center gap-2">
        <span
          className={cn("h-2 w-2 rounded-full", statusTone(metrics.modelStatus, reducedMotion))}
          aria-hidden="true"
        />
        <Activity className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
        <span className="text-[11px] font-semibold tabular-nums tracking-wide">
          {metrics.fps} FPS · {metrics.latencyMs} ms
        </span>
        {metrics.degraded && (
          <span className="rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-200">
            ECO
          </span>
        )}
      </div>
      <div className="mt-1.5 min-h-4 text-[11px] tabular-nums text-white/85">
        {metrics.modelStatus === "error" ? (
          <span className="text-rose-300">Model failed to load</span>
        ) : metrics.modelStatus !== "ready" ? (
          <span className="text-white/70">Loading hand model…</span>
        ) : live ? (
          <span>
            {live.gesture.label} · {Math.round(live.confidence * 100)}%
            <span
              className="ml-1.5 inline-block h-1.5 w-16 overflow-hidden rounded-full bg-white/20 align-middle"
              aria-hidden="true"
            >
              <span
                className="block h-full rounded-full bg-emerald-300"
                style={{ width: `${Math.round(live.confidence * 100)}%` }}
              />
            </span>
          </span>
        ) : (
          <span className="text-white/60">Show your hand…</span>
        )}
      </div>
    </div>
  );
}
