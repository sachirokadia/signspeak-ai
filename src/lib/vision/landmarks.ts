/**
 * Landmark feature extraction for MediaPipe hand landmarks.
 *
 * MediaPipe hand topology (21 points):
 *   0        wrist
 *   1-4      thumb (CMC, MCP, IP, tip)
 *   5-8      index (MCP, PIP, DIP, tip)
 *   9-12     middle (MCP, PIP, DIP, tip)
 *   13-16    ring (MCP, PIP, DIP, tip)
 *   17-20    pinky (MCP, PIP, DIP, tip)
 */
import type { FingerName, FingerStates, Vec3 } from "./types";

const FINGER_JOINTS: Record<Exclude<FingerName, "thumb">, { pip: number; tip: number }> = {
  index: { pip: 6, tip: 8 },
  middle: { pip: 10, tip: 12 },
  ring: { pip: 14, tip: 16 },
  pinky: { pip: 18, tip: 20 },
};

function dist(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  // z is noisier and in a different scale; down-weight it.
  const dz = (a.z - b.z) * 0.5;
  return Math.hypot(dx, dy, dz);
}

/**
 * Classify each finger as extended/folded by comparing tip-vs-PIP distance
 * from the wrist. Returns a crispness score (0..1) describing how decisively
 * the hand matches the reported states — used to derive confidence.
 */
export function analyseFingers(lm: Vec3[]): {
  states: FingerStates;
  crispness: number;
} {
  const wrist = lm[0]!;
  const scores: number[] = [];
  const states = {} as FingerStates;

  for (const [name, j] of Object.entries(FINGER_JOINTS)) {
    const tipD = dist(lm[j.tip]!, wrist);
    const pipD = dist(lm[j.pip]!, wrist);
    const ratio = tipD / Math.max(pipD, 1e-6);
    const extended = ratio > 1.12;
    const folded = ratio < 0.98;
    // Distance from the ambiguous band [0.98, 1.12] → crispness.
    const crisp = extended
      ? Math.min(1, (ratio - 1.12) / 0.25)
      : folded
        ? Math.min(1, (0.98 - ratio) / 0.2)
        : 0;
    states[name as FingerName] = extended;
    scores.push(extended || folded ? 0.5 + crisp * 0.5 : 0.25);
  }

  // Thumb: extended when the tip sits far from the pinky MCP
  // relative to the thumb MCP (rotation-robust heuristic).
  const pinkyMcp = lm[17]!;
  const tRatio = dist(lm[4]!, pinkyMcp) / Math.max(dist(lm[2]!, pinkyMcp), 1e-6);
  const thumbExtended = tRatio > 1.15;
  states.thumb = thumbExtended;
  scores.push(Math.min(1, 0.5 + Math.abs(tRatio - 1.15) / 0.3));

  const crispness = scores.reduce((a, b) => a + b, 0) / scores.length;
  return { states, crispness };
}

/**
 * Wrist-centred, scale-invariant feature vector (63 dims). Reserved for the
 * trainable classifier in the Gesture Studio (Phase 3) — kept here so the
 * feature definition stays stable across phases.
 */
export function normaliseLandmarks(lm: Vec3[]): number[] {
  const wrist = lm[0]!;
  const scale = Math.max(dist(lm[9]!, wrist), 1e-6); // middle MCP ≈ hand size
  const out: number[] = [];
  for (const p of lm) {
    out.push((p.x - wrist.x) / scale, (p.y - wrist.y) / scale, (p.z - wrist.z) / scale);
  }
  return out;
}

/** Thumb-tip to index-tip distance, normalised by hand size. */
export function pinchDistance(lm: Vec3[]): number {
  const wrist = lm[0]!;
  return dist(lm[4]!, lm[8]!) / Math.max(dist(lm[9]!, wrist), 1e-6);
}
