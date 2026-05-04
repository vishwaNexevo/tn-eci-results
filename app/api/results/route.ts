import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ECI_URL =
  "https://results.eci.gov.in/ResultAcGenMay2026/election-json-S22-live.json";

export async function GET() {
  try {
    const res = await fetch(ECI_URL, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Fetch failed" },
      { status: 500 },
    );
  }
}
