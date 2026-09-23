"use client";

import { useState, useTransition } from "react";
import { deleteSupplierPriceAction, updateSupplierPriceAction } from "@/actions/pricing";
import type { SupplierPriceItem } from "@/lib/supplier-prices";

const UNIT: Record<SupplierPriceItem["category"], string> = { inverter: "kVA", battery: "kWh", panel: "W" };
const CATEGORY_LABEL: Record<SupplierPriceItem["category"], string> = {
  inverter: "Inverters",
  battery: "Batteries",
  panel: "Solar panels",
};

export function SupplierPriceTable({ items }: { items: SupplierPriceItem[] }) {
  const suppliers = [...new Set(items.map((i) => i.supplier))];

  return (
    <div className="space-y-6">
      {suppliers.map((supplier) => {
        const rows = items.filter((i) => i.supplier === supplier);
        const lastUpdated = rows.reduce((latest, r) => (r.updated_at > latest ? r.updated_at : latest), "");
        return (
          <div key={supplier} className="overflow-x-auto rounded-2xl border border-line bg-white">
            <div className="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
              <h3 className="font-display text-base font-bold text-navy">{supplier}</h3>
              <p className="text-xs text-charcoal/50">
                {rows.length} items · last edited{" "}
                {new Date(lastUpdated).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-charcoal/45">
                <tr>
                  <th className="px-4 py-2.5">Item</th>
                  <th className="px-4 py-2.5">Size</th>
                  <th className="px-4 py-2.5">Price (₦)</th>
                  <th className="px-4 py-2.5">In stock</th>
                  <th className="px-4 py-2.5">Notes</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              {(["inverter", "battery", "panel"] as const).map((category) => {
                const categoryRows = rows.filter((r) => r.category === category);
                if (categoryRows.length === 0) return null;
                return (
                  <tbody key={category} className="divide-y divide-line">
                    <tr className="bg-mist/60">
                      <td colSpan={6} className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy/70">
                        {CATEGORY_LABEL[category]}
                      </td>
                    </tr>
                    {categoryRows.map((row) => (
                      <SupplierPriceRow key={row.id} row={row} />
                    ))}
                  </tbody>
                );
              })}
            </table>
          </div>
        );
      })}
    </div>
  );
}

function SupplierPriceRow({ row }: { row: SupplierPriceItem }) {
  const [price, setPrice] = useState(String(row.price_ngn));
  const [available, setAvailable] = useState(row.available);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const dirty = Number(price) !== row.price_ngn || available !== row.available;

  const save = () =>
    startTransition(async () => {
      const result = await updateSupplierPriceAction(row.id, Number(price.replace(/[,\s]/g, "")), available);
      setError(result?.error ?? null);
    });

  return (
    <tr className={row.available ? "" : "opacity-60"}>
      <td className="px-4 py-2.5 font-medium text-navy">
        {row.name}
        {row.chemistry ? <span className="ml-1.5 text-xs font-normal text-charcoal/50">{row.chemistry}</span> : null}
      </td>
      <td className="px-4 py-2.5 font-mono-num text-charcoal/70">
        {row.size}
        {UNIT[row.category]}
        {row.voltage ? <span className="text-charcoal/45"> · {row.voltage}</span> : null}
      </td>
      <td className="px-4 py-2.5">
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          inputMode="numeric"
          className="w-32 rounded-lg border border-line px-2 py-1 font-mono-num text-sm outline-none focus:border-orange"
          aria-label={`Price for ${row.name}`}
        />
      </td>
      <td className="px-4 py-2.5">
        <input
          type="checkbox"
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
          className="h-4 w-4 accent-orange"
          aria-label={`${row.name} in stock`}
        />
      </td>
      <td className="max-w-[260px] px-4 py-2.5 text-xs text-charcoal/60">
        {row.notes}
        {error ? <span className="block font-medium text-red-600">{error}</span> : null}
      </td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <button
            type="button"
            onClick={save}
            disabled={!dirty || isPending}
            className="text-xs font-semibold text-orange disabled:text-charcoal/30"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (confirm(`Delete ${row.name} from ${row.supplier}'s price list?`)) {
                startTransition(() => deleteSupplierPriceAction(row.id, row.name));
              }
            }}
            className="text-xs font-semibold text-charcoal/50 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
