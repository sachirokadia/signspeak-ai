/**
 * Synthetic 21-point hand fixtures for unit tests.
 *
 * Coordinate frame: wrist at origin, fingers extend along +y, z = 0.
 * Landmark indices follow MediaPipe's hand topology:
 *   0 wrist · 1-4 thumb (CMC, MCP, IP, tip) · 5-8 index · 9-12 middle
 *   13-16 ring · 17-20 pinky (each: MCP, PIP, DIP, tip)
 */
import type { Vec3 } from "../types";

const v = (x: number, y: number, z = 0): Vec3 => ({ x, y, z });

type FingerPose = "extended" | "folded";

/**
 * Four joints (MCP, PIP, DIP, tip) for a finger rooted at baseX.
 * Extended: joints march up +y (tip far from wrist).
 * Folded: tip curls back down toward the wrist.
 */
function fingerJoints(baseX: number, pose: FingerPose): Vec3[] {
  if (pose === "extended") {
    return [v(baseX, 1), v(baseX, 2), v(baseX, 3), v(baseX, 4)];
  }
  return [v(baseX, 1), v(baseX, 2), v(baseX, 1.3), v(baseX, 0.4)];
}

export type HandPose = {
  thumb: FingerPose;
  index: FingerPose;
  middle: FingerPose;
  ring: FingerPose;
  pinky: FingerPose;
  /** Override the thumb tip position (default depends on pose). */
  thumbTip?: Vec3;
};

/**
 * Build a full 21-landmark hand. Unused thumb joints (CMC/IP) are placed
 * plausibly between MCP and tip; they don't affect classification.
 */
export function makeHand(pose: HandPose): Vec3[] {
  const lm: Vec3[] = new Array(21);
  lm[0] = v(0, 0); // wrist

  // Thumb: MCP at (0.35, 0.6). Extended tip reaches out; folded tip tucks in.
  const thumbMcp = v(0.35, 0.6);
  const thumbTip = pose.thumbTip ?? (pose.thumb === "extended" ? v(1.6, 1.6) : v(0.45, 0.55));
  lm[1] = v(0.25, 0.3); // CMC
  lm[2] = thumbMcp; // MCP
  lm[3] = v((thumbMcp.x + thumbTip.x) / 2, (thumbMcp.y + thumbTip.y) / 2); // IP
  lm[4] = thumbTip; // tip

  const fingers: Array<[number, FingerPose]> = [
    [0.2, pose.index],
    [0.4, pose.middle],
    [0.6, pose.ring],
    [0.8, pose.pinky],
  ];
  const baseIndices = [5, 9, 13, 17];
  fingers.forEach(([baseX, fingerPose], i) => {
    const joints = fingerJoints(baseX, fingerPose);
    const base = baseIndices[i]!;
    for (let j = 0; j < 4; j++) lm[base + j] = joints[j]!;
  });

  return lm as Vec3[];
}

export const OPEN_PALM = (): Vec3[] =>
  makeHand({
    thumb: "extended",
    index: "extended",
    middle: "extended",
    ring: "extended",
    pinky: "extended",
  });

export const FIST = (): Vec3[] =>
  makeHand({
    thumb: "folded",
    index: "folded",
    middle: "folded",
    ring: "folded",
    pinky: "folded",
  });

export const THUMBS_UP = (): Vec3[] =>
  makeHand({
    thumb: "extended",
    index: "folded",
    middle: "folded",
    ring: "folded",
    pinky: "folded",
  });

export const PEACE = (): Vec3[] =>
  makeHand({
    thumb: "folded",
    index: "extended",
    middle: "extended",
    ring: "folded",
    pinky: "folded",
  });

export const POINT = (): Vec3[] =>
  makeHand({
    thumb: "folded",
    index: "extended",
    middle: "folded",
    ring: "folded",
    pinky: "folded",
  });

/** Thumb tip pinched near the folded index tip; middle/ring/pinky extended. */
export const OK_SIGN = (): Vec3[] =>
  makeHand({
    thumb: "folded",
    index: "folded",
    middle: "extended",
    ring: "extended",
    pinky: "extended",
    thumbTip: v(0.35, 0.55),
  });

export const I_LOVE_YOU = (): Vec3[] =>
  makeHand({
    thumb: "extended",
    index: "extended",
    middle: "folded",
    ring: "folded",
    pinky: "extended",
  });

export const CALL_ME = (): Vec3[] =>
  makeHand({
    thumb: "extended",
    index: "folded",
    middle: "folded",
    ring: "folded",
    pinky: "extended",
  });

export const THREE = (): Vec3[] =>
  makeHand({
    thumb: "extended",
    index: "extended",
    middle: "extended",
    ring: "folded",
    pinky: "folded",
  });

export const FOUR = (): Vec3[] =>
  makeHand({
    thumb: "folded",
    index: "extended",
    middle: "extended",
    ring: "extended",
    pinky: "extended",
  });
