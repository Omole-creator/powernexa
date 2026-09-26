"use client";

import { useState } from "react";
import { formatNaira, roundQuote, type JobEstimate, type SystemSpec } from "@/lib/costing";
import { encodeQuote, fuelSavings, newQuoteNumber, paymentSchedule, type CustomerQuote } from "@/lib/quote";
import { LOAD_COLUMNS, RowsEditor, type Row } from "./RowsEditor";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

const MAIN_ITEMS = ["inverter", "battery", "panel"];

// Turns the calculator's figures into the written quote the customer gets.
// Only two totals go across: equipment (rounded price minus the service
// lines) and installation (labour, transport, survey). No per-item prices,
// costs, markups or supplier names.
export function CustomerQuoteBuilder({ estimate, spec }: { estimate: JobEstimate; spec: SystemSpec }) {
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [number] = useState(() => newQuoteNumber());
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [date, setDate] = useState(today);
  const [summary, setSummary] = useState("");
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [warranties, setWarranties] = useState<Record<string, string>>({});
  const [load, setLoad] = useState<Row[]>([{}]);
  const [feePaid, setFeePaid] = useState("");
  const [fuel, setFuel] = useState({ monthlyNow: "", generatorHoursPerDay: "", litresPerHour: "", pricePerLitre: "" });
  const [notes, setNotes] = useState("");

  const defaultSummary = `${spec.inverterKva}kVA inverter, ${spec.batteryKwh}kWh ${spec.batteryChemistry} battery, ${spec.panelCount} x ${spec.panelWatts}W solar panels`;
  const total = roundQuote(estimate.finalPrice);
  const installationTotal = estimate.labour + estimate.transport + estimate.siteSurvey;

  const quote: CustomerQuote = {
    number,
    date,
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim() || undefined,
      address: customer.address.trim() || undefined,
    },
    systemSummary: summary.trim() || defaultSummary,
    items: estimate.equipment.map((line) => ({
      description: descriptions[line.key]?.trim() || customerLabel(line.key, line.label),
      warranty: warranties[line.key]?.trim() || undefined,
    })),
    equipmentTotal: total - installationTotal,
    installationTotal,
    assessmentFeePaid: toNumber(feePaid),
    load: load
      .filter((r) => r.appliance?.trim())
      .map((r) => ({
        appliance: r.appliance.trim(),
        quantity: toNumber(r.quantity) || 1,
        watts: toNumber(r.watts) || undefined,
        hours: toNumber(r.hours),
      })),
    fuel:
      toNumber(fuel.monthlyNow) > 0
        ? {
            monthlyNow: toNumber(fuel.monthlyNow),
            generatorHoursPerDay: toNumber(fuel.generatorHoursPerDay),
            litresPerHour: toNumber(fuel.litresPerHour),
            pricePerLitre: toNumber(fuel.pricePerLitre),
          }
        : undefined,
    notes: notes.trim() || undefined,
  };
  const pay = paymentSchedule(quote);
  const savings = quote.fuel ? fuelSavings(quote.fuel, pay.total) : null;

  const blocker = !quote.customer.name
    ? "Enter the customer's name to open the quote."
    : estimate.missing.length > 0
      ? `Add a price for: ${estimate.missing.join(", ")}.`
      : quote.load.length === 0
        ? "Add at least one appliance to the load list. The carry guarantee is based on it."
        : null;

  return (
    <div className="mt-6 rounded-2xl border-2 border-navy/10 bg-white p-6">
      <h2 className="font-display text-lg font-bold text-navy">Customer quote</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        The written quote the customer gets, as a PDF. It shows the equipment list, one equipment total and one
        installation total. Your costs, markups and suppliers never appear on it.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Customer name">
          <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Phone">
          <input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Address">
          <input value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Quote date">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value || today)} className={inputClass} />
        </Field>
        <Field label="System, in one line" className="sm:col-span-2 lg:col-span-4">
          <input value={summary} placeholder={defaultSummary} onChange={(e) => setSummary(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <details className="mt-4 rounded-xl border border-line px-4 py-3">
        <summary className="cursor-pointer text-xs font-semibold text-navy">
          Equipment as the customer sees it (add brand, model and the maker&apos;s warranty)
        </summary>
        <div className="mt-3 space-y-2">
          {estimate.equipment.map((line) => (
            <div key={line.key} className="grid gap-2 sm:grid-cols-[2fr_1fr]">
              <input
                aria-label={`${line.label} description`}
                value={descriptions[line.key] ?? ""}
                placeholder={customerLabel(line.key, line.label)}
                onChange={(e) => setDescriptions({ ...descriptions, [line.key]: e.target.value })}
                className={inputClass}
              />
              {MAIN_ITEMS.includes(line.key) ? (
                <input
                  aria-label={`${line.label} warranty`}
                  value={warranties[line.key] ?? ""}
                  placeholder="Maker's warranty, e.g. 5 years"
                  onChange={(e) => setWarranties({ ...warranties, [line.key]: e.target.value })}
                  className={inputClass}
                />
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </details>

      <div className="mt-5">
        <p className="text-xs font-semibold text-navy">What the system will carry (from the site assessment)</p>
        <p className="mb-2 text-xs text-charcoal/55">
          Backed by the 30-day carry guarantee, so only list what you measured.
        </p>
        <RowsEditor columns={LOAD_COLUMNS} rows={load} onChange={setLoad} addLabel="Add appliance" />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Current fuel spend a month (₦)">
          <input inputMode="numeric" value={fuel.monthlyNow} onChange={(e) => setFuel({ ...fuel, monthlyNow: e.target.value })} className={inputClass} placeholder="Customer tells you" />
        </Field>
        <Field label="Generator hours a day after">
          <input inputMode="decimal" value={fuel.generatorHoursPerDay} onChange={(e) => setFuel({ ...fuel, generatorHoursPerDay: e.target.value })} className={inputClass} placeholder="0 if none" />
        </Field>
        <Field label="Litres an hour">
          <input inputMode="decimal" value={fuel.litresPerHour} onChange={(e) => setFuel({ ...fuel, litresPerHour: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Price per litre (₦)">
          <input inputMode="numeric" value={fuel.pricePerLitre} onChange={(e) => setFuel({ ...fuel, pricePerLitre: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Assessment fee paid (₦)">
          <input inputMode="numeric" value={feePaid} onChange={(e) => setFeePaid(e.target.value)} className={inputClass} placeholder="Comes off the total" />
        </Field>
      </div>
      <p className="mt-1 text-xs text-charcoal/50">
        Fuel is optional. Leave &quot;current fuel spend&quot; empty and the fuel section stays off the quote.
      </p>

      <Field label="Notes on the quote (optional)" className="mt-4">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputClass} />
      </Field>

      <div className="mt-5 space-y-1.5 rounded-xl bg-mist p-5 text-sm">
        <Line label="Equipment and materials" value={quote.equipmentTotal} />
        <Line label="Installation, transport and commissioning" value={quote.installationTotal} />
        <Line label="Total on the quote" value={pay.total} strong />
        {quote.assessmentFeePaid > 0 ? <Line label="Amount to pay after assessment fee" value={pay.amountDue} /> : null}
        <Line label="Deposit (covers the equipment)" value={pay.deposit} />
        <Line label="Balance, after installation" value={pay.balance} />
        {savings ? (
          <p className="pt-2 text-xs text-charcoal/70">
            Saves {formatNaira(savings.monthlySaving)} a month on fuel
            {savings.paybackMonths ? `, pays for itself in about ${savings.paybackMonths} months` : ", no payback (check the fuel figures)"}.
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {blocker ? (
          <p className="text-xs font-medium text-red-600">{blocker}</p>
        ) : (
          <a
            href={`/admin/quote?d=${encodeQuote(quote)}`}
            target="_blank"
            rel="noopener"
            className="rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-dark"
          >
            Open customer quote
          </a>
        )}
        <span className="text-xs text-charcoal/50">Opens in a new tab with a Download PDF button.</span>
      </div>
    </div>
  );
}

// Plain customer wording for each calculator line (no supplier or model names
// unless typed in above).
function customerLabel(key: string, label: string): string {
  if (key === "panel") return label.replace("panels", "solar panels");
  return label;
}

function toNumber(value: string | undefined): number {
  const n = Number(String(value ?? "").replace(/[₦,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function Field({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block text-xs font-semibold text-navy ${className}`}>
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Line({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "font-bold text-navy" : "text-charcoal/70"}`}>
      <span>{label}</span>
      <span className="font-mono-num">{formatNaira(value)}</span>
    </div>
  );
}
