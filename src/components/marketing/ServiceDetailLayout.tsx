import type { ReactNode } from "react";
import { Container, SectionHeading, Eyebrow } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "./Breadcrumbs";
import { FaqAccordion, type FaqItem } from "./FaqAccordion";
import { LocationCard } from "./LocationCard";
import { CtaBand } from "./CtaBand";
import { CheckIcon } from "./Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, serviceJsonLd, faqJsonLd } from "@/lib/seo";
import { LAGOS_AREAS, type LagosArea } from "@/lib/constants";

export function ServiceDetailLayout({
  name,
  slug,
  heroDescription,
  benefits,
  processIntro,
  processSteps,
  pricingNote,
  faqs,
  featuredAreas,
  children,
}: {
  name: string;
  slug: string;
  heroDescription: string;
  benefits: string[];
  processIntro: string;
  processSteps: { title: string; body: string }[];
  pricingNote: ReactNode;
  faqs: FaqItem[];
  featuredAreas?: LagosArea["slug"][];
  children?: ReactNode;
}) {
  const areas = LAGOS_AREAS.filter((a) => (featuredAreas ?? []).includes(a.slug)).slice(0, 4);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name, path: `/services/${slug}` },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name,
          description: heroDescription,
          path: `/services/${slug}`,
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name, path: `/services/${slug}` },
            ]}
          />
          <Reveal className="mt-6 max-w-2xl">
            <Eyebrow>Service</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">{name}</h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">{heroDescription}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/get-a-quote" size="lg">
                Get a Free Quote
              </Button>
              <Button href="/pricing" variant="outline" size="lg">
                See Pricing Factors
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="What's included" title={`What our ${name.toLowerCase()} covers`} />
            <ul className="mt-6 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                  <span className="text-sm leading-relaxed text-charcoal/75">{benefit}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150} className="rounded-2xl border border-line bg-mist p-7">
            <h3 className="font-display text-lg font-bold text-navy">What affects the price</h3>
            <div className="mt-3 text-sm leading-relaxed text-charcoal/75">{pricingNote}</div>
          </Reveal>
        </Container>
      </section>

      {children}

      <section className="bg-navy py-20 text-white">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Our process"
              title={<span className="text-white">How we handle {name.toLowerCase()}</span>}
              description={processIntro}
            />
          </Reveal>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <Reveal key={step.title} as="li" delay={index * 100}>
                <p className="font-mono-num text-sm font-bold text-orange">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {areas.length > 0 ? (
        <section className="py-20">
          <Container>
            <Reveal>
              <SectionHeading eyebrow="Available in your area" title={`${name} across Lagos`} />
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {areas.map((area, index) => (
                <Reveal key={area.slug} delay={index * 80}>
                  <LocationCard area={area} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-mist py-20">
        <Container className="mx-auto max-w-3xl">
          <Reveal>
            <SectionHeading align="center" eyebrow="Questions" title="Frequently asked questions" />
            <div className="mt-10">
              <FaqAccordion items={faqs} />
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
