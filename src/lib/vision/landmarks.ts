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

const FINGER_CURL_JOINTS: Record<FingerName, [number, number, number, number, number]> = {
  // [mcp, pip, dip, tip] indices; thumb uses [cmc, mcp, ip, tip]
  thumb: [1, 2, 3, 4, 4],
  index: [5, 6, 7, 8, 8],
  middle: [9, 10, 11, 12, 12],
  ring: [13, 14, 15, 16, 16],
  pinky: [17, 18, 19, 20, 20],
};

function angleBetween(a: Vec3, b: Vec3, c: Vec3): number {
  // Angle at b between vectors ba and bc, in radians (0 = straight).
  const v1 = { x: a.x - b.x, y: a.y - b.y, z: (a.z - b.z) * 0.5 };
  const v2 = { x: c.x - b.x, y: c.y - b.y, z: (c.z - b.z) * 0.5 };
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const m1 = Math.hypot(v1.x, v1.y, v1.z);
  const m2 = Math.hypot(v2.x, v2.y, v2.z);
  if (m1 < 1e-9 || m2 < 1e-9) return 0;
  const cos = Math.max(-1, Math.min(1, dot / (m1 * m2)));
  return Math.acos(cos);
}

/**
 * Finger curl from joint angles: 0 = perfectly straight, 1 = fully curled.
 * Uses the maximum bend across the two main joints — a finger is "curled"
 * if either joint is sharply bent.
 */
export function fingerCurl(lm: Vec3[], finger: FingerName): number {
  const [j0, j1, j2, j3] = FINGER_CURL_JOINTS[finger]!;
  // For thumb, j0=CMC, j1=MCP, j2=IP, j3=TIP (j4 unused, same as tip).
  const a1 = angleBetween(lm[j0]!, lm[j1]!, lm[j2]!);
  const a2 = angleBetween(lm[j1]!, lm[j2]!, lm[j3]!);
  // Straight finger: angles near π (180°). Curled: angles approach 0.
  // Curl = max bend / π, where bend = π - angle.
  const maxBend = Math.max(Math.PI - a1, Math.PI - a2);
  return Math.max(0, Math.min(1, maxBend / Math.PI));
}

/**
 * Sanity check for a 21-landmark hand: rejects garbage landmark sets from
 * false-positive hand detections (background objects, shadows).
 * Returns false when the landmarks don't form a plausible hand.
 * Scale-invariant: works on both MediaPipe normalized coords and test fixtures.
 */
export function handSanity(lm: Vec3[]): boolean {
  if (!lm || lm.length < 21) return false;
  const wrist = lm[0]!;

  // All landmarks must be finite numbers.
  for (const p of lm) {
    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.z)) {
      return false;
    }
  }

  // Hand must have a minimum size (wrist to middle-MCP distance).
  // Tiny "hands" are almost always false detections on background texture.
  // 0.03 is tiny in both MediaPipe normalized coords (~0.15 typical)
  // and test fixture coords (~1.0 typical); only near-zero sizes fail.
  const handSize = dist(lm[9]!, wrist);
  if (handSize < 0.03) return false;

  // The knuckles (MCPs) should spread from the wrist — check that at least
  // 2 are a reasonable distance away. (Use MCPs, not tips: a fist has curled
  // tips close to the wrist, but the knuckles still spread.)
  const mcps = [5, 9, 13, 17];
  let spreadCount = 0;
  for (const m of mcps) {
    if (dist(lm[m]!, wrist) > handSize * 0.8) spreadCount++;
  }
  if (spreadCount < 2) return false;

  return true;
}
