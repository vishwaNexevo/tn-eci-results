"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { ApiResponse, NormalizedResults } from "./types";
import { normalize } from "./normalize";

interface State {
  data: NormalizedResults | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  refreshing: boolean;
}

export function useLiveResults(intervalMs = 20000) {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
    refreshing: false,
  });
  const aliveRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchOnce = useCallback(async (isManual = false) => {
    if (!aliveRef.current) return;
    setState((s) => ({ ...s, refreshing: true, error: isManual ? null : s.error }));
    try {
      const res = await fetch("/api/results", { cache: "no-store" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | {
              error?: string;
              upstreamStatus?: number | null;
              region?: string | null;
            }
          | null;

        const message = payload?.error
          ? payload.upstreamStatus
            ? `${payload.error} (${payload.upstreamStatus}${payload.region ? `, ${payload.region}` : ""})`
            : payload.error
          : `HTTP ${res.status}`;

        throw new Error(message);
      }
      const json = (await res.json()) as ApiResponse;
      const normalized = normalize(json, "S22");
      if (!aliveRef.current) return;
      setState({
        data: normalized,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
        refreshing: false,
      });
    } catch (e) {
      if (!aliveRef.current) return;
      setState((s) => ({
        ...s,
        loading: false,
        refreshing: false,
        error: e instanceof Error ? e.message : "Failed to load",
      }));
    }
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    fetchOnce();
    const tick = () => {
      timerRef.current = setTimeout(async () => {
        await fetchOnce();
        tick();
      }, intervalMs);
    };
    tick();
    return () => {
      aliveRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fetchOnce, intervalMs]);

  return { ...state, refresh: () => fetchOnce(true) };
}
