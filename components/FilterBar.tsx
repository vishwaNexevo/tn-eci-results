"use client";
import { Search, X } from "lucide-react";
import { partyMeta } from "@/lib/parties";
import { PartyTotals } from "@/lib/types";

export type SortKey = "seat" | "party" | "candidate";

export function FilterBar({
  query, setQuery,
  party, setParty,
  sort, setSort,
  parties,
  onClear,
  totalShown, totalAll,
}: {
  query: string; setQuery: (v: string) => void;
  party: string; setParty: (v: string) => void;
  sort: SortKey; setSort: (v: SortKey) => void;
  parties: PartyTotals[];
  onClear: () => void;
  totalShown: number; totalAll: number;
}) {
  const hasFilter = query !== "" || party !== "all";
  return (
    <div className="bg-white border border-line rounded-2xl shadow-card p-3 sm:p-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search constituency number or candidate name…"
            className="w-full rounded-lg border border-line bg-paper-soft pl-9 pr-9 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-paper-tint" aria-label="Clear">
              <X className="h-3.5 w-3.5 text-ink-muted" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={party}
            onChange={(e) => setParty(e.target.value)}
            className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="all">All parties ({parties.length})</option>
            {parties.map((p) => {
              const m = partyMeta(p.party, p.color);
              return (
                <option key={p.party} value={p.party}>
                  {m.short} — {p.count}
                </option>
              );
            })}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="seat">Sort: Seat #</option>
            <option value="party">Sort: Party</option>
            <option value="candidate">Sort: Candidate</option>
          </select>

          {hasFilter && (
            <button onClick={onClear} className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink-soft hover:bg-paper-tint">
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="mt-2 text-xs text-ink-muted">
        Showing <span className="font-semibold text-ink">{totalShown}</span> of {totalAll} constituencies
      </div>
    </div>
  );
}
