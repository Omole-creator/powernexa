import Image from "next/image";
import {
  BANK_DETAILS,
  BUSINESS_ADDRESS,
  CONTACT_EMAIL,
  PHONE_DISPLAY,
  PHONE_DISPLAY_2,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { formatNaira } from "@/lib/costing";
import { CARRY_GUARANTEE_TERMS, PROMISES, PROMISE_TERMS, WORKMANSHIP_TERMS } from "@/lib/promises";
import {
  formatDate,
  fuelSavings,
  isInstallationOnly,
  paymentSchedule,
  quoteValidUntil,
  type CustomerQuote,
} from "@/lib/quote";

// The written quote a customer receives. Laid out for A4 so "Download PDF"
// (the browser's print to PDF) gives a clean document. Shows the selling price
// of each item, never supplier costs or markups: those aren't in
// CustomerQuote at all. Inner layout uses container queries (@2xl), not screen
// breakpoints, so the PDF made on a phone (ShareQuoteButton) looks the same as
// one made on a laptop.
export function QuoteDocument({ quote }: { quote: CustomerQuote }) {
  const pay = paymentSchedule(quote);
  const fuel = quote.fuel ? fuelSavings(quote.fuel, pay.total) : null;
  const installationOnly = isInstallationOnly(quote);
  const priced = quote.items.length > 0 && quote.items.every((i) => i.amount !== undefined);

  return (
    <article className="mx-auto max-w-[800px] bg-white p-8 text-[13px] leading-relaxed text-charcoal sm:p-12 print:max-w-none print:p-0 @container">
      <header className="flex flex-col gap-6 border-b-2 border-navy pb-6 @2xl:flex-row @2xl:items-start @2xl:justify-between">
        <div>
          <Image src="/images/logo.png" alt={SITE_NAME} width={1536} height={1024} className="h-14 w-auto" priority />
          <p className="mt-3 text-xs text-charcoal/70">
            {BUSINESS_ADDRESS.street}, {BUSINESS_ADDRESS.area}, {BUSINESS_ADDRESS.city}
            <br />
            {PHONE_DISPLAY} · {PHONE_DISPLAY_2} · {CONTACT_EMAIL}
            <br />
            {SITE_URL.replace(/^https?:\/\//, "")}
          </p>
        </div>
        <div className="@2xl:text-right">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-navy">Quote</h1>
          <dl className="mt-2 space-y-0.5 text-xs">
            {quote.number ? (
              <div>
                <dt className="inline text-charcoal/60">Quote no. </dt>
                <dd className="inline font-mono-num font-semibold">{quote.number}</dd>
              </div>
            ) : null}
            <div>
              <dt className="inline text-charcoal/60">Date </dt>
              <dd className="inline font-semibold">{formatDate(quote.date)}</dd>
            </div>
            <div>
              <dt className="inline text-charcoal/60">Valid until </dt>
              <dd className="inline font-semibold">{formatDate(quoteValidUntil(quote))}</dd>
            </div>
          </dl>
        </div>
      </header>

      {/* Wrapped so the WhatsApp PDF (ShareQuoteButton) captures a plain block:
          it paints a white background onto each block it captures, which on
          the navy box itself hid the white bank and account name. */}
      <div className="mt-6 break-inside-avoid">
        <section aria-label="Payment details" className="overflow-hidden rounded-2xl bg-navy text-white">
          <div className="h-1 bg-gradient-to-r from-orange via-yellow to-orange" />
          <div className="grid gap-4 px-5 py-4 @2xl:grid-cols-[auto_1fr_auto] @2xl:items-center @2xl:gap-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-yellow">
              Pay into
              <span className="block font-medium normal-case tracking-normal text-white/60">our business account</span>
            </p>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-white/60">Bank</dt>
                <dd className="font-display text-base font-bold">{BANK_DETAILS.bank}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-white/60">Account name</dt>
                <dd className="font-display text-base font-bold">{BANK_DETAILS.accountName}</dd>
              </div>
            </dl>
            <div className="@2xl:text-right">
              <p className="text-[11px] uppercase tracking-wide text-white/60">Account number</p>
              <p className="font-mono-num text-2xl font-bold tracking-[0.08em] text-orange">{BANK_DETAILS.accountNumber}</p>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 grid gap-6 @2xl:grid-cols-2">
        <div>
          <SectionTitle>Prepared for</SectionTitle>
          <p className="font-semibold text-navy">{quote.customer.name}</p>
          {quote.customer.phone ? <p>{quote.customer.phone}</p> : null}
          {quote.customer.address ? <p>{quote.customer.address}</p> : null}
        </div>
        {quote.systemSummary ? (
          <div>
            <SectionTitle>Your system</SectionTitle>
            <p className="font-semibold text-navy">{quote.systemSummary}</p>
          </div>
        ) : null}
      </section>

      <section className="mt-8 break-inside-avoid">
        <SectionTitle>{installationOnly ? "What we install" : "What we supply and install"}</SectionTitle>
        {priced ? (
          <table className="w-full text-left">
            <thead className="text-xs text-charcoal/60">
              <tr className="border-b border-line">
                <th className="py-1.5 font-medium">Item</th>
                <th className="py-1.5 text-right font-medium">Qty</th>
                <th className="py-1.5 text-right font-medium">Unit price</th>
                <th className="py-1.5 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {quote.items.map((item, index) => (
                <tr key={index} className="align-top">
                  <td className="py-2 pr-3">
                    {item.description}
                    {item.warranty ? <span className="block text-xs text-charcoal/60">Warranty: {item.warranty}</span> : null}
                  </td>
                  <td className="py-2 text-right font-mono-num">{item.quantity ?? 1}</td>
                  <td className="py-2 pl-3 text-right font-mono-num whitespace-nowrap">{formatNaira(item.unitPrice ?? item.amount ?? 0)}</td>
                  <td className="py-2 pl-3 text-right font-mono-num whitespace-nowrap">{formatNaira(item.amount ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
        <ul className="divide-y divide-line border-y border-line">
          {quote.items.map((item, index) => (
            <li key={index} className="flex justify-between gap-4 py-2">
              <span>{item.description}</span>
              {item.warranty ? <span className="shrink-0 text-xs text-charcoal/60">{item.warranty}</span> : null}
            </li>
          ))}
        </ul>
        )}
      </section>

      <section className="mt-8 break-inside-avoid">
        <SectionTitle>Price</SectionTitle>
        <div className="space-y-1.5">
          <MoneyRow label="Equipment and materials" value={quote.equipmentTotal} />
          <MoneyRow label={installationOnly ? "Labour" : "Installation and commissioning"} value={quote.installationTotal} />
          {installationOnly ? null : (
            <p className="text-xs text-charcoal/60">Includes workmanship, transport to your site, setup and testing.</p>
          )}
          <MoneyRow label="Total" value={pay.total} strong />
          {quote.assessmentFeePaid > 0 ? (
            <>
              <MoneyRow label="Less site assessment fee already paid" value={-quote.assessmentFeePaid} />
              <MoneyRow label="Amount to pay" value={pay.amountDue} strong />
            </>
          ) : null}
        </div>
        {installationOnly ? null : (
          <div className="mt-4 rounded-xl bg-mist p-4 print:border print:border-line print:bg-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy">How you pay</p>
            <div className="mt-2 space-y-1.5">
              <MoneyRow label={`Deposit (${pay.depositPercent}%), covers your equipment`} value={pay.deposit} />
              <MoneyRow label={`Balance (${pay.balancePercent}%), after installation once you see it working`} value={pay.balance} />
            </div>
          </div>
        )}
      </section>

      {quote.load.length > 0 ? (
        <section className="mt-8 break-inside-avoid">
          <SectionTitle>What this system will carry</SectionTitle>
          <table className="w-full text-left">
            <thead className="text-xs text-charcoal/60">
              <tr className="border-b border-line">
                <th className="py-1.5 font-medium">Appliance</th>
                <th className="py-1.5 text-right font-medium">Quantity</th>
                <th className="py-1.5 text-right font-medium">Watts each</th>
                <th className="py-1.5 text-right font-medium">Hours on battery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {quote.load.map((row, index) => (
                <tr key={index}>
                  <td className="py-1.5">{row.appliance}</td>
                  <td className="py-1.5 text-right font-mono-num">{row.quantity}</td>
                  <td className="py-1.5 text-right font-mono-num">{row.watts ? `${row.watts}W` : "-"}</td>
                  <td className="py-1.5 text-right font-mono-num">{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {installationOnly ? null : (
            <p className="mt-2 text-xs text-charcoal/60">
              This list is the one our carry guarantee covers. {CARRY_GUARANTEE_TERMS}
            </p>
          )}
        </section>
      ) : null}

      {quote.fuel && fuel ? (
        <section className="mt-8 break-inside-avoid">
          <SectionTitle>Your fuel spend, before and after</SectionTitle>
          <div className="space-y-1.5">
            <MoneyRow label="What you spend on fuel now, per month" value={quote.fuel.monthlyNow} />
            <MoneyRow label="What you'll spend after installation, per month" value={fuel.monthlyAfter} />
            <MoneyRow label="What you save, per month" value={fuel.monthlySaving} strong />
          </div>
          {fuel.paybackMonths ? (
            <p className="mt-3 font-semibold text-navy">
              At that saving, the system pays for itself in about {fuel.paybackMonths} months.
            </p>
          ) : null}
          <p className="mt-2 text-xs text-charcoal/60">
            &quot;After&quot; assumes your generator runs about {plural(quote.fuel.generatorHoursPerDay, "hour")} a day,
            using {plural(quote.fuel.litresPerHour, "litre")} an hour, with fuel at {formatNaira(quote.fuel.pricePerLitre)} a litre. If
            fuel prices go up, you save more.
          </p>
        </section>
      ) : null}

      {/* The promises assume we supply the equipment, so an installation-only quote leaves them out. */}
      {installationOnly ? null : (
      <section className="mt-8 break-inside-avoid">
        <SectionTitle>Our promises to you</SectionTitle>
        <ol className="grid gap-3 @2xl:grid-cols-2">
          {PROMISES.map((promise, index) => (
            <li key={promise.key} className="rounded-xl border border-line p-3">
              <p className="font-semibold text-navy">
                {index + 1}. {promise.title}
              </p>
              <p className="mt-1 text-xs text-charcoal/75">{promise.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-charcoal/60">
          Workmanship warranty ({PROMISE_TERMS.workmanshipYears === 1 ? "1 year" : `${PROMISE_TERMS.workmanshipYears} years`} from installation): {WORKMANSHIP_TERMS}
        </p>
      </section>
      )}

      {quote.notes ? (
        <section className="mt-8 break-inside-avoid">
          <SectionTitle>Notes</SectionTitle>
          <p className="whitespace-pre-line">{quote.notes}</p>
        </section>
      ) : null}

      <footer className="mt-10 border-t border-line pt-4 text-xs text-charcoal/60">
        This quote is valid until {formatDate(quoteValidUntil(quote))}. Questions? WhatsApp or call {PHONE_DISPLAY} or{" "}
        {PHONE_DISPLAY_2}.
      </footer>
    </article>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-orange">{children}</h2>;
}

function MoneyRow({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "border-t border-line pt-1.5 text-base font-bold text-navy" : ""}`}>
      <span>{label}</span>
      <span className="font-mono-num">
        {value < 0 ? "-" : ""}
        {formatNaira(Math.abs(value))}
      </span>
    </div>
  );
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}
