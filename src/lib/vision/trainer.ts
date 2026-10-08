"use client";

/**
 * Few-shot custom-gesture trainer: k-NN over normalised landmark vectors.
 *
 * Deliberately simple and honest — with 20–40 samples per gesture this is
 * surprisingly effective, trains instantly, and every prediction is
 * explainable (nearest neighbours). The same normalised feature vector
 * defined in landmarks.ts is used, so features stay consistent.
 */
import { normaliseLandmarks } from "./landmarks";
import type { Vec3 } from "./types";

export type GestureSample = {
  id: string;
  label: string;
  /** 63-dim normalised landmark vector. */
  vector: number[];
  createdAt: number;
};

export function vectorFromLandmarks(lm: Vec3[]): number[] {
  return normaliseLandmarks(lm);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!;
    const y = b[i]!;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
}

export type KnnPrediction = {
  label: string;
  /** 0..1 — similarity-derived, uncalibrated. */
  confidence: number;
};

export class KnnClassifier {
  private readonly k: number;

  constructor(
    private readonly samples: GestureSample[],
    k = 5,
  ) {
    this.k = Math.max(1, k);
  }

  get labels(): string[] {
    return [...new Set(this.samples.map((s) => s.label))];
  }

  get sampleCount(): number {
    return this.samples.length;
  }

  predict(vector: number[]): KnnPrediction | null {
    if (this.samples.length === 0) return null;
    const scored = this.samples.map((s) => ({
      sample: s,
      sim: cosineSimilarity(vector, s.vector),
    }));
    scored.sort((a, b) => b.sim - a.sim);
    const top = scored.slice(0, Math.min(this.k, scored.length));

    // Similarity-weighted majority vote.
    const votes = new Map<string, number>();
    for (const { sample, sim } of top) {
      votes.set(sample.label, (votes.get(sample.label) ?? 0) + Math.max(0, sim));
    }
    let best: string | null = null;
    let bestScore = -Infinity;
    for (const [label, score] of votes) {
      if (score > bestScore) {
        best = label;
        bestScore = score;
      }
    }
    if (!best) return null;
    const bestSim = top.find((t) => t.sample.label === best)?.sim ?? 0;
    // Map similarity to a conservative confidence: only near-identical
    // matches score highly.
    const confidence = Math.round(Math.max(0, Math.min(1, (bestSim - 0.75) / 0.25)) * 100) / 100;
    return { label: best, confidence };
  }
}
