import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { listRecentEvents, eventsToCsv } from "@/lib/analytics";

export async function GET() {
  const user = await verifySession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const csv = eventsToCsv(await listRecentEvents(2000));

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="powernexa-analytics-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
