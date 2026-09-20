import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { QuoteForm } from "@/components/marketing/QuoteForm";
import { CheckIcon } from "@/components/marketing/Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { PHONE_DISPLAY, PHONE_E164 } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description:
    "Request a free, load-based solar and inverter installation quote in Lagos. Tell us what you need and we'll respond on WhatsApp with next steps.",
  alternates: { canonical: "/get-a-quote" },
};

const WHAT_HAPPENS_NEXT = [
  "We review your request and confirm details on WhatsApp, usually the same day during business hours.",
  "We schedule a free site visit at a time that works for you.",
  "You receive a written quote with sizing and pricing explained, no pressure to decide on the spot.",
];

export default function GetQuotePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Get a Quote", path: "/get-a-quote" },
        ])}
      />

      <section className="bg-mist py-14 sm:py-20">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Get a Quote", path: "/get-a-quote" }]} />
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow>Free, no-pressure quote</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Tell us what you need. We&apos;ll size it right.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-charcoal/75">
              Fill in the form and we&apos;ll open WhatsApp with your details ready to send. Prefer
              to call instead?{" "}
              <a href={`tel:${PHONE_E164}`} className="font-semibold text-orange">
                {PHONE_DISPLAY}
              </a>
              .
            </p>

            <div className="mt-10 rounded-2xl border border-line bg-mist p-7">
              <h2 className="font-display text-lg font-bold text-navy">What happens next</h2>
              <ul className="mt-4 space-y-3">
                {WHAT_HAPPENS_NEXT.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                    <span className="text-sm leading-relaxed text-charcoal/75">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-7 shadow-[0_30px_60px_-30px_rgba(9,43,76,0.2)] sm:p-8">
            <QuoteForm />
          </div>
        </Container>
      </section>
    </>
  );
}
