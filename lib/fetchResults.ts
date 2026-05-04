import { NormalizedResults } from "./types";
import { fetchEciResults, getEciErrorMeta } from "./eci";
import { normalize } from "./normalize";

// Server-side fetch used by SSR + the API proxy route.
export async function fetchResultsServer(): Promise<NormalizedResults | null> {
  try {
    const json = await fetchEciResults();
    return normalize(json, "S22");
  } catch (error) {
    console.error("[fetchResultsServer] failed to fetch ECI results", getEciErrorMeta(error));
    return null;
  }
}
