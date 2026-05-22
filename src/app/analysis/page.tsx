"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import { ROUTES } from "@/constants/routes";

type AnalysisTileProps = {
  label: string;
  href?: string;
  className?: string;
  tileRef?: (element: HTMLDivElement | null) => void;
};

function AnalysisTile({
  label,
  href,
  className = "",
  tileRef,
}: AnalysisTileProps) {
  const content = (
    <div
      className={[
        "grid h-36 w-36 place-items-center bg-[#eeeeee] transition-colors hover:bg-[#dedede] md:h-42 md:w-42",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="skinstric-subhead max-w-32 -rotate-45 text-center text-[#1a1a1a]">
        {label}
      </span>
    </div>
  );

  return (
    <div ref={tileRef} className="will-change-transform">
      {href ? (
        <Link href={href} aria-label={label}>
          {content}
        </Link>
      ) : (
        <div className="cursor-not-allowed opacity-90">{content}</div>
      )}
    </div>
  );
}

export default function AnalysisPage() {
  const hubRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const hub = hubRef.current;
    const copy = copyRef.current;
    const tiles = tileRefs.current.filter(Boolean);

    if (!hub || !copy || tiles.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(hub, {
        autoAlpha: 0,
        scale: 0.94,
        rotate: -2,
      });

      gsap.set(copy, {
        autoAlpha: 0,
        y: 14,
      });

      gsap.set(tiles, {
        autoAlpha: 0,
        scale: 0.82,
        y: 10,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .to(copy, {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
        })
        .to(
          hub,
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 0.9,
          },
          0.1
        )
        .to(
          tiles,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.28,
          },
          0.28
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <PageShell
      sectionLabel="ANALYSIS"
      showEnterCode={false}
      contentClassName="min-h-screen px-7 pt-24 md:px-8"
    >
      <section className="relative min-h-[calc(100vh-6rem)]">
        <div ref={copyRef} className="absolute left-0 top-0 z-20">
          <p className="skinstric-label">A. I. ANALYSIS</p>

          <p className="mt-6 max-w-xs text-[12px] font-semibold uppercase leading-relaxed tracking-[-0.02em] text-[#1a1a1a]">
            A. I. HAS ESTIMATED THE FOLLOWING.
            <br />
            FIX ESTIMATED INFORMATION IF NEEDED.
          </p>
        </div>

        <div
          ref={hubRef}
          className="absolute left-1/2 top-[45%] grid -translate-x-1/2 -translate-y-1/2 place-items-center"
        >
          <div className="relative grid h-107.5 w-107.5 place-items-center md:h-130 md:w-130">
            <span className="diamond-frame rotate-slow w-107.5 opacity-70 md:w-130" />
            <span className="diamond-frame rotate-medium w-91.25 opacity-70 md:w-112.5" />
            <span className="diamond-frame rotate-fast w-76.25 opacity-70 md:w-95" />

            <div className="grid rotate-45 grid-cols-2 grid-rows-2 gap-1">
              <AnalysisTile
                label="DEMOGRAPHICS"
                href={ROUTES.demographics}
                className="bg-[#dddddd]"
                tileRef={(element) => {
                  tileRefs.current[0] = element;
                }}
              />

              <AnalysisTile
                label="COSMETIC CONCERNS"
                tileRef={(element) => {
                  tileRefs.current[1] = element;
                }}
              />

              <AnalysisTile
                label="SKIN TYPE DETAILS"
                tileRef={(element) => {
                  tileRefs.current[2] = element;
                }}
              />

              <AnalysisTile
                label="WEATHER"
                tileRef={(element) => {
                  tileRefs.current[3] = element;
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <BottomNav
        backHref={ROUTES.select}
        proceedHref={ROUTES.demographics}
        proceedLabel="GET SUMMARY"
      />
    </PageShell>
  );
}