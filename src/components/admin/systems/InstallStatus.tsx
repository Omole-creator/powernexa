"use client";

import { useState, useTransition } from "react";
import { setInstalledAction } from "@/actions/customer-systems";
import { todayLagos } from "@/lib/aftercare";
import { formatDate } from "@/lib/quote";

// "Has this installation been done?" Answering yes with a date starts the
// warranty, the carry guarantee and the check-up countdown.
export function InstallStatus({
  systemId,
  installedOn,
  compact = false,
}: {
  systemId: number;
  installedOn: string | null;
  compact?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(installedOn ?? todayLagos());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const save = (value: string | null) =>
    startTransition(async () => {
      const result = await setInstalledAction(systemId, value);
      if (result.error) setError(result.error);
      else {
        setError(null);
        setEditing(false);
      }
    });

  const picker = (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="date"
        value={date}
        max={todayLagos()}
        onChange={(e) => setDate(e.target.value)}
        aria-label="Installation date"
        className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm outline-none focus:border-orange"
      />
      <button
        type="button"
        disabled={isPending || !date}
        onClick={() => save(date)}
        className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60"
      >
        {isPending ? "Saving..." : installedOn ? "Save date" : "Yes, installed"}
      </button>
      {editing ? (
        <button type="button" onClick={() => setEditing(false)} className="text-xs font-semibold text-charcoal/50">
          Cancel
        </button>
      ) : null}
    </div>
  );

  if (!installedOn || editing) {
    return (
      <div className={compact ? "" : "rounded-2xl border-2 border-orange/40 bg-orange/5 p-5"}>
        {compact ? null : (
          <>
            <p className="font-display text-base font-bold text-navy">Has this installation been done?</p>
            <p className="mb-3 mt-0.5 text-xs text-charcoal/60">
              {installedOn
                ? "Change the installation date. The warranty and check-up dates move with it."
                : "Not yet. When it's done, pick the date and press \"Yes, installed\". That starts the warranty, the carry guarantee and the check-up countdown."}
            </p>
          </>
        )}
        {compact && !installedOn ? <span className="mb-1 block text-xs font-semibold text-orange">Not installed yet</span> : null}
        {picker}
        {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className={compact ? "" : "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-green-200 bg-green-50 p-5"}>
      <p className={compact ? "text-sm text-charcoal/70" : "text-sm font-semibold text-green-800"}>
        {compact ? null : "✓ "}Installed {formatDate(installedOn)}
      </p>
      <div className="flex gap-3 text-xs font-semibold">
        <button type="button" onClick={() => setEditing(true)} className="text-orange">
          Change date
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (confirm("Mark as not installed? The warranty and check-up dates will be cleared until you set a date again.")) {
              save(null);
            }
          }}
          className="text-charcoal/50 hover:text-red-600"
        >
          {isPending ? "..." : "Not installed"}
        </button>
      </div>
    </div>
  );
}
