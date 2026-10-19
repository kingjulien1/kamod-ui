/** @jsxImportSource preact */
import { KamodMarkIcon } from "../docs/components/brand/KamodMarkIcon";
import { GettingStartedRocket } from "../docs/components/GettingStartedRocket";
import { ExceptionPageFrame } from "./ExceptionPageFrame";

/** Shared by first paint and route loading; no Vite environment or page registry dependency. */
export function PageOpening({
  base = "/",
  compact = false,
  startup = false,
}: {
  base?: string;
  compact?: boolean;
  startup?: boolean;
}) {
  // The startup overlay stays outside the app after readiness. Omit runtime landmarks/IDs
  // and its h1 so it cannot become a second page title or match route-state selectors.
  const Title = startup ? "p" : "h1";
  const content = (
    <section
      class={`page-opening-content${startup ? "" : " page-state-loading"}${compact ? " page-state-loading--compact" : ""}`}
      aria-label={startup ? undefined : "Loading content"}
      aria-busy="true"
    >
      <div
        class="page-opening-copy"
        role={startup ? undefined : "status"}
        aria-live={startup ? undefined : "polite"}
        aria-atomic="true"
      >
        <p class="page-state-eyebrow page-loading-label">
          <span class="page-loading-brand">
            <strong>Kamod</strong>
          </span>
          <span class="page-loading-separator" aria-hidden="true">
            /
          </span>
          <span class="page-loading-caption">
            {compact
              ? "Preparing your interactive preview..."
              : "Your next page is taking shape..."}
          </span>
        </p>
        <Title
          class="page-loading-title"
          aria-label={compact ? "Loading Preview…" : "Opening Your Next Page…"}
        >
          {compact ? "Loading " : "Opening Your Next "}
          <span class="page-loading-ending">
            {compact ? "Preview" : "Page"}
            <span class="page-loading-ellipsis" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span class="page-loading-ellipsis-label">…</span>
          </span>
        </Title>
        <p class="page-state-description page-loading-description">
          {compact
            ? "Preparing the interactive example."
            : "Loading the guide and preparing its examples for you to explore. The page will appear here automatically when it’s ready, so you can keep this view open without refreshing."}
        </p>
      </div>
      <div class="page-opening-preview">
        <div class="page-state-skeleton docs-loading-skeleton" aria-hidden="true">
          <span class="page-loading-track docs-loading-shape" />
          <span class="docs-loading-shape" />
          <span class="docs-loading-shape" />
          <div class="page-loading-panel">
            <div class="page-loading-panel-header">
              <span class="page-loading-panel-icon docs-loading-shape" />
              <div class="page-loading-panel-lines">
                <span class="docs-loading-shape" />
                <span class="docs-loading-shape" />
              </div>
              <span class="page-loading-panel-action docs-loading-shape" />
            </div>
            <span class="page-loading-panel-line docs-loading-shape" />
            <span class="page-loading-panel-line docs-loading-shape" />
            <div class="page-loading-panel-footer">
              <span class="docs-loading-shape" />
              <span class="docs-loading-shape" />
              <span class="docs-loading-shape" />
            </div>
          </div>
        </div>
        {!compact && (
          <p class="page-loading-tagline">
            <KamodMarkIcon size="1em" aria-hidden="true" />
            Made for Preact. Built to be yours.
          </p>
        )}
      </div>
    </section>
  );
  if (compact) return content;
  return (
    <ExceptionPageFrame
      base={base}
      startup={startup}
      class={startup ? "" : "page-state-shell--loading"}
      decoration={
        <div class="page-loading-rocket">
          <GettingStartedRocket expansive animateArrival={false} />
        </div>
      }
    >
      {content}
    </ExceptionPageFrame>
  );
}
