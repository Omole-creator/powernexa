import type { Metadata } from "next";
import { listPriceBenchmarks } from "@/lib/price-benchmarks";
import { SyncPricingButton } from "@/components/admin/SyncPricingButton";
import { PricingCalculator } from "@/components/admin/PricingCalculator";

export const metadata: Metadata = { title: "Equipment Pricing", robots: { index: false } };

const CATEGORY_LABELS: Record<string, string> = {
  panel: "Solar panel",
  inverter: "Inverter",
  battery: "Battery",
};

const UNIT_LABELS: Record<string, string> = {
  watt: "per watt",
  kva: "per kVA",
  kwh: "per kWh",
};

export default async function AdminPricingPage() {
  const benchmarks = await listPriceBenchmarks();
  const lastSynced = benchmarks.reduce<string | null>((latest, row) => {
    if (!latest || row.synced_at > latest) return row.synced_at;
    return latest;
  }, null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Equipment pricing</h1>
          <p className="text-sm text-charcoal/55">
            Live benchmark rates pulled from Itel Solar&apos;s public catalog, refreshed automatically
            every night. Nothing here is typed in by hand.
          </p>
        </div>
        <SyncPricingButton />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-charcoal/45">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Subtype</th>
              <th className="px-4 py-3">Rate</th>
              <th className="px-4 py-3">Range</th>
              <th className="px-4 py-3">Sample size</th>
              <th className="px-4 py-3">Last synced</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {benchmarks.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 font-medium text-navy">{CATEGORY_LABELS[row.category] ?? row.category}</td>
                <td className="px-4 py-3 text-charcoal/70">{row.subtype}</td>
                <td className="px-4 py-3 font-mono-num text-charcoal/70">
                  ₦{row.rate_ngn.toLocaleString("en-NG")} {UNIT_LABELS[row.unit] ?? row.unit}
                </td>
                <td className="px-4 py-3 font-mono-num text-charcoal/55">
                  ₦{row.min_rate_ngn.toLocaleString("en-NG")} – ₦{row.max_rate_ngn.toLocaleString("en-NG")}
                </td>
                <td className="px-4 py-3 text-charcoal/55">{row.sample_size}</td>
                <td className="px-4 py-3 whitespace-nowrap text-charcoal/55">
                  {new Date(row.synced_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </td>
              </tr>
            ))}
            {benchmarks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-charcoal/50">
                  No benchmarks yet. Click &quot;Sync now&quot; to pull the first snapshot.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {lastSynced ? (
        <p className="text-xs text-charcoal/45">
          Most recent sync: {new Date(lastSynced).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      ) : null}

      <PricingCalculator benchmarks={benchmarks} />
    </div>
  );
}
