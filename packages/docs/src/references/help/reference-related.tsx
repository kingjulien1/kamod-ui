import { LayersIcon, StarIcon } from "@kamod-ch/icons/lucide";
import type { CodeReferenceHelp } from "../types";
import { referenceChapters } from "./reference-contract";
import { referencePresentation } from "./reference-presentation";
import { ReferenceResourceHint } from "./reference-resource-hint";
import { referenceResource } from "./reference-resources";

const descriptor = "contracts · resources · guides · references · third party";

/** One flat ending preserves verified destinations, with the tooltip's chosen reference first. */
export function ReferenceRelated({
  reference,
  links: resources,
  primary,
  id,
  highlightChapters = false,
}: {
  reference: CodeReferenceHelp;
  links?: CodeReferenceHelp["related"];
  primary?: string;
  id?: string;
  highlightChapters?: boolean;
}) {
  const fallback = !resources || !primary ? referencePresentation(reference) : undefined;
  const candidates = resources ?? fallback!.resources;
  const preferred = primary ?? fallback?.primary?.href;
  const main =
    candidates.find(({ href }) => href === preferred) ??
    (reference.source && reference.source.href === preferred
      ? { ...reference.source, kind: "source" as const }
      : undefined) ??
    (reference.docs && reference.docs.href === preferred
      ? { ...reference.docs, kind: "guide" as const }
      : undefined);
  const chapters = referenceChapters(reference).flatMap((section) =>
    section.source && section.source.href !== preferred ? [section.source] : [],
  );
  const chapterHrefs = new Set(chapters.map(({ href }) => href));
  const chapterLinks = chapters.map(
    (source) =>
      candidates.find(({ href }) => href === source.href) ?? { ...source, kind: "guide" as const },
  );
  const destinations = new Map<string, (typeof candidates)[number]>();
  for (const link of [...(main ? [main] : []), ...chapterLinks, ...candidates])
    if (!destinations.has(link.href)) destinations.set(link.href, link);
  const links = [...destinations.values()];
  if (!links.length) return null;
  return (
    <nav
      id={id}
      class="code-reference-help-related"
      aria-label="Related references"
      data-highlight-chapters={highlightChapters || undefined}
    >
      <div class="code-reference-help-reading-heading">
        <div class="code-reference-help-reading-heading-left">
          <strong>
            <LayersIcon size={12} strokeWidth={2} aria-hidden="true" /> Useful resources
          </strong>
          <span class="code-reference-help-reading-detail" title={descriptor}>
            <span aria-hidden="true">·</span> {descriptor}
          </span>
        </div>
        <span class="code-reference-help-reading-count">
          <strong>{links.length}</strong> {links.length === 1 ? "reference" : "references"}
        </span>
      </div>
      <ul class="code-reference-help-related-links">
        {links.map((link) => {
          const { Icon, label, caption, description } = referenceResource(link);
          const isPrimary = link.href === preferred;
          const anchor = (
            <a
              href={link.href}
              aria-label={link.label}
              target="_top"
              class={`code-reference-help-related-link${isPrimary ? " code-reference-help-primary-link" : ""}`}
              data-reference-primary={isPrimary || undefined}
              data-reference-chapter={(!isPrimary && chapterHrefs.has(link.href)) || undefined}
              title={
                isPrimary
                  ? undefined
                  : `${caption}: ${link.label}. ${description.replace(/\*\*|`/g, "")} Destination: ${link.href}`
              }
            >
              {isPrimary && (
                <span class="code-reference-help-main-star" aria-hidden="true">
                  <StarIcon size={11} strokeWidth={1.6} />
                </span>
              )}
              <Icon size={9} strokeWidth={1.75} aria-hidden="true" />
              <code>{link.label}</code>
              <span class="code-reference-help-related-kind">
                <span aria-hidden="true">/</span> {label}
              </span>
            </a>
          );
          return (
            <li key={link.href} class="code-reference-help-related-item">
              {isPrimary ? (
                <ReferenceResourceHint
                  name={reference.name}
                  label={link.label}
                  href={link.href}
                  description={description}
                >
                  {anchor}
                </ReferenceResourceHint>
              ) : (
                anchor
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
