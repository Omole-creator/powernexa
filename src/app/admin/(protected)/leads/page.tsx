import type { Metadata } from "next";
import { listLeads } from "@/lib/leads";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Leads", robots: { index: false } };

export default async function AdminLeadsPage() {
  const leads = await listLeads();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Leads</h1>
          <p className="text-sm text-charcoal/55">
            Every quote request, permanently recorded here. Nobody can delete a lead from this
            screen, only update its status, so the record stays trustworthy for both partners.
          </p>
        </div>
        <a
          href="/api/leads/export"
          className="self-start rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-navy hover:border-orange"
        >
          Export CSV
        </a>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-charcoal/45">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-4 py-3 font-medium text-navy">{lead.name}</td>
                <td className="px-4 py-3 font-mono-num text-charcoal/70">{lead.phone}</td>
                <td className="px-4 py-3 text-charcoal/70">{lead.area}</td>
                <td className="px-4 py-3 text-charcoal/70">{lead.property_type}</td>
                <td className="px-4 py-3 text-charcoal/70">{lead.service_interest}</td>
                <td className="px-4 py-3 text-charcoal/60">{lead.budget_range ?? "Not set"}</td>
                <td className="px-4 py-3">
                  <LeadStatusSelect leadId={lead.id} status={lead.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-charcoal/55">
                  {new Date(lead.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={buildWhatsAppUrl(`Hi ${lead.name}, following up on your PowerNexa Solutions quote request.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#25D366]"
                  >
                    WhatsApp
                  </a>
                </td>
              </tr>
            ))}
            {leads.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-charcoal/50">
                  No leads yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
