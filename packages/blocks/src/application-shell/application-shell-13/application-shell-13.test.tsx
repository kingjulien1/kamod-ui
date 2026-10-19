import { cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { ApplicationShell13 } from "./application-shell-13";

afterEach(cleanup);
const props = {
  brand: { name: "Workspace" },
  user: { name: "Alex", email: "alex@example.com" },
  breadcrumbs: [{ label: "Overview" }],
  navigationGroups: [
    {
      id: "projects",
      label: "Projects",
      items: [
        { id: "overview", label: "Project overview", href: "/projects" },
        {
          id: "restricted",
          label: "Private group",
          disabled: true,
          items: [{ id: "secret", label: "Secret project", href: "/secret" }],
        },
      ],
    },
  ],
};

it("preserves grouped native routes and disables descendants of unavailable branches", () => {
  const navigate = vi.fn();
  render(
    <ApplicationShell13 {...props} currentPath="/projects" onNavigate={navigate}>
      <h1>Projects</h1>
    </ApplicationShell13>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Projects", exact: true }));
  const destination = screen.getByRole("menuitem", { name: "Project overview" });
  expect(destination.getAttribute("href")).toBe("/projects");
  expect(destination.getAttribute("aria-current")).toBe("page");
  fireEvent.click(screen.getByRole("menuitem", { name: "Secret project" }));
  expect(navigate).not.toHaveBeenCalled();
  expect(screen.getAllByRole("main")).toHaveLength(1);
});

it("omits the quick-navigation bar when no frequent destinations are supplied", () => {
  render(<ApplicationShell13 {...props} />);
  expect(screen.queryByRole("navigation", { name: "Quick navigation" })).toBeNull();
});

it("shares current-route state between the full menu and mobile quick links", () => {
  render(
    <ApplicationShell13
      {...props}
      currentPath="/projects"
      mobileLinks={[{ id: "project", label: "Projects", href: "/projects" }]}
    />,
  );
  const link = screen.getByRole("navigation", { name: "Quick navigation" }).querySelector("a")!;
  expect(link.getAttribute("aria-current")).toBe("page");
  expect(link.getAttribute("href")).toBe("/projects");
});
