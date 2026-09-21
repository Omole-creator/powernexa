"use client";

import { useActionState } from "react";
import { syncEquipmentPricesNow, type PricingSyncState } from "@/actions/pricing";

const initialState: PricingSyncState = {};

export function SyncPricingButton() {
  const [state, formAction, pending] = useActionState(syncEquipmentPricesNow, initialState);

  return (
    <form action={formAction} className="flex flex-col items-start gap-2 sm:items-end">
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-navy hover:border-orange disabled:opacity-60 sm:self-end"
      >
        {pending ? "Syncing..." : "Sync now"}
      </button>
      {state.error ? <p className="text-xs font-medium text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-xs font-medium text-green-600">{state.success}</p> : null}
    </form>
  );
}
