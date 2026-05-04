import { ApiResponse, Constituency, NormalizedResults, PartyTotals } from "./types";
import { partyMeta } from "./parties";

export function normalize(api: ApiResponse, state = "S22"): NormalizedResults {
  const block = api[state];
  const rows = block?.chartData ?? [];
  const constituencies: Constituency[] = rows
    .map((r) => {
      const meta = partyMeta(r[0], r[4]);
      return {
        party: r[0],
        state: r[1],
        seat: Number(r[2]),
        candidate: r[3],
        color: meta.color,
        status: "Leading" as const,
      };
    })
    .sort((a, b) => a.seat - b.seat);

  const totalSeats = constituencies.length;
  const majority = totalSeats > 0 ? Math.floor(totalSeats / 2) + 1 : 0;

  const byParty = new Map<string, PartyTotals>();
  for (const c of constituencies) {
    const m = partyMeta(c.party, c.color);
    const cur = byParty.get(c.party) ?? { party: c.party, color: m.color, count: 0, seats: [] };
    cur.count += 1;
    cur.seats.push(c.seat);
    byParty.set(c.party, cur);
  }
  const parties = Array.from(byParty.values()).sort((a, b) => b.count - a.count);

  return {
    state,
    totalSeats,
    majority,
    constituencies,
    parties,
    leadingParty: parties[0],
    fetchedAt: Date.now(),
  };
}
