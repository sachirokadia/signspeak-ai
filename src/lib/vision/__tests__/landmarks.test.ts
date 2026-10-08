import { describe, expect, it } from "vitest";
import { analyseFingers, normaliseLandmarks, pinchDistance } from "../landmarks";
import { FIST, OK_SIGN, OPEN_PALM, makeHand } from "./fixtures";

describe("analyseFingers", () => {
  it("reports all fingers extended for an open palm", () => {
    const { states } = analyseFingers(OPEN_PALM());
    expect(states).toEqual({
      thumb: true,
      index: true,
      middle: true,
      ring: true,
      pinky: true,
    });
  });

  it("reports all fingers folded for a fist", () => {
    const { states } = analyseFingers(FIST());
    expect(states).toEqual({
      thumb: false,
      index: false,
      middle: false,
      ring: false,
      pinky: false,
    });
  });

  it("returns crispness in [0, 1], high for decisive poses", () => {
    const open = analyseFingers(OPEN_PALM());
    const fist = analyseFingers(FIST());
    expect(open.crispness).toBeGreaterThanOrEqual(0);
    expect(open.crispness).toBeLessThanOrEqual(1);
    expect(open.crispness).toBeGreaterThan(0.5);
    expect(fist.crispness).toBeGreaterThan(0.5);
  });

  it("gives low crispness to a finger in the ambiguous band", () => {
    // Index tip placed so tipD/pipD lands inside [0.98, 1.12].
    const lm = OPEN_PALM();
    lm[8] = { x: 0.2, y: 2.05, z: 0 }; // tip ≈ pip distance
    const { states, crispness } = analyseFingers(lm);
    expect(states.index).toBe(false); // ratio <= 1.12 → not extended
    expect(crispness).toBeLessThan(analyseFingers(OPEN_PALM()).crispness);
  });
});

describe("normaliseLandmarks", () => {
  it("produces a 63-dim vector with the wrist at the origin", () => {
    const vec = normaliseLandmarks(OPEN_PALM());
    expect(vec).toHaveLength(63);
    expect(vec[0]).toBeCloseTo(0);
    expect(vec[1]).toBeCloseTo(0);
    expect(vec[2]).toBeCloseTo(0);
  });

  it("is translation invariant", () => {
    const a = normaliseLandmarks(OPEN_PALM());
    const moved = OPEN_PALM().map((p) => ({
      x: p.x + 3.7,
      y: p.y - 2.1,
      z: p.z + 0.5,
    }));
    const b = normaliseLandmarks(moved);
    for (let i = 0; i < a.length; i++) expect(b[i]).toBeCloseTo(a[i]!, 9);
  });

  it("is scale invariant", () => {
    const a = normaliseLandmarks(OPEN_PALM());
    const scaled = OPEN_PALM().map((p) => ({
      x: p.x * 2.5,
      y: p.y * 2.5,
      z: p.z * 2.5,
    }));
    const b = normaliseLandmarks(scaled);
    for (let i = 0; i < a.length; i++) expect(b[i]).toBeCloseTo(a[i]!, 9);
  });

  it("distinguishes different poses", () => {
    const a = normaliseLandmarks(OPEN_PALM());
    const b = normaliseLandmarks(FIST());
    const diff = a.reduce((acc, x, i) => acc + Math.abs(x - b[i]!), 0);
    expect(diff).toBeGreaterThan(1);
  });
});

describe("pinchDistance", () => {
  it("is small when thumb tip touches the index tip", () => {
    const d = pinchDistance(OK_SIGN());
    expect(d).toBeLessThan(0.35);
    expect(d).toBeGreaterThanOrEqual(0);
  });

  it("is large for an open palm", () => {
    expect(pinchDistance(OPEN_PALM())).toBeGreaterThan(0.35);
  });

  it("matches the documented definition", () => {
    const lm = makeHand({
      thumb: "folded",
      index: "folded",
      middle: "folded",
      ring: "folded",
      pinky: "folded",
      thumbTip: { x: 0.3, y: 0.4, z: 0 },
    });
    // index tip at (0.2, 0.4): dist = 0.1; wrist→middle MCP (0.4,1): √(1.16)
    const expected = 0.1 / Math.sqrt(1.16);
    expect(pinchDistance(lm)).toBeCloseTo(expected, 6);
  });
});
