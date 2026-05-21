import type { ReactNode } from "react";
import AppHeader from "./AppHeader";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  showIntro?: boolean;
  showEnterCode?: boolean;
  sectionLabel?: string;
  headerTone?: "dark" | "light";
};

export function PageShell({
  children,
  className = "",
  contentClassName = "",
  showIntro = true,
  showEnterCode = true,
  sectionLabel = "INTRO",
  headerTone = "dark",
}: PageShellProps) {
  return (
    <div className={["skinstric-page relative overflow-hidden", className].join(" ")}>
      <AppHeader
        showIntro={showIntro}
        showEnterCode={showEnterCode}
        sectionLabel={sectionLabel}
        tone={headerTone}
      />

      <main
        className={[
          "relative min-h-screen px-7 pt-24 md:px-8",
          contentClassName,
        ].join(" ")}
      >
        {children}
      </main>
    </div>
  );
}

export default PageShell;