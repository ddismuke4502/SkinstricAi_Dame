import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import { ROUTES } from "@/constants/routes";

type AnalysisTileProps = {
  label: string;
  href?: string;
  position: "top" | "left" | "right" | "bottom";
};

function AnalysisTile({ label, href, position }: AnalysisTileProps) {
  const content = (
    <div
      className={[
        "absolute grid h-36 w-36 rotate-45 place-items-center bg-[#e8e8e8] transition-colors hover:bg-[#dcdcdc] md:h-44 md:w-44",
        position === "top" ? "left-1/2 top-0 -translate-x-1/2" : "",
        position === "left" ? "left-0 top-1/2 -translate-y-1/2" : "",
        position === "right" ? "right-0 top-1/2 -translate-y-1/2" : "",
        position === "bottom" ? "bottom-0 left-1/2 -translate-x-1/2" : "",
      ].join(" ")}
    >
      <span className="max-w-24 -rotate-45 text-center text-[13px] font-semibold uppercase leading-tight tracking-[-0.03em]">
        {label}
      </span>
    </div>
  );

  if (!href) {
    return <div className="cursor-not-allowed opacity-80">{content}</div>;
  }

  return (
    <Link href={href} aria-label={label}>
      {content}
    </Link>
  );
}

export default function AnalysisPage() {
  return (
    <PageShell sectionLabel="ANALYSIS" contentClassName="min-h-screen px-7 pt-24 md:px-8">
      <section className="relative min-h-[calc(100vh-6rem)]">
        <div className="absolute left-0 top-0">
          <p className="skinstric-label">A.I. ANALYSIS</p>
          <p className="mt-6 max-w-xs text-[12px] font-semibold uppercase leading-relaxed tracking-[-0.02em] text-[#1a1a1a]">
            A.I. HAS ESTIMATED THE FOLLOWING.
            <br />
            FIX ESTIMATED INFORMATION IF NEEDED.
          </p>
        </div>

        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
          <div className="relative grid h-105 w-105 place-items-center md:h-140 md:w-140">
            <span className="diamond-frame rotate-slow w-105 md:w-140" />
            <span className="diamond-frame rotate-medium w-90 md:w-122.5" />
            <span className="diamond-frame rotate-fast w-75 md:w-105" />

            <div className="relative h-72.5 w-72.5 md:h-90 md:w-90">
              <AnalysisTile
                label="DEMOGRAPHICS"
                href={ROUTES.demographics}
                position="top"
              />
              <AnalysisTile label="SKIN TYPE DETAILS" position="left" />
              <AnalysisTile label="COSMETIC CONCERNS" position="right" />
              <AnalysisTile label="WEATHER" position="bottom" />
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