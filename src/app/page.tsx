import Link from "next/link";
import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Waveform } from "@/components/marketing/Waveform";
import { StatStrip } from "@/components/marketing/StatStrip";
import { TrustedBy } from "@/components/marketing/TrustedBy";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { LocationCard } from "@/components/marketing/LocationCard";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CtaBand } from "@/components/marketing/CtaBand";
import { QuoteForm } from "@/components/marketing/QuoteForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { SERVICES, LAGOS_AREAS } from "@/lib/constants";
import { TESTIMONIALS } from "@/lib/testimonials-data";
import { faqJsonLd } from "@/lib/seo";

const HOME_FAQS = [
  {
    question: "How much does solar and inverter installation cost in Lagos?",
    answer:
      "It depends on your load (what you want to power), battery capacity, and inverter size. A single room backup costs far less than a whole-house system with air conditioning. We visit, calculate your actual load, and give you a written quote with no hidden costs. See our full pricing guide for realistic ranges.",
  },
  {
    question: "Which parts of Lagos do you serve?",
    answer:
      "We currently install and maintain systems across Lagos, including Victoria Island, Lekki Phase 1, Ikoyi, Ajah, VGC, Sangotedo, Ikeja, and the Mainland. If you're unsure whether we cover your area, message us on WhatsApp and we'll confirm.",
  },
  {
    question: "How long does an installation take?",
    answer:
      "Most residential installations are completed in 1 to 3 days once the equipment is on site, depending on system size and roof access. Commercial installations for offices or estates may take longer and are scoped during the site visit.",
  },
  {
    question: "Do you offer a warranty?",
    answer:
      "Yes. Every installation comes with a written workmanship warranty, in addition to the manufacturer warranty on panels, inverters, and batteries. We'll walk you through exactly what's covered before you pay a deposit.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(HOME_FAQS)} />

      {/* Hero: each piece pops in on its own beat as soon as the page loads */}
      <section className="relative isolate overflow-hidden bg-navy">
        <Image
          src="/images/hero.jpg"
          alt="A PowerNexa Solutions technician installing solar panels on a home roof in bright sun"
          fill
          priority
          className="object-cover object-[65%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />

        <Container className="relative py-20 sm:py-24 lg:py-28">
          <div className="max-w-xl">
            <Reveal delay={0}>
              <h1 className="font-display text-4xl font-extrabold leading-[1.2] text-white sm:text-5xl lg:text-[3.25rem]">
                Solar and inverter power that never blinks.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
                We install and maintain solar panels, inverters, and battery backup for homes and
                businesses across Lagos, sized to what you actually use, not a one-size package.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/get-a-quote" size="lg">
                  Get a Free Quote
                </Button>
                <Button href="/services" variant="outlineWhite" size="lg">
                  See Our Services
                </Button>
              </div>
            </Reveal>
            <Reveal delay={480}>
              <div className="mt-12 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <StatStrip light />
              </div>
            </Reveal>
          </div>
        </Container>

        <Waveform variant="divider" className="absolute inset-x-0 bottom-0 h-10 w-full text-white/70" />
      </section>

      <TrustedBy />

      {/* Services */}
      <section className="py-20">
        <Container>
          <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="What we do"
              title="Solar, inverter, and battery services built around your load"
              description="Every job starts with an honest look at what you actually need to power, then we design around that."
            />
            <Link href="/services" className="shrink-0 text-sm font-semibold text-orange hover:text-orange-dark">
              View all services →
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, index) => (
              <Reveal key={service.slug} delay={index * 80}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Proof: real equipment and real installs, not stock icons */}
      <section className="bg-mist py-20">
        <Container>
          <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="The work itself"
              title="What a proper installation actually looks like"
              description="Panels wired to spec, inverters mounted clean, batteries stacked and labelled. No shortcuts you can't see."
            />
            <Link href="/about" className="shrink-0 text-sm font-semibold text-orange hover:text-orange-dark">
              More about how we work →
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            <Reveal className="overflow-hidden rounded-2xl border border-line lg:col-span-2 lg:row-span-2">
              <Image
                src="/images/solar-panel-inverter-wiring.jpg"
                alt="Rooftop solar panels wired to a wall-mounted inverter"
                width={800}
                height={800}
                className="h-full min-h-[280px] w-full object-cover"
              />
            </Reveal>
            <Reveal delay={100} className="overflow-hidden rounded-2xl border border-line">
              <Image
                src="/images/inverter-battery-stack.jpg"
                alt="Hybrid inverter mounted above a stack of batteries"
                width={400}
                height={300}
                className="h-full min-h-[130px] w-full object-cover"
              />
            </Reveal>
            <Reveal delay={150} className="overflow-hidden rounded-2xl border border-line">
              <Image
                src="/images/inverter-wall-mounted.jpg"
                alt="A pure sine wave inverter mounted on a wall next to the meter"
                width={400}
                height={300}
                className="h-full min-h-[130px] w-full object-cover"
              />
            </Reveal>
            <Reveal delay={200} className="overflow-hidden rounded-2xl border border-line">
              <Image
                src="/images/installation-battery-room-2.jpg"
                alt="Technician wiring an inverter and battery bank inside a Lagos home"
                width={400}
                height={300}
                className="h-full min-h-[130px] w-full object-cover"
              />
            </Reveal>
            <Reveal delay={250} className="overflow-hidden rounded-2xl border border-line">
              <Image
                src="/images/installation-distribution-board.jpg"
                alt="A technician in a safety harness inspecting a distribution board"
                width={400}
                height={300}
                className="h-full min-h-[130px] w-full object-cover"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* How it works: genuinely sequential, so numbering earns its place here */}
      <section className="bg-navy py-20 text-white">
        <Container>
          <Reveal>
            <SectionHeading
              light
              eyebrow="How it works"
              title="From first message to commissioned system"
              description="Four steps, start to finish. No guesswork, no surprise costs."
            />
          </Reveal>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Tell us your load",
                body: "Call or WhatsApp us what you want to power. We ask a few questions to understand your actual usage.",
              },
              {
                step: "02",
                title: "Site visit & quote",
                body: "We visit, measure your space and wiring, and hand you a written quote with sizing and pricing explained.",
              },
              {
                step: "03",
                title: "Professional install",
                body: "Our team installs panels, inverter, and batteries, then tests the full system before we leave.",
              },
              {
                step: "04",
                title: "Commission & warranty",
                body: "We walk you through the system, hand over your warranty, and schedule your first maintenance check.",
              },
            ].map((item, index) => (
              <Reveal key={item.step} as="li" delay={index * 100}>
                <p className="font-mono-num text-sm font-bold text-orange">{item.step}</p>
                <h3 className="mt-3 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Locations */}
      <section className="py-20">
        <Container>
          <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Where we work"
              title="Solar installers serving every corner of Lagos"
              description="From Victoria Island to Ajah, our team knows the estates, the transformers, and the local building rules."
            />
            <Link href="/locations" className="shrink-0 text-sm font-semibold text-orange hover:text-orange-dark">
              See all areas →
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LAGOS_AREAS.slice(0, 4).map((area, index) => (
              <Reveal key={area.slug} delay={index * 80}>
                <LocationCard area={area} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-mist py-20">
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="What Lagos homeowners say"
              title="Homes across Lagos that stopped worrying about power"
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.slice(0, 6).map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={(index % 3) * 100}>
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Quote form + FAQ */}
      <section className="bg-mist py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Get a quote" title="Get your free, no-pressure quote" />
            <div className="mt-8 rounded-2xl border border-line bg-white p-7">
              <QuoteForm />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <SectionHeading eyebrow="Common questions" title="Frequently asked questions" />
            <div className="mt-8">
              <FaqAccordion items={HOME_FAQS} />
            </div>
          </Reveal>
        </Container>
      </section>

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
