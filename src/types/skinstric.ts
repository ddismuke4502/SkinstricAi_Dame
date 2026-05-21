export type PhaseOnePayload = {
  name: string;
  location: string;
};

export type PhaseOneResponse = {
  SUCCUSS?: string;
  SUCCESS?: string;
  message?: string;
};

export type DemographicScoreMap = Record<string, number>;

export type DemographicCategory = "race" | "age" | "gender";

export type DemographicData = {
  race: DemographicScoreMap;
  age: DemographicScoreMap;
  gender: DemographicScoreMap;
};

export type PhaseTwoPayload = {
  image: string;
};

export type PhaseTwoResponse = {
  message: string;
  data: DemographicData;
};

export type DemographicScore = {
  label: string;
  value: number;
  percentage: string;
};

export type ActualSelections = {
  race: string;
  age: string;
  gender: string;
};

export type CustomerProfile = {
  name: string;
  location: string;
};