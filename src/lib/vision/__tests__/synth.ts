/**
 * Synthetic hand-pose infrastructure for training-data generation and tests.
 *
 * Builds 21-landmark hands in the same coordinate frame as fixtures.ts
 * (wrist at origin, fingers along +y, hand size ~1.0), with parametric
 * archetypes for the gestures that have no photo dataset (vulcan, pinch,
 * i-love-you) plus relaxed non-sign poses (no_gesture). Includes a seeded
 * RNG and augmentation (3D rotation, scale, joint noise, mirroring) so
 * training and test poses can use different seeds.
 *
 * Archetypes are validated through the REAL geometric rules in
 * classifier.ts before any training data is generated from them.
 */
import type { Vec3 } from "../types";

const v = (x: number, y: number, z = 0): Vec3 => ({ x, y, z });

/** Deterministic RNG (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = () => number;
const rand = (r: Rng, lo: number, hi: number): number => lo + r() * (hi - lo);

/**
 * Finger joints (MCP, PIP, DIP, tip) for a finger rooted at baseX with a
 * given curl (0 = straight, 1 = fully folded). Interpolates between an
 * extended and a folded pose.
 */
function curledFinger(baseX: number, curl: number, r: Rng, jitter = 0.03): Vec3[] {
  const ext: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ];
  const fld: Array<[number, number]> = [
    [0, 1],
    [0.03, 1.85],
    [-0.14, 1.1],
    [-0.2, 0.3],
  ];
  return ext.map(([ex, ey], i) => {
    const [fx, fy] = fld[i]!;
    return v(
      baseX + ex + (fx - ex) * curl + rand(r, -jitter, jitter),
      ey + (fy - ey) * curl + rand(r, -jitter, jitter),
      rand(r, -0.02, 0.02),
    );
  });
}

export type FingerSpec = { baseX: number; curl: number };

/** Assemble a full 21-landmark hand from per-finger specs + thumb tip. */
function assembleHand(
  fingers: [FingerSpec, FingerSpec, FingerSpec, FingerSpec],
  thumbTip: Vec3,
  r: Rng,
): Vec3[] {
  const lm: Vec3[] = new Array(21) as Vec3[];
  lm[0] = v(0, 0, 0); // wrist
  const thumbMcp = v(0.35, 0.6, 0);
  lm[1] = v(0.25, 0.3, 0); // CMC
  lm[2] = thumbMcp; // MCP
  lm[3] = v(
    (thumbMcp.x + thumbTip.x) / 2 + rand(r, -0.03, 0.03),
    (thumbMcp.y + thumbTip.y) / 2 + rand(r, -0.03, 0.03),
    rand(r, -0.02, 0.02),
  ); // IP
  lm[4] = thumbTip;
  const bases = [5, 9, 13, 17];
  fingers.forEach((spec, i) => {
    const joints = curledFinger(spec.baseX, spec.curl, r);
    const base = bases[i]!;
    for (let j = 0; j < 4; j++) lm[base + j] = joints[j]!;
  });
  return lm;
}

const J = (r: Rng, lo: number, hi: number): number => rand(r, lo, hi);

/** I Love You: thumb + index + pinky extended, middle + ring folded. */
export function iLoveYouArchetype(r: Rng): Vec3[] {
  const ext = () => J(r, 0, 0.12);
  const fld = () => J(r, 0.85, 1);
  return assembleHand(
    [
      { baseX: 0.2 + J(r, -0.03, 0.03), curl: ext() },
      { baseX: 0.4 + J(r, -0.03, 0.03), curl: fld() },
      { baseX: 0.6 + J(r, -0.03, 0.03), curl: fld() },
      { baseX: 0.8 + J(r, -0.03, 0.03), curl: ext() },
    ],
    v(J(r, 1.35, 1.7), J(r, 1.35, 1.7), J(r, -0.05, 0.05)),
    r,
  );
}

/**
 * Vulcan salute: all fingers extended, index+middle grouped, ring+pinky
 * grouped, wide gap between middle and ring (the rule needs the middle-ring
 * tip gap > 1.8x the neighbouring gaps). Fingers are exactly straight here —
 * the gap is what defines the pose; augmentation adds natural variation.
 */
export function vulcanArchetype(r: Rng): Vec3[] {
  const jx = () => J(r, -0.015, 0.015);
  return assembleHand(
    [
      { baseX: 0.08 + jx(), curl: 0 }, // index
      { baseX: 0.26 + jx(), curl: 0 }, // middle
      { baseX: 0.72 + jx(), curl: 0 }, // ring
      { baseX: 0.9 + jx(), curl: 0 }, // pinky
    ],
    v(J(r, 1.35, 1.7), J(r, 1.35, 1.7), J(r, -0.05, 0.05)),
    r,
  );
}

/**
 * Pinch: thumb tip touching the index tip (pinchDistance < 0.25 of hand
 * size), middle/ring/pinky folded. Distinct from OK sign (which has the
 * other three fingers extended).
 */
