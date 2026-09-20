import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { PHONE_DISPLAY, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for using the ${SITE_NAME} website and requesting a quote.`,
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsPage() {
  return (
    <section className="py-14 sm:py-16">
      <Container className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms-of-service" }]} />
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-5 font-display text-3xl font-bold text-navy sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-charcoal/50">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose-pnx mt-8 space-y-6 text-sm leading-relaxed text-charcoal/80">
          <p>
            These terms govern your use of this website and any quote request you submit through
            it. By using this site, you agree to these terms.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">Quotes are not a contract</h2>
          <p>
            A quote provided through this website, by phone, or by WhatsApp is an estimate based on
            the information available at the time. A binding agreement for installation, repair, or
            maintenance work is only formed once both parties agree to a final written quote after
            a site visit.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">Accuracy of information</h2>
          <p>
            You agree to provide accurate information about your property, load requirements, and
            contact details when requesting a quote, so we can give you an accurate assessment.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">Website content</h2>
          <p>
            Content on this site, including pricing guidance, is for general informational purposes.
            Actual system sizing and pricing depend on a site-specific assessment. Blog content
            reflects general knowledge about solar and inverter systems in Lagos and should not be
            treated as a substitute for a professional site assessment.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">Third-party services</h2>
          <p>
            When you use the WhatsApp button or link on this site, you leave our website and
            interact with WhatsApp directly, subject to WhatsApp&apos;s own terms.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">Limitation of liability</h2>
          <p>
            We aim for accuracy across this site but do not guarantee that every figure, timeline,
            or description is free of error. Final terms for any installation are set out in your
            written quote and service agreement.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">Contact</h2>
          <p>Questions about these terms can be sent to us by phone or WhatsApp at {PHONE_DISPLAY}.</p>
        </div>
      </Container>
    </section>
  );
}
