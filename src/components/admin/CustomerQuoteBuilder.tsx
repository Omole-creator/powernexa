"use client";

import { useState, useTransition } from "react";
import { saveQuoteAction } from "@/actions/saved-quotes";
import { formatNaira, roundQuote, type JobEstimate, type SystemSpec } from "@/lib/costing";
import { encodeQuote, fuelSavings, newQuoteNumber, paymentSchedule, type CustomerQuote } from "@/lib/quote";
import { LOAD_COLUMNS, RowsEditor, type Row } from "./RowsEditor";
import type { CalcState } from "./PricingCalculator";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

const MAIN_ITEMS = ["inverter", "battery", "panel"];

// Everything typed into this form, saved with the quote so it can be edited later.
type Draft = {
  number: string;
  customer: { name: string; phone: string; address: string };
  date: string;
  summary: string;
  descriptions: Record<string, string>;
  warranties: Record<string, string>;
  load: Row[];
  feePaid: string;
  fuel: { monthlyNow: string; generatorHoursPerDay: string; litresPerHour: string; pricePerLitre: string };
  notes: string;
};

type SavedTotals = { equipment: number; installation: number };

export type SavedQuoteInput = { id: number; draft: unknown; totals: SavedTotals };

function freshDraft(): Draft {
  return {
    number: newQuoteNumber(),
    customer: { name: "", phone: "", address: "" },
    date: new Date().toISOString().slice(0, 10),
    summary: "",
    descriptions: {},
    warranties: {},
    load: [{}],
    feePaid: "",
    fuel: { monthlyNow: "", generatorHoursPerDay: "", litresPerHour: "", pricePerLitre: "" },
    notes: "",
  };
}

