import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { listLeadMagnetSignups, leadMagnetSignupsToCsv } from "@/lib/lead-magnet";

export async function GET() {
  const user = await verifySession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const csv = leadMagnetSignupsToCsv(await listLeadMagnetSignups());

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="powernexa-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
