"use client";
import { NormalizedResults } from "@/lib/types";
import { partyMeta } from "@/lib/parties";

export function PartyChart({ data }: { data: NormalizedResults }) {
  const parties = data.parties;
  const max = Math.max(...parties.map((p) => p.count), data.majority, 1);

  return (
    <div className="bg-white border border-line rounded-2xl shadow-card p-4 sm:p-6">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="font-semibold text-ink">Seat Tally Chart</h3>
          <p className="text-xs text-ink-muted">Leading + won seats by party · Majority mark = {data.majority}</p>
        </div>
      </div>
      <div className="space-y-3">
        {parties.map((p) => {
          const m = partyMeta(p.party, p.color);
          const pct = (p.count / max) * 100;
          const majPct = (data.majority / max) * 100;
          return (
            <div key={p.party}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-ink-soft">{m.short}</span>
                <span className="tabular-nums font-semibold text-ink">{p.count}</span>
              </div>
              <div className="relative h-5 rounded-md bg-paper-tint overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-md transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                  style={{ width: `${pct}%`, background: m.color }}
                />
                <div className="absolute top-0 bottom-0 w-px bg-ink/40" style={{ left: `${majPct}%` }} title="Majority" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
