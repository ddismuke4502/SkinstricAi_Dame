"use client";

import DiamondButton from "@/components/ui/DiamondButton";

type BottomNavProps = {
  backHref?: string;
  proceedHref?: string;
  backLabel?: string;
  proceedLabel?: string;
  onBack?: () => void;
  onProceed?: () => void;
  showBack?: boolean;
  showProceed?: boolean;
  proceedDisabled?: boolean;
  className?: string;
};

export function BottomNav({
  backHref,
  proceedHref,
  backLabel = "BACK",
  proceedLabel = "PROCEED",
  onBack,
  onProceed,
  showBack = true,
  showProceed = true,
  proceedDisabled = false,
  className = "",
}: BottomNavProps) {
  return (
    <nav
      aria-label="Page navigation"
      className={[
        "pointer-events-none fixed bottom-8 left-0 z-40 flex w-full items-center justify-between px-7 md:px-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="pointer-events-auto skinstric-fade-in-up">
        {showBack && (
          <DiamondButton
            label={backLabel}
            direction="left"
            href={backHref}
            onClick={onBack}
            ariaLabel={backLabel}
          />
        )}
      </div>

      <div className="pointer-events-auto skinstric-fade-in-up">
        {showProceed && (
          <DiamondButton
            label={proceedLabel}
            direction="right"
            href={proceedHref}
            onClick={onProceed}
            disabled={proceedDisabled}
            ariaLabel={proceedLabel}
          />
        )}
      </div>
    </nav>
  );
}

export default BottomNav;