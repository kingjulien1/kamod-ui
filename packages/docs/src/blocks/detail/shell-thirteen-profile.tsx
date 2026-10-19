import type { ExtendedShellProfile } from "./extended-shell-sections";

export const shellThirteenProfile: ExtendedShellProfile = {
  name: "Top Navigation Workspace",
  layout: "top-navigation",
  omitState: true,
  purpose: (
    <>
      <strong>Keep the Hierarchy, Move It Above the Page.</strong> Shell 13 combines a full-width
      identity/search/account header with a second row of grouped dropdown navigation and an
      organization switcher. It gives the content a centered, generous surface without a persistent
      desktop sidebar. Unlike Shell 4’s flattened destination row, group menus preserve one level of
      labeled branches. Unlike Shell 12, module choices do not reserve a rail beside every page.
    </>
  ),
  fit: (
    <>
      Choose this composition for a dashboard, operations portal or team product with a handful of
      meaningful navigation groups. It suits people who know which area they want and do not need to
      compare a long tree while working. Keep group names distinct and items short. If several
      groups need dozens of destinations, a persistent sidebar usually exposes the hierarchy more
      clearly. The organization switcher is useful when workspace context changes independently of
      the current section.
    </>
  ),
  structure: (
    <>
      SidebarProvider supplies only the shared mobile navigation context. Desktop has no sidebar gap
      or collapse state exposed in the public API. The sticky header carries the brand, search form,
      application actions and NavUser account menu; the secondary row renders one keyboard-aware
      dropdown per navigation group. Group children become labeled menu sections instead of losing
      their relationship. One organization control stays mounted across responsive changes. The page
      uses SidebarInset’s main landmark and a centered max-width container, with optional quick
      destinations in a separate mobile bottom bar.
    </>
  ),
  responsive: (
    <>
      From 768px, the group menus wrap in their own navigation row and the search sits between brand
      and account actions. Below that breakpoint, search takes its own row, the desktop menus
      disappear and the header trigger opens the existing grouped mobile Sheet. The optional bottom
      bar exposes frequent routes, while the Sheet retains the full hierarchy. The page reserves
      bottom safe-area space only when mobileLinks is non-empty. There is no desktop sidebar toggle
      and no open/defaultOpen/onOpenChange contract to synchronize.
    </>
  ),
  styling: (
    <>
      The global header should feel stable: pair its background and foreground, retain the subtle
      border between identity and navigation, and keep search flexible rather than prescribing a
      large minimum width. Group triggers use a quiet active treatment when they contain the current
      destination; the leaf itself retains aria-current. Use semantic states rather than inventing a
      second brand palette. Keep the centered content width in the frame, not duplicated around each
      route, and give wide tables their own local scroll area.
    </>
  ),
  review: (
    <>
      Open Projects with ArrowDown, traverse its items, dismiss with Escape and confirm that focus
      returns to the trigger. Follow a real leaf and verify that its group stays visibly active.
      Submit a search, clear an empty result and switch organizations through the same visible
      control at desktop and phone widths. On mobile, compare a quick-link journey with the
      equivalent Sheet destination: both must update the same current route. Check nested disabled
      branches and the last page action above the bottom bar.
    </>
  ),
  next: (
    <>
      Choose Shell 4 for a short flat navigation list, Shell 11 for a channel-oriented media library
      or Shell 12 for persistent module context. Keep Shell 13 when grouped destinations are useful
      but should not consume a permanent side column.
    </>
  ),
  integration: (
    <>
      The example uses real links and one controlled search query. Menu items and mobileLinks share
      the same destination objects so they cannot drift into separate routing models. Supply
      mobileLinks explicitly rather than trying to fit the entire menu into a phone toolbar. Use
      onSearch to update your router or query service, and treat organization changes as requests to
      your application’s session/data layer. The showcase’s notification button provides local
      feedback only; it does not subscribe to a notification service.
    </>
  ),
  state: (
    <>
      Search can be uncontrolled or driven by searchQuery/onSearchQueryChange; onSearch receives the
      current string on submission without issuing a request. Organization selection supports the
      same controlled/uncontrolled contract as Shell 12 and falls back to the first enabled entry
      when needed. Dropdown focus, dismissal and keyboard traversal come from the existing menu
      adapters. Only the mobile Sheet has sidebar visibility state. Keep drafts and selected records
      above the route content when they should survive navigation.
    </>
  ),
  props: [
    {
      key: "mobileLinks",
      name: "mobileLinks",
      type: "readonly ApplicationShellNavigationLink[]",
      required: false,
      description:
        "Frequent destinations shown only in the mobile bottom bar. Defaults to an empty list, which removes the bar and its extra content gutter. Shares currentPath and onNavigate with the full menu.",
    },
    {
      key: "organizations",
      name: "organizations",
      type: "readonly ShellOrganization[]",
      required: false,
      description:
        "Organization choices with id, name, optional description and disabled. Empty lists remove the switcher. Selection changes no permissions or data by itself.",
    },
    {
      key: "organizationId",
      name: "organizationId",
      type: "string",
      required: false,
      description:
        "Controlled organization ID. Omit for a local initial selection; invalid IDs fall back to the first enabled choice.",
    },
    {
      key: "onOrganizationChange",
      name: "onOrganizationChange",
      type: "(id: string) => void",
      required: false,
      description:
        "Enabled organization selection. Update organizationId when controlled after your application accepts the switch.",
    },
    {
      key: "searchQuery",
      name: "searchQuery",
      type: "string",
      required: false,
      description:
        "Controlled input string, otherwise the search form owns an initially empty value.",
    },
    {
      key: "onSearchQueryChange",
      name: "onSearchQueryChange",
      type: "(query: string) => void",
      required: false,
      description:
        "Reports each input edit. Debouncing and query loading remain outside the shell.",
    },
    {
      key: "onSearch",
      name: "onSearch",
      type: "(query: string) => void",
      required: false,
      description:
        "Search form submission callback; native form navigation is prevented, but no request is sent.",
    },
    {
      key: "searchLabel",
      name: "searchLabel",
      type: "string",
      required: false,
      description: "Search form/input name and placeholder. Defaults to Search workspace.",
    },
  ],
  usage: `import { useState } from "preact/hooks";
import { ApplicationShell13 } from "./components/application-shell/application-shell-13";

const home = { id: "home", label: "Overview", href: "/workspace" };
const projects = { id: "projects", label: "Projects", href: "/projects" };

export function Workspace() {
  const [query, setQuery] = useState("");
  return (
    <ApplicationShell13
      brand={{ name: "Workspace" }}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[{ label: "Studio" }, { label: "Overview" }]}
      navigationGroups={[
        { id: "overview", label: "Overview", items: [home] },
        { id: "projects", label: "Projects", items: [projects,
          { id: "templates", label: "Templates", items: [
            { id: "starter", label: "Starter projects", href: "/projects/starters" },
          ] },
        ] },
      ]}
      mobileLinks={[home, projects]}
      currentPath="/workspace"
      organizations={[{ id: "studio", name: "Studio" }, { id: "lab", name: "Research Lab" }]}
      searchQuery={query}
      onSearchQueryChange={setQuery}
    >
      <h1 class="text-2xl font-semibold">Overview</h1>
      <p class="mt-3 text-muted-foreground">{query ? "Search: " + query : "Your route content belongs here."}</p>
    </ApplicationShell13>
  );
}`,
};
