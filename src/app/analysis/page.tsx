import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import { ROUTES } from "@/constants/routes";

type AnalysisTileProps = {
  label: string;
  href?: string;
  className?: string;
};

function AnalysisTile({ label, href, className = "" }: AnalysisTileProps) {
  const content = (
    <div
      className={[
        "grid h-34 w-34 place-items-center bg-[#eeeeee] transition-colors hover:bg-[#dedede] md:h-40 md:w-40",
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

  if (!href) {
    return <div className="cursor-not-allowed opacity-90">{content}</div>;
  }

  return (
    <Link href={href} aria-label={label}>
      {content}
    </Link>
  );
}

export default function AnalysisPage() {
  return (
    <PageShell
      sectionLabel="ANALYSIS"
      showEnterCode={false}
      contentClassName="min-h-screen px-7 pt-24 md:px-8"
    >
      <section className="skinstric-content-enter relative min-h-[calc(100vh-6rem)]">
        <div className="absolute left-0 top-0 z-20">
          <p className="skinstric-label">A. I. ANALYSIS</p>

          <p className="mt-6 max-w-xs text-[12px] font-semibold uppercase leading-relaxed tracking-[-0.02em] text-[#1a1a1a]">
            A. I. HAS ESTIMATED THE FOLLOWING.
            <br />
            FIX ESTIMATED INFORMATION IF NEEDED.
          </p>
        </div>

        <div className="absolute left-1/2 top-[45%] grid -translate-x-1/2 -translate-y-1/2 place-items-center">
          <div className="relative grid h-107.5 w-107.5 place-items-center md:h-130 md:w-130">
            <span className="diamond-frame rotate-slow w-107.5 opacity-70 md:w-130" />
            <span className="diamond-frame rotate-medium w-91.25 opacity-70 md:w-112.5" />
            <span className="diamond-frame rotate-fast w-76.25 opacity-70 md:w-95" />

            <div className="grid rotate-45 grid-cols-2 grid-rows-2 gap-1">
              <AnalysisTile
                label="DEMOGRAPHICS"
                href={ROUTES.demographics}
                className="bg-[#dddddd]"
              />

              <AnalysisTile label="COSMETIC CONCERNS" />

              <AnalysisTile label="SKIN TYPE DETAILS" />

              <AnalysisTile label="WEATHER" />
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
