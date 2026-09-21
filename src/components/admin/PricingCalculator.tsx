"use client";

import { useState } from "react";
import type { PriceBenchmark } from "@/lib/price-benchmarks";

function formatNaira(value: number): string {
  return `₦${Math.round(value).toLocaleString("en-NG")}`;
}

export function PricingCalculator({ benchmarks }: { benchmarks: PriceBenchmark[] }) {
  const panelBenchmark = benchmarks.find((b) => b.category === "panel");
  const inverterOptions = benchmarks.filter((b) => b.category === "inverter");
  const batteryOptions = benchmarks.filter((b) => b.category === "battery");

  const [panelWatts, setPanelWatts] = useState("");
  const [inverterSubtype, setInverterSubtype] = useState(inverterOptions[0]?.subtype ?? "");
  const [inverterKva, setInverterKva] = useState("");
  const [batterySubtype, setBatterySubtype] = useState(batteryOptions[0]?.subtype ?? "");
  const [batteryKwh, setBatteryKwh] = useState("");
  const [markupPercent, setMarkupPercent] = useState("");

  const selectedInverter = inverterOptions.find((b) => b.subtype === inverterSubtype);
  const selectedBattery = batteryOptions.find((b) => b.subtype === batterySubtype);

  const panelCost = (Number(panelWatts) || 0) * (panelBenchmark?.rate_ngn ?? 0);
  const inverterCost = (Number(inverterKva) || 0) * (selectedInverter?.rate_ngn ?? 0);
  const batteryCost = (Number(batteryKwh) || 0) * (selectedBattery?.rate_ngn ?? 0);
  const equipmentTotal = panelCost + inverterCost + batteryCost;
  const suggestedTotal = equipmentTotal * (1 + (Number(markupPercent) || 0) / 100);

  const inputClass =
    "w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h2 className="font-display text-lg font-bold text-navy">Equipment cost calculator</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        Uses the benchmarks above plus your own labour and margin. For preparing a quote after the
        site visit, not for quoting a customer directly.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-navy">Total panel wattage (W)</label>
          <input
            type="number"
            min="0"
            value={panelWatts}
            onChange={(e) => setPanelWatts(e.target.value)}
            className={inputClass}
            placeholder="e.g. 2000"
            disabled={!panelBenchmark}
          />
          {!panelBenchmark ? <p className="mt-1 text-xs text-charcoal/50">No panel benchmark yet.</p> : null}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-navy">Inverter size (kVA)</label>
          <div className="flex gap-2">
            <select
              value={inverterSubtype}
              onChange={(e) => setInverterSubtype(e.target.value)}
              className={inputClass}
              disabled={inverterOptions.length === 0}
            >
              {inverterOptions.map((option) => (
                <option key={option.subtype} value={option.subtype}>
                  {option.subtype}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              value={inverterKva}
              onChange={(e) => setInverterKva(e.target.value)}
              className={inputClass}
              placeholder="e.g. 6"
              disabled={inverterOptions.length === 0}
            />
          </div>
          {inverterOptions.length === 0 ? <p className="mt-1 text-xs text-charcoal/50">No inverter benchmark yet.</p> : null}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-navy">Battery capacity (kWh)</label>
          <div className="flex gap-2">
            <select
              value={batterySubtype}
              onChange={(e) => setBatterySubtype(e.target.value)}
              className={inputClass}
              disabled={batteryOptions.length === 0}
            >
              {batteryOptions.map((option) => (
                <option key={option.subtype} value={option.subtype}>
                  {option.subtype}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              value={batteryKwh}
              onChange={(e) => setBatteryKwh(e.target.value)}
              className={inputClass}
              placeholder="e.g. 5"
              disabled={batteryOptions.length === 0}
            />
          </div>
          {batteryOptions.length === 0 ? <p className="mt-1 text-xs text-charcoal/50">No battery benchmark yet.</p> : null}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-navy">Labour + margin (%)</label>
          <input
            type="number"
            min="0"
            value={markupPercent}
            onChange={(e) => setMarkupPercent(e.target.value)}
            className={inputClass}
            placeholder="Your own rate"
          />
        </div>
      </div>

      <div className="mt-6 space-y-2 rounded-xl bg-mist p-5 text-sm">
        <div className="flex justify-between text-charcoal/70">
          <span>Panels</span>
          <span className="font-mono-num">{formatNaira(panelCost)}</span>
        </div>
        <div className="flex justify-between text-charcoal/70">
          <span>Inverter</span>
          <span className="font-mono-num">{formatNaira(inverterCost)}</span>
        </div>
        <div className="flex justify-between text-charcoal/70">
          <span>Battery</span>
          <span className="font-mono-num">{formatNaira(batteryCost)}</span>
        </div>
        <div className="flex justify-between border-t border-line pt-2 font-semibold text-navy">
          <span>Equipment cost</span>
          <span className="font-mono-num">{formatNaira(equipmentTotal)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-navy">
          <span>Suggested internal total</span>
          <span className="font-mono-num text-orange">{formatNaira(suggestedTotal)}</span>
        </div>
      </div>

      <p className="mt-4 rounded-xl border border-orange/30 bg-orange/5 px-4 py-3 text-xs font-medium text-navy">
        Internal figure only. Do not read this number to a customer, their written quote still comes
        from the site visit.
      </p>
    </div>
  );
}
