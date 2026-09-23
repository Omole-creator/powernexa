"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  addSupplierPriceAction,
  importSupplierPriceListAction,
  type SupplierPriceFormState,
} from "@/actions/pricing";

const initialState: SupplierPriceFormState = {};

const inputClass =
  "w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

export function AddSupplierPriceForm({
  suppliers,
  importable,
}: {
  suppliers: string[];
  importable: { supplier: string; label: string }[];
}) {
  const [state, formAction, pending] = useActionState(addSupplierPriceAction, initialState);
  const [category, setCategory] = useState("inverter");
  const formRef = useRef<HTMLFormElement>(null);

  // Keep supplier and category after a save so a whole price list can be
  // typed in row after row; clear only the item fields.
  useEffect(() => {
    if (state.success && formRef.current) {
      for (const field of ["name", "size", "price", "voltage", "notes"]) {
        const input = formRef.current.elements.namedItem(field) as HTMLInputElement | null;
        if (input) input.value = "";
      }
      (formRef.current.elements.namedItem("name") as HTMLInputElement | null)?.focus();
    }
  }, [state]);

  const sizeUnit = category === "inverter" ? "kVA" : category === "battery" ? "kWh" : "watts";

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h3 className="font-display text-base font-bold text-navy">Add a price</h3>
          <p className="mt-1 text-xs text-charcoal/55">
            For a new supplier, type their name. Each item shows up in the table and the calculator as soon as it&apos;s saved.
          </p>
        </div>
        {importable.length > 0 ? (
          <div className="flex flex-col gap-2 sm:items-end">
            {importable.map((list) => (
              <ImportListButton key={list.supplier} supplier={list.supplier} label={list.label} />
            ))}
          </div>
        ) : null}
      </div>

      <form ref={formRef} action={formAction} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-semibold text-navy">
          Supplier
          <input name="supplier" list="supplier-names" required className={`${inputClass} mt-1`} placeholder="e.g. Nexus" />
          <datalist id="supplier-names">
            {suppliers.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </label>
        <label className="text-xs font-semibold text-navy">
          Category
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputClass} mt-1`}
          >
            <option value="inverter">Inverter</option>
            <option value="battery">Battery</option>
            <option value="panel">Solar panel</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-navy lg:col-span-2">
          Item name
          <input name="name" required className={`${inputClass} mt-1`} placeholder="e.g. Nexus 11kVA 48V" />
        </label>
        <label className="text-xs font-semibold text-navy">
          Size ({sizeUnit})
          <input name="size" required inputMode="decimal" className={`${inputClass} mt-1`} placeholder="e.g. 11" />
        </label>
        <label className="text-xs font-semibold text-navy">
          Price (₦)
          <input name="price" required inputMode="numeric" className={`${inputClass} mt-1`} placeholder="e.g. 630000" />
        </label>
        {category === "battery" ? (
          <label className="text-xs font-semibold text-navy">
            Battery type
            <select name="chemistry" defaultValue="lithium" className={`${inputClass} mt-1`}>
              <option value="lithium">Lithium</option>
              <option value="tubular">Tubular</option>
            </select>
          </label>
        ) : (
          <label className="text-xs font-semibold text-navy">
            Voltage (optional)
            <input name="voltage" className={`${inputClass} mt-1`} placeholder="e.g. 48V" />
          </label>
        )}
        <label className="text-xs font-semibold text-navy">
          Notes (optional)
          <input name="notes" className={`${inputClass} mt-1`} />
        </label>
        <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-orange px-5 py-2 text-xs font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
          >
            {pending ? "Saving..." : "Add price"}
          </button>
          {state.error ? <p className="text-xs font-medium text-red-600">{state.error}</p> : null}
          {state.success ? <p className="text-xs font-medium text-green-600">{state.success}</p> : null}
        </div>
      </form>
    </div>
  );
}

function ImportListButton({ supplier, label }: { supplier: string; label: string }) {
  const [state, formAction, pending] = useActionState(
    importSupplierPriceListAction.bind(null, supplier),
    initialState
  );
  return (
    <form action={formAction} className="flex flex-col items-start gap-1 sm:items-end">
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-orange bg-orange/5 px-4 py-2 text-xs font-semibold text-navy hover:bg-orange/10 disabled:opacity-60"
      >
        {pending ? "Loading..." : `Load ${label}`}
      </button>
      {state.error ? <p className="text-xs font-medium text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-xs font-medium text-green-600">{state.success}</p> : null}
    </form>
  );
}
