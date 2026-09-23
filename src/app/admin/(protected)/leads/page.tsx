import type { Metadata } from "next";
import Link from "next/link";
import { listLeads } from "@/lib/leads";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { ArchiveLeadButton } from "@/components/admin/ArchiveLeadButton";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { listPriceBenchmarks } from "@/lib/price-benchmarks";
import { buildPriceBook, listSupplierPrices } from "@/lib/supplier-prices";
import {
  PACKAGES,
  estimateJob,
  formatNaira,
  loadProfileLabel,
  packageForLoadProfile,
  roundQuote,
  type PriceSourceItem,
} from "@/lib/costing";

// Internal ballpark for the package a lead's "what do you want to power?"
// answer points to. Never shown to the customer.
function leadEstimate(loadProfile: string | null | undefined, priceBook: PriceSourceItem[]) {
  const key = packageForLoadProfile(loadProfile);
  if (!key) return null;
  const estimate = estimateJob({ spec: PACKAGES[key].spec, priceBook });
  if (estimate.missing.length > 0) return { key, amount: null };
  return { key, amount: roundQuote(estimate.finalPrice) };
}

export const metadata: Metadata = { title: "Leads", robots: { index: false } };

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const showArchived = view === "archived";
  const [leads, benchmarks, supplierPrices] = await Promise.all([
    listLeads({ archived: showArchived }),
    listPriceBenchmarks(),
    listSupplierPrices(),
  ]);
  const priceBook = buildPriceBook(supplierPrices.items, benchmarks);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Leads</h1>
          <p className="text-sm text-charcoal/55">
            Every quote request is permanently recorded, archiving only hides a lead from this
            list, it never deletes the row, so the record stays trustworthy for both partners.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Link
            href={showArchived ? "/admin/leads" : "/admin/leads?view=archived"}
            className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-navy hover:border-orange"
          >
            {showArchived ? "Back to active leads" : "View archived"}
          </Link>
          <a
            href="/api/leads/export"
            className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-navy hover:border-orange"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-charcoal/45">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Wants to power</th>
              <th className="px-4 py-3" title="In-house price for the matching package, from /admin/pricing. Internal only.">
                Est. job value
              </th>
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
                <td className="px-4 py-3 text-charcoal/60">{loadProfileLabel(lead.load_profile) ?? "Not set"}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <LeadEstimateCell estimate={leadEstimate(lead.load_profile, priceBook)} />
                </td>
                <td className="px-4 py-3">
                  <LeadStatusSelect leadId={lead.id} status={lead.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-charcoal/55">
                  {new Date(lead.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <a
                      href={buildWhatsAppUrl(`Hi ${lead.name}, following up on your PowerNexa Solutions quote request.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#25D366]"
                    >
                      WhatsApp
                    </a>
                    <Link href={`/admin/leads/${lead.id}/edit`} className="text-xs font-semibold text-navy hover:text-orange">
                      Edit
                    </Link>
                    <ArchiveLeadButton leadId={lead.id} name={lead.name} archived={showArchived} />
                  </div>
                </td>
              </tr>
            ))}
            {leads.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-charcoal/50">
                  {showArchived ? "No archived leads." : "No leads yet."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadEstimateCell({ estimate }: { estimate: ReturnType<typeof leadEstimate> }) {
  if (!estimate) return <span className="text-charcoal/40">Needs visit</span>;
  return (
    <Link href={`/admin/pricing?package=${estimate.key}`} className="group block">
      <span className="font-mono-num font-semibold text-navy group-hover:text-orange">
        {estimate.amount ? `~${formatNaira(estimate.amount)}` : "No prices yet"}
      </span>
      <span className="block text-xs text-charcoal/45">{PACKAGES[estimate.key].label}</span>
    </Link>
  );
}
