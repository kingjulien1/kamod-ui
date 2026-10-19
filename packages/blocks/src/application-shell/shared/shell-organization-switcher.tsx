import { CheckIcon, ChevronsUpDownIcon } from "@kamod-ch/icons/lucide";
import { Button, Dropdown, DropdownLabel, DropdownSeparator } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { MenuContent, MenuItem, MenuTrigger } from "../application-shell-1/menu";

export type ShellOrganization = {
  id: string;
  name: string;
  description?: string;
  disabled?: boolean;
};
export type ShellOrganizationProps = {
  organizations?: readonly ShellOrganization[];
  organizationId?: string;
  onOrganizationChange?: (id: string) => void;
};

/** A controlled/uncontrolled display selection, not an authorization or data-fetch boundary. */
export function ShellOrganizationSwitcher({
  organizations = [],
  organizationId,
  onOrganizationChange,
}: ShellOrganizationProps) {
  const [localId, setLocalId] = useState<string>();
  const enabled = organizations.filter((item) => !item.disabled);
  const selected = enabled.find((item) => item.id === (organizationId ?? localId)) ?? enabled[0];
  if (!organizations.length) return null;
  return (
    <Dropdown>
      <MenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          class="w-full min-w-0 justify-between"
          aria-label={`Switch organization: ${selected?.name ?? "No available organizations"}`}
          disabled={!enabled.length}
        >
          <span class="truncate">{selected?.name ?? "No available organizations"}</span>
          <ChevronsUpDownIcon size={14} class="shrink-0" aria-hidden="true" />
        </Button>
      </MenuTrigger>
      <MenuContent portal side="bottom" align="start" class="min-w-56 max-w-[calc(100vw-2rem)]">
        <DropdownLabel>Organizations</DropdownLabel>
        <DropdownSeparator />
        {organizations.map((item) => (
          <MenuItem
            key={item.id}
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled) {
                if (organizationId === undefined) setLocalId(item.id);
                onOrganizationChange?.(item.id);
              }
            }}
          >
            <span class="min-w-0 flex-1">
              <span class="block truncate">{item.name}</span>
              {item.description && (
                <span class="block text-xs text-muted-foreground">{item.description}</span>
              )}
            </span>
            {item.id === selected?.id && <CheckIcon size={14} aria-hidden="true" />}
          </MenuItem>
        ))}
      </MenuContent>
    </Dropdown>
  );
}
