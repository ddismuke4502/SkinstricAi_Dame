import type {
  ActualSelections,
  DemographicCategory,
  DemographicData,
  DemographicScore,
  DemographicScoreMap,
} from "@/types/skinstric";

export const DEMOGRAPHIC_CATEGORIES: DemographicCategory[] = [
  "race",
  "age",
  "gender",
];

export function formatCategoryLabel(category: DemographicCategory): string {
  return category.toUpperCase();
}

export function formatDemographicLabel(label: string): string {
  return label
    .split(" ")
    .map((word) => {
      if (word.includes("-") || word.includes("+")) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function formatScore(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function sortDemographicScores(
  scoreMap: DemographicScoreMap
): DemographicScore[] {
  return Object.entries(scoreMap)
    .map(([label, value]) => ({
      label,
      value,
      percentage: formatScore(value),
    }))
    .sort((a, b) => b.value - a.value);
}

export function getTopDemographicLabel(scoreMap: DemographicScoreMap): string {
  const [topScore] = sortDemographicScores(scoreMap);

  return topScore?.label ?? "";
}

export function getInitialActualSelections(
  data: DemographicData
): ActualSelections {
  return {
    race: getTopDemographicLabel(data.race),
    age: getTopDemographicLabel(data.age),
    gender: getTopDemographicLabel(data.gender),
  };
}

export function getScoresByCategory(
  data: DemographicData,
  category: DemographicCategory
): DemographicScore[] {
  return sortDemographicScores(data[category]);
}

export function hasDemographicData(
  data: DemographicData | null | undefined
): data is DemographicData {
  return Boolean(data?.race && data?.age && data?.gender);
}