export function pinchArchetype(r: Rng): Vec3[] {
  const fld = () => J(r, 0.85, 1);
  // Index reaches up then bends so its tip hovers low near the thumb.
  const lm: Vec3[] = new Array(21) as Vec3[];
  lm[0] = v(0, 0, 0);
  const thumbTip = v(J(r, 0.42, 0.52), J(r, 1.7, 1.85), J(r, -0.03, 0.03));
  const thumbMcp = v(0.35, 0.6, 0);
  lm[1] = v(0.25, 0.3, 0);
  lm[2] = thumbMcp;
  lm[3] = v((thumbMcp.x + thumbTip.x) / 2, (thumbMcp.y + thumbTip.y) / 2, 0);
  lm[4] = thumbTip;
  // Index: extended at the base, tip bent down to meet the thumb tip.
  const ix = 0.2 + J(r, -0.03, 0.03);
  const indexTip = v(thumbTip.x + J(r, -0.06, 0.06), thumbTip.y + J(r, -0.04, 0.08), 0);
  lm[5] = v(ix, 1, 0);
  lm[6] = v(ix + J(r, -0.02, 0.02), 2, 0);
  lm[7] = v(ix + 0.08, 2.55, 0);
  lm[8] = indexTip;
  const rest: Array<[number, number]> = [
    [0.4, fld()],
    [0.6, fld()],
    [0.8, fld()],
  ];
  const bases = [9, 13, 17];
  rest.forEach(([baseX, curl], i) => {
    const joints = curledFinger(baseX + J(r, -0.03, 0.03), curl, r);
    const base = bases[i]!;
    for (let j = 0; j < 4; j++) lm[base + j] = joints[j]!;
  });
  return lm;
}

/**
 * Relaxed non-sign hand (no_gesture training): fingers at middling curls
 * (0.40–0.65) that sit in the ambiguous band of every template — too curled
 * for the straight templates, too straight for the curled ones — thumb
 * loose. The generator keeps only poses the geometric rules reject (null),
 * so the class cleanly means "not a crisp sign".
 */
export function relaxedArchetype(r: Rng): Vec3[] {
  const family = Math.floor(r() * 3);
  const amb = () => J(r, 0.4, 0.65);
  if (family === 0) {
    // Relaxed open: all fingers half-curled.
    const c = () => J(r, 0.4, 0.55);
    return assembleHand(
      [
        { baseX: 0.2, curl: c() },
        { baseX: 0.4, curl: c() },
        { baseX: 0.6, curl: c() },
        { baseX: 0.8, curl: c() },
      ],
      v(J(r, 0.55, 0.75), J(r, 0.75, 0.95), 0),
      r,
    );
  }
  if (family === 1) {
    // Loose: fingers mostly folded but not a tight fist.
    const c = () => J(r, 0.55, 0.68);
    return assembleHand(
      [
        { baseX: 0.2, curl: c() },
        { baseX: 0.4, curl: c() },
        { baseX: 0.6, curl: c() },
        { baseX: 0.8, curl: c() },
      ],
      v(J(r, 0.45, 0.6), J(r, 0.5, 0.65), 0),
      r,
    );
  }
  // Mixed: random per-finger curls in the ambiguous band.
  return assembleHand(
    [
      { baseX: 0.2 + J(r, -0.04, 0.04), curl: amb() },
      { baseX: 0.4 + J(r, -0.04, 0.04), curl: amb() },
      { baseX: 0.6 + J(r, -0.04, 0.04), curl: amb() },
      { baseX: 0.8 + J(r, -0.04, 0.04), curl: amb() },
    ],
    v(J(r, 0.5, 0.8), J(r, 0.7, 1.0), 0),
    r,
  );
}

// --- Augmentation (applied in raw landmark space, before normalisation) ---

function rotX(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return v(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
}
function rotY(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return v(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
}
function rotZ(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return v(p.x * c - p.y * s, p.x * s + p.y * c, p.z);
}

/**
 * Heavy augmentation: random 3D rotation (yaw/pitch ±30°, roll ±60°),
 * scale 0.9–1.1, per-joint Gaussian-ish noise (σ≈0.015), 50% mirroring.
 * Applied about the wrist (origin), matching the fixtures frame.
 */
export function augmentHand(lm: Vec3[], r: Rng): Vec3[] {
  const yaw = J(r, -0.52, 0.52);
  const pitch = J(r, -0.52, 0.52);
  const roll = J(r, -1.05, 1.05);
  const scale = J(r, 0.9, 1.1);
  const mirror = r() < 0.5;
  return lm.map((p) => {
    let q = rotZ(rotY(rotX(p, pitch), yaw), roll);
    q = v(
      q.x * scale + J(r, -0.045, 0.045),
      q.y * scale + J(r, -0.045, 0.045),
      q.z * scale + J(r, -0.03, 0.03),
    );
    if (mirror) q = v(-q.x, q.y, q.z);
    return q;
  });
}
