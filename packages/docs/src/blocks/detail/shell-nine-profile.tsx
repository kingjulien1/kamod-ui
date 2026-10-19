import type { ExtendedShellProfile } from "./extended-shell-sections";

export const shellNineProfile: ExtendedShellProfile = {
  name: "IDE Workspace",
  layout: "ide",
  purpose: (
    <>
      <strong>Keep Files, Tools and Output in Separate Places.</strong> Shell 9 is an editor frame
      with a persistent activity rail, a collapsible explorer and an optional output region
      underneath the working page. Unlike Shell 3’s single icon rail, its tool rail remains visible
      when the explorer is closed; unlike Shell 6’s inspector, its secondary content sits below the
      editor instead of beside a record.
    </>
  ),
  fit: (
    <>
      Choose this frame for a code playground, document studio, file manager or developer tool where
      people repeatedly switch between a working document and supporting tools. Its density pays off
      when files have stable names and users recognize module icons. A simple settings screen rarely
      needs both a rail and an explorer. For a genuinely recursive file tree, retain your own tree
      model and extend the supplied navigation adapter rather than pretending its single child level
      is a full IDE filesystem.
    </>
  ),
  structure: (
    <>
      The outer SidebarProvider reserves a 3.5rem desktop rail before the explorer’s normal sidebar
      gap. The core Sidebar uses off-canvas collapse, so hiding it releases the entire explorer
      width while the rail remains in place. Shared NavMain renders grouped folders and leaves;
      NavUser retains account keyboard behavior. Header breadcrumbs describe the selected file or
      tool, the route content occupies the main landmark, and a uniquely identified bottom section
      holds app-owned diagnostics or output. Only the optional output toggle is local component
      state.
    </>
  ),
  responsive: (
    <>
      At 768px the activity rail becomes persistent and the explorer is an independently collapsible
      desktop panel. Below 768px, the same explorer becomes Kamod’s left-side Sheet and the activity
      destinations appear in a wrapping compact row below the header. Selecting an ordinary
      destination closes the mobile sheet, including router-handled clicks; modifier clicks preserve
      it. The content has no fixed editor width and the header’s actions may wrap, so the 320px view
      remains usable.
    </>
  ),
  styling: (
    <>
      Use sidebar tokens for the explorer and activity rail, background tokens for the editing
      surface and a muted surface for output. Keep active tool indicators distinct from file
      selection: the caller supplies activityLinks.active independently of currentPath when a tool
      and file are both selected. Monospace belongs to code and output, not every label. Preserve
      min-width:0 around the editor and give any genuinely wide source its own scroll region rather
      than widening the document.
    </>
  ),
  review: (
    <>
      Open src, select theme.css, edit the scratch buffer, hide the output panel and toggle the
      explorer twice. The selected filename and editor value must survive both frame changes.
      Activate Search from the rail, filter to a file, then reopen it. On mobile, select a file
      through the Sheet and verify dismissal and focus return. Finally inspect the account menu and
      test a disabled destination; neither an inert icon nor a fake terminal command should be
      presented as a working operation.
    </>
  ),
  next: (
    <>
      Choose Shell 3 for a simpler single navigation rail or Shell 6 when the supporting information
      belongs beside a document. Keep the IDE frame when module tools and a file hierarchy are
      genuinely separate dimensions of the workflow.
    </>
  ),
  integration: (
    <>
      The example intentionally supplies action-only activity links: Explorer and Search report
      through onNavigate without assigning made-up URLs. In your application, route those tools or
      swap navigationGroups for the selected module, and keep the selected file in a stable owner
      above the frame. The live showcase demonstrates local file creation, filename search and
      editable scratch buffers. Save updates memory only; connect a real document service before
      promising durable storage.
    </>
  ),
  state: (
    <>
      The output panel starts open when panel is supplied. Its toggle affects only that region;
      closing unmounts the panel content, so lift logs, terminal sessions or filters above it when
      they must persist. Omitting panel removes both the region and toggle. Explorer state is
      controlled separately through open/defaultOpen/onOpenChange. No filesystem, terminal
      execution, Git integration or editor engine is bundled.
    </>
  ),
  props: [
    {
      key: "activityLinks",
      name: "activityLinks",
      type: "readonly ApplicationShellNavigationLink[]",
      required: false,
      description:
        "Tools in the desktop rail and mobile tool row. Defaults to an empty list. Use active or currentPath for selection, disabled for unavailable tools, and onNavigate for action-only entries.",
    },
    {
      key: "panel",
      name: "panel",
      type: "ComponentChildren",
      required: false,
      description:
        "Optional bottom output content. Starts visible; closing unmounts this region. Keep persistent state in the application. Omission removes the toggle and region.",
    },
    {
      key: "panelTitle",
      name: "panelTitle",
      type: "string",
      required: false,
      description:
        "Output-region heading, accessible name and toggle label. Defaults to Output; choose a short specific name such as Build output.",
    },
  ],
  usage: `import { useState } from "preact/hooks";
import { ApplicationShell9 } from "./components/application-shell/application-shell-9";

export function Workspace() {
  const [file, setFile] = useState("App.tsx");
  const [tool, setTool] = useState("Explorer");
  return (
    <ApplicationShell9
      brand={{ name: "Studio", description: "Project files" }}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[{ label: "src" }, { label: file }]}
      navigationGroups={[{ id: "files", label: "Explorer", items: [
        { id: "src", label: "src", items: [
          { id: "app", label: "App.tsx", href: "/files/App.tsx" },
          { id: "theme", label: "theme.css", href: "/files/theme.css" },
        ] },
      ] }]}
      currentPath={"/files/" + file}
      activityLinks={[
        { id: "explorer", label: "Explorer", active: tool === "Explorer" },
        { id: "search", label: "Search", active: tool === "Search" },
      ]}
      onNavigate={(destination, event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
        event.preventDefault();
        if (destination.href) { setFile(destination.label); setTool("Explorer"); }
        else setTool(destination.label);
      }}
      panelTitle="Build output"
      panel={<p class="font-mono text-xs">Ready for your build service.</p>}
    >
      <h1 class="text-2xl font-semibold">{tool === "Explorer" ? file : "Search"}</h1>
      <p class="mt-3 text-muted-foreground">Render your editor or search view here.</p>
    </ApplicationShell9>
  );
}`,
};
