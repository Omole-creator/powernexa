import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, SectionHeading, Eyebrow } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CtaBand } from "@/components/marketing/CtaBand";
import { CheckIcon } from "@/components/marketing/Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, serviceJsonLd, faqJsonLd } from "@/lib/seo";
import { LAGOS_AREAS, SERVICES } from "@/lib/constants";
import { TESTIMONIALS } from "@/lib/testimonials-data";

export function generateStaticParams() {
  return LAGOS_AREAS.map((area) => ({ area: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area: slug } = await params;
  const area = LAGOS_AREAS.find((a) => a.slug === slug);
  if (!area) return {};

  return {
    title: `Solar Installation in ${area.name}, Lagos`,
    description: `Solar panel, inverter, and battery installation in ${area.name}, Lagos. Load-based quote, written warranty, and fast local response.`,
    alternates: { canonical: `/locations/${area.slug}` },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ area: string }> }) {
  const { area: slug } = await params;
  const area = LAGOS_AREAS.find((a) => a.slug === slug);
  if (!area) notFound();

  const localTestimonials = TESTIMONIALS.filter((t) =>
    t.location.toLowerCase().includes(area.name.split(" (")[0].toLowerCase())
  );

  const faqs = [
    {
      question: `Do you install solar and inverter systems in ${area.name}?`,
      answer: `Yes. ${area.name} is one of the Lagos areas we actively serve for solar panel installation, inverter installation, and battery replacement. Message us your address on WhatsApp and we'll confirm the fastest available visit slot.`,
    },
    {
      question: `How fast can you visit a property in ${area.name}?`,
      answer: `Response time depends on our current schedule, but ${area.name} is within our regular Lagos service radius. Contact us directly for the fastest current availability.`,
    },
    {
      question: `What does solar installation cost in ${area.name}?`,
      answer: `Pricing depends on your load, not your neighborhood. See our pricing guide for the factors that determine cost, then request a quote for an exact number based on your property.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: area.name, path: `/locations/${area.slug}` },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: `Solar and Inverter Installation in ${area.name}`,
          description: area.blurb,
          path: `/locations/${area.slug}`,
          areaServed: area.name,
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Locations", path: "/locations" },
              { name: area.name, path: `/locations/${area.slug}` },
            ]}
          />
          <Reveal className="mt-6 max-w-2xl">
            <Eyebrow>Serving {area.name}</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Solar & Inverter Installation in {area.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">{area.blurb}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/get-a-quote" size="lg">
                Get a Quote
              </Button>
              <Button href="/services" variant="outline" size="lg">
                See All Services
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Available here" title={`Services we offer in ${area.name}`} />
            <ul className="mt-6 space-y-3">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-mist"
                  >
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                    <span>
                      <span className="block font-semibold text-navy">{service.name}</span>
                      <span className="text-sm text-charcoal/65">{service.summary}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150} className="rounded-2xl border border-line bg-mist p-7">
            <h3 className="font-display text-lg font-bold text-navy">Why {area.name} chooses us</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-charcoal/75">
              <li>We calculate your actual load before recommending any system.</li>
              <li>Every quote is written down, with sizing and pricing explained.</li>
              <li>Workmanship is backed by a written warranty.</li>
              <li>Our Sangotedo base keeps response times short across Lagos.</li>
            </ul>
          </Reveal>
        </Container>
      </section>

      {localTestimonials.length > 0 ? (
        <section className="bg-mist py-20">
          <Container>
            <Reveal>
              <SectionHeading eyebrow="Local feedback" title={`What ${area.name} residents say`} />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {localTestimonials.map((testimonial, index) => (
                <Reveal key={testimonial.name} delay={(index % 3) * 100}>
                  <TestimonialCard testimonial={testimonial} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-20">
        <Container className="mx-auto max-w-3xl">
          <SectionHeading align="center" eyebrow="Questions" title={`FAQs for ${area.name}`} />
          <div className="mt-10">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
