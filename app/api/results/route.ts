import { NextResponse } from "next/server";
import { fetchEciResults, getEciErrorMeta } from "@/lib/eci";

export const runtime = "nodejs";
export const preferredRegion = "bom1";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await fetchEciResults();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    const meta = getEciErrorMeta(error);
    console.error("[api/results] failed to fetch ECI results", meta);
    return NextResponse.json(
      {
        error: meta.message,
        upstreamStatus: meta.status,
        upstreamStatusText: meta.statusText,
        region: meta.region,
      },
      {
        status: 502,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  }
}
