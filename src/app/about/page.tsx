import type { Metadata } from "next";
import { Container, SectionHeading, Eyebrow } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Waveform } from "@/components/marketing/Waveform";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { CheckIcon } from "@/components/marketing/Icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "PowerNexa Solutions installs solar, inverter, and battery backup systems for homes and businesses across Lagos. Learn how we size systems around your actual load.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  {
    title: "We size systems around your actual load",
    body: "Before we quote anything, we calculate what you actually need to power, your fridge, AC units, pumps, electronics, so you don't overpay for capacity you'll never use or underpay for a system that can't carry your home.",
  },
  {
    title: "Every quote is written and explained",
    body: "You get a written breakdown of panels, inverter size, battery capacity, and labour, explained in plain language before you commit to anything.",
  },
  {
    title: "Workmanship is warrantied",
    body: "Installation quality is backed by a written workmanship warranty, on top of the manufacturer warranty that comes with your panels, inverter, and batteries.",
  },
  {
    title: "We're based in Lagos, for Lagos",
    body: "Our team works out of Sangotedo, which means faster site visits, faster response when something needs attention, and installers who already know Lagos wiring, weather, and estate rules.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
          <Reveal className="mt-6 max-w-2xl">
            <Eyebrow>About PowerNexa Solutions</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Built to fix Lagos&apos;s power problem, one home at a time.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">
              Grid power in Lagos is unpredictable, and running a generator every day is loud,
              expensive, and hard on your health. PowerNexa Solutions exists to give homes and
              businesses a quieter, cleaner, and more predictable way to keep the lights on:
              solar, inverter, and battery systems sized correctly and installed properly.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Why sizing matters"
              title="A system that's too small fails you. Too big wastes your money."
              description="Cheap installers sell whatever package is in stock. We start with your electricity bill and your appliance list, then work backwards to the right panel count, inverter rating, and battery bank."
            />
            <ul className="mt-6 space-y-3">
              {[
                "We ask what you actually run, not just how many rooms you have.",
                "We check your existing wiring and meter before recommending anything.",
                "We explain trade-offs: more battery hours versus lower upfront cost.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                  <span className="text-sm leading-relaxed text-charcoal/75">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={200}>
            <Waveform className="h-56 w-full text-navy" />
          </Reveal>
        </Container>
      </section>

      <section className="bg-navy py-20 text-white">
        <Container>
          <Reveal>
            <SectionHeading light eyebrow="How we operate" title="What you can expect from us" />
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {PRINCIPLES.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 100} className="rounded-2xl border border-white/10 bg-white/5 p-7">
                <h3 className="font-display text-lg font-bold text-orange">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{principle.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
