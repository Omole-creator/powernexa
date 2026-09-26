import Image from "next/image";
import {
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
  paymentSchedule,
  quoteValidUntil,
  type CustomerQuote,
} from "@/lib/quote";

// The written quote a customer receives. Laid out for A4 so "Download PDF"
// (the browser's print to PDF) gives a clean document. Shows totals only,
// never supplier costs or markups: those aren't in CustomerQuote at all.
export function QuoteDocument({ quote }: { quote: CustomerQuote }) {
  const pay = paymentSchedule(quote);
  const fuel = quote.fuel ? fuelSavings(quote.fuel, pay.total) : null;

  return (
    <article className="mx-auto max-w-[800px] bg-white p-8 text-[13px] leading-relaxed text-charcoal sm:p-12 print:max-w-none print:p-0">
      <header className="flex flex-col gap-6 border-b-2 border-navy pb-6 sm:flex-row sm:items-start sm:justify-between">
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
        <div className="sm:text-right">
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

      <section className="mt-6 grid gap-6 sm:grid-cols-2">
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
        <SectionTitle>What we supply and install</SectionTitle>
        <ul className="divide-y divide-line border-y border-line">
          {quote.items.map((item, index) => (
            <li key={index} className="flex justify-between gap-4 py-2">
              <span>{item.description}</span>
              {item.warranty ? <span className="shrink-0 text-xs text-charcoal/60">{item.warranty}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 break-inside-avoid">
        <SectionTitle>Price</SectionTitle>
        <div className="space-y-1.5">
          <MoneyRow label="Equipment and materials" value={quote.equipmentTotal} />
          <MoneyRow label="Installation and commissioning" value={quote.installationTotal} />
          <p className="text-xs text-charcoal/60">Includes workmanship, transport to your site, setup and testing.</p>
          <MoneyRow label="Total" value={pay.total} strong />
          {quote.assessmentFeePaid > 0 ? (
            <>
              <MoneyRow label="Less site assessment fee already paid" value={-quote.assessmentFeePaid} />
              <MoneyRow label="Amount to pay" value={pay.amountDue} strong />
            </>
          ) : null}
        </div>
        <div className="mt-4 rounded-xl bg-mist p-4 print:border print:border-line print:bg-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy">How you pay</p>
          <div className="mt-2 space-y-1.5">
            <MoneyRow label="Deposit, to buy your equipment" value={pay.deposit} />
            <MoneyRow label="Balance, after installation once you see it working" value={pay.balance} />
          </div>
        </div>
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
          <p className="mt-2 text-xs text-charcoal/60">
            This list is the one our carry guarantee covers. {CARRY_GUARANTEE_TERMS}
          </p>
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

      <section className="mt-8 break-inside-avoid">
        <SectionTitle>Our promises to you</SectionTitle>
        <ol className="grid gap-3 sm:grid-cols-2">
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
