"use client";

import { useRouter } from "next/navigation";
import { monthOptions, quarterOptions, yearOptions } from "@/lib/date-range";
import { periodKey, todayIso, type AccountsView } from "@/lib/accounts-math";

const VIEWS: { value: AccountsView; label: string }[] = [
  { value: "month", label: "Monthly" },
  { value: "quarter", label: "Quarterly" },
  { value: "year", label: "Yearly" },
];

const selectClass =
  "rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

export function AccountsPeriodFilter({ view, period }: { view: AccountsView; period: string }) {
  const router = useRouter();
  const options = view === "year" ? yearOptions() : view === "quarter" ? quarterOptions() : monthOptions();

  function goTo(nextView: AccountsView, nextPeriod: string) {
    router.push(`/admin/accounts?view=${nextView}&period=${encodeURIComponent(nextPeriod)}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={view}
        onChange={(e) => {
          const next = e.target.value as AccountsView;
          goTo(next, periodKey(todayIso(), next));
        }}
        className={selectClass}
        aria-label="Report by"
      >
        {VIEWS.map((v) => (
          <option key={v.value} value={v.value}>
            {v.label}
          </option>
        ))}
      </select>
      <select value={period} onChange={(e) => goTo(view, e.target.value)} className={selectClass} aria-label="Period">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
