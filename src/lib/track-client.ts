"use client";

const VISITOR_COOKIE = "pnx_vid";
const SESSION_COOKIE = "pnx_sid";

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ensureIds(): { visitorId: string; sessionId: string } {
  let visitorId = readCookie(VISITOR_COOKIE);
  if (!visitorId) {
    visitorId = newId();
    writeCookie(VISITOR_COOKIE, visitorId, 60 * 60 * 24 * 365);
  }
  let sessionId = readCookie(SESSION_COOKIE);
  if (!sessionId) {
    sessionId = newId();
  }
  // sliding 30-minute session window
  writeCookie(SESSION_COOKIE, sessionId, 60 * 30);
  return { visitorId, sessionId };
}

function deviceType(): string {
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export type TrackEventType =
  | "page_view"
  | "whatsapp_click"
  | "call_click"
  | "email_click"
  | "blog_view"
  | "cta_click";

export function track(eventType: TrackEventType, pagePathOverride?: string) {
  try {
    const { visitorId, sessionId } = ensureIds();
    const params = new URLSearchParams(window.location.search);
    const payload = {
      eventType,
      pagePath: pagePathOverride ?? window.location.pathname,
      referrer: document.referrer || undefined,
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
      deviceType: deviceType(),
      visitorId,
      sessionId,
    };

    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    // Analytics must never break the page.
  }
}
