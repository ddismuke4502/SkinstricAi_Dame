"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import { ROUTES } from "@/constants/routes";
import {
  DEMOGRAPHIC_CATEGORIES,
  formatDemographicLabel,
  getInitialActualSelections,
  getScoresByCategory,
  hasDemographicData,
} from "@/lib/demographics";
import {
  getActualSelections,
  getDemographicsData,
  saveActualSelections,
} from "@/lib/storage";
import type {
  ActualSelections,
  DemographicCategory,
  DemographicData,
  DemographicScore,
} from "@/types/skinstric";

const EMPTY_SELECTIONS: ActualSelections = {
  race: "",
  age: "",
  gender: "",
};

const CATEGORY_DISPLAY: Record<DemographicCategory, string> = {
  race: "RACE",
  age: "AGE",
  gender: "SEX",
};

function SidebarSelection({
  category,
  value,
  isActive,
  onClick,
}: {
  category: DemographicCategory;
  value: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full px-5 py-4 text-left transition-colors",
        isActive
          ? "bg-[#1a1a1a] text-white"
          : "bg-[#f1f1f1] text-[#1a1a1a] hover:bg-[#e5e5e5]",
      ].join(" ")}
    >
      <p className="text-[13px] font-semibold uppercase tracking-[-0.03em]">
        {value ? formatDemographicLabel(value) : "Not selected"}
      </p>

      <p className="mt-7 text-[12px] font-semibold uppercase tracking-[-0.02em] opacity-80">
        {CATEGORY_DISPLAY[category]}
      </p>
    </button>
  );
}

function ConfidenceCircle({ percentage }: { percentage: string }) {
  const cleanPercentage = percentage.replace("%", "");

  return (
    <div className="relative grid h-64 w-64 place-items-center rounded-full border-[3px] border-[#1a1a1a] md:h-80 md:w-80">
      <p className="text-[48px] font-normal leading-none tracking-[-0.07em] md:text-[58px]">
        {cleanPercentage}
        <span className="align-super text-[20px] tracking-normal md:text-[24px]">
          %
        </span>
      </p>
    </div>
  );
}

function ScoreRow({
  score,
  isSelected,
  onClick,
}: {
  score: DemographicScore;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "grid w-full grid-cols-[1fr_auto] items-center px-4 py-3 text-left transition-colors",
        isSelected ? "bg-[#1a1a1a] text-white" : "hover:bg-[#e1e1e1]",
      ].join(" ")}
    >
      <span className="flex items-center gap-3 text-[13px] font-normal tracking-[-0.02em]">
        <span className="text-[12px]">◇</span>
        {formatDemographicLabel(score.label)}
      </span>

      <span className="text-[13px] font-normal tracking-[-0.02em]">
        {score.percentage}
      </span>
    </button>
  );
}

