import type {
  ActualSelections,
  CustomerProfile,
  DemographicData,
} from "@/types/skinstric";

const STORAGE_KEYS = {
  customerProfile: "skinstric_customer_profile",
  demographicsData: "skinstric_demographics_data",
  actualSelections: "skinstric_actual_selections",
} as const;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getItem<T>(key: string): T | null {
  if (!canUseStorage()) return null;

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!canUseStorage()) return;

  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key: string): void {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(key);
}

export function saveCustomerProfile(profile: CustomerProfile): void {
  setItem(STORAGE_KEYS.customerProfile, profile);
}

export function getCustomerProfile(): CustomerProfile | null {
  return getItem<CustomerProfile>(STORAGE_KEYS.customerProfile);
}

export function saveDemographicsData(data: DemographicData): void {
  setItem(STORAGE_KEYS.demographicsData, data);
}

export function getDemographicsData(): DemographicData | null {
  return getItem<DemographicData>(STORAGE_KEYS.demographicsData);
}

export function saveActualSelections(selections: ActualSelections): void {
  setItem(STORAGE_KEYS.actualSelections, selections);
}

export function getActualSelections(): ActualSelections | null {
  return getItem<ActualSelections>(STORAGE_KEYS.actualSelections);
}

export function clearSkinstricSession(): void {
  removeItem(STORAGE_KEYS.customerProfile);
  removeItem(STORAGE_KEYS.demographicsData);
  removeItem(STORAGE_KEYS.actualSelections);
}