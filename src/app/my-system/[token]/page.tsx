import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSystemByToken } from "@/lib/customer-systems";
import {
  carryGuaranteeEnds,
  checkupSchedule,
  eventKindLabel,
  todayLagos,
  workmanshipWarrantyEnds,
} from "@/lib/aftercare";
import { formatDate } from "@/lib/quote";
import { PROMISE_TERMS, WORKMANSHIP_TERMS } from "@/lib/promises";
import { BUSINESS_HOURS, PHONE_DISPLAY, PHONE_DISPLAY_2, PHONE_E164, PHONE_E164_2, SITE_NAME } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Your system",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

// A customer's private page, reached only by the link we send them.
export default async function MySystemPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const details = await getSystemByToken(token);
  if (!details) notFound();
  const { system, events, photos } = details;

  const today = todayLagos();
  const installed = system.installed_on;
  const schedule = checkupSchedule(installed, events);
  const helpMessage = `Hi PowerNexa, it's ${system.customer_name}${system.address ? ` (${system.address})` : ""}. I need help with my system${system.system_summary ? `: ${system.system_summary}` : ""}.`;
  const firstName = system.customer_name.split(" ")[0];

  return (
    <div className="min-h-screen bg-mist pb-16">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/">
            <Image src="/images/logo.png" alt={SITE_NAME} width={1536} height={1024} className="h-10 w-auto" priority />
          </Link>
          <a
            href={buildWhatsAppUrl(helpMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white"
          >
            WhatsApp us
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-4 pt-6">
        <section className="relative overflow-hidden rounded-[28px] bg-navy p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange/30 blur-3xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-yellow">Your system</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-[1.1] tracking-tight">Hi {firstName}</h1>
          {system.system_summary ? <p className="mt-3 text-white/85">{system.system_summary}</p> : null}
          <p className="mt-1 text-sm text-white/60">
            {system.address ? `${system.address} · ` : ""}
            {installed ? `Installed ${formatDate(installed)}` : "Installation coming up"}
          </p>
        </section>

        {system.notes ? (
          <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(9,43,76,0.3)]">
            <p className="whitespace-pre-line text-charcoal">{system.notes}</p>
          </section>
        ) : null}

        <Card title="What we promised you">
          <div className="grid gap-3 sm:grid-cols-2">
            <PromiseCard
              title={`${PROMISE_TERMS.workmanshipYears}-year workmanship warranty`}
              status={installed ? `Until ${formatDate(workmanshipWarrantyEnds(installed))}` : "Starts on installation day"}
              body="If a fault comes from our work, we fix it free."
            />
            <PromiseCard
              title="Carry guarantee"
              status={
                installed
                  ? carryGuaranteeEnds(installed) >= today
                    ? `Until ${formatDate(carryGuaranteeEnds(installed))}`
                    : `Ended ${formatDate(carryGuaranteeEnds(installed))}`
                  : `${PROMISE_TERMS.carryGuaranteeDays} days from installation`
              }
              body="If the system can't power the appliances on your list for the hours listed, we adjust or add to it at our cost."
            />
            <PromiseCard
              title="Two free check-ups"
              status={
                schedule.length === 0
                  ? `At ${PROMISE_TERMS.checkupMonths[0]} and ${PROMISE_TERMS.checkupMonths[1]} months`
                  : schedule
                      .map((c) => (c.doneOn ? `${c.number}: done ${formatDate(c.doneOn)}` : `${c.number}: due ${formatDate(c.dueOn)}`))
                      .join(" · ")
              }
              body="We check your panels, inverter, battery and wiring. We'll message you to book each one."
            />
            <PromiseCard
              title="Fast help"
              status={`Reply in ${PROMISE_TERMS.replyHours} hours, technician in ${PROMISE_TERMS.onSiteHours}`}
              body={`WhatsApp replies within ${PROMISE_TERMS.replyHours} hours during working hours (${BUSINESS_HOURS[0].days}, ${BUSINESS_HOURS[0].hours}). If something is wrong, a technician comes to you within ${PROMISE_TERMS.onSiteHours} hours.`}
            />
          </div>
          <p className="mt-3 text-xs text-charcoal/55">{WORKMANSHIP_TERMS}</p>
        </Card>

        <Card title="Something wrong?">
          <div className="flex flex-wrap gap-3">
            <a
              href={buildWhatsAppUrl(helpMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white"
            >
              WhatsApp us
            </a>
            <a href={`tel:${PHONE_E164}`} className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy">
              Call {PHONE_DISPLAY}
            </a>
            <a href={`tel:${PHONE_E164_2}`} className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy">
              Call {PHONE_DISPLAY_2}
            </a>
          </div>
          <p className="mt-3 text-sm text-charcoal/65">
            Tell us what the inverter screen shows, or send a photo of it. It helps us bring the right parts.
          </p>
        </Card>

        {system.equipment.length > 0 ? (
          <Card title="Your equipment">
            <ul className="divide-y divide-line">
              {system.equipment.map((item, index) => (
                <li key={index} className="py-2.5 text-sm">
                  <p className="font-medium text-navy">{item.item}</p>
                  <p className="text-charcoal/60">
                    {[item.model, item.serial ? `Serial ${item.serial}` : null, item.warranty ? `Maker's warranty: ${item.warranty}` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {system.load_items.length > 0 ? (
          <Card title="What your system carries">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-charcoal/50">
                <tr className="border-b border-line">
                  <th className="py-1.5 font-medium">Appliance</th>
                  <th className="py-1.5 text-right font-medium">Qty</th>
                  <th className="py-1.5 text-right font-medium">Hours on battery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {system.load_items.map((row, index) => (
                  <tr key={index}>
                    <td className="py-1.5">{row.appliance}</td>
                    <td className="py-1.5 text-right font-mono-num">{row.quantity}</td>
                    <td className="py-1.5 text-right font-mono-num">{row.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-charcoal/55">
              Adding appliances? Tell us first, so we can check the system can take them.
            </p>
          </Card>
        ) : null}

        {photos.length > 0 ? (
          <Card title="Photos of your installation">
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) =>
                photo.url ? (
                  <a key={photo.id} href={photo.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={photo.caption ?? "Your installation"} className="aspect-[4/3] w-full object-cover" />
                    {photo.caption ? <span className="mt-1 block text-xs text-charcoal/60">{photo.caption}</span> : null}
                  </a>
                ) : null
              )}
            </div>
          </Card>
        ) : null}

        {events.length > 0 ? (
          <Card title="Service history">
            <ul className="divide-y divide-line">
              {events.map((event) => (
                <li key={event.id} className="py-2.5 text-sm">
                  <p>
                    <span className="font-medium text-navy">{eventKindLabel(event.kind)}</span>
                    <span className="text-charcoal/50"> · {formatDate(event.event_date)}</span>
                  </p>
                  <p className="text-charcoal/70">{event.description}</p>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {system.quote ? (
          <Card title="Your quote">
            <p className="text-sm text-charcoal/70">
              Quote {system.quote.number} from {formatDate(system.quote.date)}.
            </p>
            <Link
              href={`/my-system/${token}/quote`}
              className="mt-3 inline-block rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-dark"
            >
              View or download your quote
            </Link>
          </Card>
        ) : null}

        <p className="pt-2 text-center text-xs text-charcoal/45">
          This page is private to you. Please don&apos;t share the link.
        </p>
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(9,43,76,0.3)]">
      <h2 className="mb-4 font-display text-lg font-bold leading-[1.1] tracking-tight text-navy">{title}</h2>
      {children}
    </section>
  );
}

function PromiseCard({ title, status, body }: { title: string; status: string; body: string }) {
  return (
    <div className="rounded-2xl bg-mist p-4">
      <p className="font-semibold text-navy">{title}</p>
      <p className="mt-0.5 text-sm font-semibold text-orange">{status}</p>
      <p className="mt-1 text-xs text-charcoal/65">{body}</p>
    </div>
  );
}
