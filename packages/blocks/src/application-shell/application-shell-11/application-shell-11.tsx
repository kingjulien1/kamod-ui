import { ChevronDownIcon } from "@kamod-ch/icons/lucide";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  cn,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@kamod-ch/ui";
import { NavMain } from "../application-shell-1/nav-main";
import { NavUser } from "../application-shell-1/nav-user";
import type {
  ApplicationShellNavigate,
  ApplicationShellNavigationLink,
} from "../application-shell-1/types";
import { ShellBreadcrumbs } from "../shared/shell-breadcrumbs";
import { ShellSearch, type ShellSearchProps } from "../shared/shell-search";
import type { ApplicationShellFrameProps } from "../shared/types";

/** A subscribed channel destination with optional avatar; no follow state is inferred. */
export type ApplicationShellSubscription = ApplicationShellNavigationLink & { avatarSrc?: string };

/** Media discovery frame: global search/account header and a collapsible channel list. */
export type ApplicationShell11Props = ApplicationShellFrameProps &
  ShellSearchProps & {
    subscriptions?: readonly ApplicationShellSubscription[];
    /** Channel-list disclosure label; defaults to "Subscriptions". */
    subscriptionsLabel?: string;
  };

function MediaSidebar({
  subscriptions = [],
  subscriptionsLabel = "Subscriptions",
  ...props
}: ApplicationShell11Props) {
  const { isMobile, setOpenMobile } = useSidebar();
  const navigate: ApplicationShellNavigate = (destination, event) => {
    props.onNavigate?.(destination, event);
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
      collapsible="icon"
      class="md:top-16 md:h-[calc(100svh-4rem)] motion-reduce:transition-none!"
    >
      <SidebarHeader class="md:hidden">
        <p class="px-2 py-3 text-sm font-semibold">{props.brand.name}</p>
        <NavUser user={props.user} onUserAction={props.onUserAction} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          navigationGroups={props.navigationGroups}
          currentPath={props.currentPath}
          onNavigate={navigate}
        />
        {subscriptions.length > 0 && (
          <SidebarGroup>
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  class="w-full justify-between group-data-[collapsible=icon]:hidden"
                >
                  {subscriptionsLabel}
                  <ChevronDownIcon size={14} aria-hidden="true" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenu>
                  {subscriptions.map((channel) => (
                    <SidebarMenuItem key={channel.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={
                          !channel.disabled &&
                          (channel.active ??
                            (!!props.currentPath && props.currentPath === channel.href))
                        }
                        tooltip={channel.label}
                      >
                        {channel.href && !channel.disabled ? (
                          <a
                            aria-label={channel.label}
                            href={channel.href}
                            aria-current={
                              (channel.active ??
                              (!!props.currentPath && props.currentPath === channel.href))
                                ? "page"
                                : undefined
                            }
                            onClick={(event) => navigate(channel, event)}
                          >
                            <Avatar class="size-6 shrink-0">
                              {channel.avatarSrc && <AvatarImage src={channel.avatarSrc} alt="" />}
                              <AvatarFallback class="text-[10px]">
                                {channel.label.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span class="truncate group-data-[collapsible=icon]:hidden">
                              {channel.label}
                            </span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            aria-label={channel.label}
                            disabled={channel.disabled}
                            onClick={(event) => navigate(channel, event)}
                          >
                            <Avatar class="size-6 shrink-0">
                              <AvatarFallback class="text-[10px]">
                                {channel.label.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span class="truncate group-data-[collapsible=icon]:hidden">
                              {channel.label}
                            </span>
                          </button>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export function ApplicationShell11({
  children,
  headerActions,
  class: classProp,
  className,
  ...props
}: ApplicationShell11Props) {
  return (
    <SidebarProvider
      open={props.open}
      defaultOpen={props.defaultOpen ?? true}
      onOpenChange={props.onOpenChange}
      data-application-shell="media"
      class={cn(
        "flex-col min-w-0 bg-background text-foreground motion-reduce:[&_*]:transition-none!",
        classProp,
        className,
      )}
    >
      <header class="sticky top-0 z-20 flex min-h-16 flex-wrap items-center gap-3 border-b bg-background px-4 py-3 md:h-16 md:flex-nowrap md:py-2">
        <SidebarTrigger />
        <span class="flex min-w-0 max-w-[50%] items-center gap-2 font-semibold">
          <span aria-hidden="true" class="shrink-0 [&>img]:size-7 [&>svg]:size-7">
            {props.brand.logo}
          </span>
          <span class="truncate">{props.brand.name}</span>
        </span>
        <div class="order-3 w-full md:order-none md:mx-auto md:max-w-xl md:flex-1">
          <ShellSearch {...props} searchLabel={props.searchLabel ?? "Search videos"} />
        </div>
        <div class="ml-auto flex max-w-full items-center gap-2">
          {headerActions}
          <div class="hidden w-44 md:block">
            <NavUser user={props.user} onUserAction={props.onUserAction} />
          </div>
        </div>
      </header>
      <div class="flex min-w-0 flex-1">
        <MediaSidebar {...props} />
        <SidebarInset class="min-w-0">
          <div class="border-b px-4 py-3">
            <ShellBreadcrumbs breadcrumbs={props.breadcrumbs} onNavigate={props.onNavigate} />
          </div>
          <div class="min-w-0 flex-1 p-4 sm:p-6">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
