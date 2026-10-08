/**
 * GestureDecisionEngine — turns jittery per-frame predictions into deliberate
 * gesture events.
 *
 * Three mechanisms, in order:
 *   1. Stability voting — a gesture must win N consecutive frames.
 *   2. Confidence gating — frames below minConfidence don't count.
 *   3. Cooldown — the same gesture can't re-fire until cooldownMs elapses.
 */
import type { RawPrediction, StableGesture } from "./types";

export type DecisionEngineOptions = {
  stabilityFrames?: number;
  minConfidence?: number;
  cooldownMs?: number;
};

export class GestureDecisionEngine {
  private readonly stabilityFrames: number;
  private readonly minConfidence: number;
  private readonly cooldownMs: number;

  private lastLabel: string | null = null;
  private run = 0;
  private lastEmittedLabel: string | null = null;
  private lastEmitAt = 0;

  constructor(opts: DecisionEngineOptions = {}) {
    this.stabilityFrames = opts.stabilityFrames ?? 8;
    this.minConfidence = opts.minConfidence ?? 0.75;
    this.cooldownMs = opts.cooldownMs ?? 1500;
  }

  reset(): void {
    this.lastLabel = null;
    this.run = 0;
  }

  /**
   * Feed one frame's prediction. Returns a StableGesture exactly once per
   * confirmed gesture, otherwise null.
   */
  push(pred: RawPrediction | null, now: number = Date.now()): StableGesture | null {
    const label = pred && pred.confidence >= this.minConfidence ? pred.gesture.id : null;

    if (label && label === this.lastLabel) {
      this.run += 1;
    } else {
      this.lastLabel = label;
      this.run = label ? 1 : 0;
    }

    if (!label || !pred || this.run < this.stabilityFrames) return null;
    if (label === this.lastEmittedLabel && now - this.lastEmitAt < this.cooldownMs) {
      return null;
    }

    this.lastEmittedLabel = label;
    this.lastEmitAt = now;
    this.run = 0; // require a fresh stable run before the next emission
    return {
      gesture: pred.gesture,
      phrase: pred.gesture.phrase,
      confidence: pred.confidence,
      at: new Date(now),
    };
  }
}
