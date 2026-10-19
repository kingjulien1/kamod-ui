import { ExternalLinkIcon, LinkIcon } from "@kamod-ch/icons/lucide";
import { Badge } from "@kamod-ch/ui/badge";
import { useId, useState } from "preact/hooks";
import { splitDisplayPath } from "../../docs/components/display-path";
import type { CodeReferenceHelp } from "../types";
import { technologyRole } from "./reference-context";
import { hasReferenceContract, ReferenceContract, referenceChapters } from "./reference-contract";
import { ReferenceFacts } from "./reference-facts";
import { referenceKinds } from "./reference-kinds";
import { ReferenceNotice } from "./reference-notice";
import { ReferencePage } from "./reference-page";
import { referencePresentation } from "./reference-presentation";
import { ReferenceRelated } from "./reference-related";
import { ReferenceSentence } from "./reference-sentence";

/** Preserve the copyable origin while each path segment yields to the single-line row. */
function ReferencePath({ path }: { path: string }) {
  const { root, middle, end } = splitDisplayPath(path);
  return (
    <code
      class="path-display code-reference-help-path"
      data-path-middle={middle ? "true" : undefined}
      dir="ltr"
    >
      {root && <span data-path-part="root">{root}</span>}
      {middle && <span data-path-part="middle">{middle}</span>}
      {end && <span data-path-part="end">{end}</span>}
    </code>
  );
}

/** One responsive reading surface, using verified facts and existing delegated tooltip behavior. */
export function CodeReferenceHelpContent({ reference }: { reference: CodeReferenceHelp }) {
  const { kind, name, module, description } = reference;
  const { Icon, label } = referenceKinds[kind];
  const { primary, location, context, resources, note, caption, page } =
    referencePresentation(reference);
  const resourcesId = useId();
  const [chaptersHighlighted, setChaptersHighlighted] = useState(false);
  const chapters = referenceChapters(reference);
  const chapterCount = reference.sections?.length
    ? chapters.filter((chapter) => chapter.source).length
    : 0;
  const role = technologyRole(reference);
  const HeaderTag = primary ? "a" : "div";
  const OriginTag = primary ? "a" : "div";
  return (
    <div class="code-reference-help-layout" data-reference-kind={kind}>
      <header class="code-reference-help-header">
        <HeaderTag
          class="code-reference-help-header-main"
          href={primary?.href}
          target={primary ? "_top" : undefined}
          aria-label={primary ? `View ${name} reference` : undefined}
          title={primary?.label}
        >
          <span
            class={`code-reference-help-kind-icon${primary ? " docs-icon-button" : ""}`}
            aria-hidden="true"
          >
            <LinkIcon size={16} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <div class="code-reference-help-heading">
            <div class="code-reference-help-title-row">
              <span class="code-reference-help-title">
                <strong>
                  <code>{name}</code>
                </strong>
              </span>
              {role && (
                <span class="code-reference-help-role" title={role}>
                  <span aria-hidden="true">/</span>
                  <span>{role}</span>
                </span>
              )}
            </div>
          </div>
          <div class="code-reference-help-heading-meta">
            <div class="code-reference-help-badges">
              <Badge class="code-reference-help-kind" size="xxs">
                <Icon size={12} strokeWidth={2} aria-hidden="true" />
                {page?.label ?? label}
              </Badge>
              {primary && (
                <span class="docs-icon-button code-reference-help-open" aria-hidden="true">
                  <ExternalLinkIcon size={11} strokeWidth={2.5} aria-hidden="true" />
                </span>
              )}
            </div>
          </div>
        </HeaderTag>
      </header>
      {page ? (
        <ReferencePage reference={reference} destination={page} />
      ) : (
        <>
          <div class="code-reference-help-origin">
            <OriginTag
              class="code-reference-help-origin-link"
              href={primary?.href}
              target={primary ? "_top" : undefined}
            >
              <span class="code-reference-help-origin-path">
                <ReferencePath path={module} />
              </span>
              <span class="code-reference-help-context" title={context}>
                <span aria-hidden="true">/</span>
                <span>{kind === "technology" ? "Setup & Usage" : context}</span>
              </span>
            </OriginTag>
            {location &&
              (chapterCount > 0 ? (
                <a
                  class="code-reference-help-location-detail code-reference-help-chapter-jump"
                  href={`#${resourcesId}`}
                  aria-controls={resourcesId}
                  onClick={(event) => {
                    event.preventDefault();
                    setChaptersHighlighted(true);
                    document.getElementById(resourcesId)?.scrollIntoView({
                      block: "nearest",
                      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                        ? "instant"
                        : "smooth",
                    });
                  }}
                >
                  <strong>{chapterCount}</strong>{" "}
                  <span>reference {chapterCount === 1 ? "chapter" : "chapters"}</span>
                </a>
              ) : (
                <span class="code-reference-help-location-detail" title={location.detail}>
                  <span>{location.detail}</span>
                </span>
              ))}
          </div>
          <div class="code-reference-help-summary">
            <p>
              <ReferenceSentence text={description} />
            </p>
            <ReferenceFacts reference={reference} />
            {caption && (
              <p class="code-reference-help-detail">
                <ReferenceSentence text={caption} />
                {kind !== "command" && (
                  <>
                    {" "}
                    <ReferenceSentence text={note} />
                  </>
                )}
              </p>
            )}
          </div>
        </>
      )}
      {reference.notice && <ReferenceNotice notice={reference.notice} />}
      {hasReferenceContract(reference) && (
        <div class="code-reference-help-content">
          <ReferenceContract reference={reference} />
        </div>
      )}
      <ReferenceRelated
        reference={reference}
        links={resources}
        primary={primary?.href}
        id={resourcesId}
        highlightChapters={chaptersHighlighted}
      />
    </div>
  );
}
