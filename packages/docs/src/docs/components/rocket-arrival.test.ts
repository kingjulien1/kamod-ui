import { expect, it } from "vitest";
import { arrivalProgress, rocketArrivalFrames } from "./rocket-arrival";

it("accelerates to 60% distance then settles with a near-zero final speed", () => {
  expect(arrivalProgress(0)).toBe(0);
  expect(arrivalProgress(0.6)).toBeCloseTo(0.6);
  expect(arrivalProgress(1)).toBe(1);
  const speeds = Array.from(
    { length: 100 },
    (_, i) => arrivalProgress((i + 1) / 100) - arrivalProgress(i / 100),
  );
  expect(speeds.indexOf(Math.max(...speeds))).toBeGreaterThanOrEqual(58);
  expect(speeds.indexOf(Math.max(...speeds))).toBeLessThanOrEqual(60);
  expect(speeds.every((speed) => speed > 0)).toBe(true);
  expect(speeds[0]).toBeLessThan(speeds[59] / 100);
  expect(speeds[99]).toBeLessThan(speeds[60] / 100);
});

it("ties growth, opacity and wake strength to travelled distance, with a stable landing", () => {
  const frames = rocketArrivalFrames(300);
  for (const frame of frames) {
    const progress = arrivalProgress(frame.offset);
    const scale = Number(frame.transform.match(/scale\(([^)]+)\)/)![1]);
    expect(scale).toBeCloseTo(0.06 + progress * 0.94, 4);
    expect(frame.opacity).toBeCloseTo(Math.min(1, progress / 0.6));
    expect(frame["--arrival-wake-strength"]).toBeCloseTo(Math.max(0, (progress - 0.2) / 0.8));
  }
  expect(frames[0].opacity).toBe(0);
  expect(frames.at(-1)?.transform).toBe(
    "translate(0.0000px, 0.0000px) scale(1.00000) rotate(0.000deg)",
  );
  expect(rocketArrivalFrames(300, () => 0)[20].transform).not.toBe(
    rocketArrivalFrames(300, () => 1)[20].transform,
  );
});
