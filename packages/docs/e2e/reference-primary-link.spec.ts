import { expect, test } from "@playwright/test";

for (const width of [320, 1440]) {
  test(`reference header and starred primary resource share their destination at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/getting-started");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await page.evaluate(() => {
      const line = document.createElement("p");
      line.id = "primary-reference-fixture";
      line.innerHTML = "<code>Dialog</code>";
      document.querySelector("main")!.prepend(line);
    });
    const term = page.locator("#primary-reference-fixture code");
    await expect(term).toHaveAttribute("data-code-module");
    await term.focus();
    const card = page.getByRole("dialog", { name: "Dialog reference", exact: true });
    await expect(card.locator('[data-reference-kind="component"]')).toBeVisible();
    const jump = card.locator(".code-reference-help-chapter-jump");
    await expect(jump).toHaveText("3 reference chapters");
    await jump.click();
    const resources = card.locator(".code-reference-help-related");
    await expect(resources).toHaveAttribute("data-highlight-chapters", "true");
    const chapterPositions = await resources
      .locator(".code-reference-help-related-link")
      .evaluateAll((links) =>
        links.flatMap((link, index) =>
          link.hasAttribute("data-reference-chapter") ? [index] : [],
        ),
      );
    expect(chapterPositions).toHaveLength(3);
    expect(chapterPositions.at(-1)! - chapterPositions[0]).toBe(2);
    await expect(resources.locator("[data-reference-chapter]").first()).toHaveCSS(
      "outline-width",
      "2px",
    );
    if (width === 320) {
      const panel = card.locator(".code-reference-help-panel").nth(1);
      expect(
        await panel.evaluate((node) => {
          node.scrollLeft = node.scrollWidth;
          return node.scrollLeft;
        }),
      ).toBeGreaterThan(0);
    }
    const primary = card.locator(".code-reference-help-primary-link");
    await expect(primary).not.toHaveAttribute("data-reference-chapter");
    await expect(primary).toHaveCSS("outline-width", "0px");
    const destination = (await primary.getAttribute("href"))!;
    await expect(card.locator("header a")).toHaveCount(1);
    await expect(card.locator(".code-reference-help-header-main")).toHaveAttribute(
      "href",
      destination,
    );
    await expect(card.locator(".code-reference-help-origin-link")).toHaveAttribute(
      "href",
      destination,
    );
    expect(
      await card
        .locator(".code-reference-help-kind")
        .evaluate((node) => node.closest("a")?.getAttribute("href")),
    ).toBe(destination);
    expect(
      await card
        .locator(".code-reference-help-context")
        .evaluate((node) => node.closest("a")?.getAttribute("href")),
    ).toBe(destination);
    await expect(card.locator("a a")).toHaveCount(0);
    await primary.scrollIntoViewIfNeeded();
    const palette = await primary.evaluate((node) => {
      const probe = document.createElement("span");
      probe.style.cssText = "background:var(--primary);color:var(--primary-foreground)";
      node.append(probe);
      const style = getComputedStyle(probe),
        result = { background: style.backgroundColor, ink: style.color };
      probe.remove();
      return result;
    });
    await expect(primary).toHaveCSS("background-color", palette.background);
    await expect(primary).toHaveCSS("color", palette.ink);
    await expect(card.locator(".code-reference-help-related-links")).toHaveCSS(
      "justify-content",
      "flex-start",
    );
    const aligned = await resources
      .locator(".code-reference-help-related-link")
      .evaluateAll((links) =>
        links.every((node) => {
          const center = node.getBoundingClientRect().y + node.getBoundingClientRect().height / 2;
          return [...node.children].every((child) => {
            const box = child.getBoundingClientRect();
            return Math.abs(box.y + box.height / 2 - center) < 1;
          });
        }),
      );
    expect(aligned).toBe(true);
    const star = primary.locator(".code-reference-help-main-star");
    await expect(star).toHaveCSS("color", "rgb(250, 204, 21)");
    await expect(star.locator("svg")).toHaveCSS("animation-name", "reference-main-star-twinkle");
    expect(
      await star.evaluate((node) =>
        node
          .getAnimations({ subtree: true })
          .every((animation) => Number(animation.effect!.getTiming().duration) >= 10000),
      ),
    ).toBe(true);
    await primary.hover();
    const hint = page.getByRole("tooltip").filter({ hasText: "Main reference · start here" });
    await expect(hint).toBeVisible();
    await expect(hint).toContainText("Your starting point for Dialog");
    const box = (await hint.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(15);
    expect(box.y + box.height).toBeLessThanOrEqual(885);
    expect(
      await card.evaluate(
        (node) => !node.contains(document.querySelector(".code-reference-resource-tooltip")),
      ),
    ).toBe(true);
    await expect(card).toBeVisible();
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(await star.evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(0);
    await page.keyboard.press("Escape");
    await expect(card).toHaveCount(0);
    await expect(hint).toHaveCount(0);
  });
}
