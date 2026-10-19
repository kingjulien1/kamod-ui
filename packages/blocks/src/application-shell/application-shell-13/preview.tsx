import { BellIcon, FolderIcon, HouseIcon, SettingsIcon, UsersIcon } from "@kamod-ch/icons/lucide";
import { Badge, Button } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import kamodLogoUrl from "../application-shell-1/assets/kamod-ui-logo.svg?url";
import { ApplicationShell13 } from "./application-shell-13";

const destinations = [
  { id: "overview", label: "Overview", href: "/overview", icon: HouseIcon },
  { id: "projects", label: "Projects", href: "/projects", icon: FolderIcon },
  { id: "team", label: "Team", href: "/team", icon: UsersIcon },
  { id: "workspace", label: "Workspace", href: "/workspace", icon: SettingsIcon },
];

/** Group-menu routing, shared quick links, organization choice and working local search. */
export function ApplicationShell13Preview() {
  const [path, setPath] = useState("/overview");
  const [query, setQuery] = useState("");
  const [organization, setOrganization] = useState("studio");
  const [notice, setNotice] = useState(
    "Explore a group above or use quick navigation on your phone.",
  );
  const [projects, setProjects] = useState(["Design system", "Customer portal", "Autumn launch"]);
  const heading =
    destinations.find((item) => item.href === path)?.label ??
    path.slice(1).replace(/^./, (value) => value.toUpperCase());
  const visible = projects.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
  return (
    <ApplicationShell13
      brand={{ name: "Kamod Workspace", logo: <img src={kamodLogoUrl} alt="" /> }}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[
        { label: organization === "studio" ? "Kamod Studio" : "Research Lab" },
        { label: heading },
      ]}
      navigationGroups={destinations.map((item) => ({
        id: item.id,
        label: item.label,
        items: [
          item,
          {
            id: `${item.id}-settings`,
            label: `${item.label} settings`,
            href: `/${item.id}/settings`,
          },
        ],
      }))}
      mobileLinks={destinations}
      currentPath={path}
      onNavigate={(destination, event) => {
        event.preventDefault();
        if (destination.href) setPath(destination.href);
        setNotice(`${destination.label} opened locally.`);
      }}
      organizations={[
        { id: "studio", name: "Kamod Studio" },
        { id: "lab", name: "Research Lab" },
      ]}
      organizationId={organization}
      onOrganizationChange={(value) => {
        setOrganization(value);
        setNotice("Organization context changed in this preview only.");
      }}
      searchQuery={query}
      onSearchQueryChange={setQuery}
      onSearch={(value) =>
        setNotice(value ? `Showing projects matching “${value}”.` : "Showing all projects.")
      }
      onUserAction={(action) => setNotice(`${action} selected; connect your account service.`)}
      headerActions={
        <Button
          size="icon"
          variant="ghost"
          aria-label="Notifications"
          onClick={() =>
            setNotice("You’re all caught up. This preview has no notification service.")
          }
        >
          <BellIcon size={18} aria-hidden="true" />
        </Button>
      }
    >
      <div class="space-y-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              Workspace / {heading}
            </p>
            <h1 class="text-2xl font-semibold">{heading}</h1>
            <p class="mt-2 text-sm text-muted-foreground">
              A clear header. A shared route. Room for your next project.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              const name = `Project ${projects.length + 1}`;
              setProjects((items) => [...items, name]);
              setQuery("");
              setNotice(`${name} created locally.`);
            }}
          >
            New project
          </Button>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((name, index) => (
            <article
              key={name}
              class="space-y-5 rounded-xl border bg-card p-5 text-card-foreground"
            >
              <div class="flex items-center justify-between">
                <span class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FolderIcon size={20} aria-hidden="true" />
                </span>
                <Badge variant="outline">{index % 2 ? "Planning" : "In progress"}</Badge>
              </div>
              <h2 class="font-semibold">{name}</h2>
              <p class="text-sm text-muted-foreground">
                {organization === "studio" ? "Kamod Studio" : "Research Lab"} · Shared workspace
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPath(`/projects/${name.toLowerCase().replaceAll(" ", "-")}`);
                  setNotice(`${name} opened locally.`);
                }}
              >
                Open project
              </Button>
            </article>
          ))}
        </div>
        {!visible.length && (
          <div class="rounded-xl border p-6">
            <h2 class="font-medium">No matching projects</h2>
            <p class="mt-2 text-sm text-muted-foreground">Try a shorter search.</p>
            <Button class="mt-4" size="sm" variant="outline" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </div>
        )}
        <p role="status" class="border-t pt-4 text-xs text-muted-foreground">
          {notice}
        </p>
      </div>
    </ApplicationShell13>
  );
}
