"use client";

import { useState } from "react";
import { formatNaira } from "@/lib/costing";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

function toNumber(value: string): number {
  const n = Number(value.replace(/[₦,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// For a customer who doesn't know what they spend on fuel: works it out from how
// long the generator runs. Nothing is saved.
export function FuelSpendCalculator() {
  const [hours, setHours] = useState("");
  const [days, setDays] = useState("30");
  const [litres, setLitres] = useState("");
  const [price, setPrice] = useState("");
  const filled = [hours, days, litres, price].every((v) => v.trim() !== "");
  const monthly = Math.round(toNumber(hours) * toNumber(days) * toNumber(litres) * toNumber(price));

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Generator hours a day">
          <input inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} className={inputClass} placeholder="e.g. 10" />
        </Field>
        <Field label="Days a month it runs">
          <input inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} className={inputClass} placeholder="e.g. 30" />
        </Field>
        <Field label="Litres an hour">
          <input inputMode="decimal" value={litres} onChange={(e) => setLitres(e.target.value)} className={inputClass} placeholder="e.g. 1.5" />
        </Field>
        <Field label="Price per litre (₦)">
          <input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="e.g. 1000" />
        </Field>
      </div>

      {filled ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Result label="A day" value={Math.round(toNumber(hours) * toNumber(litres) * toNumber(price))} />
          <Result label="A month" value={monthly} strong />
          <Result label="A year" value={monthly * 12} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-charcoal/50">Fill in all four boxes to see the fuel spend.</p>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-navy">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Result({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`rounded-xl px-4 py-3 ${strong ? "bg-navy text-white" : "bg-mist text-navy"}`}>
      <p className={`text-xs ${strong ? "text-white/70" : "text-charcoal/55"}`}>Fuel spend {label.toLowerCase()}</p>
      <p className="font-mono-num text-xl font-semibold">{formatNaira(value)}</p>
    </div>
  );
}
