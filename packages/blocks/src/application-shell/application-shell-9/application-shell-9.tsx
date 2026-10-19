import { PanelBottomIcon } from "@kamod-ch/icons/lucide";
import { Button, cn, SidebarInset, SidebarProvider, SidebarTrigger } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useId, useState } from "preact/hooks";
import type { ApplicationShellNavigationLink } from "../application-shell-1/types";
import { ShellBreadcrumbs } from "../shared/shell-breadcrumbs";
import { ShellRailLinks } from "../shared/shell-rail-links";
import { ShellTieredSidebar } from "../shared/shell-tiered-sidebar";
import type { ApplicationShellFrameProps } from "../shared/types";

/** IDE frame: module rail, caller-supplied file groups and an optional bottom panel. */
export type ApplicationShell9Props = ApplicationShellFrameProps & {
  /** Icon destinations for app-owned tools. Empty by default; active/currentPath decide selection. */
  activityLinks?: readonly ApplicationShellNavigationLink[];
  /** Bottom panel content. Omit to remove its toggle and region; page state survives panel closure. */
  panel?: ComponentChildren;
  /** Panel heading and toggle label; defaults to "Output". */
  panelTitle?: string;
};

/** Original Kamod composition inspired by the public IDE-style reference. */
export function ApplicationShell9({
  activityLinks = [],
  panel,
  panelTitle = "Output",
  children,
  headerActions,
  class: classProp,
  className,
  ...props
}: ApplicationShell9Props) {
  const [panelOpen, setPanelOpen] = useState(true);
  const panelId = useId();
  return (
    <SidebarProvider
      open={props.open}
      defaultOpen={props.defaultOpen ?? true}
      onOpenChange={props.onOpenChange}
      data-application-shell="ide"
      class={cn(
        "min-w-0 bg-background text-foreground md:pl-14 motion-reduce:[&_*]:transition-none!",
        classProp,
        className,
      )}
    >
      <aside
        aria-label="Activity bar"
        class="fixed inset-y-0 left-0 z-20 hidden w-14 flex-col items-center gap-5 border-r bg-sidebar py-4 text-sidebar-foreground md:flex"
      >
        <span
          role="img"
          aria-label={props.brand.name}
          class="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary [&>svg]:size-5 [&>img]:size-5"
        >
          {props.brand.logo ?? props.brand.name.slice(0, 1)}
        </span>
        <ShellRailLinks
          links={activityLinks}
          currentPath={props.currentPath}
          onNavigate={props.onNavigate}
        />
      </aside>
      <ShellTieredSidebar {...props} />
      <SidebarInset class="min-w-0">
        <header class="flex min-h-16 flex-wrap items-center gap-3 border-b px-4 py-3">
          <SidebarTrigger />
          <ShellBreadcrumbs breadcrumbs={props.breadcrumbs} onNavigate={props.onNavigate} />
          <div class="ml-auto flex max-w-full flex-wrap items-center gap-2">
            {headerActions}
            {panel && (
              <Button
                size="sm"
                variant="outline"
                aria-expanded={panelOpen}
                aria-controls={panelId}
                onClick={() => setPanelOpen((value) => !value)}
              >
                <PanelBottomIcon size={16} aria-hidden="true" />
                {panelTitle}
              </Button>
            )}
          </div>
        </header>
        {activityLinks.length > 0 && (
          <div class="border-b md:hidden">
            <ShellRailLinks
              links={activityLinks}
              currentPath={props.currentPath}
              onNavigate={props.onNavigate}
              mobile
            />
          </div>
        )}
        <div class="min-w-0 flex-1 p-4 sm:p-6">{children}</div>
        {panel && panelOpen && (
          <section id={panelId} aria-label={panelTitle} class="min-w-0 border-t bg-muted/20 p-4">
            <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider">{panelTitle}</h2>
            {panel}
          </section>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
