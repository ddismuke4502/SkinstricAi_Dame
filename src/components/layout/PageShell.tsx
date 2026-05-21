import type { ReactNode } from "react";
import AppHeader from "./AppHeader";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  showIntro?: boolean;
  showEnterCode?: boolean;
};

export function PageShell({
  children,
  className = "",
  contentClassName = "",
  showIntro = true,
  showEnterCode = true,
}: PageShellProps) {
  return (
    <div className={["skinstric-page relative overflow-hidden", className].join(" ")}>
      <AppHeader showIntro={showIntro} showEnterCode={showEnterCode} />

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