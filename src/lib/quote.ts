// The customer-facing quote, built in /admin/pricing from the job cost
// calculator. It carries only what the customer is allowed to see: the
// equipment list with the selling price of each item (after markup), one
// equipment total and one installation total. Supplier costs, markup rates
// and supplier names never enter this object, so they can't leak onto the
// printed quote or a My System page.
// Pure functions, safe on the client and the server.

import { PROMISE_TERMS } from "./promises";

// quantity / unitPrice / amount are missing on quotes saved before item
// prices were shown; those print as a plain list.
export type QuoteItem = { description: string; warranty?: string; quantity?: number; unitPrice?: number; amount?: number };

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

// The customer supplies their own equipment and we only install, so there's
// no equipment for a deposit to cover: the quote has no deposit and balance.
export function isInstallationOnly(quote: Pick<CustomerQuote, "equipmentTotal">): boolean {
  return quote.equipmentTotal <= 0;
}

export function quoteTotal(quote: CustomerQuote): number {
  return quote.equipmentTotal + quote.installationTotal;
}

// The deposit always covers the equipment. Owner's preference is a 70/30
// split, used whenever 70% is enough to cover the equipment; otherwise the
// deposit is the equipment total. The balance is paid once the system is
// installed and working.
export const PREFERRED_DEPOSIT_SHARE = 0.7;

export function splitPayment(amountDue: number, equipmentTotal: number) {
  const preferred = Math.ceil((amountDue * PREFERRED_DEPOSIT_SHARE) / 1000) * 1000;
  const deposit = Math.min(amountDue, Math.max(equipmentTotal, preferred));
  const balance = amountDue - deposit;
  const depositPercent = amountDue > 0 ? Math.round((deposit / amountDue) * 100) : 0;
  return { deposit, balance, depositPercent, balancePercent: amountDue > 0 ? 100 - depositPercent : 0 };
}

// The site assessment fee comes off the total before the split.
export function paymentSchedule(quote: CustomerQuote) {
  const total = quoteTotal(quote);
  const amountDue = Math.max(0, total - quote.assessmentFeePaid);
  return { total, amountDue, ...splitPayment(amountDue, quote.equipmentTotal) };
}

// Customer prices for each equipment line. The calculator's marked-up prices
// are scaled so they add up exactly to the rounded equipment total, and unit
// prices are kept to whole ₦1,000s. What's left over from rounding goes on a
// single-unit line that already has a price (never a ₦0 line the customer
// isn't paying for), so every row still reads quantity x unit price = amount.
export function priceItems(
  lines: { quantity: number; price: number }[],
  equipmentTotal: number
): { quantity: number; unitPrice: number; amount: number }[] {
  const raw = lines.reduce((a, l) => a + l.price, 0);
  const scale = raw > 0 ? equipmentTotal / raw : 0;
  const priced = lines.map((l) => {
    const quantity = Math.max(1, l.quantity);
    const unitPrice = Math.round((l.price * scale) / quantity / 1000) * 1000;
    return { quantity, unitPrice, amount: unitPrice * quantity };
  });
  const leftover = equipmentTotal - priced.reduce((a, p) => a + p.amount, 0);
  if (leftover !== 0) {
    const singles = priced.filter((p) => p.quantity === 1 && p.amount > 0 && p.amount + leftover > 0);
    const target = singles.sort((a, b) => b.amount - a.amount)[0];
    if (target) {
      target.amount += leftover;
      target.unitPrice = target.amount;
    }
  }
  return priced;
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
// Like num, but missing stays missing: a ₦0 price is a price, not "no price".
const optNum = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : undefined);

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
        return {
          description: str(item.description, 200),
          warranty: str(item.warranty, 120) || undefined,
          quantity: num(item.quantity) || undefined,
          unitPrice: optNum(item.unitPrice),
          amount: optNum(item.amount),
        };
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
