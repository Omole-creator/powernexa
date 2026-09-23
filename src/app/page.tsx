import Link from "next/link";
import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Waveform } from "@/components/marketing/Waveform";
import { StatStrip } from "@/components/marketing/StatStrip";
import { ProofSection } from "@/components/marketing/ProofSection";
import { TrustedBy } from "@/components/marketing/TrustedBy";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { LocationCard } from "@/components/marketing/LocationCard";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CtaBand } from "@/components/marketing/CtaBand";
import { QuoteForm } from "@/components/marketing/QuoteForm";
import { LeadMagnetGate } from "@/components/marketing/LeadMagnetGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { SERVICES, LAGOS_AREAS } from "@/lib/constants";
import { TESTIMONIALS } from "@/lib/testimonials-data";
import { faqJsonLd } from "@/lib/seo";
import { DEFAULT_LEAD_MAGNET } from "@/lib/lead-magnets";

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

const PROCESS_STEPS = [
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
    body: "We buy every panel, inverter, and battery ourselves, install it, then test the full system before we leave. You don't have to find or buy anything.",
  },
  {
    step: "04",
    title: "Commission & warranty",
    body: "We walk you through the system, hand over your warranty, and schedule your first maintenance check.",
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
              <h1 className="font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
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
                  Get a Quote
                </Button>
                <Button href="/services" variant="outlineWhite" size="lg">
                  See Our Services
                </Button>
              </div>
            </Reveal>
            <Reveal delay={480}>
              <div className="mt-12 rounded-[28px] bg-white/10 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <StatStrip light />
              </div>
            </Reveal>
          </div>
        </Container>

        <Waveform variant="divider" className="absolute inset-x-0 bottom-0 h-10 w-full text-white/70" />
      </section>

      <TrustedBy />

      {/* Proof: counters plus one install video, straight after the hero so the
          claim is backed up before we ask for anything. */}
      <ProofSection />

      {/* Services: one featured, rest supporting, not a flat uniform grid */}
      <section className="relative overflow-hidden py-24">
        <GlowOrb color="orange" className="-right-32 top-10 h-72 w-72" />
        <GlowOrb color="yellow" className="-left-24 bottom-0 h-56 w-56" />
        <Container className="relative">
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
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <ServiceCard service={SERVICES[0]} featured />
            </Reveal>
            {SERVICES.slice(1).map((service, index) => (
              <Reveal key={service.slug} delay={(index + 1) * 80}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* One proof image, placed once, doing one job: back up the headline. */}
      <section className="bg-mist py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="What that actually means"
              title="This is what &quot;never blinks&quot; looks like"
              description="Panels on the roof, wired straight into an inverter sized for your load. That's the whole idea: generate it, store it, use it, without a gap in between."
            />
          </Reveal>
          <Reveal delay={150} className="relative">
            <div className="overflow-hidden rounded-[32px] shadow-[0_30px_60px_-24px_rgba(9,43,76,0.35)]">
              <Image
                src="/images/solar-panel-inverter-wiring.jpg"
                alt="Rooftop solar panels wired to a wall-mounted inverter"
                width={640}
                height={480}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-navy px-5 py-4 text-white shadow-xl sm:block">
              <p className="font-mono-num text-2xl font-bold text-orange">100%</p>
              <p className="text-xs text-white/70">load-calculated</p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* How it works: connected steps, genuinely sequential */}
      <section className="relative overflow-hidden bg-navy py-24 text-white">
        <GlowOrb color="orange" className="left-1/4 top-0 h-64 w-64" />
        <Container className="relative">
          <Reveal>
            <SectionHeading
              light
              eyebrow="How it works"
              title="From first message to commissioned system"
              description="Four steps, start to finish. No guesswork, no surprise costs."
            />
          </Reveal>
          <div className="relative mt-14">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-white/15 lg:block" />
            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STEPS.map((item, index) => (
                <Reveal key={item.step} as="li" delay={index * 100} className="relative">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-orange font-mono-num text-lg font-bold text-white shadow-[0_10px_24px_-6px_rgba(245,130,32,0.6)]">
                    {item.step}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Second proof image: safety, isolated from the first by two full sections. */}
      <section className="py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal delay={150} className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-[32px] shadow-[0_30px_60px_-24px_rgba(9,43,76,0.25)]">
              <Image
                src="/images/installation-distribution-board.jpg"
                alt="A technician in a safety harness inspecting a distribution board"
                width={640}
                height={480}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="The part you don't see in a quote"
              title="Isolated first. Tested after. Every time."
              description="Before anyone touches a wire, the circuit gets isolated. Before we call a job finished, the whole system gets tested under load. That order never changes."
            />
          </Reveal>
        </Container>
      </section>

      {/* Locations */}
      <section className="relative overflow-hidden bg-mist py-24">
        <GlowOrb color="navy" className="-right-20 bottom-0 h-72 w-72" />
        <Container className="relative">
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

      {/* Lead magnet: a free, no-quote-required download between the trust-building
          sections (locations) and the harder "get a quote" ask further down. */}
      <section className="py-24">
        <Container>
          <Reveal>
            <LeadMagnetGate
              magnet={DEFAULT_LEAD_MAGNET}
              title={DEFAULT_LEAD_MAGNET.title}
              description="Not ready for a quote yet? Get the checklist Lagos homeowners use to check any inverter installer before paying a deposit. No installation booking required."
            />
          </Reveal>
        </Container>
      </section>

      {/* Third proof image: the equipment itself, right before the testimonials that talk about it. */}
      <section className="py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="What you're actually buying"
              title="The inverter and battery bank behind the promise"
              description="This is what sits in the room after we leave: an inverter sized to your load, and batteries stacked for the backup hours you asked for. Nothing hidden, nothing oversold."
            />
          </Reveal>
          <Reveal delay={150}>
            <div className="overflow-hidden rounded-[32px] shadow-[0_30px_60px_-24px_rgba(9,43,76,0.25)]">
              <Image
                src="/images/inverter-battery-stack.jpg"
                alt="Hybrid inverter mounted above a stack of batteries, with solar panels in the background"
                width={640}
                height={480}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-mist py-24">
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
      <section className="relative overflow-hidden bg-mist py-24">
        <GlowOrb color="orange" className="left-1/3 top-0 h-64 w-64" />
        <Container className="relative grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Get a quote" title="Get your no-pressure quote" />
            <div className="mt-8 rounded-[28px] bg-white p-7 shadow-[0_20px_50px_-24px_rgba(9,43,76,0.25)]">
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
