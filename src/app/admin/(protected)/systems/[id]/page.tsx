import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSystem } from "@/lib/customer-systems";
import { carryGuaranteeEnds, checkupSchedule, workmanshipWarrantyEnds } from "@/lib/aftercare";
import { formatDate } from "@/lib/quote";
import { SITE_URL } from "@/lib/constants";
import { buildWhatsAppUrl, mySystemWhatsAppMessage, toWhatsAppNumber } from "@/lib/whatsapp";
import { SystemForm } from "@/components/admin/systems/SystemForm";
import { EventLog } from "@/components/admin/systems/EventLog";
import { PhotoManager } from "@/components/admin/systems/PhotoManager";
import { DeleteSystemButton, SystemLinkCard } from "@/components/admin/systems/SystemLinkCard";
import { InstallStatus } from "@/components/admin/systems/InstallStatus";

export const metadata: Metadata = { title: "My System Page", robots: { index: false } };

export default async function AdminSystemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const systemId = Number(id);
  if (!Number.isInteger(systemId) || systemId < 1) notFound();
  const details = await getSystem(systemId);
  if (!details) notFound();
  const { system, events, photos } = details;

  const link = `${SITE_URL}/my-system/${system.token}`;
  const waNumber = toWhatsAppNumber(system.phone);
  const whatsappUrl = waNumber ? buildWhatsAppUrl(mySystemWhatsAppMessage(system.customer_name, link), waNumber) : null;
  const schedule = checkupSchedule(system.installed_on, events);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/admin/systems" className="text-xs font-semibold text-orange">
            ← All My System pages
          </Link>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy">{system.customer_name}</h1>
          <p className="text-sm text-charcoal/55">{system.system_summary}</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="#details" className="rounded-full border border-navy/20 bg-white px-4 py-1.5 text-xs font-semibold text-navy hover:border-orange">
            Edit details
          </a>
          <DeleteSystemButton id={system.id} label={system.customer_name} />
        </div>
      </div>

      <InstallStatus systemId={system.id} installedOn={system.installed_on} />

      <SystemLinkCard link={link} whatsappUrl={whatsappUrl} />

      <div className="grid gap-4 sm:grid-cols-3">
        <DateCard
          label="Carry guarantee ends"
          value={system.installed_on ? formatDate(carryGuaranteeEnds(system.installed_on)) : null}
        />
        <DateCard
          label="Workmanship warranty ends"
          value={system.installed_on ? formatDate(workmanshipWarrantyEnds(system.installed_on)) : null}
        />
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">Free check-ups</p>
          {schedule.length === 0 ? (
            <p className="mt-1 text-sm text-orange">Start when installed</p>
          ) : (
            <ul className="mt-1 space-y-0.5 text-sm">
              {schedule.map((c) => (
                <li key={c.number} className={c.doneOn ? "text-green-700" : "text-navy"}>
                  {c.number}. {c.doneOn ? `Done ${formatDate(c.doneOn)}` : `Due ${formatDate(c.dueOn)}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <section id="details" className="scroll-mt-6 rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-navy">Details</h2>
        <SystemForm system={system} />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-lg font-bold text-navy">Service log</h2>
        <p className="mb-4 text-xs text-charcoal/55">
          Log each free check-up as &quot;Free check-up&quot;, the customer&apos;s page marks it done.
        </p>
        <EventLog systemId={system.id} events={events} />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-navy">Installation photos</h2>
        <PhotoManager systemId={system.id} photos={photos} />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-lg font-bold text-navy">Quote</h2>
        {system.quote ? (
          <p className="mt-1 text-sm text-charcoal/70">
            Quote {system.quote.number} from {formatDate(system.quote.date)} is on the customer&apos;s page, with a
            Download PDF button.
          </p>
        ) : (
          <p className="mt-1 text-sm text-charcoal/55">
            No quote attached. Pages created from a customer quote carry it over automatically.
          </p>
        )}
      </section>
    </div>
  );
}

function DateCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${value ? "text-navy" : "text-orange"}`}>
        {value ?? "Starts when installed"}
      </p>
    </div>
  );
}
