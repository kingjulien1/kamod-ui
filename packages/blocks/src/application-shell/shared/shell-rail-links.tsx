import { CircleIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import type {
  ApplicationShellNavigate,
  ApplicationShellNavigationLink,
} from "../application-shell-1/types";

/** Native module destinations. Selection and permissions belong to the caller. */
export function ShellRailLinks({
  links,
  currentPath,
  onNavigate,
  label = "Workspace tools",
  mobile = false,
}: {
  links: readonly ApplicationShellNavigationLink[];
  currentPath?: string;
  onNavigate?: ApplicationShellNavigate;
  label?: string;
  mobile?: boolean;
}) {
  return (
    <nav
      aria-label={label}
      class={
        mobile ? "flex min-w-0 flex-wrap justify-around gap-1" : "flex flex-col items-center gap-2"
      }
    >
      {links.map((link) => {
        const Icon = link.icon ?? CircleIcon;
        const active =
          !link.disabled && (link.active ?? (!!currentPath && link.href === currentPath));
        return (
          <Button
            key={link.id}
            href={link.disabled ? undefined : link.href}
            disabled={link.disabled}
            variant={active ? "secondary" : "ghost"}
            size={mobile ? "sm" : "icon"}
            class={mobile ? "min-w-0 flex-1 flex-col gap-1 h-auto py-2 text-xs" : "size-10"}
            aria-label={link.label}
            title={link.label}
            aria-current={active ? "page" : undefined}
            onClick={(event: Parameters<ApplicationShellNavigate>[1]) => {
              if (!link.disabled) onNavigate?.(link, event);
            }}
          >
            <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
            {mobile && <span class="max-w-full truncate">{link.label}</span>}
          </Button>
        );
      })}
    </nav>
  );
}
