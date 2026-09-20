"use client";

import { useRouter } from "next/navigation";
import type { PeriodType } from "@/lib/date-range";
import { dayOptions, monthOptions, quarterOptions, yearOptions, defaultValueFor } from "@/lib/date-range";

const PERIOD_TYPES: { value: PeriodType; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

function optionsFor(type: PeriodType) {
  if (type === "day") return dayOptions();
  if (type === "quarter") return quarterOptions();
  if (type === "year") return yearOptions();
  return monthOptions();
}

const selectClass =
  "rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

export function DashboardPeriodFilter({ type, value }: { type: PeriodType; value: string }) {
  const router = useRouter();

  function goTo(nextType: PeriodType, nextValue: string) {
    router.push(`/admin?period=${nextType}&value=${encodeURIComponent(nextValue)}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={type}
        onChange={(e) => goTo(e.target.value as PeriodType, defaultValueFor(e.target.value as PeriodType))}
        className={selectClass}
      >
        {PERIOD_TYPES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <select value={value} onChange={(e) => goTo(type, e.target.value)} className={selectClass}>
        {optionsFor(type).map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
