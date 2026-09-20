import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ServiceDetailLayout } from "@/components/marketing/ServiceDetailLayout";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Commercial Solar for Business in Lagos",
  description:
    "Commercial-grade solar, inverter, and battery systems for offices, clinics, schools, and estates in Lagos. Load assessments that account for actual business hours and equipment.",
  alternates: { canonical: "/services/commercial-solar-for-business" },
};

export default function CommercialSolarPage() {
  return (
    <ServiceDetailLayout
      name="Commercial Solar for Business"
      slug="commercial-solar-for-business"
      heroDescription="Every hour of downtime costs a business money, whether it's a clinic losing patient hours, a school losing classroom time, or an office losing productivity. We design commercial systems around your operating hours and critical equipment, not a residential package scaled up."
      benefits={[
        "Load assessment that separates critical equipment (servers, medical fridges, machinery) from general use.",
        "System design that keeps your business running through extended outages, not just a few hours.",
        "Installation scheduled to minimize disruption to your operating hours.",
        "Maintenance contracts built around your business's uptime requirements.",
        "Documentation and warranty paperwork suitable for business record-keeping.",
      ]}
      pricingNote={
        <p>
          Commercial systems are priced per project after a load assessment, since offices,
          clinics, and schools all draw very different loads. Estates coordinating multiple homes
          can also get a commercial-style group quote. See general pricing factors in our{" "}
          <Link href="/pricing" className="font-semibold text-orange">
            pricing guide
          </Link>
          , then request a site visit for an exact number.
        </p>
      }
      processIntro="Commercial projects get the same core process as residential ones, with more detail at the assessment stage."
      processSteps={[
        { title: "Business load audit", body: "We map out your equipment, operating hours, and which loads are truly critical." },
        { title: "System design & proposal", body: "A written proposal covering capacity, backup duration, and phased options if needed." },
        { title: "Scheduled installation", body: "Installation is timed around your business hours to minimize disruption." },
        { title: "Handover & maintenance plan", body: "Staff walkthrough, documentation, and an ongoing maintenance schedule." },
      ]}
      featuredAreas={["victoria-island", "ikeja", "lekki-phase-1", "vgc"]}
      faqs={[
        {
          question: "Can solar power an entire office or clinic?",
          answer:
            "Yes, with the right system size. The key is separating critical loads (what must stay on) from general loads (what can wait), so we size the system to guarantee uptime for what matters most without over-building the whole system.",
        },
        {
          question: "Do you offer group pricing for estates?",
          answer:
            "Yes. When multiple homes in the same estate install around the same time, we can coordinate scheduling and offer better group pricing than individual installations.",
        },
        {
          question: "How do you handle installation without disrupting our business?",
          answer:
            "We schedule the noisier and more disruptive parts of installation around your operating hours where possible, and agree on a timeline with you before work starts.",
        },
      ]}
    >
      <section className="bg-mist py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Estates & facility managers"
              title="Coordinated installs across an entire estate"
              description="If you manage a gated estate, we can schedule installations across multiple homes efficiently, standardize on equipment that's easy to maintain, and set up a shared maintenance calendar that keeps every household's system in good health."
            />
          </Reveal>
          <Reveal delay={150} className="rounded-2xl border border-line bg-white p-7">
            <h3 className="font-display text-lg font-bold text-navy">See relevant estate areas</h3>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
              We&apos;ve worked across estate-style neighborhoods including{" "}
              <Link href="/locations/vgc" className="font-semibold text-orange">
                VGC
              </Link>{" "}
              and{" "}
              <Link href="/locations/lekki-phase-1" className="font-semibold text-orange">
                Lekki Phase 1
              </Link>
              . Message us your estate name and we&apos;ll confirm coverage.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal className="overflow-hidden rounded-2xl border border-line">
            <Image
              src="/images/installation-battery-room-2.jpg"
              alt="Commercial-grade inverter and battery installation inside a Lagos business premises"
              width={640}
              height={480}
              className="h-full w-full object-cover"
            />
          </Reveal>
          <Reveal delay={150}>
            <SectionHeading
              eyebrow="Built for uptime"
              title="Commercial rooms need commercial-grade installs"
              description="A business backup room carries more load and runs longer hours than a home setup. We size the inverter, battery bank, and wiring for that duty cycle, not a residential kit stretched past its limit."
            />
          </Reveal>
        </Container>
      </section>
    </ServiceDetailLayout>
  );
}
