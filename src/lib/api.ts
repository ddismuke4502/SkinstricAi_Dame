import type {
  PhaseOnePayload,
  PhaseOneResponse,
  PhaseTwoPayload,
  PhaseTwoResponse,
} from "@/types/skinstric";

const PHASE_ONE_ENDPOINT =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne";

const PHASE_TWO_ENDPOINT =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo";

type ApiErrorPayload = {
  message?: string;
  error?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getApiErrorMessage(data: unknown): string {
  if (!isRecord(data)) {
    return "Something went wrong. Please try again.";
  }

  const message = data.message;
  const error = data.error;

  if (typeof message === "string" && message.length > 0) {
    return message;
  }

  if (typeof error === "string" && error.length > 0) {
    return error;
  }

  return "Something went wrong. Please try again.";
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as T | ApiErrorPayload | null;

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data));
  }

  if (!data) {
    throw new Error("The server returned an empty response.");
  }

  return data as T;
}

export async function submitPhaseOneProfile(
  payload: PhaseOnePayload
): Promise<PhaseOneResponse> {
  const response = await fetch(PHASE_ONE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<PhaseOneResponse>(response);
}

export async function submitPhaseTwoImage(
  payload: PhaseTwoPayload
): Promise<PhaseTwoResponse> {
  const response = await fetch(PHASE_TWO_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<PhaseTwoResponse>(response);
}