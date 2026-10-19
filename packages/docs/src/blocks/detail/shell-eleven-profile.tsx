import type { ExtendedShellProfile } from "./extended-shell-sections";

export const shellElevenProfile: ExtendedShellProfile = {
  name: "Video Platform",
  layout: "media",
  purpose: (
    <>
      <strong>Put Discovery in the Header and Familiar Places in the Sidebar.</strong> Shell 11
      adapts the video-library pattern: a full-width identity/search/account header remains above
      category navigation and a collapsible subscription list. The page stays devoted to browsing
      media rather than spending its own first row on global search. It differs from Shell 2’s
      project workspace through its channel-oriented sidebar and from Shell 13’s horizontal grouped
      menus through persistent browsing destinations.
    </>
  ),
  fit: (
    <>
      Choose this layout for a learning library, recorded sessions, internal video hub or media
      catalog with repeat visitors and recognizable channels. Subscriptions should be real
      destinations with a useful name, not decorative avatar rows. A small collection without
      channel structure may be easier to serve with Shell 4 and a plain filter bar. This composition
      supplies navigation and search input, not streaming, recommendation ranking, playback or
      subscription billing.
    </>
  ),
  structure: (
    <>
      SidebarProvider wraps a vertical application frame. The global header has one sidebar trigger,
      brand, search form and desktop account menu. Below it, the core Sidebar reserves its desktop
      gap and anchors its fixed container beneath the header. NavMain renders ordinary categories; a
      core Collapsible owns the independent subscription disclosure. Channel destinations use Avatar
      fallbacks and the same navigation callback. Breadcrumbs and arbitrary children sit inside the
      single SidebarInset main landmark.
    </>
  ),
  responsive: (
    <>
      Desktop starts with expanded navigation and supports the core icon-collapse mode. The global
      header stays one 64px row from 768px upward and the desktop sidebar begins below it. On
      smaller screens, search moves to its own full-width header row and navigation opens in the
      core Sheet. Account controls are available inside the mobile sheet instead of squeezing the
      header. Category selection and subscription destinations dismiss the sheet after an ordinary
      click, including router-intercepted activation.
    </>
  ),
  styling: (
    <>
      Keep video artwork and thumbnail aspect ratios in the page content; the shell does not invent
      a thumbnail service or force a card grid on consumers. Use sidebar foreground pairs for
      navigation, a quiet active state and concise channel labels. Avatar fallbacks should remain
      useful without remote images. Search has a rounded input but inherits the host’s focus and
      color tokens. Avoid adding a fixed search width: the mobile row must shrink cleanly at 320px,
      and a long brand name should truncate rather than push account controls outside the viewport.
    </>
  ),
  review: (
    <>
      Submit a search with Enter, combine it with a category filter, then choose a subscription
      channel and verify the result count and empty state. Collapse the subscription list without
      collapsing the entire sidebar, then switch the desktop frame to icons and back. On mobile,
      open navigation, follow a channel and confirm dismissal. Inspect account access in both
      layouts and verify that selecting a video reports metadata rather than pretending a player or
      streaming request exists.
    </>
  ),
  next: (
    <>
      Prefer Shell 13 when navigation belongs in a horizontal hierarchy; choose Shell 2 when project
      groups and page actions matter more than media discovery. Keep search results, channel
      membership and your player implementation in the application so this frame can serve different
      catalogs.
    </>
  ),
  integration: (
    <>
      The working example makes search controlled and filters local titles. In a real catalog,
      submit the query to your route or service from onSearch; onSearchQueryChange is suitable for
      immediate client-side filtering or an application-owned debounce. The callback receives the
      submitted string without altering it. Subscription links use the same route handler as
      category links, so currentPath can select one channel without a second source of navigation
      state.
    </>
  ),
  state: (
    <>
      Search is uncontrolled when searchQuery is absent and starts empty. When searchQuery is
      supplied, update it through onSearchQueryChange. The subscription disclosure starts open and
      is independent of desktop expansion. The shell does not maintain followed-channel membership:
      replacing subscriptions changes the rendered list. An empty list omits the disclosure
      entirely. A closed disclosure does not erase application-owned search or selected-media state.
    </>
  ),
  props: [
    {
      key: "subscriptions",
      name: "subscriptions",
      type: "readonly ApplicationShellSubscription[]",
      required: false,
      description:
        "Channel destinations extending ApplicationShellNavigationLink with optional avatarSrc. Defaults to an empty list, omitting the channel section. Disabled channels cannot activate.",
    },
    {
      key: "subscriptionsLabel",
      name: "subscriptionsLabel",
      type: "string",
      required: false,
      description:
        "Accessible and visible channel-list disclosure label; defaults to Subscriptions.",
    },
    {
      key: "searchQuery",
      name: "searchQuery",
      type: "string",
      required: false,
      description:
        "Controlled search input. Omit for internal empty initial state. Supply onSearchQueryChange when controlling it.",
    },
    {
      key: "onSearchQueryChange",
      name: "onSearchQueryChange",
      type: "(query: string) => void",
      required: false,
      description:
        "Reports every search edit. Filtering, debounce and result loading remain application concerns.",
    },
    {
      key: "onSearch",
      name: "onSearch",
      type: "(query: string) => void",
      required: false,
      description:
        "Called on form submission or the search button. The shell prevents native form navigation and sends no request.",
    },
    {
      key: "searchLabel",
      name: "searchLabel",
      type: "string",
      required: false,
      description:
        "Search form/input accessible name and input placeholder. Defaults to Search videos.",
    },
  ],
  usage: `import { useState } from "preact/hooks";
import { ApplicationShell11 } from "./components/application-shell/application-shell-11";

export function Workspace() {
  const [query, setQuery] = useState("");
  const titles = ["Designing a workspace", "Building with Preact"];
  return (
    <ApplicationShell11
      brand={{ name: "Team Watch" }}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[{ label: "Watch" }, { label: "Discover" }]}
      navigationGroups={[{ id: "browse", items: [
        { id: "home", label: "Home", href: "/watch" },
        { id: "library", label: "Library", href: "/watch/library" },
      ] }]}
      subscriptions={[{ id: "studio", label: "Studio Notes", href: "/watch/studio" }]}
      searchQuery={query}
      onSearchQueryChange={setQuery}
      onSearch={setQuery}
    >
      <h1 class="text-2xl font-semibold">Discover</h1>
      <ul class="mt-4 space-y-3">
        {titles.filter((title) => title.toLowerCase().includes(query.toLowerCase()))
          .map((title) => <li key={title}>{title}</li>)}
      </ul>
    </ApplicationShell11>
  );
}`,
};
