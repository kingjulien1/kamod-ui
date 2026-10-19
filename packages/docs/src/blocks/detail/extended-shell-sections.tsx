import type { ComponentChildren } from "preact";
import { withBasePath } from "../../base-path";
import { CodeBlock } from "../../docs/components/CodeBlock";
import { propDescriptions } from "../application-shell-api-data";
import type { ApplicationShellBlock } from "../application-shell-config";
import { applicationShellPropFields } from "../application-shell-type-source";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import { type BlockPropRow, BlockPropsTable } from "./BlockPropsTable";
import { shellProductionSection } from "./ShellProductionGuide";
import { ShellVariantSetup } from "./ShellVariantSetup";
import type { BlockGuideSection } from "./types";

/** Authored differences, integrated into the established six-chapter guide order. */
export type ExtendedShellProfile = {
  name: string;
  layout: string;
  purpose: ComponentChildren;
  fit: ComponentChildren;
  structure: ComponentChildren;
  responsive: ComponentChildren;
  styling: ComponentChildren;
  review: ComponentChildren;
  next: ComponentChildren;
  integration: ComponentChildren;
  state: ComponentChildren;
  usage: string;
  props: readonly BlockPropRow[];
  omitState?: boolean;
};

export function createExtendedShellSections(
  block: ApplicationShellBlock,
  profile: ExtendedShellProfile,
): readonly BlockGuideSection[] {
  const number = block.id.split("-").at(-1);
  const entry = `${block.id}/${block.id}.tsx`;
  const Usage = () => (
    <BlockDocSection
      id="application-shell-usage"
      introduction={
        <p>
          <strong>Start with a Working Screen.</strong> Copy this complete example after adding the
          source folder. The shell supplies the page’s <code>main</code> landmark; render route
          content directly inside it. Brand, account identity, navigation and breadcrumbs stay
          explicit props, with no router or session provider required.
        </p>
      }
    >
      <BlockGuideHeading id="application-shell-render" />
      <CodeBlock language="tsx" filePath="src/App.tsx" code={profile.usage} />
      <p>{profile.integration}</p>
      <BlockGuideHeading id="application-shell-connect" />
      <p>
        <strong>Keep Navigation Native Until Your Router Takes Over.</strong> Supply real URLs and
        derive <code>currentPath</code> from the current route. An explicit <code>active</code>{" "}
        value wins over exact matching, including <code>false</code>. Intercept only ordinary
        primary clicks handled by your router; preserve modified clicks, downloads and external
        destinations. Disabled parents also disable their children. Action-only destinations can
        omit <code>href</code> and use the same callback.
      </p>
      <p>
        <code>onUserAction</code> reports account, billing, notification and logout selections. It
        does not authenticate, open a billing portal or revoke a session. Connect those callbacks to
        your application services. Keep queries, permissions and pending/error states outside the
        frame; hiding a destination does not enforce access. Replace demo content with your actual
        loading, empty, failure and successful screens.
      </p>
      <BlockGuideHeading id="application-shell-state" />
      <p>{profile.responsive}</p>
      <p>{profile.state}</p>
      {!profile.omitState && (
        <p>
          The core <code>SidebarProvider</code> remains the sole owner of desktop and mobile
          visibility. Pass <code>open</code> and <code>onOpenChange</code> together for controlled
          desktop state, or use <code>defaultOpen</code> once for an uncontrolled initial value.
          Mobile Sheet state is independent. Do not remount the shell on every sidebar toggle: page
          drafts should survive changes to the navigation frame.
        </p>
      )}
    </BlockDocSection>
  );
  const Props = () => (
    <BlockDocSection
      id="application-shell-props"
      introduction={
        <p>
          <strong>Document the Boundary You Actually Use.</strong>{" "}
          <code>ApplicationShell{number}Props</code> combines the shared application contracts with
          this variant’s specific slots. Optional slots disappear when omitted. Unknown DOM
          attributes are not forwarded to the outer wrapper; use <code>class</code> or{" "}
          <code>className</code> for host sizing.
        </p>
      }
    >
      <BlockGuideHeading id="application-shell-prop-reference" />
      <BlockPropsTable
        labelledBy="application-shell-prop-reference"
        caption={`ApplicationShell${number} props`}
        rows={[
          ...applicationShellPropFields
            .filter(
              (row) =>
                !profile.omitState || !["open", "defaultOpen", "onOpenChange"].includes(row.name),
            )
            .map((row) => ({
              key: row.name,
              name: row.name,
              type: row.type,
              required: row.required,
              description:
                row.name === "open"
                  ? "Controlled desktop panel visibility. Supply onOpenChange to accept toggle requests. Mobile navigation remains independent."
                  : row.name === "defaultOpen"
                    ? "Initial uncontrolled desktop panel visibility; true by default. Ignored when open is supplied."
                    : propDescriptions[row.name],
            })),
          {
            key: "headerActions",
            name: "headerActions",
            type: "ComponentChildren",
            required: false,
            description:
              "Optional application controls in the header. Use meaningful labels and let the row wrap; the shell does not implement the actions.",
          },
          ...profile.props,
        ]}
      />
      <BlockGuideHeading id="application-shell-data-contracts" />
      <p>
        Reuse <code>ApplicationShellNavigationGroup</code> for labeled groups,{" "}
        <code>ApplicationShellNavigationLink</code> for individual destinations and{" "}
        <code>ApplicationShellNavigate</code> for activation. IDs must be stable within their lists.
        Navigation supports one explicit child level; a recursive filesystem or permission tree
        belongs in your application’s model and adapter. Icons are Preact component references,
        while logos and content slots accept rendered Preact children.
      </p>
      <p>
        The{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-1#application-shell-data-types",
          )}
        >
          Shared Brand, Navigation, User and Callback Contracts
        </a>{" "}
        document their individual fields. Read{" "}
        <ShowcaseCodeLink blockId={block.id} file={entry}>
          This Variant’s Source and Prop Comments
        </ShowcaseCodeLink>{" "}
        for the implementation and defaults. The copied files, rather than a separate
        documentation-only schema, remain authoritative.
      </p>
    </BlockDocSection>
  );
  const About = () => (
    <BlockDocSection
      id="application-shell-about"
      className="blocks-doc-explanation"
      introduction={<p>{profile.purpose}</p>}
    >
      <BlockGuideHeading id="application-shell-fit" />
      <p>{profile.fit}</p>
      <BlockGuideHeading id="application-shell-structure" />
      <p>{profile.structure}</p>
      <p>
        <strong>Compose Existing Behavior, Customize the Frame.</strong> The block reuses Kamod’s
        navigation, account dropdown, breadcrumbs and responsive overlay behavior. Its{" "}
        <ShowcaseCodeLink blockId={block.id} file={entry}>
          Public Entry
        </ShowcaseCodeLink>{" "}
        owns the arrangement and optional local display state. The preview is a separate fixture, so
        copying the production component does not bring fictional data or demonstration actions into
        your application.
      </p>
      <BlockGuideHeading id="application-shell-appearance" />
      <p>{profile.styling}</p>
      <p>
        Use semantic background/foreground pairs for the page, sidebar, muted areas and selection.
        Let the host own its theme and fonts; this shell installs no second theme provider or
        preference store. Check long labels, missing avatars and dense real content in both
        appearances. The shared{" "}
        <a href={withBasePath("/blocks/theming#understand-the-sidebar-token-family")}>
          Sidebar Token Guide
        </a>{" "}
        explains which values belong to the frame.
      </p>
      <BlockGuideHeading id="application-shell-review" />
      <p>{profile.review}</p>
      <p>
        Review at 320, 768, 1024 and 1440px with keyboard navigation, visible focus and reduced
        motion. Repeat a complete destination journey in desktop and mobile presentations. Verify
        that the page retains one main landmark, active links name their current destination,
        overlays dismiss with Escape and focus returns to their trigger. The preview keeps its
        changes in memory; it demonstrates interaction without claiming a working backend.
      </p>
      <p>
        {profile.next} Compare{" "}
        <a href={withBasePath("/blocks/application-shell")}>All Application Shells</a> before
        committing to a frame: choose the smallest navigation model that serves the actual workflow.
      </p>
    </BlockDocSection>
  );
  const Reference = () => (
    <BlockDocSection
      id="application-shell-reference"
      introduction={
        <p>
          <strong>Public Design Reference, Original Kamod Implementation.</strong> This variant
          takes its layout brief from{" "}
          <a href={block.sourceUrl}>Shadcnblocks Application Shell {number}</a>. The public preview
          and feature description inform the composition; no Pro source or React/Radix runtime
          implementation is included.
        </p>
      }
    >
      <p>
        The copyable implementation lives in{" "}
        <ShowcaseCodeLink blockId={block.id} file={entry}>
          The Source Showcase
        </ShowcaseCodeLink>
        . Keep the repository license and attribution when redistributing your adaptation. Visual
        details use Kamod’s current theme, verified primitives and accessibility behavior rather
        than hard-coded colors from a screenshot.
      </p>
      <p>
        Start from <a href="#application-shell-usage">The Working Example</a>, change one
        integration boundary at a time, and run the{" "}
        <a href="#application-shell-review">Variant Journey Review</a> with your real content. For
        source ownership, theme setup and routing guidance, return to{" "}
        <a href={withBasePath("/blocks/getting-started")}>Adding Your First Block</a>.
      </p>
    </BlockDocSection>
  );
  return [
    {
      id: "application-shell-installation",
      label: "Add This Block",
      eyebrow: "Getting Started",
      Content: () => <ShellVariantSetup block={block} />,
      children: [
        { id: "application-shell-copy", label: "Copy the Source" },
        { id: "application-shell-dependencies", label: "Dependencies" },
        { id: "application-shell-styles", label: "Styles and Import" },
      ],
    },
    {
      id: "application-shell-usage",
      label: "Render and Connect",
      eyebrow: "Integration",
      Content: Usage,
      children: [
        { id: "application-shell-render", label: "Working Example" },
        { id: "application-shell-connect", label: "Routes and Services" },
        { id: "application-shell-state", label: "Responsive State" },
      ],
    },
    {
      id: "application-shell-props",
      label: "Props and Data",
      eyebrow: "API Reference",
      Content: Props,
      children: [
        { id: "application-shell-prop-reference", label: "Component Props" },
        { id: "application-shell-data-contracts", label: "Data Contracts" },
      ],
    },
    {
      id: "application-shell-about",
      label: `About the ${profile.name}`,
      eyebrow: "A Closer Look",
      Content: About,
      children: [
        { id: "application-shell-fit", label: "When to Choose It" },
        { id: "application-shell-structure", label: "Composition" },
        { id: "application-shell-appearance", label: "Appearance" },
        { id: "application-shell-review", label: "Verify the Journey" },
      ],
    },
    shellProductionSection,
    {
      id: "application-shell-reference",
      label: "Source and Next Steps",
      eyebrow: "Keep Building",
      Content: Reference,
    },
  ];
}
