import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import DiamondButton from "@/components/ui/DiamondButton";
import { ROUTES } from "@/constants/routes";

function SideDiamondGroup({
  side,
  label,
  href,
}: {
  side: "left" | "right";
  label: string;
  href: string;
}) {
  const isLeft = side === "left";

  return (
    <div
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
        />

        <div className="relative z-20 flex flex-col items-center text-center">
          <h1 className="skinstric-hero-title max-w-225">
            Sophisticated
            <br />
            skincare
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
