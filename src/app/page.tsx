import Link from "next/link";
import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { HeroCollage } from "@/components/marketing/HeroCollage";
import { TrackRecord } from "@/components/marketing/TrackRecord";
import { Promises } from "@/components/marketing/Promises";
import { FeaturedProjects } from "@/components/marketing/FeaturedProjects";
import { ChevronIcon } from "@/components/marketing/Icons";
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
      "Yes. Every installation comes with a 1-year written workmanship warranty. If a fault comes from our work, we fix it free. That's on top of the maker's warranty on your panels, inverter and batteries. In that same year you get two free check-ups, at 6 and 12 months.",
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
    body: "We visit, measure your load and wiring, and send a written quote that lists what the system will carry and for how many hours. That price is final.",
  },
  {
    step: "03",
    title: "Professional install",
    body: "We buy every panel, inverter, and battery ourselves, install it, then test the full system before we leave. You don't have to find or buy anything.",
  },
  {
    step: "04",
    title: "Commission & warranty",
    body: "We show you how it works and send you a private page with your warranty and check-up dates. You pay the balance once you see it working.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(HOME_FAQS)} />

      {/* Hero, modelled on the reference site: centred copy, both CTAs on one
          line (even on phones), then three overlapping install photos rising
          in. The bottom fades into white so the photos sit across the seam. */}
      <section className="relative isolate overflow-hidden bg-navy">
        <Image
          src="/images/hero.jpg"
          alt="A PowerNexa Solutions technician installing solar panels on a home roof in bright sun"
          fill
          priority
          className="hero-zoom object-cover object-[65%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,26,48,0.88)_0%,rgba(9,43,76,0.74)_40%,rgba(9,43,76,0.55)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-white" />

        <Container className="relative flex flex-col items-center pt-16 text-center sm:pt-20 lg:pt-24">
          <Link href="/services" className="hero-fade-in group" style={{ animationDelay: "0ms" }}>
            <span className="flex w-fit items-center gap-1.5 rounded-full border-[1.5px] border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur transition group-hover:border-orange/60 group-hover:bg-white/15 sm:px-5 sm:text-xs">
              <span className="sm:hidden">Solar and inverter installs, Lagos</span>
              <span className="hidden sm:inline">Solar, inverter and battery installation in Lagos</span>
              <ChevronIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <h1
            className="hero-fade-in mt-7 max-w-3xl text-balance bg-gradient-to-br from-white from-40% to-white/65 bg-clip-text font-display text-4xl font-extrabold leading-[1.05] tracking-tighter text-transparent sm:text-5xl lg:text-[4rem]"
            style={{ animationDelay: "150ms" }}
          >
            Solar and inverter power that never blinks.
          </h1>

          <p
            className="hero-fade-in mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/80 sm:text-lg"
            style={{ animationDelay: "300ms" }}
          >
            We install and maintain solar panels, inverters, and battery backup for homes and
            businesses across Lagos, sized to what you actually use, not a one-size package.
          </p>

          <div
            className="hero-fade-in mt-9 flex w-full flex-row flex-nowrap items-center justify-center gap-3 sm:w-auto sm:gap-4"
            style={{ animationDelay: "450ms" }}
          >
            <Button href="/get-a-quote" size="lg" className="h-12 flex-1 whitespace-nowrap px-5 sm:h-14 sm:flex-none sm:px-8">
              Get a Quote
            </Button>
            <Button
              href="/services"
              variant="outlineWhite"
              size="lg"
              className="h-12 flex-1 whitespace-nowrap border-white/40 px-5 backdrop-blur hover:border-white sm:h-14 sm:flex-none sm:px-8"
            >
              See Our Services
            </Button>
          </div>
        </Container>

        <HeroCollage />
      </section>

      <TrustedBy />

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

      <TrackRecord />

      <FeaturedProjects />

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

      <Promises />

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
