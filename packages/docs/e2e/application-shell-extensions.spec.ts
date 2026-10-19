import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const variants = [
  { number: 9, name: "IDE Workspace" },
  { number: 11, name: "Video Platform" },
  { number: 12, name: "Two-Tier Workspace" },
  { number: 13, name: "Top Navigation Workspace" },
];
for (const variant of variants) {
  const route = `/blocks/application-shell/application-shell-${variant.number}`;
  test(`Shell ${variant.number}: complete guide and actual source showcase`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(variant.name);
    for (const id of ["installation", "usage", "props", "about", "production", "reference"])
      await expect(page.locator(`#application-shell-${id}`)).toBeAttached();
    await expect(
      page.locator('section[aria-labelledby="application-shell-reference"]'),
    ).toContainText("Public Design Reference");
    await page.getByRole("tab", { name: "Code", exact: true }).click();
    await expect(page.locator(".blocks-code-layout")).toContainText(
      `ApplicationShell${variant.number}`,
    );
    await expect(page.locator(".blocks-code-layout")).not.toContainText("Could not load");
    await page.getByRole("tab", { name: "Prompt", exact: true }).click();
    await expect(page.getByRole("tabpanel", { name: "Prompt", exact: true })).toContainText(
      `application-shell-${variant.number}`,
    );
  });
  test(`Shell ${variant.number}: responsive light and dark navigation`, async ({ page }) => {
    await page.goto(`${route}/preview`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    if (variant.number === 13) {
      await page.evaluate(() => document.documentElement.classList.remove("dark"));
      await assertNoBlockingA11yViolations(page, "Application Shell 13 light appearance");
    }
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const dark of [false, true]) {
        await page.evaluate(
          (value) => document.documentElement.classList.toggle("dark", value),
          dark,
        );
        await expect(page.locator("main")).toHaveCount(1);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        ).toBe(true);
      }
    }
    await assertNoBlockingA11yViolations(page, `Application Shell ${variant.number}`);
    if (variant.number === 9) {
      const editor = page.getByRole("textbox", { name: "Scratch editor" });
      await editor.fill("Keep this draft while the frame changes.");
      await page.getByRole("button", { name: "Workspace output", exact: true }).click();
      await expect(page.getByRole("region", { name: "Workspace output" })).toHaveCount(0);
      await page.getByRole("button", { name: "Toggle Sidebar", exact: true }).click();
      await expect(editor).toHaveValue("Keep this draft while the frame changes.");
      await page.getByRole("button", { name: "Workspace output", exact: true }).click();
      await expect(page.getByRole("region", { name: "Workspace output" })).toBeVisible();
      await page.getByRole("button", { name: "New file", exact: true }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("draft-3.tsx");
    }
    if (variant.number === 11) {
      await page
        .getByRole("searchbox", { name: "Search videos" })
        .fill("no matches for this query");
      await page.getByRole("button", { name: "Submit search" }).click();
      await expect(page.getByRole("heading", { name: "No matching sessions" })).toBeVisible();
      await page.getByRole("button", { name: "Reset filters" }).click();
      await page.getByRole("button", { name: "Design", exact: true }).click();
      await expect(page.getByRole("button", { name: /Building a calmer workspace/ })).toBeVisible();
      await page.getByRole("button", { name: "Subscriptions", exact: true }).click();
      await expect(page.getByRole("link", { name: "Studio Notes", exact: true })).toBeHidden();
    }
    if (variant.number === 12) {
      await page.getByRole("button", { name: "Switch organization: Kamod Studio" }).click();
      await page.getByRole("menuitem", { name: /Research Lab/ }).click();
      await expect(
        page.getByRole("button", { name: "Switch organization: Research Lab" }),
      ).toBeVisible();
      await page
        .getByRole("navigation", { name: "Workspace modules" })
        .first()
        .getByRole("link", { name: "Documents", exact: true })
        .click();
      await expect(page.locator("main")).toContainText("Documents");
      await page.getByRole("button", { name: "New project", exact: true }).click();
      await expect(page.locator("main")).toContainText("Project 4");
    }
    if (variant.number === 13) {
      const projects = page.getByRole("button", { name: "Projects", exact: true });
      await projects.focus();
      await page.keyboard.press("ArrowDown");
      await expect(page.getByRole("menuitem", { name: "Projects", exact: true })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(projects).toBeFocused();
      await projects.click();
      await page.getByRole("menuitem", { name: "Projects", exact: true }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Projects");
      await page
        .getByRole("searchbox", { name: "Search workspace" })
        .fill("no project has this name");
      await expect(page.getByRole("heading", { name: "No matching projects" })).toBeVisible();
      await page.getByRole("button", { name: "Clear search" }).click();
      await page.getByRole("button", { name: "Switch organization: Kamod Studio" }).click();
      await page.getByRole("menuitem", { name: "Research Lab", exact: true }).click();
      await expect(
        page.getByRole("button", { name: "Switch organization: Research Lab" }),
      ).toBeVisible();
    }
    await page.setViewportSize({ width: 320, height: 900 });
    const trigger = page.getByRole("button", { name: "Toggle Sidebar", exact: true });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
}
