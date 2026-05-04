"use client";
import { RefreshCw } from "lucide-react";
import { LiveUpdateIndicator } from "./LiveUpdateIndicator";

export function ResultHeader({
  lastUpdated,
  refreshing,
  onRefresh,
}: {
  lastUpdated: number | null;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <header className="bg-white border-b border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand to-brand-accent flex items-center justify-center text-white font-black shadow-card">
            TN
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-ink leading-tight">
              Tamil Nadu Assembly Election Results <span className="text-brand">2026</span>
            </h1>
            <p className="text-sm text-ink-muted mt-0.5">
              Source: Election Commission of India · Live constituency-wise updates
            </p>
            <div className="mt-2"><LiveUpdateIndicator lastUpdated={lastUpdated} refreshing={refreshing} /></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg bg-ink text-white px-3.5 py-2 text-sm font-medium hover:bg-ink-soft disabled:opacity-60 transition"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
}
