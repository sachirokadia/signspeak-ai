/**
 * End-to-end gesture accuracy harness.
 *
 * For each of the 14 sign gestures, feeds realistic 21-landmark hands
 * through the FULL production chain —
 *   custom ONNX model (v4, per-gesture precision thresholds)
 *     → MediaPipe (mocked: silent AND adversarial misfire scenarios)
 *     → geometric rules
 *     → arbitration (custom-first)
 *     → GestureDecisionEngine (app defaults: 8 frames, 0.75, 1500ms)
 * — and asserts the emitted gesture id.
 *
 * Test data:
 *  - 11 photo classes: REAL held-out HaGRID landmarks (images never used
 *    in training), extracted via MediaPipe (heldout-landmarks.json).
 *  - vulcan / pinch / i-love-you: synthetic poses from the test-infra
 *    archetypes with a different seed than training.
 *  - no_gesture: synthetic relaxed poses (different seed), rules-null
 *    filtered — measures the false-positive rate.
 *
 * Ship bar: >=90% recall per gesture, >=95% precision per gesture,
 * no_gesture false-positive rate < 2%.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { InferenceSession } from "onnxruntime-web";
import { arbitratePredictions } from "../arbitration";
import { classifyLandmarks, neuralToPrediction } from "../classifier";
import { NO_GESTURE_ID, predictWithSession } from "../customModel";
import { GestureDecisionEngine } from "../decisionEngine";
import type { MediaPipeGestureName, Vec3 } from "../types";
import {
  augmentHand,
  iLoveYouArchetype,
  mulberry32,
  pinchArchetype,
  relaxedArchetype,
  vulcanArchetype,
} from "./synth";

const ROOT = process.cwd();
const MODEL_PATH = join(ROOT, "public/models/gesture_mlp_v4.onnx");
const LABELS_PATH = join(ROOT, "public/models/gesture_labels_v4.json");
const THRESHOLDS_PATH = join(ROOT, "public/models/gesture_thresholds_v4.json");
const HELDOUT_PATH = join(ROOT, "src/lib/vision/__tests__/heldout-landmarks.json");

const GESTURES_14 = [
  "open-palm",
  "fist",
  "thumbs-up",
  "thumbs-down",
  "peace",
  "point",
  "ok-sign",
  "i-love-you",
  "call-me",
  "three",
  "four",
  "rock-on",
  "vulcan",
  "pinch",
] as const;

/**
 * Known MediaPipe misfires (from the production diagnosis): when the user
 * holds these signs, MediaPipe's 8-class net fires the wrong gesture with
 * high confidence. The harness replays them to prove the custom model now
 * outranks MediaPipe.
 */
const ADVERSARIAL_MP: Record<string, { name: MediaPipeGestureName; score: number }> = {
  three: { name: "Victory", score: 0.92 },
  "rock-on": { name: "ILoveYou", score: 0.9 },
  four: { name: "Open_Palm", score: 0.88 },
  vulcan: { name: "Open_Palm", score: 0.88 },
};

const toVec3 = (arr: number[][]): Vec3[] => arr.map(([x, y, z]) => ({ x: x!, y: y!, z: z! }));

/** Frame-level predictions per gesture, collected for the precision summary. */
const harnessPreds: Record<string, (string | null)[]> = {};

let session: InferenceSession;
let labels: string[];
let thresholds: Record<string, number>;

function fullChain(hands: Vec3[][], mp: { name: MediaPipeGestureName; score: number } | null) {
  return hands.map(async (lm) => {
    const custom = await predictWithSession(session, labels, thresholds, lm);
    const neural = mp ? neuralToPrediction(mp.name, mp.score) : null;
    const rules = classifyLandmarks(lm);
    const pred = arbitratePredictions({
      custom,
      neural,
      rules,
      customFallback: null,
    });
    // Decision engine with app defaults.
    const engine = new GestureDecisionEngine({
      stabilityFrames: 8,
      minConfidence: 0.75,
      cooldownMs: 1500,
    });
    let emitted: string | null = null;
    for (let f = 0; f < 10; f++) {
      const s = engine.push(pred, 1000 + f * 33);
      if (s && !emitted) emitted = s.gesture.id;
    }
    return { framePred: pred?.gesture.id ?? null, emitted };
  });
}

async function resolveAll<T>(ps: Promise<T>[]): Promise<T[]> {
  return Promise.all(ps);
}

