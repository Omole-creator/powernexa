import type { Metadata } from "next";
import Link from "next/link";
import { ServiceDetailLayout } from "@/components/marketing/ServiceDetailLayout";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Waveform } from "@/components/marketing/Waveform";

export const metadata: Metadata = {
  title: "Inverter Installation in Lagos",
  description:
    "Pure sine wave inverter installation in Lagos, sized to your actual load. Correct sizing, safe wiring, and a written warranty on every install.",
  alternates: { canonical: "/services/inverter-installation" },
};

export default function InverterInstallationPage() {
  return (
    <ServiceDetailLayout
      name="Inverter Installation"
      slug="inverter-installation"
      heroDescription="A correctly sized pure sine wave inverter is the difference between clean, silent power and a system that hums, overheats, or trips every time you switch on the AC. We size and install inverters for homes and businesses across Lagos."
      benefits={[
        "Correct kVA sizing based on your actual appliance load, not a round number.",
        "Pure sine wave inverters that run sensitive electronics and AC compressors safely.",
        "Proper changeover wiring so switching between grid and inverter power happens without a flicker.",
        "Battery bank matched to your inverter for the backup hours you actually need.",
        "Written warranty on installation, on top of the inverter manufacturer's warranty.",
      ]}
      pricingNote={
        <p>
          Inverter cost is driven mainly by kVA rating and whether it&apos;s pure sine wave or modified
          sine wave. Larger inverters that can carry AC units and pumps cost more than a small
          unit for lights and a fridge. See our{" "}
          <Link href="/pricing" className="font-semibold text-orange">
            pricing guide
          </Link>{" "}
          for typical ranges.
        </p>
      }
      processIntro="Getting inverter sizing wrong is the single most common mistake we see from other installers. Here's how we avoid it."
      processSteps={[
        { title: "List your appliances", body: "We total up the wattage of what you actually plan to run at the same time." },
        { title: "Size the inverter & battery", body: "We recommend a kVA rating and battery capacity with margin for future needs." },
        { title: "Install & wire the changeover", body: "Clean, code-compliant wiring so your home switches power sources without a flicker." },
        { title: "Load test before handover", body: "We run your own appliances on the system before we call the job done." },
      ]}
      featuredAreas={["lekki-phase-1", "ikeja", "ajah", "lagos-mainland"]}
      faqs={[
        {
          question: "What's the difference between pure sine wave and modified sine wave inverters?",
          answer:
            "A pure sine wave inverter produces power that closely matches what comes from the grid, which is safer for sensitive electronics, AC compressors, and motors. A modified sine wave inverter is cheaper but can cause humming, reduced efficiency, or damage to certain appliances over time.",
        },
        {
          question: "What size inverter do I need?",
          answer:
            "It depends on the combined wattage of what you want to run at once. A home running a few lights, a TV, and a fridge needs far less than one running multiple air conditioners. We calculate this for you during your free assessment.",
        },
        {
          question: "Can you install an inverter with my existing solar panels or generator setup?",
          answer:
            "In most cases yes. We assess your existing equipment and wiring first and tell you honestly if anything needs to be upgraded or replaced to work safely with a new inverter.",
        },
      ]}
    >
      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Why the wave shape matters"
              title="Our logo isn't just a sun. It's a sine wave, on purpose."
              description="A pure sine wave inverter produces a smooth, continuous wave, just like grid power. A cheap modified sine wave inverter produces a jagged, stepped wave. That jagged shape is why cheap inverters make your fridge hum, your fan sound rough, and your electronics wear out faster."
            />
            <p className="mt-5 text-sm leading-relaxed text-charcoal/70">
              We only install pure sine wave inverters for exactly this reason. It costs a little
              more upfront and saves you money in appliance repairs over the years.
            </p>
          </div>
          <Waveform className="h-48 w-full text-navy" />
        </Container>
      </section>
    </ServiceDetailLayout>
  );
}
