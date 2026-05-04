// API row shape: [partyCode, stateCode, seatNumber, candidateName, color]
export type ChartRow = [string, string, number, string, string];
// API row shape: [partyCode, stateCode, seatNumber]
export type TableRow = [string, string, number];

export interface ApiResponse {
  [stateCode: string]: {
    chartData: ChartRow[];
    tableData: TableRow[];
  };
}

export interface Constituency {
  seat: number;
  state: string;
  party: string;
  candidate: string;
  color: string;
  // status is leading vs won — the live JSON does not distinguish, so we mark all as "Leading/Won"
  status: "Leading" | "Won";
}

export interface PartyTotals {
  party: string;
  color: string;
  count: number;
  seats: number[];
}

export interface NormalizedResults {
  state: string;
  totalSeats: number;
  majority: number;
  constituencies: Constituency[];
  parties: PartyTotals[];
  leadingParty?: PartyTotals;
  fetchedAt: number;
}
