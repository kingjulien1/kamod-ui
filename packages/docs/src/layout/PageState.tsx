import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  HouseIcon,
  RotateCcwIcon,
  RouteIcon,
} from "@kamod-ch/icons/lucide";
import { APP_BASE_URL, withBasePath } from "../base-path";
import { ExceptionPageFrame } from "./ExceptionPageFrame";
import { PageOpening } from "./PageOpening";

/** A standalone recovery page, with no demo registry or browser-only state. */
export function PageNotFound() {
  return (
    <ExceptionPageFrame base={APP_BASE_URL} class="page-state-shell--not-found">
      <section class="not-found-hero" aria-labelledby="page-state-title">
        <p class="not-found-status" aria-hidden="true">
          404
        </p>
        <div class="not-found-copy">
          <h1 id="page-state-title">Page not found</h1>
          <p class="not-found-description">We couldn’t find that page.</p>
          <nav class="not-found-actions" aria-label="Page recovery">
            <a class="not-found-home" href={withBasePath("/")}>
              <HouseIcon size={15} aria-hidden="true" />
              Back to Home
            </a>
            <a class="not-found-guide" href={withBasePath("/docs/getting-started")}>
              Getting Started <ArrowRightIcon size={14} aria-hidden="true" />
            </a>
          </nav>
        </div>
      </section>
    </ExceptionPageFrame>
  );
}

export function PageLoading({ compact = false }: { compact?: boolean }) {
  return <PageOpening base={APP_BASE_URL} compact={compact} />;
}

/** A static first-paint-sized message; a full reload also clears a rejected lazy import. */
export function PageLoadError({ compact = false }: { compact?: boolean }) {
  const content = (
    <section class="page-state-message" role="alert">
      <p class="page-state-message-label">
        <span class="page-state-message-brand">
          <RouteIcon size={18} aria-hidden="true" />
          <strong>Kamod</strong>
        </span>
        <span aria-hidden="true">·</span>
        <span>Loading interrupted</span>
      </p>
      <h1 class="page-state-message-title">Let’s Try That Again.</h1>
      <p class="page-state-message-description">
        Something interrupted this {compact ? "preview" : "page"} before it was ready. Check your
        connection, then try loading it again.
        {!compact && " You can also head home and pick up from there."}
      </p>
      <div class="page-recovery-actions">
        <button class="page-recovery-link" type="button" onClick={() => window.location.reload()}>
          <RotateCcwIcon size={14} aria-hidden="true" />
          <span>Reload Page</span>
          <ArrowRightIcon size={12} aria-hidden="true" />
        </button>
        {!compact && (
          <>
            <span class="page-recovery-action-divider" aria-hidden="true">
              /
            </span>
            <a class="page-recovery-link" href={withBasePath("/")}>
              <HouseIcon size={14} aria-hidden="true" />
              <span>Back to Home</span>
              <ArrowUpRightIcon size={12} aria-hidden="true" />
            </a>
          </>
        )}
      </div>
      <hr class="page-recovery-divider" />
    </section>
  );
  return compact ? (
    <div class="page-state-recovery page-state-recovery--compact">{content}</div>
  ) : (
    <ExceptionPageFrame base={APP_BASE_URL} mainClass="page-state-recovery">
      {content}
    </ExceptionPageFrame>
  );
}
