import "server-only";
import { supabase } from "./supabase";
import type { DateRange } from "./date-range";

export const TRACKABLE_EVENTS = [
  "page_view",
  "whatsapp_click",
  "call_click",
  "email_click",
  "quote_form_submit",
  "blog_view",
  "cta_click",
  "lead_magnet_signup",
] as const;

export type TrackableEvent = (typeof TRACKABLE_EVENTS)[number];

const BOT_USER_AGENT_HINTS = [
  "bot",
  "spider",
  "crawler",
  "slurp",
  "bingpreview",
  "facebookexternalhit",
  "whatsapp",
  "ahrefsbot",
  "semrushbot",
];

export function looksLikeBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const lower = userAgent.toLowerCase();
  return BOT_USER_AGENT_HINTS.some((hint) => lower.includes(hint));
}

export type NewEventInput = {
  eventType: TrackableEvent;
  pagePath: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceType?: string;
  visitorId?: string;
  sessionId?: string;
  isBot: boolean;
};

export async function recordEvent(input: NewEventInput): Promise<void> {
  const { error } = await supabase.from("analytics_events").insert({
    event_type: input.eventType,
    page_path: input.pagePath.slice(0, 300),
    referrer: input.referrer?.slice(0, 300) ?? null,
    utm_source: input.utmSource?.slice(0, 100) ?? null,
    utm_medium: input.utmMedium?.slice(0, 100) ?? null,
    utm_campaign: input.utmCampaign?.slice(0, 100) ?? null,
    device_type: input.deviceType?.slice(0, 20) ?? null,
    visitor_id: input.visitorId?.slice(0, 64) ?? null,
    session_id: input.sessionId?.slice(0, 64) ?? null,
    is_bot: input.isBot,
  });
  if (error) throw error;
}

export type DashboardStats = {
  totalsByEvent: { event_type: string; count: number }[];
  dailyPageViews: { day: string; count: number }[];
  topPages: { page_path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  deviceBreakdown: { device_type: string; count: number }[];
  uniqueVisits: number;
  leadsToday: number;
  leadsThisWeek: number;
};

// Bots never count anywhere in this dashboard. There is no toggle to include
// them, both partners always see human traffic only.
//
// These read from Postgres functions defined in the Supabase SQL editor.
// See docs/SPEC.md and the project setup guide for the exact SQL to run.
export async function getDashboardStats(range: DateRange): Promise<DashboardStats> {
  const includeBots = false;
  const startTs = range.start.toISOString();
  const endTs = range.end.toISOString();
  const [totals, daily, pages, referrers, devices, uniqueVisits, leadsToday, leadsThisWeek] = await Promise.all([
    supabase.rpc("dashboard_totals_by_event", { start_ts: startTs, end_ts: endTs, include_bots: includeBots }),
    supabase.rpc("dashboard_daily_page_views", { start_ts: startTs, end_ts: endTs, include_bots: includeBots }),
    supabase.rpc("dashboard_top_pages", { start_ts: startTs, end_ts: endTs, include_bots: includeBots, result_limit: 10 }),
    supabase.rpc("dashboard_top_referrers", { start_ts: startTs, end_ts: endTs, include_bots: includeBots, result_limit: 8 }),
    supabase.rpc("dashboard_device_breakdown", { start_ts: startTs, end_ts: endTs, include_bots: includeBots }),
    getUniqueVisitCount(range),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  for (const result of [totals, daily, pages, referrers, devices]) {
    if (result.error) throw result.error;
  }

  return {
    totalsByEvent: totals.data ?? [],
    dailyPageViews: (daily.data ?? []).map((d: { day: string; count: number }) => ({
      day: d.day,
      count: d.count,
    })),
    topPages: pages.data ?? [],
    topReferrers: referrers.data ?? [],
    deviceBreakdown: devices.data ?? [],
    uniqueVisits,
    leadsToday: leadsToday.count ?? 0,
    leadsThisWeek: leadsThisWeek.count ?? 0,
  };
}

// Counts a visitor once per calendar day: the same person browsing five
// pages today is one visit, and the same person coming back tomorrow is a
// second visit. Deduplicated in JS from raw rows rather than a SQL function,
// so no extra schema change is needed.
export async function getUniqueVisitCount(range: DateRange): Promise<number> {
  const { data, error } = await supabase
    .from("analytics_events")
    .select("visitor_id, created_at")
    .eq("event_type", "page_view")
    .eq("is_bot", false)
    .not("visitor_id", "is", null)
    .gte("created_at", range.start.toISOString())
    .lt("created_at", range.end.toISOString());
  if (error) throw error;

  const seen = new Set<string>();
  for (const row of data ?? []) {
    const day = String(row.created_at).slice(0, 10);
    seen.add(`${row.visitor_id}:${day}`);
  }
  return seen.size;
}

export type EventRow = {
  id: number;
  event_type: string;
  page_path: string;
  referrer: string | null;
  device_type: string | null;
  is_bot: boolean;
  created_at: string;
};

export async function listRecentEvents(limit = 500): Promise<EventRow[]> {
  const { data, error } = await supabase
    .from("analytics_events")
    .select("id, event_type, page_path, referrer, device_type, is_bot, created_at")
    .order("id", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export function eventsToCsv(events: EventRow[]): string {
  const headers = ["id", "event_type", "page_path", "referrer", "device_type", "is_bot", "created_at"];
  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? "" : String(value);
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const rows = events.map((e) => headers.map((h) => escape(e[h as keyof EventRow])).join(","));
  return [headers.join(","), ...rows].join("\n");
}
