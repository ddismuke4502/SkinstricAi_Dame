import Link from "next/link";

type AppHeaderProps = {
  showIntro?: boolean;
  showEnterCode?: boolean;
  sectionLabel?: string;
  tone?: "dark" | "light";
};

export function AppHeader({
  showIntro = true,
  showEnterCode = true,
  sectionLabel = "INTRO",
  tone = "dark",
}: AppHeaderProps) {
  const isLight = tone === "light";

  return (
    <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between px-7 py-5 md:px-8">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          aria-label="Go to Skinstric home"
          className={[
            "skinstric-label transition-opacity hover:opacity-60",
            isLight ? "text-white" : "text-[#1a1a1a]",
          ].join(" ")}
        >
          SKINSTRIC
        </Link>

        {showIntro && (
          <div
            className={[
              "hidden items-center gap-2 text-[12px] font-semibold uppercase leading-none md:flex",
              isLight ? "text-white/70" : "text-[#7c7c7c]",
            ].join(" ")}
          >
            <span className={isLight ? "text-white/50" : "text-[#b4b4b4]"}>
              [
            </span>
            <span>{sectionLabel}</span>
            <span className={isLight ? "text-white/50" : "text-[#b4b4b4]"}>
              ]
            </span>
          </div>
        )}
      </div>

      {showEnterCode && (
        <button
          type="button"
          className="bg-[#111] px-5 py-3 text-[10px] font-semibold uppercase leading-none text-white transition-opacity hover:opacity-80"
        >
          ENTER CODE
        </button>
      )}
    </header>
  );
}

export default AppHeader;