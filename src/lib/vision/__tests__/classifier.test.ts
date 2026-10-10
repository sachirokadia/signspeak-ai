import { describe, expect, it } from "vitest";
import {
  GESTURE_DEFINITIONS,
  classifyLandmarks,
  getGestureDefinition,
  neuralToPrediction,
} from "../classifier";
import {
  CALL_ME,
  FIST,
  FOUR,
  I_LOVE_YOU,
  OK_SIGN,
  OPEN_PALM,
  PEACE,
  POINT,
  ROCK_ON,
  THUMBS_UP,
  THREE,
  makeHand,
} from "./fixtures";

describe("classifyLandmarks", () => {
  it.each([
    ["open-palm", OPEN_PALM()],
    ["fist", FIST()],
    ["thumbs-up", THUMBS_UP()],
    ["peace", PEACE()],
    ["point", POINT()],
    ["ok-sign", OK_SIGN()],
    ["i-love-you", I_LOVE_YOU()],
    ["call-me", CALL_ME()],
    ["three", THREE()],
    ["four", FOUR()],
    ["rock-on", ROCK_ON()],
  ] as const)("recognises %s", (id, lm) => {
    const pred = classifyLandmarks(lm);
    expect(pred).not.toBeNull();
    expect(pred!.gesture.id).toBe(id);
  });

  it("returns null for null or short input", () => {
    expect(classifyLandmarks(null)).toBeNull();
    expect(classifyLandmarks([])).toBeNull();
    expect(classifyLandmarks(OPEN_PALM().slice(0, 10))).toBeNull();
  });

  it("returns null for an unrecognised pose", () => {
    // Index + ring extended matches no template.
    const lm = makeHand({
      thumb: "folded",
      index: "extended",
      middle: "folded",
      ring: "extended",
      pinky: "folded",
    });
    expect(classifyLandmarks(lm)).toBeNull();
  });

  it("reports confidence in (0.55, 1] derived from crispness", () => {
    const pred = classifyLandmarks(OPEN_PALM());
    expect(pred).not.toBeNull();
    expect(pred!.confidence).toBeGreaterThan(0.55);
    expect(pred!.confidence).toBeLessThanOrEqual(1);
  });

  it("exposes finger states on the prediction", () => {
    const pred = classifyLandmarks(PEACE());
    expect(pred!.fingerStates).toEqual({
      thumb: false,
      index: true,
      middle: true,
      ring: false,
      pinky: false,
    });
  });
});

describe("gesture definitions", () => {
  it("covers every GestureId with a phrase", () => {
    const ids = GESTURE_DEFINITIONS.map((g) => g.id).sort();
    expect(ids).toEqual(
      [
        "fist",
        "ok-sign",
        "open-palm",
        "peace",
        "point",
        "thumbs-up",
        "thumbs-down",
        "i-love-you",
        "call-me",
        "three",
        "four",
        "rock-on",
        "vulcan",
        "pinch",
      ].sort(),
    );
    for (const g of GESTURE_DEFINITIONS) {
      expect(g.phrase.length).toBeGreaterThan(0);
    }
  });

  it("getGestureDefinition throws for unknown ids", () => {
    // @ts-expect-error — exercising the runtime guard
    expect(() => getGestureDefinition("jazz-hands")).toThrow(/Unknown gesture id/);
  });
});

describe("neuralToPrediction", () => {
  it("maps MediaPipe categories to gesture definitions", () => {
    const cases = [
      ["Closed_Fist", "fist"],
      ["Open_Palm", "open-palm"],
      ["Pointing_Up", "point"],
      ["Thumb_Up", "thumbs-up"],
      ["Thumb_Down", "thumbs-down"],
      ["Victory", "peace"],
      ["ILoveYou", "i-love-you"],
    ] as const;
    for (const [mpName, expectedId] of cases) {
      const pred = neuralToPrediction(mpName, 0.9);
      expect(pred).not.toBeNull();
      expect(pred!.gesture.id).toBe(expectedId);
      expect(pred!.confidence).toBe(0.9);
    }
  });

  it("returns null for None and low scores", () => {
    expect(neuralToPrediction("None", 0.9)).toBeNull();
    expect(neuralToPrediction("Open_Palm", 0.3)).toBeNull();
  });
});
