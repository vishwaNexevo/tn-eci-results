"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLiveResults } from "@/lib/useLiveResults";
import { NormalizedResults } from "@/lib/types";
import { ResultHeader } from "./ResultHeader";
import { SummaryCards } from "./SummaryCards";
import { PartyCard } from "./PartyCard";
import { PartyChart } from "./PartyChart";
import { ConstituencyTable } from "./ConstituencyTable";
import { FilterBar, SortKey } from "./FilterBar";
import { Comparison } from "./Comparison";

export function Dashboard({ initialData }: { initialData: NormalizedResults | null }) {
  const live = useLiveResults(20000);
  // Hydrate with SSR data on first paint, then live updates take over.
  const data = live.data ?? initialData;
  const lastUpdated = live.lastUpdated ?? initialData?.fetchedAt ?? null;

  const [query, setQuery] = useState("");
  const [party, setParty] = useState("all");
  const [sort, setSort] = useState<SortKey>("seat");

  // Track which seats changed party between refreshes for flash animation.
  const prevRef = useRef<Map<number, string>>(new Map());
  const [changed, setChanged] = useState<Set<number>>(new Set());
  useEffect(() => {
    if (!data) return;
    const next = new Map<number, string>();
    const ch = new Set<number>();
    for (const c of data.constituencies) {
      next.set(c.seat, c.party);
      const prev = prevRef.current.get(c.seat);
      if (prev !== undefined && prev !== c.party) ch.add(c.seat);
    }
    if (prevRef.current.size > 0 && ch.size > 0) {
      setChanged(ch);
      const t = setTimeout(() => setChanged(new Set()), 1800);
      return () => clearTimeout(t);
    }
    prevRef.current = next;
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    let rows = data.constituencies.filter((c) => {
      const partyOk = party === "all" || c.party === party;
      if (!partyOk) return false;
      if (!q) return true;
      return (
        c.candidate.toLowerCase().includes(q) ||
        String(c.seat).includes(q) ||
        c.party.toLowerCase().includes(q)
      );
    });
    rows = [...rows].sort((a, b) => {
      if (sort === "seat") return a.seat - b.seat;
      if (sort === "party") return a.party.localeCompare(b.party) || a.seat - b.seat;
      return a.candidate.localeCompare(b.candidate);
    });
    return rows;
  }, [data, query, party, sort]);

  return (
    <div className="min-h-screen bg-paper-soft">
      <ResultHeader lastUpdated={lastUpdated} refreshing={live.refreshing} onRefresh={live.refresh} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {!data && live.loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white border border-line animate-pulse" />
            ))}
          </div>
        )}

        {live.error && !data && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="text-red-700 font-semibold">Couldn't load results</div>
            <p className="text-red-600 text-sm mt-1">{live.error}</p>
            <button onClick={live.refresh} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 text-white px-3 py-1.5 text-sm">
              Try again
            </button>
          </div>
        )}

        {data && (
          <>
            <SummaryCards data={data} />

            <section>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-ink">Party-wise Overview</h2>
                  <p className="text-xs text-ink-muted">All parties currently leading or won at least one seat.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {data.parties.map((p) => (
                  <PartyCard key={p.party} party={p} totalSeats={data.totalSeats} majority={data.majority} />
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PartyChart data={data} />
              <Comparison data={data} />
            </section>

            <section>
              <div className="mb-3">
                <h2 className="text-lg font-bold text-ink">Constituency Results</h2>
                <p className="text-xs text-ink-muted">Live leading candidate for every Tamil Nadu Assembly constituency.</p>
              </div>
              <div className="space-y-3">
                <FilterBar
                  query={query} setQuery={setQuery}
                  party={party} setParty={setParty}
                  sort={sort} setSort={setSort}
                  parties={data.parties}
                  totalShown={filtered.length} totalAll={data.constituencies.length}
                  onClear={() => { setQuery(""); setParty("all"); }}
                />
                <ConstituencyTable rows={filtered} changedSeats={changed} />
              </div>
            </section>

            <footer className="pt-4 pb-10 text-center text-xs text-ink-muted">
              Data sourced live from the{" "}
              <a className="underline hover:text-ink" href="https://results.eci.gov.in" target="_blank" rel="noopener noreferrer">
                Election Commission of India
              </a>
              . This dashboard is for informational purposes only.
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
