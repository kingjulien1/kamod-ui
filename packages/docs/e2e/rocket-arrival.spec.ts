import { expect, test } from "@playwright/test";

for (const loading of [false, true]) {
  test(`rocket ${loading ? "starts in its final loop on the loading page" : "grows along its curved arrival before guide stars appear"}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    let release = () => {};
    if (loading) {
      const pending = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route(/GettingStartedContent.*\.(?:js|tsx)/, async (route) => {
        await pending;
        await route.continue().catch(() => {});
      });
    }
    try {
      await page.goto(loading ? "/404" : "/docs/getting-started");
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      if (loading) await page.getByRole("link", { name: "Getting Started", exact: true }).click();
      const flight = page.locator(
        loading
          ? ".page-state-shell .getting-started-flight"
          : ".page-header-decoration .getting-started-flight",
      );
      if (loading) {
        await expect(flight).toHaveAttribute("data-flight-arrival", "false");
        await expect(flight).not.toHaveAttribute("data-flight-enhanced");
      } else await expect(flight).toHaveAttribute("data-flight-enhanced", "true");
      await expect(flight).toHaveAttribute("data-active", "true");
      const samples = await flight.evaluate((node) => {
        const entry = node.querySelector(".getting-started-flight-arrival")!;
        const stars = [...node.querySelectorAll(".getting-started-flight-star")];
        const animations = node.getAnimations({ subtree: true });
        animations.forEach((animation) => animation.pause());
        return [0, 1920, 3200, 4100, 5000].map((time) => {
          animations.forEach((animation) => {
            animation.currentTime = time;
          });
          const style = getComputedStyle(entry),
            matrix = new DOMMatrix(style.transform);
          return {
            time,
            x: matrix.e,
            y: matrix.f,
            scale: Math.hypot(matrix.a, matrix.b),
            opacity: Number(style.opacity),
            loop: getComputedStyle(node.querySelector(".getting-started-flight-rocket")!).transform,
            wake: parseFloat(
              getComputedStyle(node.querySelector(".getting-started-flight-trail")!).strokeWidth,
            ),
            stars: stars.map((star) => Number(getComputedStyle(star).opacity)),
            safe: stars.every((star) => {
              const s = getComputedStyle(star);
              return !(
                parseFloat(s.getPropertyValue("--star-x")) < 50 &&
                parseFloat(s.getPropertyValue("--star-y")) > 50
              );
            }),
          };
        });
      });
      if (loading) {
        for (const sample of samples) {
          expect(sample.opacity).toBe(1);
          expect(sample.scale).toBe(1);
          expect(Math.hypot(sample.x, sample.y)).toBe(0);
          expect(sample.wake).toBeCloseTo(1.9);
        }
        expect(samples[0].loop).not.toBe(samples[1].loop);
        expect(samples[1].stars.some((opacity) => opacity > 0.1)).toBe(true);
      } else {
        expect(samples[0].opacity).toBe(0);
        expect(samples[0].scale).toBeCloseTo(0.06, 2);
        expect(Math.hypot(samples[0].x, samples[0].y)).toBeGreaterThan(100);
        expect(samples[1].scale).toBeCloseTo(0.624, 2);
        expect(samples[1].opacity).toBe(1);
        expect(samples[2].scale).toBeCloseTo(1, 3);
        expect(Math.hypot(samples[2].x, samples[2].y)).toBeLessThan(0.1);
        expect(samples[1].wake).toBeGreaterThan(samples[0].wake);
        expect(samples[2].wake).toBeGreaterThan(samples[1].wake);
        expect(
          samples.slice(0, 4).every((sample) => sample.stars.every((opacity) => opacity === 0)),
        ).toBe(true);
      }
      expect(samples[4].stars.some((opacity) => opacity > 0.1)).toBe(true);
      expect(samples.every((sample) => sample.safe)).toBe(true);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(flight.locator(".getting-started-flight-arrival")).toHaveCSS("opacity", "1");
      await expect
        .poll(() =>
          flight.evaluate(
            (node) =>
              node
                .getAnimations({ subtree: true })
                .filter((animation) => animation.playState === "running").length,
          ),
        )
        .toBe(0);
    } finally {
      release();
    }
  });
}
