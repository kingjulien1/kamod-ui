/** Shared geometry for a one-shot arrival; no timers or animation-frame work. */
export const ROCKET_ARRIVAL_MS = 3200;
type Point = { x: number; y: number };

export function arrivalProgress(time: number) {
  const t = Math.max(0, Math.min(1, time));
  // Matching slopes meet at 60% distance: a slow launch and a much softer final approach.
  return t <= 0.6 ? 0.6 * (t / 0.6) ** 2.6 : 0.6 + 0.4 * (1 - ((1 - t) / 0.4) ** 2.6);
}

function bezier(a: Point, b: Point, c: Point, d: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u ** 3 * a.x + 3 * u ** 2 * t * b.x + 3 * u * t ** 2 * c.x + t ** 3 * d.x,
    y: u ** 3 * a.y + 3 * u ** 2 * t * b.y + 3 * u * t ** 2 * c.y + t ** 3 * d.y,
  };
}

export function rocketArrivalFrames(distance: number, random: () => number = () => 0.5) {
  const variation = () => (random() - 0.5) * 0.14;
  const start = { x: -1, y: 0.56 + variation() };
  const first = { x: -0.9, y: 0.38 + variation() };
  const bend = { x: -0.67, y: -0.2 + variation() };
  const join = { x: -0.4, y: -0.04 + variation() };
  // Mirrored controls give both curves the same tangent at the join.
  const next = { x: 2 * join.x - bend.x, y: 2 * join.y - bend.y };
  const final = { x: -0.12, y: 0.12 };
  const end = { x: 0, y: 0 };
  const samples: (Point & { length: number })[] = [{ ...start, length: 0 }];
  for (let i = 1; i <= 240; i++) {
    const point =
      i <= 120
        ? bezier(start, first, bend, join, i / 120)
        : bezier(join, next, final, end, (i - 120) / 120);
    const previous = samples.at(-1)!;
    samples.push({
      ...point,
      length: previous.length + Math.hypot(point.x - previous.x, point.y - previous.y),
    });
  }
  const total = samples.at(-1)!.length;
  return Array.from({ length: 81 }, (_, index) => {
    const offset = index / 80;
    const progress = arrivalProgress(offset);
    const length = total * progress;
    const at = Math.max(
      1,
      samples.findIndex((sample) => sample.length >= length),
    );
    const before = samples[at - 1],
      after = samples[at];
    const fraction = (length - before.length) / (after.length - before.length || 1);
    const x = (before.x + (after.x - before.x) * fraction) * distance;
    const y = (before.y + (after.y - before.y) * fraction) * distance;
    const bank =
      index === 80 ? 0 : (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI + 45;
    const scale = 0.06 + 0.94 * progress;
    return {
      offset,
      transform: `translate(${x.toFixed(4)}px, ${y.toFixed(4)}px) scale(${scale.toFixed(5)}) rotate(${bank.toFixed(3)}deg)`,
      opacity: Math.min(1, progress / 0.6),
      "--arrival-wake-strength": Math.max(0, (progress - 0.2) / 0.8),
    };
  });
}
