"use client";

import { useActionState } from "react";
import { saveSystemAction, type SystemFormState } from "@/actions/customer-systems";
import type { SystemRecord } from "@/lib/customer-systems";
import { LOAD_COLUMNS, RowsField, toRows, type RowColumn } from "../RowsEditor";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

const EQUIPMENT_COLUMNS: RowColumn[] = [
  { key: "item", label: "Item", placeholder: "e.g. 5kVA inverter", wide: true },
  { key: "model", label: "Brand and model" },
  { key: "serial", label: "Serial number" },
  { key: "warranty", label: "Maker's warranty", placeholder: "e.g. 5 years" },
];

const initialState: SystemFormState = {};

export function SystemForm({ system }: { system?: SystemRecord }) {
  const [state, formAction, pending] = useActionState(saveSystemAction.bind(null, system?.id ?? null), initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-semibold text-navy">
          Customer name
          <input name="customerName" required defaultValue={system?.customer_name} className={`${inputClass} mt-1`} />
        </label>
        <label className="text-xs font-semibold text-navy">
          Phone (for sending the link)
          <input name="phone" defaultValue={system?.phone ?? ""} className={`${inputClass} mt-1`} placeholder="0803..." />
        </label>
        <label className="text-xs font-semibold text-navy">
          Address
          <input name="address" defaultValue={system?.address ?? ""} className={`${inputClass} mt-1`} />
        </label>
        <label className="text-xs font-semibold text-navy">
          Installed on
          <input type="date" name="installedOn" defaultValue={system?.installed_on ?? ""} className={`${inputClass} mt-1`} />
          <span className="mt-1 block font-normal text-charcoal/50">Sets the warranty and check-up dates.</span>
        </label>
        <label className="text-xs font-semibold text-navy sm:col-span-2 lg:col-span-4">
          System, in one line
          <input
            name="systemSummary"
            defaultValue={system?.system_summary ?? ""}
            className={`${inputClass} mt-1`}
            placeholder="e.g. 5kVA inverter, 5kWh lithium battery, 6 x 550W solar panels"
          />
        </label>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-navy">Equipment installed</p>
        <RowsField name="equipment" columns={EQUIPMENT_COLUMNS} initialRows={toRows(system?.equipment ?? [])} addLabel="Add item" />
      </div>

      <div>
        <p className="text-xs font-semibold text-navy">What the system carries</p>
        <p className="mb-2 text-xs text-charcoal/55">The list the 30-day carry guarantee covers. Comes from the quote.</p>
        <RowsField name="loadItems" columns={LOAD_COLUMNS} initialRows={toRows(system?.load_items ?? [])} addLabel="Add appliance" />
      </div>

      <label className="block text-xs font-semibold text-navy">
        Note to the customer (shown on their page, optional)
        <textarea name="notes" rows={2} defaultValue={system?.notes ?? ""} className={`${inputClass} mt-1`} />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-orange px-6 py-2 text-sm font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
        >
          {pending ? "Saving..." : system ? "Save changes" : "Create My System page"}
        </button>
        {state.error ? <p className="text-xs font-medium text-red-600">{state.error}</p> : null}
        {state.success ? <p className="text-xs font-medium text-green-600">{state.success}</p> : null}
      </div>
    </form>
  );
}
