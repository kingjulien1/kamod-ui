import type { ExtendedShellProfile } from "./extended-shell-sections";

export const shellTwelveProfile: ExtendedShellProfile = {
  name: "Two-Tier Workspace",
  layout: "tiered",
  purpose: (
    <>
      <strong>Separate the Product’s Modules from the Current Module’s Places.</strong> Shell 12
      keeps a narrow module rail visible while a contextual navigation panel opens beside it. An
      organization switcher sits at the top of that panel, and the working page is a rounded surface
      on the surrounding sidebar canvas. Unlike Shell 9, this is a product workspace rather than a
      file editor: the second tier contains ordinary application routes, and mobile modules move to
      a bottom navigation bar.
    </>
  ),
  fit: (
    <>
      Choose this frame when a product has several substantial modules, each with its own
      destinations, plus an organization or tenant context. People can keep their module orientation
      while closing the detail panel to reclaim space. Avoid two tiers for a small flat menu; Shell
      2 or Shell 3 needs fewer concepts. Module selection should change meaningful contextual
      content rather than recoloring an icon with no effect. Keep organization switching explicit
      when it changes permissions, available records or unsaved work.
    </>
  ),
  structure: (
    <>
      The desktop frame reserves a 3.5rem rail, then a core off-canvas Sidebar gap. The rail
      contains module links, the sidebar trigger and an account menu that remains reachable when the
      contextual panel closes. The panel combines an organization dropdown and NavMain’s grouped
      navigation. SidebarInset supplies the only main landmark, with a breadcrumb header and a
      rounded application surface. The organization control reuses Shell 1’s keyboard-aware portaled
      menu adapters; the core primitives own dismissal, focus and panel visibility.
    </>
  ),
  responsive: (
    <>
      At 768px and above, the module rail stays visible and the contextual panel can slide
      completely out of view. The core sidebar toggle and its existing keyboard shortcut request the
      same desktop state. Below 768px, a safe-area-aware bottom bar exposes module destinations and
      an Open workspace menu control. The full contextual navigation and organization switcher live
      in the left-side Sheet. Main content reserves bottom space so final controls cannot sit behind
      the mobile bar.
    </>
  ),
  styling: (
    <>
      Use the sidebar token family for both tiers, then a bordered background/foreground surface for
      the page. The desktop inset is a visual boundary, not a second theme or a fixed-width
      dashboard. Keep module labels short enough for the mobile bar; supply icons and accessible
      names, and limit the number of frequent destinations. The bar wraps where necessary rather
      than forcing page overflow. Panel transitions come from Sidebar and are disabled under reduced
      motion. Avoid animation that moves the page independently from the sidebar gap.
    </>
  ),
  review: (
    <>
      Switch from Overview to Documents and verify that its contextual heading, module indicator and
      working page agree. Close the contextual panel and open the account menu from the rail. Reopen
      it, select another organization with the keyboard and verify the selection callback and
      application context. On a phone, use the bottom module bar, open the menu, follow a contextual
      destination and confirm that the Sheet closes. Finally scroll to the last page action: it must
      remain above the safe-area bar.
    </>
  ),
  next: (
    <>
      Choose Shell 9 when the contextual tier is a file explorer and output belongs beneath the
      editor. Choose Shell 13 when a horizontal grouped menu is a better fit than a permanent rail.
      Shell 3 remains the smaller option when modules and contextual routes do not need separate
      levels.
    </>
  ),
  integration: (
    <>
      The working example controls both module and organization IDs outside the frame. Derive
      navigationGroups from the selected module, and use moduleLinks.active when a module contains
      several routes that cannot be represented by one exact URL. An organization selection is a
      request to the application: confirm drafts, authorize access, update the route and load the
      appropriate data before treating the workspace as switched. The showcase changes local labels
      and project state only; it does not claim tenant isolation or make data requests.
    </>
  ),
  state: (
    <>
      The organization switcher can be controlled with organizationId or keep a local selection when
      that prop is omitted. It falls back to the first enabled organization if the current ID is
      absent or removed. Disabled organizations cannot be selected; an entirely disabled list leaves
      a disabled trigger. The switcher does not fire a callback merely because the list changed. An
      empty list removes the control. Module and route state always remain caller-owned; sidebar
      expansion is a separate concern.
    </>
  ),
  props: [
    {
      key: "moduleLinks",
      name: "moduleLinks",
      type: "readonly ApplicationShellNavigationLink[]",
      required: false,
      description:
        "Desktop module rail and mobile bottom-bar destinations. Defaults to an empty list. Explicit active state supports modules containing several routes; navigation reports through onNavigate.",
    },
    {
      key: "organizations",
      name: "organizations",
      type: "readonly ShellOrganization[]",
      required: false,
      description:
        "Organizations with stable id, name, optional description and disabled state. Empty arrays remove the switcher; no data authorization is performed.",
    },
    {
      key: "organizationId",
      name: "organizationId",
      type: "string",
      required: false,
      description:
        "Controlled selected organization. Omit for local selection. Invalid or removed IDs display the first enabled organization.",
    },
    {
      key: "onOrganizationChange",
      name: "onOrganizationChange",
      type: "(id: string) => void",
      required: false,
      description:
        "Reports an enabled menu selection. When controlled, update organizationId after your application accepts the change.",
    },
  ],
  usage: `import { useState } from "preact/hooks";
import { ApplicationShell12 } from "./components/application-shell/application-shell-12";

export function Workspace() {
  const [module, setModule] = useState("projects");
  const [organization, setOrganization] = useState("studio");
  return (
    <ApplicationShell12
      brand={{ name: "Team workspace" }}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[{ label: organization }, { label: module }]}
      organizations={[{ id: "studio", name: "Studio" }, { id: "lab", name: "Research Lab" }]}
      organizationId={organization}
      onOrganizationChange={setOrganization}
      moduleLinks={[
        { id: "projects", label: "Projects", active: module === "projects" },
        { id: "team", label: "Team", active: module === "team" },
      ]}
      onNavigate={(destination) => setModule(destination.label.toLowerCase())}
      navigationGroups={[{ id: "context", label: module, items: [
        { id: "overview", label: "Overview", href: "/workspace" },
        { id: "settings", label: "Settings", href: "/workspace/settings" },
      ] }]}
    >
      <h1 class="text-2xl font-semibold">{module === "team" ? "Team" : "Projects"}</h1>
      <p class="mt-3 text-muted-foreground">Selected organization: {organization}</p>
    </ApplicationShell12>
  );
}`,
};