function ActionButton({
  label,
  variant = "light",
  onClick,
}: {
  label: string;
  variant?: "light" | "dark";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "min-w-24 border px-5 py-3 text-[12px] font-semibold uppercase leading-none tracking-[-0.02em] transition-opacity hover:opacity-70",
        variant === "dark"
          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
          : "border-[#1a1a1a] bg-transparent text-[#1a1a1a]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function DemographicsPage() {
  const router = useRouter();

  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);
  const [data, setData] = useState<DemographicData | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<DemographicCategory>("race");
  const [actualSelections, setActualSelections] =
    useState<ActualSelections>(EMPTY_SELECTIONS);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storedData = getDemographicsData();

    if (hasDemographicData(storedData)) {
      const storedSelections = getActualSelections();
      const initialSelections =
        storedSelections ?? getInitialActualSelections(storedData);

      setData(storedData);
      setActualSelections(initialSelections);
      saveActualSelections(initialSelections);
    }

    setHasLoadedStorage(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const scores = useMemo(() => {
    if (!data) return [];

    return getScoresByCategory(data, selectedCategory);
  }, [data, selectedCategory]);

  const selectedScore = useMemo(() => {
    const selectedLabel = actualSelections[selectedCategory];

    return (
      scores.find((score) => score.label === selectedLabel) ??
      scores[0] ?? {
        label: "",
        value: 0,
        percentage: "0.00%",
      }
    );
  }, [actualSelections, scores, selectedCategory]);

  function handleScoreSelect(score: DemographicScore) {
    const updatedSelections = {
      ...actualSelections,
      [selectedCategory]: score.label,
    };

    setActualSelections(updatedSelections);
    saveActualSelections(updatedSelections);
  }

  function handleReset() {
    if (!data) return;

    const initialSelections = getInitialActualSelections(data);

    setActualSelections(initialSelections);
    saveActualSelections(initialSelections);
  }

  function handleConfirm() {
    saveActualSelections(actualSelections);
    router.push(ROUTES.analysis);
  }

  if (!hasLoadedStorage) {
    return (
      <PageShell
        sectionLabel="ANALYSIS"
        contentClassName="flex min-h-screen items-center justify-center"
      >
        <p className="skinstric-muted-label">Loading analysis...</p>
      </PageShell>
    );
  }

  if (!data) {
    return (
      <PageShell
        sectionLabel="ANALYSIS"
        contentClassName="min-h-screen px-7 pt-24 md:px-8"
      >
        <section className="flex min-h-[calc(100vh-6rem)] items-center justify-center text-center">
          <div>
            <p className="skinstric-muted-label mb-4">NO ANALYSIS FOUND</p>
            <h1 className="skinstric-section-title">
              Upload
              <br />
              required
            </h1>
            <p className="mx-auto mt-6 max-w-sm text-[12px] font-semibold uppercase leading-relaxed tracking-[-0.02em] text-[#7c7c7c]">
              Please upload an image or take a selfie before viewing demographic
              results.
            </p>
          </div>
        </section>

        <BottomNav
          backHref={ROUTES.analysis}
          proceedHref={ROUTES.upload}
          proceedLabel="UPLOAD"
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      sectionLabel="ANALYSIS"
      contentClassName="min-h-screen px-7 pt-24 md:px-8"
    >
      <section className="min-h-[calc(100vh-6rem)] pb-32">
        <div className="mb-16">
          <p className="skinstric-label">A.I. ANALYSIS</p>

          <h1 className="mt-3 text-[clamp(54px,7vw,86px)] font-normal uppercase leading-[0.86] tracking-[-0.075em]">
            Demographics
          </h1>

          <p className="mt-5 text-[13px] font-semibold uppercase tracking-[-0.02em]">
            Predicted race &amp; age
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[190px_1fr_360px]">
          <aside className="space-y-2">
            {DEMOGRAPHIC_CATEGORIES.map((category) => (
              <SidebarSelection
                key={category}
                category={category}
                value={actualSelections[category]}
                isActive={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </aside>

          <main className="min-h-97.5 border-t-2 border-[#1a1a1a] bg-[#f1f1f1] px-5 py-6 md:min-h-120">
            <h2 className="text-[32px] font-normal leading-none tracking-[-0.06em] md:text-[42px]">
              {formatDemographicLabel(selectedScore.label)}
              {selectedCategory === "age" ? " y.o." : ""}
            </h2>

            <div className="flex min-h-75 items-center justify-center md:min-h-95">
              <ConfidenceCircle percentage={selectedScore.percentage} />
            </div>
          </main>

          <aside className="border-t-2 border-[#1a1a1a] bg-[#f1f1f1]">
            <div className="grid grid-cols-[1fr_auto] px-4 py-4">
              <p className="text-[14px] font-normal uppercase tracking-[-0.03em]">
                {CATEGORY_DISPLAY[selectedCategory] === "SEX"
                  ? "SEX"
                  : CATEGORY_DISPLAY[selectedCategory]}
              </p>

              <p className="text-[14px] font-normal uppercase tracking-[-0.03em]">
                A.I. CONFIDENCE
              </p>
            </div>

            <div>
              {scores.map((score) => (
                <ScoreRow
                  key={score.label}
                  score={score}
                  isSelected={
                    actualSelections[selectedCategory] === score.label
                  }
                  onClick={() => handleScoreSelect(score)}
                />
              ))}
            </div>
          </aside>
        </div>

        <p className="mt-10 text-center text-[12px] font-normal tracking-[-0.02em] text-[#9a9a9a]">
          If A.I. estimate is wrong, select the correct one.
        </p>
      </section>

      <BottomNav backHref={ROUTES.analysis} showBack showProceed={false} />

      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
        <ActionButton label="RESET" onClick={handleReset} />
        <ActionButton label="CONFIRM" variant="dark" onClick={handleConfirm} />
      </div>
    </PageShell>
  );
}
