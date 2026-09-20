import type { Metadata } from "next";
import { Container, SectionHeading, Eyebrow } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Solar & Inverter Installation Services in Lagos",
  description:
    "Solar panel installation, inverter installation, battery replacement, maintenance, and commercial solar for businesses across Lagos. Get a free, load-based quote.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]} />
          <Reveal className="mt-6 max-w-2xl">
            <Eyebrow>Our services</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Solar and inverter installation, sized around your actual load
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">
              From a single-room backup to a full commercial system, every job starts with a load
              assessment, not a guess. Pick a service below to see how it works and what it costs.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, index) => (
              <Reveal key={service.slug} delay={index * 80}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-mist py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Not sure where to start?"
              title="Tell us what you're trying to power"
              description="Most people don't know whether they need a 3.5kVA or 10kVA inverter, and that's fine. Send us your appliance list on WhatsApp or fill in the quote form, and we'll tell you exactly what fits your load and your budget."
            />
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
