import { SearchIcon } from "@kamod-ch/icons/lucide";
import { Button, Input, Label } from "@kamod-ch/ui";
import { useId, useState } from "preact/hooks";

/** Search is app-owned; the shell never sends queries or decides result routes. */
export type ShellSearchProps = {
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  onSearch?: (query: string) => void;
  searchLabel?: string;
};

export function ShellSearch({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  searchLabel = "Search workspace",
}: ShellSearchProps) {
  const id = useId();
  const [query, setQuery] = useState("");
  const value = searchQuery ?? query;
  return (
    <form
      role="search"
      aria-label={searchLabel}
      class="flex min-w-0 flex-1 items-center gap-1"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch?.(value);
      }}
    >
      <Label htmlFor={id} class="sr-only">
        {searchLabel}
      </Label>
      <Input
        id={id}
        type="search"
        value={value}
        placeholder={searchLabel}
        class="min-w-0 rounded-full"
        onInput={(event) => {
          const next = event.currentTarget.value;
          if (searchQuery === undefined) setQuery(next);
          onSearchQueryChange?.(next);
        }}
      />
      <Button size="icon" variant="ghost" type="submit" aria-label="Submit search">
        <SearchIcon size={18} aria-hidden="true" />
      </Button>
    </form>
  );
}
