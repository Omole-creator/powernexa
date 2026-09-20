import type { Metadata } from "next";
import { Container, SectionHeading, Eyebrow } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CtaBand } from "@/components/marketing/CtaBand";
import { CheckIcon } from "@/components/marketing/Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Solar & Inverter Installation Cost in Lagos",
  description:
    "What determines solar panel and inverter installation cost in Lagos: load size, battery type, panel wattage, and more. Get an exact, written quote for your property.",
  alternates: { canonical: "/pricing" },
};

const FACTORS = [
  {
    title: "Your load (what you're actually powering)",
    body: "A few lights and a fridge cost far less to back up than multiple air conditioners, pumps, and office equipment. This is the single biggest driver of cost.",
  },
  {
    title: "Battery type and capacity",
    body: "Lithium batteries cost more upfront but last longer and need less maintenance. Tubular batteries cost less initially but are replaced more often. Capacity (how many hours of backup you want) also drives price directly.",
  },
  {
    title: "Inverter size and wave type",
    body: "Pure sine wave inverters cost more than modified sine wave units, but protect your appliances better. Higher kVA ratings for heavier loads also cost more.",
  },
  {
    title: "Panel wattage and count",
    body: "More panels, or higher-wattage panels, mean higher solar-generation capacity and higher upfront cost, but also more independence from the grid.",
  },
  {
    title: "Roof and installation conditions",
    body: "Roof type, height, access, and the distance between your panels, inverter, and battery room all affect labour and material costs.",
  },
  {
    title: "Warranty and backup duration",
    body: "A longer written warranty and a system designed for extended backup hours (for frequent, long outages) typically costs more than a basic short-backup setup.",
  },
];

const TIERS = [
  {
    name: "Essential Backup",
    who: "Studio flats, small apartments, single rooms",
    powers: "Lights, fans, a fridge, TV, phone and laptop charging",
    backup: "A few hours of backup during outages",
  },
  {
    name: "Whole-Home System",
    who: "3 to 5 bedroom homes",
    powers: "Lights, fans, fridge/freezer, TV, router, and 1 or 2 air conditioning units",
    backup: "Extended backup through most outages, day or night",
  },
  {
    name: "Commercial / Estate System",
    who: "Offices, clinics, schools, multi-home estates",
    powers: "Critical business equipment plus general office or facility loads",
    backup: "Sized around your operating hours and critical-load requirements",
  },
];

const FAQS = [
  {
    question: "Why don't you publish fixed prices?",
    answer:
      "Because a fixed price would be misleading. Two homes with the same number of bedrooms can need very different systems depending on what they actually run. We'd rather calculate your actual load and give you an accurate written quote than publish a number that doesn't apply to your situation.",
  },
  {
    question: "Is solar cheaper than running a generator?",
    answer:
      "Solar has no daily fuel cost, which is the main ongoing expense of running a generator. The upfront investment in solar is higher, but it's a one-time cost (plus occasional maintenance) rather than a cost that repeats every single day you need power.",
  },
  {
    question: "Can I start small and expand later?",
    answer:
      "In many cases yes. We can design a system with room to add panels or battery capacity later, and we'll tell you upfront if your budget tier has that flexibility or not.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Discuss your budget with us directly during your quote call. We'll be upfront about what's possible for your specific project.",
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }]} />
          <div className="mt-6 max-w-2xl">
            <Eyebrow>Solar installation cost in Lagos</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              What actually determines your solar and inverter cost
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">
              We won&apos;t quote you a fake fixed price here, because it would be wrong for most
              people who read it. Instead, here&apos;s exactly what drives cost up or down, so you
              can budget realistically before you request your free, exact quote.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Cost factors" title="Six things that determine your price" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FACTORS.map((factor) => (
              <div key={factor.title} className="rounded-2xl border border-line bg-white p-6">
                <h3 className="font-display text-base font-bold text-navy">{factor.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-charcoal/70">{factor.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-navy py-20 text-white">
        <Container>
          <SectionHeading
            eyebrow="Typical system tiers"
            title={<span className="text-white">Three common starting points</span>}
            description="These are illustrative categories, not quotes. Your exact system and price come from your free site visit."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <div key={tier.name} className="rounded-2xl border border-white/15 bg-white/5 p-7">
                <h3 className="font-display text-xl font-bold text-orange">{tier.name}</h3>
                <p className="mt-1 text-sm text-white/60">{tier.who}</p>
                <div className="mt-5 space-y-3 text-sm text-white/80">
                  <p className="flex gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-yellow" />
                    <span>
                      <strong className="font-semibold text-white">Powers:</strong> {tier.powers}
                    </span>
                  </p>
                  <p className="flex gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-yellow" />
                    <span>
                      <strong className="font-semibold text-white">Backup:</strong> {tier.backup}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="mx-auto max-w-3xl">
          <SectionHeading align="center" eyebrow="Pricing questions" title="Frequently asked questions" />
          <div className="mt-10">
            <FaqAccordion items={FAQS} />
          </div>
        </Container>
      </section>

      <CtaBand
        title="Get your exact price, not an estimate"
        description="A free site visit gives you a written quote based on your actual load, not a guess."
      />
    </>
  );
}
