/** @jsxImportSource preact */
import { RocketIcon } from "@kamod-ch/icons/tabler/outline";
import { useEffect, useRef } from "preact/hooks";
import { observeViewportActivity } from "../../layout/runtime/viewport-activity";
import { ROCKET_ARRIVAL_MS, rocketArrivalFrames } from "./rocket-arrival";

// Outer corner lanes leave air around the vehicle; random placement happens only at hidden seams.
const STARS = [
  { x: 14, y: 17, size: 15, duration: 4.6, delay: 0 },
  { x: 58, y: 17, size: 16, duration: 5.3, delay: 0.4 },
  { x: 86, y: 38, size: 14, duration: 4.9, delay: 0.8 },
  { x: 85, y: 82, size: 15.5, duration: 5.8, delay: 0.2 },
] as const;
// The whole lower-left sector belongs to the wake; stars keep distinct perimeter cells.
const OPENING_STARS = [
  { x: 30, y: 6, size: 28, duration: 4.6, delay: 0 },
  { x: 60, y: 8, size: 19, duration: 5.7, delay: 0.65 },
  { x: 90, y: 23, size: 30, duration: 5.3, delay: 0.35 },
  { x: 94, y: 57, size: 18, duration: 6.1, delay: 0.9 },
  { x: 88, y: 90, size: 27, duration: 4.9, delay: 0.15 },
  { x: 0, y: 30, size: 29, duration: 5.8, delay: 0.5 },
] as const;
const TRAILS = [
  { x: 12, y: 72, size: 23, duration: 0.56, delay: -0.16 },
  { x: 20, y: 81, size: 29, duration: 0.71, delay: -0.42 },
  { x: 31, y: 87, size: 20, duration: 0.63, delay: -0.29 },
] as const;

function moveStar(star: SVGSVGElement, lane: (typeof STARS | typeof OPENING_STARS)[number]) {
  star.style.setProperty("--star-x", `${lane.x + (Math.random() - 0.5) * 4}%`);
  star.style.setProperty("--star-y", `${lane.y + (Math.random() - 0.5) * 4}%`);
  star.style.setProperty("--star-size", `${lane.size * (0.95 + Math.random() * 0.1)}px`);
}

/** Stationary flight: layered CSS turbulence and independent wake icons, without a frame loop. */
export function GettingStartedRocket({
  expansive = false,
  animateArrival = true,
}: {
  expansive?: boolean;
  animateArrival?: boolean;
}) {
  const stars = expansive ? OPENING_STARS : STARS;
  const field = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!field.current) return;
    const node = field.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const vehicle = node.querySelector<HTMLElement>(".getting-started-flight-arrival")!;
    let entry: Animation | undefined;
    if (animateArrival && !motion.matches && typeof vehicle.animate === "function") {
      const pixels = node.querySelector<HTMLElement>(".getting-started-flight-rocket")!.offsetWidth;
      const distance = Math.min(420, pixels * (2.35 + Math.random() * 0.3));
      entry = vehicle.animate(rocketArrivalFrames(distance, Math.random), {
        duration: ROCKET_ARRIVAL_MS,
        fill: "both",
        easing: "linear",
      });
      entry.pause();
      node.dataset.flightEnhanced = "true";
    }
    const stop = observeViewportActivity(node, (active) => {
      node.dataset.active = String(active);
      if (entry?.playState === "paused" && active) entry.play();
      else if (entry?.playState === "running" && !active) entry.pause();
    });
    const reduce = () => {
      if (motion.matches) entry?.cancel();
    };
    motion.addEventListener("change", reduce);
    return () => {
      stop();
      motion.removeEventListener("change", reduce);
      entry?.cancel();
    };
  }, [animateArrival]);

  return (
    <span
      ref={field}
      class={`getting-started-flight${expansive ? " getting-started-flight--expansive" : ""}`}
      style={{
        "--arrival-duration": `${animateArrival ? ROCKET_ARRIVAL_MS : 0}ms`,
        "--star-arrival-delay": `${animateArrival ? ROCKET_ARRIVAL_MS + 1000 : 0}ms`,
      }}
      data-flight-arrival={animateArrival ? undefined : "false"}
      data-active="false"
      aria-hidden="true"
    >
      {stars.map((star, index) => (
        <svg
          key={index}
          class="getting-started-flight-star"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
          style={{
            "--star-x": `${star.x}%`,
            "--star-y": `${star.y}%`,
            "--star-size": `${star.size}px`,
            "--star-duration": `${star.duration}s`,
            "--star-delay": `${star.delay}s`,
          }}
          onAnimationIteration={(event) => moveStar(event.currentTarget, star)}
        >
          <path d="M12 2c1 7 3 9 10 10-7 1-9 3-10 10C11 15 9 13 2 12c7-1 9-3 10-10Z" />
        </svg>
      ))}
      <span class="getting-started-flight-arrival">
        <span class="getting-started-flight-rocket">
          <span class="getting-started-flight-thrust">
            {TRAILS.map((trail, index) => (
              <svg
                key={index}
                class="getting-started-flight-trail"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.35}
                strokeLinecap="round"
                focusable="false"
                style={{
                  left: `${trail.x}%`,
                  top: `${trail.y}%`,
                  "--trail-size": `${trail.size}px`,
                  "--trail-duration": `${trail.duration}s`,
                  "--trail-delay": `${trail.delay}s`,
                  "--trail-drift": `${index === 0 ? -4 : index === 1 ? 2 : 5}px`,
                }}
              >
                <path d="m17 7-10 10" />
              </svg>
            ))}
            <RocketIcon class="getting-started-flight-vehicle" size={78} strokeWidth={1.4} />
          </span>
        </span>
      </span>
    </span>
  );
}
