import { ChevronDownIcon } from "@kamod-ch/icons/lucide";
import { Button, Dropdown, DropdownLabel, DropdownSeparator } from "@kamod-ch/ui";
import { Fragment } from "preact";
import { MenuContent, MenuItem, MenuTrigger } from "../application-shell-1/menu";
import type {
  ApplicationShellNavigate,
  ApplicationShellNavigationGroup,
  ApplicationShellNavigationLink,
} from "../application-shell-1/types";

/** One native menu per group; nested branches become labeled one-level menu sections. */
export function ShellGroupMenus({
  groups,
  currentPath,
  onNavigate,
}: {
  groups: readonly ApplicationShellNavigationGroup[];
  currentPath?: string;
  onNavigate?: ApplicationShellNavigate;
}) {
  const leaf = (item: ApplicationShellNavigationLink) => {
    const active = !item.disabled && (item.active ?? (!!currentPath && item.href === currentPath));
    return (
      <MenuItem
        key={item.id}
        href={item.disabled ? undefined : item.href}
        disabled={item.disabled}
        aria-disabled={item.disabled || undefined}
        aria-current={active ? "page" : undefined}
        class="px-3 py-2"
        onClick={(event: Parameters<ApplicationShellNavigate>[1]) => {
          if (!item.disabled) onNavigate?.(item, event);
        }}
      >
        {item.label}
      </MenuItem>
    );
  };
  return (
    <nav
      aria-label="Workspace navigation"
      class="hidden min-w-0 flex-wrap items-center gap-1 md:flex"
    >
      {groups
        .filter((group) => group.items.length)
        .map((group) => {
          const active = group.items.some(
            (item) =>
              !item.disabled &&
              ((item.active ?? (!!currentPath && item.href === currentPath)) ||
                item.items?.some(
                  (child) =>
                    !child.disabled &&
                    (child.active ?? (!!currentPath && child.href === currentPath)),
                )),
          );
          return (
            <Dropdown key={group.id}>
              <MenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  class={active ? "bg-muted! text-foreground" : "text-foreground"}
                >
                  {group.label ?? "Navigation"}
                  <ChevronDownIcon size={14} aria-hidden="true" />
                </Button>
              </MenuTrigger>
              <MenuContent
                portal
                side="bottom"
                align="start"
                class="min-w-52 max-w-[calc(100vw-2rem)]"
              >
                {group.items.map((item) =>
                  item.items?.length ? (
                    <Fragment key={item.id}>
                      {item.href ? leaf(item) : <DropdownLabel>{item.label}</DropdownLabel>}
                      {item.items.map((child) =>
                        leaf({ ...child, disabled: item.disabled || child.disabled }),
                      )}
                      <DropdownSeparator />
                    </Fragment>
                  ) : (
                    leaf(item)
                  ),
                )}
              </MenuContent>
            </Dropdown>
          );
        })}
    </nav>
  );
}
