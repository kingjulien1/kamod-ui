import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { NavMain } from "../application-shell-1/nav-main";
import { NavUser } from "../application-shell-1/nav-user";
import type { ApplicationShellNavigate } from "../application-shell-1/types";
import type { ApplicationShellFrameProps } from "./types";

/** An off-canvas panel beside a persistent 3.5rem rail; mobile uses the core Sheet. */
export function ShellTieredSidebar({
  brand,
  navigationGroups,
  user,
  currentPath,
  onNavigate,
  onUserAction,
  heading,
  showAccount = true,
}: Pick<
  ApplicationShellFrameProps,
  "brand" | "navigationGroups" | "user" | "currentPath" | "onNavigate" | "onUserAction"
> & { heading?: ComponentChildren; showAccount?: boolean }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const navigate: ApplicationShellNavigate = (destination, event) => {
    onNavigate?.(destination, event);
    if (
      isMobile &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey
    )
      setOpenMobile(false);
  };
  return (
    <Sidebar
      collapsible="offcanvas"
      class="md:left-14! md:group-data-[collapsible=offcanvas]:left-[calc(3.5rem-var(--sidebar-width))]! motion-reduce:transition-none!"
    >
      <SidebarHeader class="min-h-16 justify-center border-b px-4">
        {heading ?? (
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold">{brand.name}</p>
            <p class="truncate text-xs text-muted-foreground">
              {brand.description ?? "Workspace explorer"}
            </p>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          navigationGroups={navigationGroups}
          currentPath={currentPath}
          onNavigate={navigate}
        />
      </SidebarContent>
      {(showAccount || isMobile) && (
        <SidebarFooter>
          <NavUser user={user} onUserAction={onUserAction} />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
