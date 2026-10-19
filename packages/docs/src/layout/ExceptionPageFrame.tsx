/** @jsxImportSource preact */
import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import Logo from "../../.preactpress/theme/Logo";

/** Private shared frame; also rendered before hydration, without runtime landmarks at startup. */
export function ExceptionPageFrame({
  children,
  base = "/",
  startup = false,
  class: className = "",
  mainClass = "",
  decoration,
}: {
  children: ComponentChildren;
  base?: string;
  startup?: boolean;
  class?: string;
  mainClass?: string;
  decoration?: ComponentChildren;
}) {
  const Header = startup ? "div" : "header";
  const Main = startup ? "div" : "main";
  const Footer = startup ? "div" : "footer";
  return (
    <div
      class={`page-opening ${startup ? "page-opening--startup" : "page-state-shell"} ${className}`}
    >
      <Header class={`page-opening-topbar${startup ? "" : " page-state-topbar"}`}>
        <a class="page-state-brand" href={base} aria-label="Kamod UI home">
          <Logo base={base} />
        </a>
      </Header>
      {decoration}
      <Main
        class={`page-opening-main${startup ? "" : " page-state-main"} ${mainClass}`}
        id={startup ? undefined : "content"}
        tabIndex={startup ? undefined : -1}
      >
        {children}
      </Main>
      <Footer class="page-exception-footer">
        <p>
          Copyright © 2026 Klaus Zahiragic –{" "}
          <a href="https://www.kamod.ch/">
            www.kamod.ch
            <ArrowUpRightIcon aria-hidden="true" />
          </a>
        </p>
        <p>
          Built with{" "}
          <a href="https://kamod-ch.github.io/preactpress/">
            PreactPress
            <ArrowUpRightIcon aria-hidden="true" />
          </a>
          .
        </p>
      </Footer>
    </div>
  );
}
