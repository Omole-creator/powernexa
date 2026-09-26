"use client";

import { useMemo, useState } from "react";
import {
  JOB_COSTS,
  PACKAGES,
  defaultAccessoryCosts,
  defaultServiceCosts,
  estimateJob,
  formatNaira,
  roundQuote,
  type AccessoryCosts,
  type Chemistry,
  type ManualEquipmentCosts,
  type PackageKey,
  type PriceSourceItem,
  type ServiceCosts,
} from "@/lib/costing";
import { CustomerQuoteBuilder } from "./CustomerQuoteBuilder";

const inputClass =
  "w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

const ACCESSORY_FIELDS: { key: keyof AccessoryCosts; label: string }[] = [
  { key: "mounting", label: "Mounting structure" },
  { key: "cables", label: "Cables and MC4" },
  { key: "protection", label: "Breakers, isolators, SPD" },
  { key: "earthing", label: "Earthing kit" },
];

const MANUAL_FIELDS: { key: keyof ManualEquipmentCosts; label: string }[] = [
  { key: "inverter", label: "Inverter, total cost" },
  { key: "battery", label: "Battery, total cost" },
  { key: "panelEach", label: "Price of one panel" },
];

const SERVICE_FIELDS: { key: keyof ServiceCosts; label: string; hint: string }[] = [
  {
    key: "labour",
    label: "Labour",
    hint: `Starts at ₦${JOB_COSTS.labourPerKva.toLocaleString("en-NG")} per kVA, min ₦${JOB_COSTS.labourMinimum.toLocaleString("en-NG")}`,
  },
  { key: "transport", label: "Transport and logistics", hint: "Depends on distance and load" },
  { key: "siteSurvey", label: "Site survey visit", hint: "What the assessment cost us" },
];

