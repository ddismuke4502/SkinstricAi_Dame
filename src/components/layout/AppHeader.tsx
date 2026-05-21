"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type AppHeaderProps = {
  showIntro?: boolean;
  showEnterCode?: boolean;
  sectionLabel?: string;
  tone?: "dark" | "light";
};

export function AppHeader({
  showIntro = true,
  showEnterCode = false,
  sectionLabel = "INTRO",
  tone = "dark",
}: AppHeaderProps) {
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  const isLight = tone === "light";

  function handleCodeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedCode = accessCode.trim();

    if (!cleanedCode) return;

    window.localStorage.setItem("skinstric_access_code", cleanedCode);
    setIsCodeModalOpen(false);
    setAccessCode("");
  }

  return (
    <>
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
            onClick={() => setIsCodeModalOpen(true)}
            className="skinstric-enter-code-button"
          >
            ENTER CODE
          </button>
        )}
      </header>

      {isCodeModalOpen && (
        <div className="fixed inset-0 z-100 grid place-items-center bg-black/20 px-6">
          <form
            onSubmit={handleCodeSubmit}
            className="w-full max-w-90 bg-[#1a1a1a] text-white shadow-xl"
          >
            <div className="border-b border-white/30 px-5 py-5">
              <p className="text-[12px] font-semibold uppercase tracking-[-0.02em]">
                ENTER ACCESS CODE
              </p>
            </div>

            <div className="px-5 py-5">
              <input
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                autoFocus
                placeholder="Code"
                className="w-full border-b border-white/50 pb-2 text-[20px] font-normal uppercase tracking-[-0.04em] text-white placeholder:text-white/40"
              />
            </div>

            <div className="flex justify-end gap-8 border-t border-white/30 px-5 py-3">
              <button
                type="button"
                onClick={() => {
                  setIsCodeModalOpen(false);
                  setAccessCode("");
                }}
                className="text-[11px] font-semibold uppercase tracking-[-0.02em] text-white/70 transition-opacity hover:opacity-70"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="text-[11px] font-semibold uppercase tracking-[-0.02em] text-white transition-opacity hover:opacity-70"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default AppHeader;
