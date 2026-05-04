import { ApiResponse } from "./types";

export const ECI_URL =
  "https://results.eci.gov.in/ResultAcGenMay2026/election-json-S22-live.json";

const REQUEST_TIMEOUT_MS = 10_000;
const REQUEST_HEADERS = {
  Accept: "application/json,text/plain,*/*",
  "Accept-Language": "en-IN,en;q=0.9",
  Referer: "https://results.eci.gov.in/ResultAcGenMay2026/partywiseleadresult-75S22.htm",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
} as const;

export class EciUpstreamError extends Error {
  status?: number;
  statusText?: string;
  bodySnippet?: string;

  constructor(
    message: string,
    options?: {
      status?: number;
      statusText?: string;
      bodySnippet?: string;
      cause?: unknown;
    },
  ) {
    super(message);
    this.name = "EciUpstreamError";
    this.status = options?.status;
    this.statusText = options?.statusText;
    this.bodySnippet = options?.bodySnippet;
    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

export function getExecutionRegion() {
  return process.env.VERCEL_REGION ?? "local";
}

export function getEciErrorMeta(error: unknown) {
  if (error instanceof EciUpstreamError) {
    return {
      message: error.message,
      status: error.status ?? null,
      statusText: error.statusText ?? null,
      bodySnippet: error.bodySnippet ?? null,
      region: getExecutionRegion(),
    };
  }

  return {
    message: error instanceof Error ? error.message : "Unknown upstream error",
    status: null,
    statusText: null,
    bodySnippet: null,
    region: getExecutionRegion(),
  };
}

export async function fetchEciResults(): Promise<ApiResponse> {
  let response: Response;

  try {
    response = await fetch(ECI_URL, {
      cache: "no-store",
      headers: REQUEST_HEADERS,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new EciUpstreamError("ECI upstream request failed", { cause: error });
  }

  if (!response.ok) {
    const bodySnippet = (await response.text()).replace(/\s+/g, " ").trim().slice(0, 240);
    throw new EciUpstreamError(
      `ECI upstream returned ${response.status} ${response.statusText}`,
      {
        status: response.status,
        statusText: response.statusText,
        bodySnippet,
      },
    );
  }

  return (await response.json()) as ApiResponse;
}
