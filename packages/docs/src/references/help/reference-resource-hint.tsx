import { Tooltip, TooltipContent, TooltipTrigger } from "@kamod-ch/ui/tooltip";
import type { ComponentChildren } from "preact";
import { createPortal } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { ReferenceSentence } from "./reference-sentence";

/** The resource hint sits outside the scrolling card so short references cannot clip it. */
export function ReferenceResourceHint({
  children,
  name,
  label,
  description,
  href,
}: {
  children: ComponentChildren;
  name: string;
  label: string;
  description: string;
  href: string;
}) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);
  return (
    <Tooltip
      open={open}
      onOpenChange={setOpen}
      delayDuration={550}
      closeDelayDuration={140}
      disableHoverableContent
      style={{ minWidth: 0, maxWidth: "100%" }}
    >
      <TooltipTrigger
        asChild
        onPointerEnter={(event) => setAnchor(event.currentTarget.getBoundingClientRect())}
        onFocus={(event) => setAnchor(event.currentTarget.getBoundingClientRect())}
      >
        {children}
      </TooltipTrigger>
      {open &&
        anchor &&
        createPortal(
          <div
            class="code-reference-resource-tooltip"
            data-application-tooltip=""
            style={{
              position: "fixed",
              top: anchor.top,
              left: anchor.left,
              width: anchor.width,
              height: anchor.height,
              pointerEvents: "none",
              zIndex: 10020,
            }}
          >
            <TooltipContent
              class="code-reference-help-resource-hint"
              side="top"
              align="start"
              collisionPadding={16}
              sideOffset={6}
            >
              <span class="code-reference-help-resource-hint-intro">
                Main reference · start here
              </span>
              <strong>{label}</strong>
              <p>
                Your starting point for {name}. <ReferenceSentence text={description} />
              </p>
              <span class="code-reference-help-resource-hint-path" title={href}>
                {href}
              </span>
            </TooltipContent>
          </div>,
          document.body,
        )}
    </Tooltip>
  );
}
