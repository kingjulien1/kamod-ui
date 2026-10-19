import { cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { ApplicationShell9 } from "./application-shell-9";
import { ApplicationShell9Preview } from "./preview";

afterEach(cleanup);
const props = {
  brand: { name: "Studio" },
  user: { name: "Alex", email: "alex@example.com" },
  breadcrumbs: [{ label: "Editor" }],
  navigationGroups: [],
};

it("keeps editor state while independently hiding output and explorer", () => {
  render(<ApplicationShell9Preview />);
  const editor = screen.getByRole("textbox", { name: "Scratch editor" });
  fireEvent.input(editor, { target: { value: "Unsaved scratch buffer" } });
  fireEvent.click(screen.getByRole("button", { name: "Workspace output" }));
  expect(screen.queryByRole("region", { name: "Workspace output" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
  expect(
    (screen.getByRole("textbox", { name: "Scratch editor" }) as HTMLTextAreaElement).value,
  ).toBe("Unsaved scratch buffer");
  fireEvent.click(screen.getByRole("button", { name: "Workspace output" }));
  expect(screen.getByRole("region", { name: "Workspace output" })).toBeTruthy();
  expect(screen.getAllByRole("main")).toHaveLength(1);
});

it("does not advertise an absent output region", () => {
  render(
    <ApplicationShell9 {...props}>
      <h1>Document</h1>
    </ApplicationShell9>,
  );
  expect(screen.queryByRole("button", { name: "Output" })).toBeNull();
  expect(screen.getByRole("heading", { name: "Document" })).toBeTruthy();
});

it("preserves native tool destinations and disabled state", () => {
  const onNavigate = vi.fn();
  render(
    <ApplicationShell9
      {...props}
      currentPath="/search"
      onNavigate={onNavigate}
      activityLinks={[
        { id: "search", label: "Search", href: "/search" },
        { id: "restricted", label: "Private", href: "/private", disabled: true },
      ]}
    />,
  );
  const links = screen.getAllByRole("link", { name: "Search" });
  expect(links[0].getAttribute("aria-current")).toBe("page");
  expect(links[0].getAttribute("href")).toBe("/search");
  for (const control of screen.getAllByRole("button", { name: "Private" }))
    expect((control as HTMLButtonElement).disabled).toBe(true);
});

it("creates selectable scratch files without mutating existing buffers", () => {
  render(<ApplicationShell9Preview />);
  fireEvent.click(screen.getByRole("button", { name: "New file" }));
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("draft-3.tsx");
  expect(
    (screen.getByRole("textbox", { name: "Scratch editor" }) as HTMLTextAreaElement).value,
  ).toBe("// Start writing here.\n");
});
