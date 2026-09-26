// The customer-facing quote, built in /admin/pricing from the job cost
// calculator. It carries only what the customer is allowed to see: the
// equipment list (no per-item prices, no supplier names), one equipment total
// and one installation total. Supplier costs and markups never enter this
// object, so they can't leak onto the printed quote or a My System page.
// Pure functions, safe on the client and the server.

import { PROMISE_TERMS } from "./promises";

export type QuoteItem = { description: string; warranty?: string };

export type LoadItem = { appliance: string; quantity: number; watts?: number; hours: number };

export type FuelInputs = {
  monthlyNow: number; // what the customer spends on fuel a month today
  generatorHoursPerDay: number; // hours the generator will still run after install
  litresPerHour: number;
  pricePerLitre: number;
};

export type CustomerQuote = {
  number: string;
  date: string; // yyyy-mm-dd
  customer: { name: string; phone?: string; address?: string };
  systemSummary: string;
  items: QuoteItem[];
  equipmentTotal: number;
  installationTotal: number;
  assessmentFeePaid: number;
  load: LoadItem[];
  fuel?: FuelInputs;
  notes?: string;
};

export function quoteTotal(quote: CustomerQuote): number {
  return quote.equipmentTotal + quote.installationTotal;
}

// The deposit covers the equipment, the balance is paid once the system is
// installed and working. The site assessment fee comes off what's left.
export function paymentSchedule(quote: CustomerQuote) {
  const total = quoteTotal(quote);
  const amountDue = Math.max(0, total - quote.assessmentFeePaid);
  const deposit = Math.min(quote.equipmentTotal, amountDue);
  return { total, amountDue, deposit, balance: amountDue - deposit };
}

export function fuelSavings(fuel: FuelInputs, systemPrice: number) {
  const monthlyAfter = fuel.generatorHoursPerDay * 30 * fuel.litresPerHour * fuel.pricePerLitre;
  const monthlySaving = fuel.monthlyNow - monthlyAfter;
  const paybackMonths = monthlySaving > 0 ? Math.ceil(systemPrice / monthlySaving) : null;
  return { monthlyAfter, monthlySaving, paybackMonths };
}

export function quoteValidUntil(quote: CustomerQuote): string {
  return addDays(quote.date, PROMISE_TERMS.quoteValidDays);
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function addMonths(isoDate: string, months: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function newQuoteNumber(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `PNX-${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
}

// The quote travels to the print page in the URL, as base64url JSON.
export function encodeQuote(quote: CustomerQuote): string {
  const bytes = new TextEncoder().encode(JSON.stringify(quote));
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeQuote(encoded: string | undefined | null): CustomerQuote | null {
  if (!encoded) return null;
  try {
    const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return parseQuote(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return null;
  }
}

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : 0);

// Rebuilds a quote from untrusted JSON (a URL or a database row), keeping
// only the known fields.
export function parseQuote(raw: unknown): CustomerQuote | null {
  if (!raw || typeof raw !== "object") return null;
  const q = raw as Record<string, unknown>;
  const customer = (q.customer ?? {}) as Record<string, unknown>;
  const name = str(customer.name, 120);
  const date = str(q.date, 10);
  if (!name || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

  const items = Array.isArray(q.items)
    ? q.items.slice(0, 30).map((i) => {
        const item = (i ?? {}) as Record<string, unknown>;
        return { description: str(item.description, 200), warranty: str(item.warranty, 120) || undefined };
      })
    : [];
  const load = Array.isArray(q.load)
    ? q.load.slice(0, 40).map((i) => {
        const row = (i ?? {}) as Record<string, unknown>;
        return {
          appliance: str(row.appliance, 120),
          quantity: num(row.quantity) || 1,
          watts: num(row.watts) || undefined,
          hours: num(row.hours),
        };
      })
    : [];
  const fuelRaw = q.fuel as Record<string, unknown> | undefined;
  const fuel =
    fuelRaw && num(fuelRaw.monthlyNow) > 0
      ? {
          monthlyNow: num(fuelRaw.monthlyNow),
          generatorHoursPerDay: num(fuelRaw.generatorHoursPerDay),
          litresPerHour: num(fuelRaw.litresPerHour),
          pricePerLitre: num(fuelRaw.pricePerLitre),
        }
      : undefined;

  return {
    number: str(q.number, 40),
    date,
    customer: { name, phone: str(customer.phone, 40) || undefined, address: str(customer.address, 200) || undefined },
    systemSummary: str(q.systemSummary, 200),
    items: items.filter((i) => i.description),
    equipmentTotal: num(q.equipmentTotal),
    installationTotal: num(q.installationTotal),
    assessmentFeePaid: num(q.assessmentFeePaid),
    load: load.filter((l) => l.appliance),
    fuel,
    notes: str(q.notes, 1000) || undefined,
  };
}
