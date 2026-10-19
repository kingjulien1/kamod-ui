import { cn, SidebarInset, SidebarProvider, SidebarTrigger } from "@kamod-ch/ui";
import { AppSidebar } from "../application-shell-1/app-sidebar";
import { NavUser } from "../application-shell-1/nav-user";
import type { ApplicationShellNavigationLink } from "../application-shell-1/types";
import { ShellBreadcrumbs } from "../shared/shell-breadcrumbs";
import { ShellGroupMenus } from "../shared/shell-group-menus";
import {
  type ShellOrganizationProps,
  ShellOrganizationSwitcher,
} from "../shared/shell-organization-switcher";
import { ShellRailLinks } from "../shared/shell-rail-links";
import { ShellSearch, type ShellSearchProps } from "../shared/shell-search";
import type { ApplicationShellFrameProps } from "../shared/types";

/** Horizontal group menus retain hierarchy; desktop sidebar state is intentionally not public. */
export type ApplicationShell13Props = Omit<
  ApplicationShellFrameProps,
  "open" | "defaultOpen" | "onOpenChange"
> &
  ShellOrganizationProps &
  ShellSearchProps & {
    /** Optional frequent destinations for the mobile bottom bar; defaults to an empty list. */
    mobileLinks?: readonly ApplicationShellNavigationLink[];
  };

export function ApplicationShell13({
  mobileLinks = [],
  headerActions,
  children,
  class: classProp,
  className,
  ...props
}: ApplicationShell13Props) {
  return (
    <SidebarProvider
      data-application-shell="top-navigation"
      class={cn(
        "min-w-0 flex-col bg-background text-foreground motion-reduce:[&_*]:transition-none!",
        classProp,
        className,
      )}
    >
      <div class="md:hidden">
        <AppSidebar {...props} />
      </div>
      <div class="sticky top-0 z-20 border-b bg-background">
        <header class="mx-auto flex min-h-16 max-w-screen-2xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 md:flex-nowrap">
          <SidebarTrigger class="md:hidden" />
          <span class="flex min-w-0 max-w-[55%] items-center gap-2 font-semibold">
            <span class="shrink-0 [&>img]:size-7 [&>svg]:size-7" aria-hidden="true">
              {props.brand.logo}
            </span>
            <span class="truncate">{props.brand.name}</span>
          </span>
          <div class="order-3 w-full md:order-none md:mx-auto md:max-w-lg md:flex-1">
            <ShellSearch {...props} />
          </div>
          <div class="ml-auto flex max-w-full items-center gap-2">
            {headerActions}
            <div class="hidden w-44 md:block">
              <NavUser user={props.user} onUserAction={props.onUserAction} />
            </div>
          </div>
        </header>
        <div class={`${props.organizations?.length ? "flex" : "hidden md:flex"} border-t`}>
          <div class="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
            <ShellGroupMenus
              groups={props.navigationGroups}
              currentPath={props.currentPath}
              onNavigate={props.onNavigate}
            />
            <div class="ml-auto w-full md:w-52">
              <ShellOrganizationSwitcher {...props} />
            </div>
          </div>
        </div>
      </div>
      <SidebarInset class="min-w-0">
        <div
          class={`mx-auto w-full min-w-0 max-w-7xl space-y-6 p-4 sm:p-6 ${mobileLinks.length ? "pb-32 md:pb-6" : ""}`}
        >
          <ShellBreadcrumbs breadcrumbs={props.breadcrumbs} onNavigate={props.onNavigate} />
          {children}
        </div>
      </SidebarInset>
      {mobileLinks.length > 0 && (
        <div class="fixed inset-x-0 bottom-0 z-30 border-t bg-background px-2 pt-1 pb-[max(.5rem,env(safe-area-inset-bottom))] md:hidden">
          <ShellRailLinks
            label="Quick navigation"
            links={mobileLinks}
            currentPath={props.currentPath}
            onNavigate={props.onNavigate}
            mobile
          />
        </div>
      )}
    </SidebarProvider>
  );
}
