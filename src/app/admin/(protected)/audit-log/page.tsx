import type { Metadata } from "next";
import { listAuditLog } from "@/lib/audit";

export const metadata: Metadata = { title: "Audit Log", robots: { index: false } };

export default async function AuditLogPage() {
  const entries = await listAuditLog();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">Audit log</h1>
        <p className="text-sm text-charcoal/55">
          Every login and every change made from this admin panel, so both partners can see exactly
          who did what and when. This log cannot be edited or cleared from the app.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-charcoal/45">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Who</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="whitespace-nowrap px-4 py-3 text-charcoal/60">
                  {new Date(entry.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </td>
                <td className="px-4 py-3 font-medium text-navy">{entry.actor_email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-navy">
                    {entry.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal/60">{entry.detail ?? "No detail"}</td>
              </tr>
            ))}
            {entries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-charcoal/50">
                  No activity recorded yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
