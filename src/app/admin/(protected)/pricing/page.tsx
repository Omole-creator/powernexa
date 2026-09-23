import type { Metadata } from "next";
import { listPriceBenchmarks } from "@/lib/price-benchmarks";
import { buildPriceBook, listSupplierPrices } from "@/lib/supplier-prices";
import { PACKAGES, type PackageKey } from "@/lib/costing";
import { SyncPricingButton } from "@/components/admin/SyncPricingButton";
import { PricingCalculator } from "@/components/admin/PricingCalculator";
import { SupplierPriceTable } from "@/components/admin/SupplierPriceTable";
import { AddSupplierPriceForm } from "@/components/admin/AddSupplierPriceForm";

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

const SUPPLIER_SQL = `create table if not exists supplier_price_items (
  id bigint generated always as identity primary key,
  supplier text not null,
  category text not null check (category in ('inverter', 'battery', 'panel')),
  name text not null,
  size numeric not null check (size > 0),
  voltage text,
  chemistry text check (chemistry in ('lithium', 'tubular')),
  price_ngn numeric not null check (price_ngn > 0),
  available boolean not null default true,
  notes text,
  updated_at timestamptz not null default now()
);
create index if not exists idx_supplier_price_items_lookup on supplier_price_items (category, available);
alter table supplier_price_items enable row level security;
alter table leads add column if not exists load_profile text;`;

export default async function AdminPricingPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const { package: packageParam } = await searchParams;
  const initialPackage: PackageKey =
    packageParam && packageParam in PACKAGES ? (packageParam as PackageKey) : "medium";
  const [benchmarks, supplierPrices] = await Promise.all([listPriceBenchmarks(), listSupplierPrices()]);
  const priceBook = buildPriceBook(supplierPrices.items, benchmarks);
  const suppliers = [...new Set(supplierPrices.items.map((i) => i.supplier))];
  const lastSynced = benchmarks.reduce<string | null>((latest, row) => {
    if (!latest || row.synced_at > latest) return row.synced_at;
    return latest;
  }, null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">Equipment pricing</h1>
        <p className="text-sm text-charcoal/55">
          Work out the in-house price of a job from supplier price lists and Itel Solar&apos;s live catalog. For
          internal quote prep only, customers never see these figures.
        </p>
      </div>

      {supplierPrices.tableMissing ? (
        <div className="rounded-2xl border border-orange/40 bg-orange/5 p-5 text-sm text-navy">
          <p className="font-semibold">One-time setup needed for supplier price lists</p>
          <p className="mt-1 text-charcoal/70">
            Paste this into the Supabase SQL editor and run it once. Until then, supplier lists (like Nexus) can&apos;t be
            saved and the calculator uses Itel&apos;s prices only.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-navy p-4 text-xs text-white">{SUPPLIER_SQL}</pre>
        </div>
      ) : null}

      <PricingCalculator key={initialPackage} priceBook={priceBook} initialPackage={initialPackage} />

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-navy">Supplier price lists</h2>
          <p className="text-sm text-charcoal/55">
            Company price sheets typed in by hand, for suppliers whose websites don&apos;t show real prices. Untick
            &quot;In stock&quot; to keep an item on file but out of the calculator.
          </p>
        </div>
        {supplierPrices.items.length > 0 ? <SupplierPriceTable items={supplierPrices.items} /> : null}
        {!supplierPrices.tableMissing ? (
          <AddSupplierPriceForm
            suppliers={suppliers}
            showNexusImport={!suppliers.includes("Nexus")}
          />
        ) : null}
      </section>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-lg font-bold text-navy">Itel Solar live rates</h2>
          <p className="text-sm text-charcoal/55">
            Median rates from Itel Solar&apos;s public catalog, refreshed automatically every night. Used for any size a
            supplier list doesn&apos;t cover.
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
    </div>
  );
}
