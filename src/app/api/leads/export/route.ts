import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { listLeads, leadsToCsv } from "@/lib/leads";

export async function GET() {
  const user = await verifySession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const csv = leadsToCsv(await listLeads({ archived: "all" }));

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="powernexa-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
