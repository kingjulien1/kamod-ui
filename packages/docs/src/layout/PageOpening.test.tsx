// @vitest-environment jsdom
import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { PageOpening } from "./PageOpening";
import { PageLoadError, PageNotFound } from "./PageState";

function markup(startup: boolean, base = "/") {
  const root = document.createElement("div");
  root.innerHTML = renderToString(<PageOpening startup={startup} base={base} />);
  return root;
}

describe("shared page opening screen", () => {
  it("uses the same content and constellation before startup and during navigation", () => {
    const startup = markup(true);
    const navigation = markup(false);
    expect(startup.querySelector(".page-opening-content")!.textContent).toBe(
      navigation.querySelector(".page-opening-content")!.textContent,
    );
    expect(startup.querySelector(".page-loading-rocket")!.innerHTML).toBe(
      navigation.querySelector(".page-loading-rocket")!.innerHTML,
    );
    for (const root of [startup, navigation]) {
      expect(root.querySelector(".page-loading-brand")!.textContent).toBe("Kamod");
      expect(root.querySelector('.page-loading-brand [data-slot="spinner"]')).toBeNull();
    }
  });

  it("keeps the persistent startup overlay out of route landmarks and state selectors", () => {
    const startup = markup(true);
    expect(
      startup.querySelector("main, h1, #content, .page-state-shell, .page-state-loading"),
    ).toBeNull();
    const navigation = markup(false);
    expect(navigation.querySelector("main#content h1")!.textContent).toContain(
      "Opening Your Next Page",
    );
    expect(navigation.querySelector('.page-state-loading[aria-busy="true"]')).not.toBeNull();
  });

  it("resolves the home link and official symbol under a deployment base", () => {
    for (const startup of [true, false]) {
      const root = markup(startup, "/kamod-ui/");
      expect(root.querySelector('a[aria-label="Kamod UI home"]')!.getAttribute("href")).toBe(
        "/kamod-ui/",
      );
      for (const image of root.querySelectorAll(".kamod-icon__img")) {
        expect(image.getAttribute("src")).toMatch(/^\/kamod-ui\/kamod-icon(?:-dark)?\.svg$/);
      }
    }
  });
});

it("shares official branding and footer destinations across standalone states", () => {
  for (const state of [<PageOpening />, <PageNotFound />, <PageLoadError />]) {
    const root = document.createElement("div");
    root.innerHTML = renderToString(state);
    expect(root.querySelector("header .kamod-ui-logo-wordmark")?.textContent).toBe("kamod");
    expect(root.querySelector("header .kamod-ui-logo-product")?.textContent).toBe("UI");
    expect(root.querySelector("footer")?.textContent).toContain("Copyright © 2026 Klaus Zahiragic");
    expect(root.querySelector('footer a[href="https://www.kamod.ch/"]')).not.toBeNull();
    expect(
      root.querySelector('footer a[href="https://kamod-ch.github.io/preactpress/"]'),
    ).not.toBeNull();
    expect(root.querySelectorAll("main#content")).toHaveLength(1);
  }
  const root = markup(false);
  expect(root.querySelector(".page-loading-separator")?.textContent).toBe("/");
  expect(root.querySelector(".page-loading-tagline svg")?.getAttribute("fill")).toBe(
    "currentColor",
  );
  expect(root.querySelectorAll(".getting-started-flight-star")).toHaveLength(6);
});
