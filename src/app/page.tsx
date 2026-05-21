"use client";

import { useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import DiamondButton from "@/components/ui/DiamondButton";
import { ROUTES } from "@/constants/routes";

type HoverTarget = "left" | "right" | null;

function SideDiamondGroup({
  side,
  label,
  href,
  hoverTarget,
  onHoverChange,
}: {
  side: "left" | "right";
  label: string;
  href: string;
  hoverTarget: HoverTarget;
  onHoverChange: (target: HoverTarget) => void;
}) {
  const isLeft = side === "left";
  const shouldFade =
    (hoverTarget === "left" && !isLeft) || (hoverTarget === "right" && isLeft);

  return (
    <div
      onMouseEnter={() => onHoverChange(side)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(side)}
      onBlur={() => onHoverChange(null)}
      className={[
        "absolute top-1/2 hidden -translate-y-1/2 items-center transition-all duration-700 ease-out xl:flex",
        isLeft ? "-left-65" : "-right-65",
        shouldFade ? "pointer-events-none opacity-0" : "opacity-100",
      ].join(" ")}
    >
      <div className="relative grid h-130 w-130 place-items-center">
        <span className="diamond-frame rotate-slow w-130" />
        <span className="diamond-frame rotate-medium w-110" />
        <span className="diamond-frame rotate-fast w-90" />

        <div
          className={[
            "absolute top-1/2 z-10 -translate-y-1/2",
            isLeft ? "right-18" : "left-18",
          ].join(" ")}
        >
          <DiamondButton
            label={label}
            href={href}
            direction={isLeft ? "left" : "right"}
          />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [hoverTarget, setHoverTarget] = useState<HoverTarget>(null);

  const heroSlideClass =
    hoverTarget === "right"
      ? "-translate-x-[29vw]"
      : hoverTarget === "left"
        ? "translate-x-[29vw]"
        : "translate-x-0";

  const skincareLineClass =
    hoverTarget === "right"
      ? "translate-x-0"
      : hoverTarget === "left"
        ? "translate-x-[1.65em]"
        : "translate-x-[1.09em]";

  return (
    <PageShell
      showEnterCode={true}
      contentClassName="flex min-h-screen items-center justify-center px-6 pt-0"
    >
      <section className="relative flex min-h-screen w-full items-center justify-center">
        <SideDiamondGroup
          side="left"
          label="DISCOVER A.I."
          href={ROUTES.testing}
          hoverTarget={hoverTarget}
          onHoverChange={setHoverTarget}
        />

        <div
          className={[
            "relative z-20 flex flex-col transition-transform duration-1400 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
            heroSlideClass,
          ].join(" ")}
        >
          <h1 className="skinstric-hero-title w-fit text-left">
            <span className="block">Sophisticated</span>
            <span
              className={[
                "block transition-transform duration-1400 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
                skincareLineClass,
              ].join(" ")}
            >
              skincare
            </span>
          </h1>

          <div className="mt-16 flex w-full items-center justify-between gap-8 xl:hidden">
            <DiamondButton
              label="DISCOVER A.I."
              href={ROUTES.testing}
              direction="left"
            />

            <DiamondButton
              label="TAKE TEST"
              href={ROUTES.testing}
              direction="right"
            />
          </div>
        </div>

        <SideDiamondGroup
          side="right"
          label="TAKE TEST"
          href={ROUTES.testing}
          hoverTarget={hoverTarget}
          onHoverChange={setHoverTarget}
        />

        <p className="skinstric-body-copy absolute bottom-8 left-0 hidden max-w-82.5 text-left md:block">
          SKINSTRIC DEVELOPED AN A.I. THAT CREATES
          <br />
          A HIGHLY-PERSONALISED ROUTINE TAILORED TO
          <br />
          WHAT YOUR SKIN NEEDS.
        </p>
      </section>

      <BottomNav showBack={false} showProceed={false} />
    </PageShell>
  );
}
