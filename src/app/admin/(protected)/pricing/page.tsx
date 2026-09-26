import Link from "next/link";
import type { Metadata } from "next";
import { buildPriceBook, listSupplierPrices } from "@/lib/supplier-prices";
import { PACKAGES, type PackageKey } from "@/lib/costing";
import { PricingCalculator, type CalcState } from "@/components/admin/PricingCalculator";
import { SavedQuotesList } from "@/components/admin/SavedQuotesList";
import { getSavedQuote, listSavedQuotes } from "@/lib/saved-quotes";
import { SupplierPriceTable } from "@/components/admin/SupplierPriceTable";
import { AddSupplierPriceForm } from "@/components/admin/AddSupplierPriceForm";
import { SUPPLIER_PRICE_LISTS } from "@/lib/supplier-seed-data";

export const metadata: Metadata = { title: "Equipment Pricing", robots: { index: false } };

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
  searchParams: Promise<{ package?: string; quote?: string }>;
}) {
  const { package: packageParam, quote: quoteParam } = await searchParams;
  const quoteId = Number(quoteParam) > 0 ? Number(quoteParam) : null;
  const [saved, savedQuotes] = await Promise.all([quoteId ? getSavedQuote(quoteId) : null, listSavedQuotes()]);
  const savedCalc = (saved?.calc ?? null) as { calc?: Partial<CalcState>; draft?: unknown } | null;
  const initialPackage: PackageKey =
    packageParam && packageParam in PACKAGES ? (packageParam as PackageKey) : "medium";
  const supplierPrices = await listSupplierPrices();
  const priceBook = buildPriceBook(supplierPrices.items);
  const suppliers = [...new Set(supplierPrices.items.map((i) => i.supplier))];
  const importable = SUPPLIER_PRICE_LISTS.filter((l) => !suppliers.includes(l.supplier)).map(({ supplier, label }) => ({
    supplier,
    label,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">Equipment pricing</h1>
        <p className="text-sm text-charcoal/55">
          Work out the in-house price of a job from supplier price lists. For internal quote prep only,
          customers never see these figures.
        </p>
      </div>

      {supplierPrices.tableMissing ? (
        <div className="rounded-2xl border border-orange/40 bg-orange/5 p-5 text-sm text-navy">
          <p className="font-semibold">One-time setup needed for supplier price lists</p>
          <p className="mt-1 text-charcoal/70">
            Paste this into the Supabase SQL editor and run it once. Until then, supplier lists (like Nexus) can&apos;t be
            saved and the calculator has no prices to work from.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-navy p-4 text-xs text-white">{SUPPLIER_SQL}</pre>
        </div>
      ) : null}

      {savedQuotes.tableMissing ? (
        <p className="rounded-2xl border border-orange/40 bg-orange/5 px-5 py-4 text-sm text-navy">
          Saving quotes needs a one-time setup. Run the SQL shown on{" "}
          <Link href="/admin/systems" className="font-semibold text-orange">
            My System Pages
          </Link>{" "}
          in Supabase. You can still open and download quotes without it.
        </p>
      ) : (
        <SavedQuotesList quotes={savedQuotes.quotes} activeId={saved ? saved.id : null} />
      )}

      <PricingCalculator
        key={saved ? `quote-${saved.id}` : initialPackage}
        priceBook={priceBook}
        initialPackage={initialPackage}
        initialCalc={savedCalc?.calc}
        savedQuote={
          saved
            ? {
                id: saved.id,
                draft: savedCalc?.draft,
                totals: { equipment: saved.quote.equipmentTotal, installation: saved.quote.installationTotal },
              }
            : undefined
        }
      />

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
          <AddSupplierPriceForm suppliers={suppliers} importable={importable} />
        ) : null}
      </section>
    </div>
  );
}
