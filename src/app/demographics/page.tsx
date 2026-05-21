"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import { ROUTES } from "@/constants/routes";
import {
  DEMOGRAPHIC_CATEGORIES,
  formatCategoryLabel,
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

const CATEGORY_COPY: Record<DemographicCategory, string> = {
  race: "Predicted ethnicity confidence",
  age: "Predicted age confidence",
  gender: "Predicted gender confidence",
};

const EMPTY_SELECTIONS: ActualSelections = {
  race: "",
  age: "",
  gender: "",
};

function ActualSelectionCard({
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
        "w-full border px-4 py-4 text-left transition-colors",
        isActive
          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
          : "border-[#d8d8d8] bg-transparent text-[#1a1a1a] hover:bg-[#f1f1f1]",
      ].join(" ")}
    >
      <p className="text-[11px] font-semibold uppercase leading-none tracking-[-0.02em] opacity-70">
        {formatCategoryLabel(category)}
      </p>
      <p className="mt-3 text-[22px] font-normal leading-none tracking-[-0.06em]">
        {value ? formatDemographicLabel(value) : "Not selected"}
      </p>
    </button>
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
        "grid w-full grid-cols-[1fr_auto] items-center border-b border-[#d8d8d8] px-3 py-4 text-left transition-colors",
        isSelected ? "bg-[#1a1a1a] text-white" : "hover:bg-[#f1f1f1]",
      ].join(" ")}
    >
      <span className="text-[15px] font-semibold uppercase tracking-[-0.03em]">
        {formatDemographicLabel(score.label)}
      </span>

      <span className="text-[15px] font-semibold tracking-[-0.03em]">
        {score.percentage}
      </span>
    </button>
  );
}

export default function DemographicsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DemographicData | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<DemographicCategory>("race");
  const [actualSelections, setActualSelections] =
    useState<ActualSelections>(EMPTY_SELECTIONS);

  useEffect(() => {
  function loadStoredAnalysis() {
    const storedData = getDemographicsData();

    if (!hasDemographicData(storedData)) {
      setIsLoading(false);
      return;
    }

    const storedSelections = getActualSelections();
    const initialSelections =
      storedSelections ?? getInitialActualSelections(storedData);

    setData(storedData);
    setActualSelections(initialSelections);
    saveActualSelections(initialSelections);
    setIsLoading(false);
  }

  loadStoredAnalysis();
}, []);

  const scores = useMemo(() => {
    if (!data) return [];

    return getScoresByCategory(data, selectedCategory);
  }, [data, selectedCategory]);

  function handleScoreSelect(score: DemographicScore) {
    const updatedSelections = {
      ...actualSelections,
      [selectedCategory]: score.label,
    };

    setActualSelections(updatedSelections);
    saveActualSelections(updatedSelections);
  }

  if (isLoading) {
    return (
      <PageShell contentClassName="flex min-h-screen items-center justify-center">
        <p className="skinstric-muted-label">Loading analysis...</p>
      </PageShell>
    );
  }

  if (!data) {
    return (
      <PageShell contentClassName="min-h-screen px-7 pt-24 md:px-8">
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
          backHref={ROUTES.select}
          proceedHref={ROUTES.upload}
          proceedLabel="UPLOAD"
        />
      </PageShell>
    );
  }

  return (
    <PageShell contentClassName="min-h-screen px-7 pt-24 md:px-8">
      <section className="min-h-[calc(100vh-6rem)] pb-28">
        <div className="mb-10">
          <p className="skinstric-label">A.I. ANALYSIS</p>
          <h1 className="mt-4 text-[clamp(42px,6vw,72px)] font-normal leading-[0.9] tracking-[-0.075em]">
            Demographics
          </h1>
          <p className="mt-4 max-w-md text-[12px] font-semibold uppercase leading-relaxed tracking-[-0.02em] text-[#7c7c7c]">
            Predicted attributes are listed by confidence. Select the correct
            option to update your actual profile.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-3">
            <p className="skinstric-muted-label mb-4">ACTUAL PROFILE</p>

            {DEMOGRAPHIC_CATEGORIES.map((category) => (
              <ActualSelectionCard
                key={category}
                category={category}
                value={actualSelections[category]}
                isActive={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </aside>

          <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
            <div className="border border-[#d8d8d8] p-5">
              <p className="skinstric-muted-label mb-5">CATEGORIES</p>

              <div className="space-y-3">
                {DEMOGRAPHIC_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={[
                      "w-full border px-4 py-5 text-left transition-colors",
                      selectedCategory === category
                        ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                        : "border-[#d8d8d8] hover:bg-[#f1f1f1]",
                    ].join(" ")}
                  >
                    <p className="text-[13px] font-semibold uppercase tracking-[-0.02em]">
                      {formatCategoryLabel(category)}
                    </p>
                    <p className="mt-2 text-[11px] font-semibold uppercase leading-snug tracking-[-0.02em] opacity-60">
                      {CATEGORY_COPY[category]}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-[#d8d8d8]">
              <div className="flex items-center justify-between border-b border-[#d8d8d8] px-5 py-4">
                <div>
                  <p className="skinstric-muted-label">SELECTED CATEGORY</p>
                  <h2 className="mt-2 text-[28px] font-normal uppercase leading-none tracking-[-0.06em]">
                    {formatCategoryLabel(selectedCategory)}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="skinstric-muted-label">ACTUAL</p>
                  <p className="mt-2 text-[18px] font-semibold uppercase leading-none tracking-[-0.04em]">
                    {formatDemographicLabel(actualSelections[selectedCategory])}
                  </p>
                </div>
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
            </div>
          </div>
        </div>
      </section>

      <BottomNav
        backHref={ROUTES.select}
        proceedHref={ROUTES.home}
        proceedLabel="HOME"
      />
    </PageShell>
  );
}