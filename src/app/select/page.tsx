import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import DiamondButton from "@/components/ui/DiamondButton";
import RotatingDiamond from "@/components/ui/RotatingDiamond";
import { ROUTES } from "@/constants/routes";

export default function SelectPage() {
  return (
    <PageShell contentClassName="min-h-screen px-7 pt-24 md:px-8">
      <section className="relative min-h-[calc(100vh-6rem)]">
        <div className="absolute left-0 top-0">
          <p className="skinstric-label">TO START ANALYSIS</p>
        </div>

        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
          <div className="relative flex w-full max-w-6xl items-center justify-center">
            <div className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
              <DiamondButton
                label="TAKE SELFIE"
                href={ROUTES.camera}
                direction="left"
              />
            </div>

            <RotatingDiamond size="lg">
              <p className="skinstric-muted-label mb-4">PREPARE YOUR</p>
              <h1 className="skinstric-section-title">
                Analysis
                <br />
                method
              </h1>

              <div className="mt-12 flex flex-col items-center gap-7 lg:hidden">
                <DiamondButton
                  label="TAKE SELFIE"
                  href={ROUTES.camera}
                  direction="left"
                />

                <DiamondButton
                  label="UPLOAD IMAGE"
                  href={ROUTES.upload}
                  direction="right"
                />
              </div>
            </RotatingDiamond>

            <div className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
              <DiamondButton
                label="UPLOAD IMAGE"
                href={ROUTES.upload}
                direction="right"
              />
            </div>
          </div>
        </div>
      </section>

      <BottomNav
        backHref={ROUTES.testing}
        showBack
        showProceed={false}
      />
    </PageShell>
  );
}