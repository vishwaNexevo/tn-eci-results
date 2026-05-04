"use client";
import { PartyTotals } from "@/lib/types";
import { partyMeta, withAlpha } from "@/lib/parties";
import { PartyBadge } from "./PartyBadge";

export function PartyCard({
  party,
  totalSeats,
  majority,
}: {
  party: PartyTotals;
  totalSeats: number;
  majority: number;
}) {
  const meta = partyMeta(party.party, party.color);
  const pct = totalSeats > 0 ? (party.count / totalSeats) * 100 : 0;
  const majorityPct = totalSeats > 0 ? (majority / totalSeats) * 100 : 50;
  const crossed = party.count >= majority;

  return (
    <div
      className="bg-white rounded-2xl border border-line shadow-card p-4 transition hover:shadow-md"
      style={{ borderTop: `3px solid ${meta.color}` }}
    >
      <div className="flex items-center gap-3">
        <PartyBadge party={party.party} color={party.color} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-ink truncate" title={meta.full}>{meta.short}</div>
          <div className="text-[11px] text-ink-muted truncate">{meta.full}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-ink tabular-nums leading-none">{party.count}</div>
          <div className="text-[10px] uppercase text-ink-muted tracking-wider">Leading/Won</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: withAlpha(meta.color, 0.12) }}>
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: meta.color }}
          />
          <div
            className="absolute top-[-3px] bottom-[-3px] w-px bg-ink/40"
            style={{ left: `${majorityPct}%` }}
            title={`Majority mark (${majority})`}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-muted">
          <span>{pct.toFixed(1)}% of seats</span>
          {crossed ? (
            <span className="font-semibold text-emerald-700">Majority crossed ✓</span>
          ) : (
            <span>Needs {Math.max(majority - party.count, 0)} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
