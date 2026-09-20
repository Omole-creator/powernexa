import { NextResponse, type NextRequest } from "next/server";
import { recordEvent, looksLikeBot, TRACKABLE_EVENTS, type TrackableEvent } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.eventType as TrackableEvent;

    if (!TRACKABLE_EVENTS.includes(eventType)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent");

    await recordEvent({
      eventType,
      pagePath: typeof body.pagePath === "string" ? body.pagePath : "/",
      referrer: typeof body.referrer === "string" ? body.referrer : undefined,
      utmSource: typeof body.utmSource === "string" ? body.utmSource : undefined,
      utmMedium: typeof body.utmMedium === "string" ? body.utmMedium : undefined,
      utmCampaign: typeof body.utmCampaign === "string" ? body.utmCampaign : undefined,
      deviceType: typeof body.deviceType === "string" ? body.deviceType : undefined,
      visitorId: typeof body.visitorId === "string" ? body.visitorId : undefined,
      sessionId: typeof body.sessionId === "string" ? body.sessionId : undefined,
      isBot: looksLikeBot(userAgent),
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