export function PricingCalculator({
  priceBook,
  initialPackage = "medium",
}: {
  priceBook: PriceSourceItem[];
  initialPackage?: PackageKey;
}) {
  const start = PACKAGES[initialPackage].spec;
  const [preset, setPreset] = useState<PackageKey | "custom">(initialPackage);
  const [inverterKva, setInverterKva] = useState(String(start.inverterKva));
  const [batteryKwh, setBatteryKwh] = useState(String(start.batteryKwh));
  const [chemistry, setChemistry] = useState<Chemistry>(start.batteryChemistry);
  const [panelCount, setPanelCount] = useState(String(start.panelCount));
  const [panelWatts, setPanelWatts] = useState(String(start.panelWatts));
  const [source, setSource] = useState("");
  const [accessoryOverrides, setAccessoryOverrides] = useState<Partial<Record<keyof AccessoryCosts, string>>>({});
  const [serviceOverrides, setServiceOverrides] = useState<Partial<Record<keyof ServiceCosts, string>>>({});
  const [manualInputs, setManualInputs] = useState<Partial<Record<keyof ManualEquipmentCosts, string>>>({});

  const sources = useMemo(() => [...new Set(priceBook.map((i) => i.source))], [priceBook]);

  const spec = {
    inverterKva: Number(inverterKva) || 0,
    batteryKwh: Number(batteryKwh) || 0,
    batteryChemistry: chemistry,
    panelCount: Number(panelCount) || 0,
    panelWatts: Number(panelWatts) || 0,
  };
  const defaults = defaultAccessoryCosts(spec.inverterKva, spec.panelCount);
  const accessories: AccessoryCosts = {
    mounting: numberOr(accessoryOverrides.mounting, defaults.mounting),
    cables: numberOr(accessoryOverrides.cables, defaults.cables),
    protection: numberOr(accessoryOverrides.protection, defaults.protection),
    earthing: numberOr(accessoryOverrides.earthing, defaults.earthing),
  };
  const serviceDefaults = defaultServiceCosts(spec.inverterKva);
  const services: ServiceCosts = {
    labour: numberOr(serviceOverrides.labour, serviceDefaults.labour),
    transport: numberOr(serviceOverrides.transport, serviceDefaults.transport),
    siteSurvey: numberOr(serviceOverrides.siteSurvey, serviceDefaults.siteSurvey),
  };
  // A blank box means "use the price list" for that item.
  const manual: ManualEquipmentCosts = {};
  for (const { key } of MANUAL_FIELDS) {
    const raw = manualInputs[key]?.trim();
    if (raw && Number.isFinite(Number(raw))) manual[key] = Number(raw);
  }
  const estimate = estimateJob({ spec, priceBook, accessories, services, sourceFilter: source || undefined, manual });

  const applyPreset = (key: PackageKey | "custom") => {
    setPreset(key);
    if (key === "custom") return;
    const p = PACKAGES[key].spec;
    setInverterKva(String(p.inverterKva));
    setBatteryKwh(String(p.batteryKwh));
    setChemistry(p.batteryChemistry);
    setPanelCount(String(p.panelCount));
    setPanelWatts(String(p.panelWatts));
    setAccessoryOverrides({});
    setServiceOverrides({});
  };
  const edit = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setPreset("custom");
  };

  return (
    <>
    <div className="rounded-2xl border border-line bg-white p-6">
      <h2 className="font-display text-lg font-bold text-navy">Job cost calculator</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        Supplier cost, your markups (inverter 10%, battery 20%, panels 10%, accessories 35%), then labour,
        transport and the site survey, which you can change for each job. It picks the cheapest price on file
        for each item unless you choose one supplier or type the cost in yourself.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs font-semibold text-navy">
          Package
          <select value={preset} onChange={(e) => applyPreset(e.target.value as PackageKey | "custom")} className={`${inputClass} mt-1`}>
            {(Object.keys(PACKAGES) as PackageKey[]).map((key) => (
              <option key={key} value={key}>
                {PACKAGES[key].label}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-navy">
          Price source
          <select value={source} onChange={(e) => setSource(e.target.value)} className={`${inputClass} mt-1`}>
            <option value="">Cheapest on file</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s} only
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-navy">
          Inverter (kVA)
          <input type="number" min="0" step="0.1" value={inverterKva} onChange={edit(setInverterKva)} className={`${inputClass} mt-1`} />
        </label>
        <label className="text-xs font-semibold text-navy">
          Battery (kWh)
          <div className="mt-1 flex gap-2">
            <input type="number" min="0" step="0.1" value={batteryKwh} onChange={edit(setBatteryKwh)} className={inputClass} />
            <select
              value={chemistry}
              onChange={(e) => {
                setChemistry(e.target.value as Chemistry);
                setPreset("custom");
              }}
              className={inputClass}
            >
              <option value="lithium">Lithium</option>
              <option value="tubular">Tubular</option>
            </select>
          </div>
        </label>
        <label className="text-xs font-semibold text-navy">
          Panels (count x watts)
          <div className="mt-1 flex gap-2">
            <input type="number" min="0" value={panelCount} onChange={edit(setPanelCount)} className={inputClass} />
            <input type="number" min="0" step="10" value={panelWatts} onChange={edit(setPanelWatts)} className={inputClass} />
          </div>
        </label>
      </div>

      <details className="mt-4 rounded-xl border border-line px-4 py-3">
        <summary className="cursor-pointer text-xs font-semibold text-navy">
          Type equipment costs by hand (leave a box empty to use the price lists)
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {MANUAL_FIELDS.map((field) => (
            <label key={field.key} className="text-xs font-semibold text-navy">
              {field.label} (₦)
              <input
                type="number"
                min="0"
                placeholder="From price list"
                value={manualInputs[field.key] ?? ""}
                onChange={(e) => setManualInputs((prev) => ({ ...prev, [field.key]: e.target.value }))}
                className={`${inputClass} mt-1`}
              />
            </label>
          ))}
        </div>
      </details>

      <details className="mt-4 rounded-xl border border-line px-4 py-3">
        <summary className="cursor-pointer text-xs font-semibold text-navy">
          Accessory costs (estimated from system size, edit if you have real figures)
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ACCESSORY_FIELDS.map((field) => (
            <label key={field.key} className="text-xs font-semibold text-navy">
              {field.label} (₦)
              <input
                type="number"
                min="0"
                value={accessoryOverrides[field.key] ?? String(defaults[field.key])}
                onChange={(e) => setAccessoryOverrides((prev) => ({ ...prev, [field.key]: e.target.value }))}
                className={`${inputClass} mt-1`}
              />
            </label>
          ))}
        </div>
      </details>

      {estimate.missing.length > 0 ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
          No price on file for: {estimate.missing.join(", ")}. The total below leaves these out. Add a supplier price
          below.
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-xs uppercase tracking-wide text-charcoal/45">
            <tr className="border-b border-line">
              <th className="py-2 text-left">Item</th>
              <th className="py-2 text-right">Cost</th>
              <th className="py-2 text-right">Markup</th>
              <th className="py-2 text-right">Our price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {estimate.equipment.map((line) => (
              <tr key={line.key}>
                <td className="py-2 pr-3">
                  <span className="font-medium text-navy">{line.label}</span>
                  {line.detail ? <span className="block text-xs text-charcoal/50">{line.detail}</span> : null}
                </td>
                <td className="py-2 text-right font-mono-num text-charcoal/70">{formatNaira(line.cost)}</td>
                <td className="py-2 text-right font-mono-num text-charcoal/55">{Math.round(line.markupRate * 100)}%</td>
                <td className="py-2 text-right font-mono-num text-navy">{formatNaira(line.price)}</td>
              </tr>
            ))}
            <tr className="font-semibold text-navy">
              <td className="py-2">Equipment total</td>
              <td className="py-2 text-right font-mono-num">{formatNaira(estimate.equipmentCost)}</td>
              <td />
              <td className="py-2 text-right font-mono-num">{formatNaira(estimate.equipmentPrice)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-1.5 rounded-xl bg-mist p-5 text-sm">
        <Row label="Equipment (our price)" value={estimate.equipmentPrice} />
        <div className="grid gap-3 py-2 sm:grid-cols-3">
          {SERVICE_FIELDS.map((field) => (
            <label key={field.key} className="text-xs font-semibold text-navy">
              {field.label} (₦)
              <input
                type="number"
                min="0"
                value={serviceOverrides[field.key] ?? String(serviceDefaults[field.key])}
                onChange={(e) => setServiceOverrides((prev) => ({ ...prev, [field.key]: e.target.value }))}
                className={`${inputClass} mt-1 bg-white`}
              />
              <span className="mt-1 block font-normal text-charcoal/50">{field.hint}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-lg font-bold text-navy">
          <span>Final price</span>
          <span className="font-mono-num text-orange">{formatNaira(estimate.finalPrice)}</span>
        </div>
        <div className="flex justify-between text-xs text-charcoal/60">
          <span>Rounded for the written quote</span>
          <span className="font-mono-num">{formatNaira(roundQuote(estimate.finalPrice))}</span>
        </div>
        <div className="flex justify-between text-xs text-charcoal/60">
          <span>Deposit (covers the equipment), balance after installation</span>
          <span className="font-mono-num">
            {formatNaira(roundQuote(estimate.finalPrice) - estimate.labour - estimate.transport - estimate.siteSurvey)}
          </span>
        </div>
        <div className="flex justify-between text-xs font-semibold text-green-700">
          <span>Expected margin (equipment markups)</span>
          <span className="font-mono-num">{formatNaira(estimate.expectedMargin)}</span>
        </div>
      </div>

      <p className="mt-4 rounded-xl border border-orange/30 bg-orange/5 px-4 py-3 text-xs font-medium text-navy">
        Internal figures only. Don&apos;t read them to a customer. After the site assessment, fill in the customer
        quote below and send them the PDF.
      </p>
    </div>

    <CustomerQuoteBuilder estimate={estimate} spec={spec} />
    </>
  );
}

function numberOr(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function Row({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "font-semibold text-navy" : "text-charcoal/70"}`}>
      <span>{label}</span>
      <span className="font-mono-num">{formatNaira(value)}</span>
    </div>
  );
}
