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

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as
    | T
    | ApiErrorPayload
    | null;

  if (!response.ok) {
    const message =
      data && "message" in data && data.message
        ? data.message
        : data && "error" in data && data.error
          ? data.error
          : "Something went wrong. Please try again.";

    throw new Error(message);
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