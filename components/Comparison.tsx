"use client";
import { useMemo, useState } from "react";
import { NormalizedResults } from "@/lib/types";
import { partyMeta, withAlpha } from "@/lib/parties";

export function Comparison({ data }: { data: NormalizedResults }) {
  const top = data.parties.slice(0, 6);
  const [a, setA] = useState(top[0]?.party ?? "");
  const [b, setB] = useState(top[1]?.party ?? "");

  const pa = useMemo(() => data.parties.find((p) => p.party === a), [data, a]);
  const pb = useMemo(() => data.parties.find((p) => p.party === b), [data, b]);

  if (!pa || !pb) return null;
  const ma = partyMeta(pa.party, pa.color);
  const mb = partyMeta(pb.party, pb.color);
  const total = pa.count + pb.count || 1;
  const pctA = (pa.count / total) * 100;

  return (
    <div className="bg-white border border-line rounded-2xl shadow-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-semibold text-ink">Head-to-Head Comparison</h3>
        <div className="flex gap-2">
          <select value={a} onChange={(e) => setA(e.target.value)} className="rounded-md border border-line bg-white px-2 py-1 text-xs">
            {data.parties.map((p) => <option key={p.party} value={p.party}>{partyMeta(p.party, p.color).short}</option>)}
          </select>
          <span className="text-ink-muted text-xs self-center">vs</span>
          <select value={b} onChange={(e) => setB(e.target.value)} className="rounded-md border border-line bg-white px-2 py-1 text-xs">
            {data.parties.map((p) => <option key={p.party} value={p.party}>{partyMeta(p.party, p.color).short}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl p-4" style={{ background: withAlpha(ma.color, 0.08) }}>
          <div className="text-xs text-ink-muted">{ma.full}</div>
          <div className="mt-1 text-3xl font-bold tabular-nums" style={{ color: ma.color }}>{pa.count}</div>
          <div className="text-xs text-ink-muted">leading / won</div>
        </div>
        <div className="rounded-xl p-4 text-right" style={{ background: withAlpha(mb.color, 0.08) }}>
          <div className="text-xs text-ink-muted">{mb.full}</div>
          <div className="mt-1 text-3xl font-bold tabular-nums" style={{ color: mb.color }}>{pb.count}</div>
          <div className="text-xs text-ink-muted">leading / won</div>
        </div>
      </div>

      <div className="relative h-3 rounded-full overflow-hidden bg-paper-tint flex">
        <div className="h-full transition-all duration-700" style={{ width: `${pctA}%`, background: ma.color }} />
        <div className="h-full flex-1 transition-all duration-700" style={{ background: mb.color }} />
      </div>
      <div className="flex justify-between text-[11px] mt-1">
        <span style={{ color: ma.color }} className="font-semibold">{ma.short} {pctA.toFixed(1)}%</span>
        <span style={{ color: mb.color }} className="font-semibold">{(100 - pctA).toFixed(1)}% {mb.short}</span>
      </div>
    </div>
  );
}
