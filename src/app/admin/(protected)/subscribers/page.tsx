import type { Metadata } from "next";
import { listLeadMagnetSignups } from "@/lib/lead-magnet";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";

export const metadata: Metadata = { title: "Subscribers", robots: { index: false } };

export default async function AdminSubscribersPage() {
  const signups = await listLeadMagnetSignups();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Subscribers</h1>
          <p className="text-sm text-charcoal/55">
            Everyone who gave their name, email, and phone number to download a free checklist,
            from the blog or the homepage.
          </p>
        </div>
        <a
          href="/api/subscribers/export"
          className="self-start rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-navy hover:border-orange"
        >
          Export CSV
        </a>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-charcoal/45">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Download</th>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {signups.map((signup) => (
              <tr key={signup.id}>
                <td className="px-4 py-3 font-medium text-navy">{signup.name}</td>
                <td className="px-4 py-3 text-charcoal/70">{signup.email}</td>
                <td className="px-4 py-3 font-mono-num text-charcoal/70">{signup.phone}</td>
                <td className="px-4 py-3 text-charcoal/70">
                  {LEAD_MAGNETS[signup.magnet_slug]?.title ?? signup.magnet_slug}
                </td>
                <td className="px-4 py-3 text-charcoal/55">{signup.source_page ?? "Not recorded"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-charcoal/55">
                  {new Date(signup.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </td>
              </tr>
            ))}
            {signups.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-charcoal/50">
                  No downloads yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