describe("gesture accuracy harness (full chain)", () => {
  beforeAll(async () => {
    session = await InferenceSession.create(MODEL_PATH, {
      executionProviders: ["wasm"],
    });
    const labelsJson = JSON.parse(readFileSync(LABELS_PATH, "utf8")) as unknown;
    labels = Array.isArray(labelsJson)
      ? (labelsJson as string[])
      : (labelsJson as { labels: string[] }).labels;
    thresholds = (
      JSON.parse(readFileSync(THRESHOLDS_PATH, "utf8")) as {
        thresholds: Record<string, number>;
      }
    ).thresholds;
    expect(labels).toContain(NO_GESTURE_ID);
    expect(Object.keys(thresholds).length).toBeGreaterThanOrEqual(14);
  }, 60000);

  it.each(GESTURES_14)(
    "recognises %s end-to-end (>=90% recall)",
    async (id) => {
      const heldout = JSON.parse(readFileSync(HELDOUT_PATH, "utf8")) as Record<
        string,
        number[][][]
      >;
      let hands: Vec3[][];
      if (id === "vulcan" || id === "pinch" || id === "i-love-you") {
        // Synthetic test poses: different seed than training (42/43/44).
        const r = mulberry32(777);
        const make =
          id === "vulcan" ? vulcanArchetype : id === "pinch" ? pinchArchetype : iLoveYouArchetype;
        hands = Array.from({ length: 60 }, () => augmentHand(make(r), r));
      } else {
        const raw = heldout[id];
        expect(raw && raw.length).toBeGreaterThan(0);
        hands = raw!.map(toVec3);
      }

      // Scenario A: MediaPipe silent — custom model must deliver.
      const resA = await resolveAll(fullChain(hands, null));
      // Scenario B: adversarial MediaPipe misfire — custom must still win.
      const adv = ADVERSARIAL_MP[id] ?? null;
      const resB = adv ? await resolveAll(fullChain(hands, adv)) : [];

      const recallOf = (res: { emitted: string | null }[]) =>
        res.filter((x) => x.emitted === id).length / res.length;

      const recallA = recallOf(resA);
      console.log(
        `[harness] ${id}: n=${hands.length} recall_silent=${(recallA * 100).toFixed(1)}%` +
          (adv ? ` recall_adversarial=${(recallOf(resB) * 100).toFixed(1)}%` : ""),
      );
      // Record before asserting so the precision summary still runs.
      harnessPreds[id] = resA.map((x) => x.framePred);
      expect(recallA).toBeGreaterThanOrEqual(0.9);
      if (adv) expect(recallOf(resB)).toBeGreaterThanOrEqual(0.9);
    },
    120000,
  );

  it("precision >=95% per gesture and no_gesture FP < 2%", async () => {
    // Per-gesture precision from the silent-scenario frame predictions.
    for (const id of GESTURES_14) {
      const tp = harnessPreds[id]!.filter((p) => p === id).length;
      let fp = 0;
      const fpSources: string[] = [];
      for (const other of GESTURES_14) {
        if (other === id) continue;
        const n = harnessPreds[other]!.filter((p) => p === id).length;
        if (n > 0) fpSources.push(`${other}(${n})`);
        fp += n;
      }
      const precision = tp / Math.max(tp + fp, 1);
      console.log(
        `[harness] precision ${id}: ${(precision * 100).toFixed(1)}% (tp=${tp} fp=${fp}` +
          (fpSources.length ? ` from ${fpSources.join(", ")}` : "") +
          `)`,
      );
      expect(precision).toBeGreaterThanOrEqual(0.95);
    }

    // no_gesture: relaxed poses (different seed than training) must stay silent.
    const r = mulberry32(778);
    const ngHands: Vec3[][] = [];
    let tries = 0;
    while (ngHands.length < 200 && tries < 4000) {
      tries++;
      const hand = relaxedArchetype(r);
      if (classifyLandmarks(hand) !== null) continue;
      ngHands.push(augmentHand(hand, r));
    }
    expect(ngHands.length).toBe(200);
    const res = await resolveAll(fullChain(ngHands, null));
    const fps = res.filter((x) => x.framePred !== null).length;
    const fpRate = fps / res.length;
    console.log(`[harness] no_gesture FP: ${(fpRate * 100).toFixed(2)}% (${fps}/${res.length})`);
    expect(fpRate).toBeLessThan(0.02);
  }, 120000);
});
