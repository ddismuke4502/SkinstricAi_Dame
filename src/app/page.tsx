"use client";

import { useEffect, useRef, type Ref } from "react";
import gsap from "gsap";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import DiamondButton from "@/components/ui/DiamondButton";
import { ROUTES } from "@/constants/routes";

type HoverTarget = "left" | "right" | null;

function SideDiamondGroup({
  side,
  label,
  href,
  ctaRef,
  onHoverChange,
}: {
  side: "left" | "right";
  label: string;
  href: string;
  ctaRef?: Ref<HTMLDivElement>;
  onHoverChange: (target: HoverTarget) => void;
}) {
  const isLeft = side === "left";

  return (
    <div
      ref={ctaRef}
      onMouseEnter={() => onHoverChange(side)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(side)}
      onBlur={() => onHoverChange(null)}
      className={[
        "absolute top-1/2 hidden -translate-y-1/2 items-center xl:flex",
        isLeft ? "-left-65" : "-right-65",
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
  const heroRef = useRef<HTMLDivElement | null>(null);
  const skincareLineRef = useRef<HTMLSpanElement | null>(null);
  const leftCtaRef = useRef<HTMLDivElement | null>(null);
  const rightCtaRef = useRef<HTMLDivElement | null>(null);

  function animateHero(target: HoverTarget) {
    const hero = heroRef.current;
    const skincareLine = skincareLineRef.current;
    const leftCta = leftCtaRef.current;
    const rightCta = rightCtaRef.current;

    if (!hero || !skincareLine || !leftCta || !rightCta) return;

    const timeline = gsap.timeline({
      defaults: {
        duration: 1.15,
        ease: "power3.out",
      },
    });

    if (target === "right") {
      timeline
        .to(
          hero,
          {
            x: "-29vw",
          },
          0
        )
        .to(
          skincareLine,
          {
            x: "0em",
          },
          0
        )
        .to(
          leftCta,
          {
            autoAlpha: 0,
            pointerEvents: "none",
            duration: 0.55,
            ease: "power2.out",
          },
          0
        )
        .to(
          rightCta,
          {
            autoAlpha: 1,
            pointerEvents: "auto",
            duration: 0.55,
            ease: "power2.out",
          },
          0
        );

      return;
    }

    if (target === "left") {
      timeline
        .to(
          hero,
          {
            x: "29vw",
          },
          0
        )
        .to(
          skincareLine,
          {
            x: "2.18em",
          },
          0
        )
        .to(
          rightCta,
          {
            autoAlpha: 0,
            pointerEvents: "none",
            duration: 0.55,
            ease: "power2.out",
          },
          0
        )
        .to(
          leftCta,
          {
            autoAlpha: 1,
            pointerEvents: "auto",
            duration: 0.55,
            ease: "power2.out",
          },
          0
        );

      return;
    }

    timeline
      .to(
        hero,
        {
          x: 0,
        },
        0
      )
      .to(
        skincareLine,
        {
          x: "1.09em",
        },
        0
      )
      .to(
        [leftCta, rightCta],
        {
          autoAlpha: 1,
          pointerEvents: "auto",
          duration: 0.65,
          ease: "power2.out",
        },
        0
      );
  }

  useEffect(() => {
    const hero = heroRef.current;
    const skincareLine = skincareLineRef.current;
    const leftCta = leftCtaRef.current;
    const rightCta = rightCtaRef.current;

    if (!hero || !skincareLine || !leftCta || !rightCta) return;

    gsap.set(hero, {
      x: 0,
      willChange: "transform",
    });

    gsap.set(skincareLine, {
      x: "1.09em",
      willChange: "transform",
    });

    gsap.set([leftCta, rightCta], {
      autoAlpha: 1,
      willChange: "opacity",
    });

    gsap.fromTo(
      hero,
      {
        y: 18,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <PageShell
      showEnterCode={true}
      contentClassName="flex min-h-screen items-center justify-center px-6 pt-0"
    >
      <section className="skinstric-content-enter relative flex min-h-screen w-full items-center justify-center">
        <SideDiamondGroup
          side="left"
          label="DISCOVER A.I."
          href={ROUTES.testing}
          ctaRef={leftCtaRef}
          onHoverChange={animateHero}
        />

        <div ref={heroRef} className="relative z-20 flex flex-col">
          <h1 className="skinstric-hero-title w-fit text-left">
            <span className="block">Sophisticated</span>
            <span ref={skincareLineRef} className="block">
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
          ctaRef={rightCtaRef}
          onHoverChange={animateHero}
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