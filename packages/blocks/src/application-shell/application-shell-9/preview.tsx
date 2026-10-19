import {
  FileCodeIcon,
  FilesIcon,
  FolderIcon,
  GitBranchIcon,
  SearchIcon,
  SettingsIcon,
} from "@kamod-ch/icons/lucide";
import { Badge, Button, Input, Label, Textarea } from "@kamod-ch/ui";
import { useId, useState } from "preact/hooks";
import kamodLogoUrl from "../application-shell-1/assets/kamod-ui-logo.svg?url";
import { ApplicationShell9 } from "./application-shell-9";

const initialFiles = [
  { name: "App.tsx", value: "export function App() {\n  return <h1>Hello, Kamod.</h1>;\n}\n" },
  { name: "theme.css", value: '@import "tailwindcss";\n@import "@kamod-ch/ui/theme.css";\n' },
  { name: "README.md", value: "# Studio workspace\n\nBuild a small, thoughtful interface.\n" },
];

/** Editable scratch files and local tool routes; no filesystem or terminal execution. */
export function ApplicationShell9Preview() {
  const id = useId();
  const [files, setFiles] = useState(initialFiles);
  const [selected, setSelected] = useState("App.tsx");
  const [tool, setTool] = useState("explorer");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("Workspace ready. Changes stay in this preview.");
  const file = files.find((item) => item.name === selected)!;
  return (
    <ApplicationShell9
      brand={{
        name: "Kamod Studio",
        description: "workspace / src",
        logo: <img src={kamodLogoUrl} alt="" />,
      }}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[{ label: "workspace" }, { label: tool === "explorer" ? selected : tool }]}
      activityLinks={[
        { id: "explorer", label: "Explorer", icon: FilesIcon, active: tool === "explorer" },
        { id: "search", label: "Search", icon: SearchIcon, active: tool === "search" },
        { id: "git", label: "Changes", icon: GitBranchIcon, active: tool === "git" },
        { id: "settings", label: "Settings", icon: SettingsIcon, active: tool === "settings" },
      ]}
      navigationGroups={[
        {
          id: "files",
          label: "Explorer",
          items: [
            {
              id: "src",
              label: "src",
              icon: FolderIcon,
              items: files.map((item) => ({
                id: item.name,
                label: item.name,
                icon: FileCodeIcon,
                href: `/files/${item.name}`,
              })),
            },
          ],
        },
      ]}
      currentPath={`/files/${selected}`}
      onNavigate={(destination, event) => {
        event.preventDefault();
        if (destination.href) {
          setSelected(destination.label);
          setTool("explorer");
        } else setTool(destination.label === "Changes" ? "git" : destination.label.toLowerCase());
      }}
      onUserAction={(action) =>
        setNotice(`${action} selected. Connect your account service in your app.`)
      }
      headerActions={
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const name = `draft-${files.length}.tsx`;
            setFiles((items) => [...items, { name, value: "// Start writing here.\n" }]);
            setSelected(name);
            setTool("explorer");
            setNotice(`Created ${name} locally.`);
          }}
        >
          New file
        </Button>
      }
      panelTitle="Workspace output"
      panel={
        <p role="status" class="font-mono text-xs leading-relaxed text-muted-foreground">
          {notice}
        </p>
      }
    >
      <div class="mx-auto max-w-5xl space-y-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              Studio / {tool}
            </p>
            <h1 class="text-2xl font-semibold">
              {tool === "explorer"
                ? selected
                : tool === "search"
                  ? "Search files"
                  : tool === "git"
                    ? "Local changes"
                    : "Editor settings"}
            </h1>
          </div>
          <Badge variant="outline">Local workspace</Badge>
        </div>
        {tool === "explorer" ? (
          <div class="space-y-3">
            <Label htmlFor={`${id}-editor`}>Scratch editor</Label>
            <Textarea
              id={`${id}-editor`}
              value={file.value}
              rows={14}
              class="font-mono text-sm"
              onInput={(event) =>
                setFiles((items) =>
                  items.map((item) =>
                    item.name === selected ? { ...item, value: event.currentTarget.value } : item,
                  ),
                )
              }
            />
            <Button
              size="sm"
              onClick={() => setNotice(`Saved ${selected} in memory. No disk or network changes.`)}
            >
              Save scratch file
            </Button>
          </div>
        ) : tool === "search" ? (
          <div class="space-y-4">
            <Label htmlFor={`${id}-search`}>Find a filename</Label>
            <Input
              id={`${id}-search`}
              value={query}
              onInput={(event) => setQuery(event.currentTarget.value)}
            />
            {files
              .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
              .map((item) => (
                <Button
                  key={item.name}
                  variant="outline"
                  class="mr-2"
                  onClick={() => {
                    setSelected(item.name);
                    setTool("explorer");
                  }}
                >
                  {item.name}
                </Button>
              ))}
            {!files.some((item) => item.name.toLowerCase().includes(query.toLowerCase())) && (
              <p class="text-sm text-muted-foreground">No matching files.</p>
            )}
          </div>
        ) : tool === "git" ? (
          <div class="rounded-xl border p-5">
            <h2 class="font-medium">Scratch files</h2>
            <p class="mt-2 text-sm text-muted-foreground">
              {files.length} files in this local session. This preview does not connect to Git.
            </p>
          </div>
        ) : (
          <div class="rounded-xl border p-5">
            <h2 class="font-medium">Theme-aware by default</h2>
            <p class="mt-2 text-sm text-muted-foreground">
              Use the showcase’s appearance controls to review the editor in your current palette.
              Fonts and surfaces inherit your application theme.
            </p>
          </div>
        )}
      </div>
    </ApplicationShell9>
  );
}
