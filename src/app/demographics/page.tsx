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
        "skinstric-sidebar-card",
        isActive ? "skinstric-sidebar-card-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-[13px] font-semibold uppercase leading-none tracking-[-0.03em]">
        {value ? formatDemographicLabel(value) : "Not selected"}
      </p>

      <p className="mt-8 text-[12px] font-semibold uppercase leading-none tracking-[-0.02em] opacity-90">
        {CATEGORY_DISPLAY[category]}
      </p>
    </button>
  );
}

function ConfidenceCircle({ percentage }: { percentage: string }) {
  const cleanPercentage = percentage.replace("%", "");

  return (
    <div className="skinstric-confidence-circle relative grid h-64 w-64 place-items-center rounded-full border-[3px] border-[#1a1a1a] md:h-77.5 md:w-77.5">
      <p className="skinstric-confidence-value text-[46px] font-normal leading-none tracking-[-0.07em] md:text-[54px]">
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
        "skinstric-score-row",
        isSelected ? "skinstric-score-row-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
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
        "skinstric-action-button",
        variant === "dark"
          ? "skinstric-action-button-dark"
          : "skinstric-action-button-light",
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
      showEnterCode={false}
      contentClassName="min-h-screen px-4 pt-[88px] md:px-8"
    >
      <section className="skinstric-demographics-shell">
        <div className="mb-8 md:mb-14.5">
          <p className="skinstric-label">A. I. ANALYSIS</p>

          <h1 className="skinstric-mobile-page-title mt-3 font-normal uppercase md:text-[clamp(54px,5.8vw,72px)]">
            Demographics
          </h1>

          <p className="mt-4 text-[13px] font-semibold uppercase tracking-[-0.02em]">
            Predicted race &amp; age
          </p>
        </div>

        <div className="skinstric-demographics-grid">
          <aside className="skinstric-demographics-sidebar">
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

          <main className="skinstric-demographics-main">
            <h2 className="skinstric-demographics-main-title text-[32px] font-normal leading-none tracking-[-0.07em] md:text-[40px]">
              {formatDemographicLabel(selectedScore.label)}
              {selectedCategory === "age" ? " y.o." : ""}
            </h2>

            <div className="flex min-h-70 items-center justify-center md:min-h-92.5">
              <ConfidenceCircle percentage={selectedScore.percentage} />
            </div>
          </main>

          <aside className="skinstric-demographics-list">
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

        <p className="mt-9 text-center text-[12px] font-normal tracking-[-0.02em] text-[#9a9a9a]">
          If A.I. estimate is wrong, select the correct one.
        </p>
      </section>

      <BottomNav backHref={ROUTES.analysis} showBack showProceed={false} />

      <div className="skinstric-demographics-actions fixed bottom-8 right-8 z-50 flex items-center gap-3">
        <ActionButton label="RESET" onClick={handleReset} />
        <ActionButton label="CONFIRM" variant="dark" onClick={handleConfirm} />
      </div>
    </PageShell>
  );
}
