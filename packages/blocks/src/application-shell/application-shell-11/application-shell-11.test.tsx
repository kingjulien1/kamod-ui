import { cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { ApplicationShell11 } from "./application-shell-11";

afterEach(cleanup);
const props = {
  brand: { name: "Watch" },
  user: { name: "Alex", email: "alex@example.com" },
  breadcrumbs: [{ label: "Discover" }],
  navigationGroups: [],
};

it("submits the current uncontrolled search without native navigation", () => {
  const submit = vi.fn();
  render(
    <ApplicationShell11 {...props} onSearch={submit}>
      <h1>Catalog</h1>
    </ApplicationShell11>,
  );
  fireEvent.input(screen.getByRole("searchbox", { name: "Search videos" }), {
    target: { value: "Preact interfaces" },
  });
  fireEvent.submit(screen.getByRole("search"));
  expect(submit).toHaveBeenCalledWith("Preact interfaces");
  expect(screen.getAllByRole("main")).toHaveLength(1);
});

it("reports controlled search edits without replacing the supplied value", () => {
  const change = vi.fn();
  render(<ApplicationShell11 {...props} searchQuery="Design" onSearchQueryChange={change} />);
  fireEvent.input(screen.getByRole("searchbox", { name: "Search videos" }), {
    target: { value: "Development" },
  });
  expect(change).toHaveBeenCalledWith("Development");
});

it("omits empty channels and independently collapses a supplied subscription list", () => {
  const view = render(<ApplicationShell11 {...props} />);
  expect(screen.queryByRole("button", { name: "Subscriptions" })).toBeNull();
  view.rerender(
    <ApplicationShell11
      {...props}
      subscriptions={[{ id: "studio", label: "Studio Notes", href: "/studio" }]}
    />,
  );
  expect(screen.getByRole("link", { name: "Studio Notes" }).getAttribute("href")).toBe("/studio");
  fireEvent.click(screen.getByRole("button", { name: "Subscriptions" }));
  expect(screen.queryByRole("link", { name: "Studio Notes" })).toBeNull();
});
