import type { Metadata } from "next";
import { Container, SectionHeading, Eyebrow } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { QuoteForm } from "@/components/marketing/QuoteForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import {
  BUSINESS_ADDRESS,
  BUSINESS_HOURS,
  PHONE_DISPLAY,
  PHONE_E164,
} from "@/lib/constants";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { EmailLink } from "@/components/layout/EmailLink";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact PowerNexa Solutions for solar, inverter, and battery installation across Lagos. Call, WhatsApp, or send a quote request.",
  alternates: { canonical: "/contact" },
};

const mapQuery = encodeURIComponent(
  `${BUSINESS_ADDRESS.street}, ${BUSINESS_ADDRESS.area}, ${BUSINESS_ADDRESS.city}`
);

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
          <Reveal className="mt-6 max-w-2xl">
            <Eyebrow>Get in touch</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Talk to us about your power needs
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">
              Call, WhatsApp, or send a quote request below. We respond fastest on WhatsApp during
              business hours.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-8">
            <Reveal className="rounded-2xl border border-line bg-white p-7">
              <h2 className="font-display text-lg font-bold text-navy">Call or WhatsApp</h2>
              <a href={`tel:${PHONE_E164}`} className="mt-3 block font-mono-num text-2xl font-bold text-navy hover:text-orange">
                {PHONE_DISPLAY}
              </a>
              <EmailLink className="mt-2 block text-sm font-medium text-charcoal/70 hover:text-orange" />
              <a
                href={buildWhatsAppUrl(defaultWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
              >
                Chat on WhatsApp
              </a>
            </Reveal>

            <Reveal delay={100} className="rounded-2xl border border-line bg-white p-7">
              <h2 className="font-display text-lg font-bold text-navy">Service base</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                {BUSINESS_ADDRESS.street}
                <br />
                {BUSINESS_ADDRESS.area}, {BUSINESS_ADDRESS.city}
              </p>
              <p className="mt-3 text-xs text-charcoal/50">
                We install and maintain systems across Lagos. This is our operating base, not a retail
                showroom, visits are by appointment.
              </p>
              <div className="mt-5 overflow-hidden rounded-xl border border-line">
                <iframe
                  title="PowerNexa Solutions service area map"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  width="100%"
                  height="220"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block"
                />
              </div>
            </Reveal>

            <Reveal delay={200} className="rounded-2xl border border-line bg-white p-7">
              <h2 className="font-display text-lg font-bold text-navy">Business hours</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-charcoal/70">
                {BUSINESS_HOURS.map((h) => (
                  <li key={h.days}>
                    <span className="font-medium text-navy">{h.days}:</span> {h.hours}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <SectionHeading eyebrow="Or send a request" title="Get a free quote" />
            <div className="mt-6 rounded-2xl border border-line bg-white p-7">
              <QuoteForm />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
