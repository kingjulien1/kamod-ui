import { cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { ApplicationShell12 } from "./application-shell-12";

afterEach(cleanup);
const props = {
  brand: { name: "Workspace" },
  user: { name: "Alex", email: "alex@example.com" },
  breadcrumbs: [{ label: "Overview" }],
  navigationGroups: [],
};
const organizations = [
  { id: "studio", name: "Studio" },
  { id: "lab", name: "Research Lab" },
];

it("reports controlled organization selection without silently accepting it", () => {
  const change = vi.fn();
  render(
    <ApplicationShell12
      {...props}
      organizations={organizations}
      organizationId="studio"
      onOrganizationChange={change}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Switch organization: Studio" }));
  fireEvent.click(screen.getByRole("menuitem", { name: "Research Lab" }));
  expect(change).toHaveBeenCalledWith("lab");
  expect(screen.getByRole("button", { name: "Switch organization: Studio" })).toBeTruthy();
});

it("falls back to an enabled organization and keeps unavailable choices disabled", () => {
  const change = vi.fn();
  render(
    <ApplicationShell12
      {...props}
      organizations={[{ id: "unavailable", name: "Private", disabled: true }, ...organizations]}
      organizationId="removed"
      onOrganizationChange={change}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Switch organization: Studio" }));
  fireEvent.click(screen.getByRole("menuitem", { name: "Private" }));
  expect(change).not.toHaveBeenCalled();
});

it("keeps one main landmark and releases only the contextual panel on collapse", () => {
  const change = vi.fn();
  const { container } = render(
    <ApplicationShell12
      {...props}
      onOpenChange={change}
      moduleLinks={[{ id: "docs", label: "Documents", href: "/documents" }]}
      currentPath="/documents"
    >
      <h1>Working page</h1>
    </ApplicationShell12>,
  );
  expect(screen.getAllByRole("main")).toHaveLength(1);
  for (const link of screen.getAllByRole("link", { name: "Documents" }))
    expect(link.getAttribute("aria-current")).toBe("page");
  fireEvent.click(screen.getAllByRole("button", { name: "Toggle Sidebar" })[0]);
  expect(change).toHaveBeenCalledWith(false);
  expect(container.querySelector('[data-collapsible="offcanvas"]')).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Working page" })).toBeTruthy();
});
