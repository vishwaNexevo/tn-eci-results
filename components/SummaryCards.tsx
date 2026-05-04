"use client";
import { NormalizedResults } from "@/lib/types";
import { partyMeta } from "@/lib/parties";
import { Trophy, Flag, ListChecks, Crown } from "lucide-react";

export function SummaryCards({ data }: { data: NormalizedResults }) {
  const counted = data.constituencies.length;
  const leader = data.leadingParty;
  const leaderMeta = leader ? partyMeta(leader.party, leader.color) : null;

  const cards = [
    {
      label: "Total Seats",
      value: data.totalSeats.toString(),
      sub: "Tamil Nadu Legislative Assembly",
      icon: <ListChecks className="h-5 w-5" />,
      tint: "bg-slate-100 text-slate-700",
    },
    {
      label: "Majority Mark",
      value: data.majority.toString(),
      sub: "Seats needed to form government",
      icon: <Flag className="h-5 w-5" />,
      tint: "bg-amber-50 text-amber-700",
    },
    {
      label: "Leading / Won",
      value: leader ? leader.count.toString() : "—",
      sub: leaderMeta ? `${leaderMeta.full}` : "Awaiting trends",
      icon: <Crown className="h-5 w-5" />,
      tint: "bg-rose-50 text-rose-700",
      accent: leaderMeta?.color,
    },
    {
      label: "Counted Seats",
      value: counted.toString(),
      sub: `${Math.round((counted / Math.max(data.totalSeats, 1)) * 100)}% reported`,
      icon: <Trophy className="h-5 w-5" />,
      tint: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white rounded-2xl border border-line shadow-card p-4 sm:p-5 relative overflow-hidden"
        >
          {c.accent && (
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: c.accent }} />
          )}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] sm:text-xs uppercase tracking-wider text-ink-muted font-semibold">{c.label}</div>
              <div className="mt-1 text-2xl sm:text-3xl font-bold text-ink tabular-nums">{c.value}</div>
              <div className="mt-1 text-xs text-ink-muted line-clamp-1">{c.sub}</div>
            </div>
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${c.tint}`}>{c.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
