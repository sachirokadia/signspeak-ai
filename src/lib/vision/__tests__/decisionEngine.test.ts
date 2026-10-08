import { beforeEach, describe, expect, it } from "vitest";
import { GestureDecisionEngine } from "../decisionEngine";
import { getGestureDefinition } from "../classifier";
import type { GestureDefinition, RawPrediction } from "../types";

const hello = getGestureDefinition("open-palm");
const yes = getGestureDefinition("fist");

const ALL_EXTENDED = {
  thumb: true,
  index: true,
  middle: true,
  ring: true,
  pinky: true,
} as const;

function pred(gesture: GestureDefinition, confidence = 0.9): RawPrediction {
  return { gesture, confidence, fingerStates: { ...ALL_EXTENDED } };
}

describe("GestureDecisionEngine", () => {
  let engine: GestureDecisionEngine;

  beforeEach(() => {
    engine = new GestureDecisionEngine({
      stabilityFrames: 3,
      minConfidence: 0.75,
      cooldownMs: 1000,
    });
  });

  it("emits only after N consecutive stable frames", () => {
    expect(engine.push(pred(hello), 0)).toBeNull();
    expect(engine.push(pred(hello), 10)).toBeNull();
    const emitted = engine.push(pred(hello), 20);
    expect(emitted).not.toBeNull();
    expect(emitted!.gesture.id).toBe("open-palm");
    expect(emitted!.phrase).toBe(hello.phrase);
    expect(emitted!.at).toEqual(new Date(20));
  });

  it("ignores frames below the confidence gate", () => {
    engine.push(pred(hello, 0.9), 0);
    engine.push(pred(hello, 0.9), 10);
    // A weak frame breaks the run instead of advancing it.
    expect(engine.push(pred(hello, 0.5), 20)).toBeNull();
    expect(engine.push(pred(hello, 0.9), 30)).toBeNull();
    expect(engine.push(pred(hello, 0.9), 40)).toBeNull();
    expect(engine.push(pred(hello, 0.9), 50)).not.toBeNull();
  });

  it("a null frame resets the stability run", () => {
    engine.push(pred(hello), 0);
    engine.push(pred(hello), 10);
    expect(engine.push(null, 20)).toBeNull();
    expect(engine.push(pred(hello), 30)).toBeNull();
    expect(engine.push(pred(hello), 40)).toBeNull();
    expect(engine.push(pred(hello), 50)).not.toBeNull();
  });

  it("a different gesture resets the run", () => {
    engine.push(pred(hello), 0);
    engine.push(pred(hello), 10);
    expect(engine.push(pred(yes), 20)).toBeNull();
    expect(engine.push(pred(yes), 30)).toBeNull();
    const emitted = engine.push(pred(yes), 40);
    expect(emitted!.gesture.id).toBe("fist");
  });

  it("suppresses re-emission inside the cooldown window", () => {
    engine.push(pred(hello), 0);
    engine.push(pred(hello), 10);
    expect(engine.push(pred(hello), 20)).not.toBeNull(); // emits, t=20
    // Fresh stable run, but still inside cooldown.
    engine.push(pred(hello), 500);
    engine.push(pred(hello), 510);
    expect(engine.push(pred(hello), 520)).toBeNull();
  });

  it("allows re-emission after the cooldown elapses", () => {
    engine.push(pred(hello), 0);
    engine.push(pred(hello), 10);
    expect(engine.push(pred(hello), 20)).not.toBeNull(); // emits, t=20
    engine.push(pred(hello), 1500);
    engine.push(pred(hello), 1510);
    const emitted = engine.push(pred(hello), 1520); // 1500ms later
    expect(emitted).not.toBeNull();
    expect(emitted!.gesture.id).toBe("open-palm");
  });

  it("does not apply cooldown across different gestures", () => {
    engine.push(pred(hello), 0);
    engine.push(pred(hello), 10);
    expect(engine.push(pred(hello), 20)).not.toBeNull();
    engine.push(pred(yes), 500);
    engine.push(pred(yes), 510);
    const emitted = engine.push(pred(yes), 520);
    expect(emitted).not.toBeNull();
    expect(emitted!.gesture.id).toBe("fist");
  });

  it("reset() clears the in-progress run", () => {
    engine.push(pred(hello), 0);
    engine.push(pred(hello), 10);
    engine.reset();
    expect(engine.push(pred(hello), 20)).toBeNull();
    expect(engine.push(pred(hello), 30)).toBeNull();
    expect(engine.push(pred(hello), 40)).not.toBeNull();
  });

  it("uses the documented defaults", () => {
    const d = new GestureDecisionEngine();
    // 8 stability frames by default: 7 pushes must not emit.
    for (let t = 0; t < 7; t++) expect(d.push(pred(hello), t)).toBeNull();
    expect(d.push(pred(hello), 7)).not.toBeNull();
  });
});
