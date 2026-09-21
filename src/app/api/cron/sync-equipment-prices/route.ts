import { NextRequest, NextResponse } from "next/server";
import { syncAllPriceBenchmarks } from "@/lib/price-benchmarks";

// Called nightly by Vercel Cron (see vercel.json). Vercel automatically sends
// `Authorization: Bearer ${CRON_SECRET}` on cron-triggered requests when that
// env var is set, so this route rejects anything else.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncAllPriceBenchmarks();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Equipment price sync failed", error);
    return NextResponse.json({ ok: false, error: "Sync failed" }, { status: 500 });
  }
}
