import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../base-path";

const recoveryDestinations = [
  {
    title: "Components",
    path: "/docs/components",
    description:
      "Find accessible building blocks, explore live examples, and bring just the pieces you need into your next Preact interface.",
  },
  {
    title: "Blocks",
    path: "/blocks",
    description:
      "Start with a complete layout, inspect how its components fit together, and adapt the source to make it your own.",
  },
  {
    title: "Packages",
    path: "/docs/packages",
    description:
      "Meet the companion tools for reusable behavior, persistent state, and icons, with focused guides to help you choose.",
  },
  {
    title: "Forms",
    path: "/docs/forms",
    description:
      "Connect fields, validation, and useful feedback into a form that makes the next step clear, from first input to submission.",
  },
] as const;

const recoveryPackages = [
  {
    name: "@kamod-ch/ui",
    path: "/docs/getting-started",
    description: "Accessible Preact components.",
  },
  {
    name: "@kamod-ch/icons",
    path: "/docs/icons-package/installation",
    description: "Tree-shakeable SVG icons.",
  },
  {
    name: "@kamod-ch/hooks",
    path: "/docs/hooks-package/installation",
    description: "Reusable Preact behavior.",
  },
  {
    name: "@kamod-ch/signals",
    path: "/docs/signals-package/installation",
    description: "Small state, kept in sync.",
  },
] as const;

/** Share the label-to-grid rhythm and accessible naming across both recovery rows. */
function RecoveryGroup({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ComponentChildren;
}) {
  return (
    <section class="not-found-directory-group" aria-labelledby={id}>
      <h2 id={id} class="not-found-directory-label">
        {title}
      </h2>
      <div class="not-found-destinations">{children}</div>
    </section>
  );
}

/** Static, base-path-aware recovery links; no state, effects or client-only dependencies. */
export function NotFoundDirectory() {
  return (
    <nav class="not-found-directory" aria-labelledby="not-found-directory-title">
      <RecoveryGroup id="not-found-directory-title" title="A good place to continue">
        {recoveryDestinations.map(({ title, path, description }) => {
          const id = `not-found-${title.toLowerCase()}`;
          return (
            <a
              key={path}
              class="not-found-destination"
              href={withBasePath(path)}
              aria-labelledby={id}
              aria-describedby={`${id}-description`}
            >
              <span class="not-found-destination-title" id={id}>
                {title} <ArrowUpRightIcon size={13} aria-hidden="true" />
              </span>
              <span class="not-found-destination-description" id={`${id}-description`}>
                {description}
              </span>
              <span class="not-found-path">
                <code>{path}</code>
                <ArrowUpRightIcon size={12} aria-hidden="true" />
              </span>
            </a>
          );
        })}
      </RecoveryGroup>
      <RecoveryGroup id="not-found-packages-title" title="Tools to take with you">
        {recoveryPackages.map(({ name, path, description }) => (
          <div class="not-found-package" key={name}>
            <a class="not-found-package-link" href={withBasePath(path)}>
              <code>{name}</code>
              <ArrowUpRightIcon size={12} aria-hidden="true" />
            </a>
            <p class="not-found-package-description">{description}</p>
          </div>
        ))}
      </RecoveryGroup>
    </nav>
  );
}
