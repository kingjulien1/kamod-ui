import {
  CalendarIcon,
  FileTextIcon,
  HouseIcon,
  MessageCircleIcon,
  UsersIcon,
} from "@kamod-ch/icons/lucide";
import { Badge, Button, Input, Label } from "@kamod-ch/ui";
import { useId, useState } from "preact/hooks";
import kamodLogoUrl from "../application-shell-1/assets/kamod-ui-logo.svg?url";
import { ApplicationShell12 } from "./application-shell-12";

const modules = [
  { id: "home", label: "Overview", icon: HouseIcon },
  { id: "documents", label: "Documents", icon: FileTextIcon },
  { id: "schedule", label: "Schedule", icon: CalendarIcon },
  { id: "team", label: "Team", icon: UsersIcon },
];

/** Organization and module selection with contextual navigation and local project creation. */
export function ApplicationShell12Preview() {
  const id = useId();
  const [organization, setOrganization] = useState("studio");
  const [module, setModule] = useState("home");
  const [page, setPage] = useState("Overview");
  const [path, setPath] = useState("/overview");
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState(["Design system", "Customer portal", "Autumn launch"]);
  const [notice, setNotice] = useState(
    "Choose a module; its context stays next to the working page.",
  );
  const organizationName = organization === "studio" ? "Kamod Studio" : "Research Lab";
  const moduleName = modules.find((item) => item.id === module)!.label;
  return (
    <ApplicationShell12
      brand={{ name: "Kamod UI", description: moduleName, logo: <img src={kamodLogoUrl} alt="" /> }}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[{ label: organizationName }, { label: page }]}
      organizations={[
        { id: "studio", name: "Kamod Studio", description: "Product workspace" },
        { id: "lab", name: "Research Lab", description: "Discovery workspace" },
      ]}
      organizationId={organization}
      onOrganizationChange={(value) => {
        setOrganization(value);
        setNotice(
          `Switched to ${value === "studio" ? "Kamod Studio" : "Research Lab"}. This changes preview context only.`,
        );
      }}
      moduleLinks={modules.map((item) => ({
        ...item,
        href: `/modules/${item.id}`,
        active: module === item.id,
      }))}
      navigationGroups={[
        {
          id: "context",
          label: moduleName,
          items: [
            { id: "overview", label: `${moduleName} overview`, href: "/overview", icon: HouseIcon },
            { id: "documents", label: "Documents", href: "/documents", icon: FileTextIcon },
            { id: "messages", label: "Messages", href: "/messages", icon: MessageCircleIcon },
          ],
        },
        {
          id: "library",
          label: "Library",
          items: [
            {
              id: "resources",
              label: "Resources",
              items: [
                { id: "guides", label: "Guides", href: "/guides" },
                { id: "templates", label: "Templates", href: "/templates" },
              ],
            },
          ],
        },
      ]}
      currentPath={path}
      onNavigate={(destination, event) => {
        event.preventDefault();
        if (destination.href?.startsWith("/modules/")) {
          setModule(destination.href.split("/").at(-1)!);
          setPage("Overview");
          setPath("/overview");
        } else {
          setPage(destination.label);
          setPath(destination.href ?? "/overview");
        }
      }}
      onUserAction={(action) => setNotice(`${action} selected; connect your account service.`)}
      headerActions={<Badge variant="outline">{organizationName}</Badge>}
    >
      <div class="mx-auto max-w-6xl space-y-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              {moduleName} / {organizationName}
            </p>
            <h1 class="text-2xl font-semibold">{page}</h1>
            <p class="mt-2 text-sm text-muted-foreground">
              A little context on the left. Plenty of room for the work.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              const name = `Project ${projects.length + 1}`;
              setProjects((items) => [...items, name]);
              setQuery("");
              setNotice(`Created ${name} locally in ${organizationName}.`);
            }}
          >
            New project
          </Button>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          {[
            ["Active projects", String(projects.length)],
            ["Workspace", organizationName],
            ["Module", moduleName],
          ].map(([label, value]) => (
            <div key={label} class="rounded-xl border bg-card p-5 text-card-foreground">
              <p class="text-xs text-muted-foreground">{label}</p>
              <p class="mt-3 break-words text-xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
        <div class="space-y-2">
          <Label htmlFor={`${id}-search`}>Find a project</Label>
          <Input
            id={`${id}-search`}
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
          />
        </div>
        <div class="divide-y rounded-xl border">
          {projects
            .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
            .map((name) => (
              <div key={name} class="flex flex-wrap items-center justify-between gap-3 p-4">
                <span class="font-medium">{name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage(name);
                    setNotice(`${name} opened in this local workspace.`);
                  }}
                >
                  Open project
                </Button>
              </div>
            ))}
        </div>
        {!projects.some((name) => name.toLowerCase().includes(query.toLowerCase())) && (
          <p class="text-sm text-muted-foreground">No matching projects. Try a shorter name.</p>
        )}
        <p role="status" class="text-xs text-muted-foreground">
          {notice}
        </p>
      </div>
    </ApplicationShell12>
  );
}
