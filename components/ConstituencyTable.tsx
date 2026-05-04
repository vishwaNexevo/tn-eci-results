"use client";
import { Constituency } from "@/lib/types";
import { partyMeta } from "@/lib/parties";
import { PartyBadge } from "./PartyBadge";

export function ConstituencyTable({
  rows,
  changedSeats,
}: {
  rows: Constituency[];
  changedSeats: Set<number>;
}) {
  if (rows.length === 0) {
    return (
      <div className="bg-white border border-line rounded-2xl p-10 text-center text-ink-muted">
        No constituencies match your filters.
      </div>
    );
  }
  return (
    <div className="bg-white border border-line rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto scroll-thin">
        <table className="min-w-full text-sm">
          <thead className="bg-paper-soft text-ink-soft">
            <tr>
              <th className="px-3 sm:px-4 py-3 text-left font-semibold w-16">#</th>
              <th className="px-3 sm:px-4 py-3 text-left font-semibold">Constituency</th>
              <th className="px-3 sm:px-4 py-3 text-left font-semibold">Leading Candidate</th>
              <th className="px-3 sm:px-4 py-3 text-left font-semibold">Party</th>
              <th className="px-3 sm:px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const m = partyMeta(c.party, c.color);
              const flash = changedSeats.has(c.seat);
              return (
                <tr
                  key={c.seat}
                  className={`border-t border-line hover:bg-paper-soft/60 ${flash ? "animate-flash" : ""}`}
                >
                  <td className="px-3 sm:px-4 py-3 tabular-nums font-semibold text-ink">{c.seat}</td>
                  <td className="px-3 sm:px-4 py-3 text-ink-soft">AC {String(c.seat).padStart(3, "0")}</td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="font-medium text-ink">{c.candidate}</div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PartyBadge party={c.party} color={c.color} size="sm" />
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                        style={{ background: `${m.color}1A`, color: m.color }}
                        title={m.full}
                      >
                        {m.short}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulseDot" /> Leading
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
