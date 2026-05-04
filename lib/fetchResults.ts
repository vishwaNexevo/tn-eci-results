import { ApiResponse, NormalizedResults } from "./types";
import { normalize } from "./normalize";

const ECI_URL =
  "https://results.eci.gov.in/ResultAcGenMay2026/election-json-S22-live.json";

// Server-side fetch used by SSR + the API proxy route.
export async function fetchResultsServer(): Promise<NormalizedResults | null> {
  try {
    const res = await fetch(ECI_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiResponse;
    return normalize(json, "S22");
  } catch {
    return null;
  }
}
