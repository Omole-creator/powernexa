import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { Sparkbars, Barlist } from "@/components/admin/Sparkbars";
import { getDashboardStats } from "@/lib/analytics";
import { listLeads } from "@/lib/leads";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

function countFor(totals: { event_type: string; count: number }[], type: string): number {
  return totals.find((t) => t.event_type === type)?.count ?? 0;
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats(30);
  const leads = await listLeads();
  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-sm text-charcoal/55">
          Last 30 days, human traffic only. Both partners see the same numbers here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Unique visits" value={stats.uniqueVisits} hint="One person, one day" />
        <StatCard label="Page views" value={countFor(stats.totalsByEvent, "page_view")} hint="Last 30 days" />
        <StatCard label="WhatsApp clicks" value={countFor(stats.totalsByEvent, "whatsapp_click")} hint="Last 30 days" />
        <StatCard label="Call clicks" value={countFor(stats.totalsByEvent, "call_click")} hint="Last 30 days" />
        <StatCard label="Quote submissions" value={countFor(stats.totalsByEvent, "quote_form_submit")} hint="Last 30 days" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="New leads" value={newLeadsCount} hint="Awaiting first contact" />
        <StatCard label="Leads this week" value={stats.leadsThisWeek} />
        <StatCard label="Leads today" value={stats.leadsToday} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-bold text-navy">Page views, last 30 days</h2>
          <div className="mt-6">
            <Sparkbars data={stats.dailyPageViews} />
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-bold text-navy">Device breakdown</h2>
          <div className="mt-6">
            <Barlist data={stats.deviceBreakdown} labelKey="device_type" countKey="count" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-bold text-navy">Top pages</h2>
          <div className="mt-6">
            <Barlist data={stats.topPages} labelKey="page_path" countKey="count" />
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-bold text-navy">Top referrers</h2>
          <div className="mt-6">
            <Barlist data={stats.topReferrers} labelKey="referrer" countKey="count" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-navy">Recent leads</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-orange">
            View all →
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-charcoal/45">
              <tr>
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Area</th>
                <th className="pb-2 pr-4">Service</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leads.slice(0, 6).map((lead) => (
                <tr key={lead.id}>
                  <td className="py-2.5 pr-4 font-medium text-navy">{lead.name}</td>
                  <td className="py-2.5 pr-4 text-charcoal/70">{lead.area}</td>
                  <td className="py-2.5 pr-4 text-charcoal/70">{lead.service_interest}</td>
                  <td className="py-2.5 pr-4">
                    <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-navy">
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-charcoal/55">{new Date(lead.created_at).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-charcoal/50">
                    No leads yet. They&apos;ll show up here the moment someone submits the quote form.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
