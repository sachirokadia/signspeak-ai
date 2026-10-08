import { describe, expect, it } from "vitest";
import { KnnClassifier, vectorFromLandmarks } from "../trainer";
import type { GestureSample } from "../trainer";
import { FIST, OPEN_PALM } from "./fixtures";

function sample(id: string, label: string, vector: number[]): GestureSample {
  return { id, label, vector, createdAt: Date.now() };
}

/** Deterministic pseudo-random vectors clustered around a centre. */
function makeCluster(
  centre: number[],
  count: number,
  spread: number,
  label: string,
  seed: number,
): GestureSample[] {
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648 - 0.5;
  };
  return Array.from({ length: count }, (_, i) => {
    const vector = centre.map((c) => c + rand() * spread);
    return sample(`${label}-${i}`, label, vector);
  });
}

const centreA = Array.from({ length: 63 }, (_, i) => Math.sin(i * 0.3));
const centreB = Array.from({ length: 63 }, (_, i) => Math.cos(i * 0.3) + 2);

describe("KnnClassifier", () => {
  it("returns null when there are no samples", () => {
    expect(new KnnClassifier([]).predict(centreA)).toBeNull();
  });

  it("reports labels and sampleCount", () => {
    const c = new KnnClassifier([
      ...makeCluster(centreA, 3, 0.05, "wave", 1),
      ...makeCluster(centreB, 2, 0.05, "nod", 2),
    ]);
    expect(c.sampleCount).toBe(5);
    expect(c.labels.sort()).toEqual(["nod", "wave"]);
  });

  it("predicts the nearest cluster", () => {
    const c = new KnnClassifier([
      ...makeCluster(centreA, 10, 0.05, "wave", 1),
      ...makeCluster(centreB, 10, 0.05, "nod", 2),
    ]);
    expect(c.predict(centreA)!.label).toBe("wave");
    expect(c.predict(centreB)!.label).toBe("nod");
  });

  it("gives confidence 1 for an identical vector", () => {
    const c = new KnnClassifier(makeCluster(centreA, 5, 0.05, "wave", 1));
    expect(c.predict(centreA)!.confidence).toBe(1);
  });

  it("maps cosine similarity to confidence per the documented formula", () => {
    // confidence = clamp((sim - 0.75) / 0.25): sim=1 → 1, sim≤0.75 → 0.
    const c = new KnnClassifier([sample("s1", "wave", centreA)], 1);
    // Scaled centre: cosine similarity stays 1 → confidence 1.
    expect(c.predict(centreA.map((x) => x * 2))!.confidence).toBe(1);
    // Zero vector: similarity 0 → confidence 0.
    expect(c.predict(new Array(63).fill(0))!.confidence).toBe(0);
  });

  it("uses similarity-weighted voting, not just the single nearest", () => {
    // Query [1,0,…]. One "nod" sample is the single nearest (sim≈0.995),
    // but three "wave" samples (sim≈0.980 each) outvote it on weight.
    const unit = (angle: number) => {
      const v = new Array(63).fill(0);
      v[0] = Math.cos(angle);
      v[1] = Math.sin(angle);
      return v;
    };
    const query = unit(0);
    const c = new KnnClassifier(
      [
        sample("n1", "nod", unit(0.1)),
        sample("w1", "wave", unit(0.2)),
        sample("w2", "wave", unit(0.2)),
        sample("w3", "wave", unit(0.2)),
      ],
      4,
    );
    expect(c.predict(query)!.label).toBe("wave");
  });

  it("handles k larger than the sample count", () => {
    const c = new KnnClassifier([sample("s1", "wave", centreA)], 10);
    expect(c.predict(centreA)!.label).toBe("wave");
  });

  it("vectorFromLandmarks matches the 63-dim normalised features", () => {
    const vec = vectorFromLandmarks(OPEN_PALM());
    expect(vec).toHaveLength(63);
    const c = new KnnClassifier([sample("open", "open-palm", vec)]);
    // A fist is far from an open palm in feature space → low confidence.
    const fistVec = vectorFromLandmarks(FIST());
    const pred = c.predict(fistVec)!;
    expect(pred.label).toBe("open-palm"); // only label available
    expect(pred.confidence).toBeLessThan(0.5);
  });
});
