"use client";
import { useEffect, useState } from "react";

export function LiveUpdateIndicator({ lastUpdated, refreshing }: { lastUpdated: number | null; refreshing: boolean }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const ago = lastUpdated ? Math.max(0, Math.floor((Date.now() - lastUpdated) / 1000)) : null;

  return (
    <div className="flex items-center gap-2 text-xs text-ink-muted">
      <span className="relative flex h-2.5 w-2.5">
        <span className={`absolute inline-flex h-full w-full rounded-full ${refreshing ? "bg-amber-400" : "bg-emerald-500"} opacity-60 animate-pulseDot`} />
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${refreshing ? "bg-amber-500" : "bg-emerald-600"}`} />
      </span>
      <span className="font-medium uppercase tracking-wider text-ink-soft">
        {refreshing ? "Updating…" : "Live"}
      </span>
      {ago !== null && (
        <span className="text-ink-muted">· updated {ago < 5 ? "just now" : `${ago}s ago`}</span>
      )}
    </div>
  );
}