// Turns the calculator's figures into the written quote the customer gets.
// Only two totals go across: equipment (rounded price minus the service
// lines) and installation (labour, transport, survey). No per-item prices,
// costs, markups or supplier names.
export function CustomerQuoteBuilder({
  estimate,
  spec,
  calc,
  savedQuote,
}: {
  estimate: JobEstimate;
  spec: SystemSpec;
  calc: CalcState;
  savedQuote?: SavedQuoteInput;
}) {
  const [draft, setDraft] = useState<Draft>(() => ({ ...freshDraft(), ...((savedQuote?.draft as Partial<Draft>) ?? {}) }));
  const [savedId, setSavedId] = useState<number | null>(savedQuote?.id ?? null);
  // The totals as last saved. When today's price lists give different
  // figures, the editor warns before the saved (possibly sent) quote changes.
  const [savedTotals, setSavedTotals] = useState<SavedTotals | null>(savedQuote?.totals ?? null);
  const [saveStatus, setSaveStatus] = useState<{ ok?: string; error?: string }>({});
  const [isSaving, startSaving] = useTransition();
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaveStatus({});
  };

  const defaultSummary = `${spec.inverterKva}kVA inverter, ${spec.batteryKwh}kWh ${spec.batteryChemistry} battery, ${spec.panelCount} x ${spec.panelWatts}W solar panels`;
  const total = roundQuote(estimate.finalPrice);
  const installationTotal = estimate.labour + estimate.transport + estimate.siteSurvey;

  const quote: CustomerQuote = {
    number: draft.number,
    date: draft.date,
    customer: {
      name: draft.customer.name.trim(),
      phone: draft.customer.phone.trim() || undefined,
      address: draft.customer.address.trim() || undefined,
    },
    systemSummary: draft.summary.trim() || defaultSummary,
    items: estimate.equipment.map((line) => ({
      description: draft.descriptions[line.key]?.trim() || customerLabel(line.key, line.label),
      warranty: draft.warranties[line.key]?.trim() || undefined,
    })),
    equipmentTotal: total - installationTotal,
    installationTotal,
    assessmentFeePaid: toNumber(draft.feePaid),
    load: draft.load
      .filter((r) => r.appliance?.trim())
      .map((r) => ({
        appliance: r.appliance.trim(),
        quantity: toNumber(r.quantity) || 1,
        watts: toNumber(r.watts) || undefined,
        hours: toNumber(r.hours),
      })),
    fuel:
      toNumber(draft.fuel.monthlyNow) > 0
        ? {
            monthlyNow: toNumber(draft.fuel.monthlyNow),
            generatorHoursPerDay: toNumber(draft.fuel.generatorHoursPerDay),
            litresPerHour: toNumber(draft.fuel.litresPerHour),
            pricePerLitre: toNumber(draft.fuel.pricePerLitre),
          }
        : undefined,
    notes: draft.notes.trim() || undefined,
  };
  const pay = paymentSchedule(quote);
  const savings = quote.fuel ? fuelSavings(quote.fuel, pay.total) : null;
  const quoteHref = `/admin/quote?d=${encodeQuote(quote)}${savedId ? `&id=${savedId}` : ""}`;

  const blocker = !quote.customer.name
    ? "Enter the customer's name first."
    : estimate.missing.length > 0
      ? `Add a price for: ${estimate.missing.join(", ")}.`
      : quote.load.length === 0
        ? "Add at least one appliance to the load list. The carry guarantee is based on it."
        : null;

  const priceChanged =
    savedTotals !== null &&
    (savedTotals.equipment !== quote.equipmentTotal || savedTotals.installation !== quote.installationTotal);

  const save = () => {
    if (
      priceChanged &&
      !confirm(
        `The price has changed since this quote was saved (${formatNaira(savedTotals.equipment + savedTotals.installation)} then, ${formatNaira(pay.total)} now). If the customer already has this quote, saving changes their price. Save the new price?`
      )
    ) {
      return;
    }
    startSaving(async () => {
      const result = await saveQuoteAction(savedId, JSON.stringify(quote), JSON.stringify({ calc, draft }));
      if (result.error || !result.id) {
        setSaveStatus({ error: result.error ?? "Could not save." });
        return;
      }
      setSavedId(result.id);
      setSavedTotals({ equipment: quote.equipmentTotal, installation: quote.installationTotal });
      window.history.replaceState(null, "", `/admin/pricing?quote=${result.id}`);
      setSaveStatus({ ok: `Saved as ${draft.number}.` });
    });
  };

  const startNew = () => {
    if (!confirm("Start a new quote? Anything not saved on this one is lost.")) return;
    setDraft(freshDraft());
    setSavedId(null);
    setSavedTotals(null);
    setSaveStatus({});
    window.history.replaceState(null, "", "/admin/pricing");
  };

  return (
    <div id="customer-quote" className="mt-6 rounded-2xl border-2 border-navy/10 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-navy">
            Customer quote <span className="font-mono-num text-sm font-medium text-charcoal/50">{draft.number}</span>
          </h2>
        </div>
        {savedId ? (
          <button type="button" onClick={startNew} className="text-xs font-semibold text-orange">
            + New quote
          </button>
        ) : null}
      </div>

      <Section title="Customer details" summary={draft.customer.name || "Not filled in"} defaultOpen>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Customer name">
            <input value={draft.customer.name} onChange={(e) => set("customer", { ...draft.customer, name: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Phone">
            <input value={draft.customer.phone} onChange={(e) => set("customer", { ...draft.customer, phone: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Address">
            <input value={draft.customer.address} onChange={(e) => set("customer", { ...draft.customer, address: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Quote date">
            <input type="date" value={draft.date} onChange={(e) => set("date", e.target.value || draft.date)} className={inputClass} />
          </Field>
          <Field label="System, in one line" className="sm:col-span-2 lg:col-span-4">
            <input value={draft.summary} placeholder={defaultSummary} onChange={(e) => set("summary", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Equipment as the customer sees it" summary="Brand, model and the maker's warranty">
        <div className="space-y-2">
          {estimate.equipment.map((line) => (
            <div key={line.key} className="grid gap-2 sm:grid-cols-[2fr_1fr]">
              <input
                aria-label={`${line.label} description`}
                value={draft.descriptions[line.key] ?? ""}
                placeholder={customerLabel(line.key, line.label)}
                onChange={(e) => set("descriptions", { ...draft.descriptions, [line.key]: e.target.value })}
                className={inputClass}
              />
              {MAIN_ITEMS.includes(line.key) ? (
                <input
                  aria-label={`${line.label} warranty`}
                  value={draft.warranties[line.key] ?? ""}
                  placeholder="Maker's warranty, e.g. 5 years"
                  onChange={(e) => set("warranties", { ...draft.warranties, [line.key]: e.target.value })}
                  className={inputClass}
                />
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="What the system will carry" summary={`${quote.load.length} appliance${quote.load.length === 1 ? "" : "s"}`} defaultOpen>
        <p className="mb-2 text-xs text-charcoal/55">
          From the site assessment. Backed by the 30-day carry guarantee, so only list what you measured.
        </p>
        <RowsEditor columns={LOAD_COLUMNS} rows={draft.load} onChange={(rows) => set("load", rows)} addLabel="Add appliance" />
      </Section>

      <Section
        title="Fuel savings and assessment fee"
        summary={savings ? `Saves ${formatNaira(savings.monthlySaving)} a month` : "Optional"}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Current fuel spend a month (₦)">
            <input inputMode="numeric" value={draft.fuel.monthlyNow} onChange={(e) => set("fuel", { ...draft.fuel, monthlyNow: e.target.value })} className={inputClass} placeholder="Customer tells you" />
          </Field>
          <Field label="Generator hours a day after">
            <input inputMode="decimal" value={draft.fuel.generatorHoursPerDay} onChange={(e) => set("fuel", { ...draft.fuel, generatorHoursPerDay: e.target.value })} className={inputClass} placeholder="0 if none" />
          </Field>
          <Field label="Litres an hour">
            <input inputMode="decimal" value={draft.fuel.litresPerHour} onChange={(e) => set("fuel", { ...draft.fuel, litresPerHour: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Price per litre (₦)">
            <input inputMode="numeric" value={draft.fuel.pricePerLitre} onChange={(e) => set("fuel", { ...draft.fuel, pricePerLitre: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Assessment fee paid (₦)">
            <input inputMode="numeric" value={draft.feePaid} onChange={(e) => set("feePaid", e.target.value)} className={inputClass} placeholder="Comes off the total" />
          </Field>
        </div>
        <p className="mt-1 text-xs text-charcoal/50">
          Leave &quot;current fuel spend&quot; empty and the fuel section stays off the quote.
        </p>
      </Section>

      <Section title="Notes on the quote" summary={draft.notes ? "Added" : "Optional"}>
        <textarea value={draft.notes} onChange={(e) => set("notes", e.target.value)} rows={2} className={inputClass} />
      </Section>

      {priceChanged ? (
        <div className="mt-5 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">The price has changed since this quote was saved.</p>
          <div className="mt-2 grid gap-1 font-mono-num text-xs sm:grid-cols-3">
            <span />
            <span className="font-sans font-semibold">As saved</span>
            <span className="font-sans font-semibold">Now</span>
            <span className="font-sans">Equipment and materials</span>
            <span>{formatNaira(savedTotals.equipment)}</span>
            <span>{formatNaira(quote.equipmentTotal)}</span>
            <span className="font-sans">Installation and commissioning</span>
            <span>{formatNaira(savedTotals.installation)}</span>
            <span>{formatNaira(quote.installationTotal)}</span>
            <span className="font-sans font-semibold">Total</span>
            <span className="font-semibold">{formatNaira(savedTotals.equipment + savedTotals.installation)}</span>
            <span className="font-semibold">{formatNaira(pay.total)}</span>
          </div>
          <p className="mt-2 text-xs">
            A supplier price or a calculator figure is different from when you saved. If the customer already has this
            quote, their price is the one as saved: open it from Saved quotes. Saving here changes it.
          </p>
        </div>
      ) : null}

      <div className="mt-5 space-y-1.5 rounded-xl bg-mist p-5 text-sm">
        <Line label="Equipment and materials" value={quote.equipmentTotal} />
        <Line label="Installation and commissioning" value={quote.installationTotal} />
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
        {/* Always visible, greyed out until the quote has what it needs. */}
        <a
          href={blocker ? undefined : `${quoteHref}&print=1`}
          target="_blank"
          rel="noopener"
          aria-disabled={blocker ? true : undefined}
          className={`rounded-full px-6 py-2.5 text-sm font-semibold text-white ${blocker ? "cursor-not-allowed bg-orange/40" : "bg-orange hover:bg-orange-dark"}`}
        >
          Download PDF
        </a>
        <a
          href={blocker ? undefined : quoteHref}
          target="_blank"
          rel="noopener"
          aria-disabled={blocker ? true : undefined}
          className={`rounded-full border px-6 py-2.5 text-sm font-semibold ${blocker ? "cursor-not-allowed border-line text-charcoal/35" : "border-navy/20 text-navy hover:border-orange"}`}
        >
          Preview
        </a>
        <button
          type="button"
          onClick={save}
          disabled={isSaving || blocker !== null}
          className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSaving ? "Saving..." : savedId ? "Save changes" : "Save quote"}
        </button>
        {blocker ? <p className="w-full text-xs font-medium text-red-600">{blocker}</p> : null}
        {saveStatus.ok ? <span className="text-xs font-medium text-green-700">{saveStatus.ok}</span> : null}
        {saveStatus.error ? <span className="text-xs font-medium text-red-600">{saveStatus.error}</span> : null}
        {!saveStatus.ok && !saveStatus.error ? (
          <span className="text-xs text-charcoal/50">
            Download PDF opens the print window: choose &quot;Save as PDF&quot;, then send it on WhatsApp.
            {savedId ? " Save changes to update it under Saved quotes." : " Save it to find it again under Saved quotes."}
          </span>
        ) : null}
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

function Section({
  title,
  summary,
  defaultOpen = false,
  children,
}: {
  title: string;
  summary: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group mt-4 rounded-xl border border-line px-4 py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-navy">
        <span>{title}</span>
        <span className="flex items-center gap-2 text-xs font-normal text-charcoal/50">
          <span className="truncate">{summary}</span>
          <span className="transition-transform group-open:rotate-180" aria-hidden="true">
            ▾
          </span>
        </span>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
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
