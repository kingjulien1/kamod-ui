import { MenuIcon } from "@kamod-ch/icons/lucide";
import {
  Button,
  cn,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@kamod-ch/ui";
import { NavUser } from "../application-shell-1/nav-user";
import type { ApplicationShellNavigationLink } from "../application-shell-1/types";
import { ShellBreadcrumbs } from "../shared/shell-breadcrumbs";
import {
  type ShellOrganizationProps,
  ShellOrganizationSwitcher,
} from "../shared/shell-organization-switcher";
import { ShellRailLinks } from "../shared/shell-rail-links";
import { ShellTieredSidebar } from "../shared/shell-tiered-sidebar";
import type { ApplicationShellFrameProps } from "../shared/types";

/** A persistent module rail with a separately collapsible contextual navigation panel. */
export type ApplicationShell12Props = ApplicationShellFrameProps &
  ShellOrganizationProps & {
    /** Module destinations for the desktop rail and mobile bottom bar; defaults to an empty list. */
    moduleLinks?: readonly ApplicationShellNavigationLink[];
  };

function TieredWorkspace({
  moduleLinks = [],
  children,
  headerActions,
  ...props
}: ApplicationShell12Props) {
  const { openMobile, setOpenMobile } = useSidebar();
  return (
    <>
      <aside
        aria-label="Module rail"
        class="fixed inset-y-0 left-0 z-20 hidden w-14 flex-col items-center gap-5 border-r bg-sidebar py-4 text-sidebar-foreground md:flex"
      >
        <span
          role="img"
          aria-label={props.brand.name}
          class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary [&>img]:size-6 [&>svg]:size-6"
        >
          {props.brand.logo ?? props.brand.name.slice(0, 1)}
        </span>
        <ShellRailLinks
          links={moduleLinks}
          label="Workspace modules"
          currentPath={props.currentPath}
          onNavigate={props.onNavigate}
        />
        <div class="mt-auto flex flex-col items-center gap-3">
          <SidebarTrigger />
          <div class="group w-10" data-collapsible="icon">
            <NavUser user={props.user} onUserAction={props.onUserAction} />
          </div>
        </div>
      </aside>
      <ShellTieredSidebar
        {...props}
        showAccount={false}
        heading={props.organizations?.length ? <ShellOrganizationSwitcher {...props} /> : undefined}
      />
      <SidebarInset class="min-w-0 bg-background md:my-2 md:mr-2 md:rounded-2xl md:border md:shadow-sm">
        <header class="flex min-h-16 flex-wrap items-center gap-3 border-b px-4 py-3">
          <SidebarTrigger class="md:hidden" />
          <ShellBreadcrumbs breadcrumbs={props.breadcrumbs} onNavigate={props.onNavigate} />
          <div class="ml-auto flex max-w-full flex-wrap gap-2">{headerActions}</div>
        </header>
        <div class="min-w-0 flex-1 p-4 pb-32 sm:p-6 md:pb-6">{children}</div>
      </SidebarInset>
      <div class="fixed inset-x-0 bottom-0 z-30 border-t bg-background px-2 pt-2 pb-[max(.5rem,env(safe-area-inset-bottom))] md:hidden">
        <div class="flex items-end gap-1">
          <div class="min-w-0 flex-1">
            <ShellRailLinks
              links={moduleLinks}
              label="Workspace modules"
              currentPath={props.currentPath}
              onNavigate={props.onNavigate}
              mobile
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            class="h-auto shrink-0 flex-col gap-1 py-2 text-xs"
            aria-label="Open workspace menu"
            aria-expanded={openMobile}
            onClick={() => setOpenMobile(true)}
          >
            <MenuIcon size={19} aria-hidden="true" />
            Menu
          </Button>
        </div>
      </div>
    </>
  );
}

export function ApplicationShell12({
  class: classProp,
  className,
  ...props
}: ApplicationShell12Props) {
  return (
    <SidebarProvider
      open={props.open}
      defaultOpen={props.defaultOpen ?? true}
      onOpenChange={props.onOpenChange}
      data-application-shell="tiered"
      class={cn(
        "min-w-0 bg-sidebar text-foreground md:pl-14 motion-reduce:[&_*]:transition-none!",
        classProp,
        className,
      )}
    >
      <TieredWorkspace {...props} />
    </SidebarProvider>
  );
}
