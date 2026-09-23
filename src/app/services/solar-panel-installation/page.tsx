import type { Metadata } from "next";
import Link from "next/link";
import { ServiceDetailLayout } from "@/components/marketing/ServiceDetailLayout";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Solar Panel Installation in Lagos",
  description:
    "Professional solar panel installation in Lagos for homes and businesses. Load-based system sizing, quality panels, and a written workmanship warranty.",
  alternates: { canonical: "/services/solar-panel-installation" },
};

export default function SolarPanelInstallationPage() {
  return (
    <ServiceDetailLayout
      name="Solar Panel Installation"
      slug="solar-panel-installation"
      heroDescription="Rooftop solar for homes, estates, and offices across Lagos. We calculate your actual power needs first, then design a panel array that covers it, not a generic package sized for a different house."
      benefits={[
        "Site assessment to check roof space, angle, and shading before we recommend anything.",
        "Monocrystalline or polycrystalline panels, matched to your budget and available space.",
        "Structural mounting rated for Lagos wind and rain, not a bracket kit from a hardware stall.",
        "Full wiring, earthing, and safety isolation done to standard, not shortcuts to save time.",
        "Written workmanship warranty plus the manufacturer warranty on the panels themselves.",
      ]}
      pricingNote={
        <p>
          Panel installation cost depends on system size (kW), panel type, roof condition, and
          how far your roof is from your inverter and battery room. See our{" "}
          <Link href="/pricing" className="font-semibold text-orange">
            full pricing guide
          </Link>{" "}
          for realistic ranges, or request a quote for an exact number.
        </p>
      }
      processIntro="Every panel installation follows the same disciplined process, whether it's a 2-panel starter system or a 40-panel commercial array."
      processSteps={[
        { title: "Load & roof assessment", body: "We check your appliances, your electricity bill, and your roof's condition and orientation." },
        { title: "System design & quote", body: "You get a written quote showing panel count, wattage, and expected output for your load." },
        { title: "Mounting & wiring", body: "Panels are mounted, wired, and earthed to standard, with cable runs kept clean and protected." },
        { title: "Testing & handover", body: "We test output under load, walk you through the system, and hand over your warranty documents." },
      ]}
      featuredAreas={["victoria-island", "lekki-phase-1", "ikoyi", "vgc"]}
      faqs={[
        {
          question: "How many solar panels do I need for my home?",
          answer:
            "It depends entirely on what you want to run and for how long. A single fridge and some lights need far fewer panels than a home running multiple AC units. We calculate this during your site assessment rather than guessing.",
        },
        {
          question: "Do you install both monocrystalline and polycrystalline panels?",
          answer:
            "Yes. Monocrystalline panels cost more but perform better in limited roof space, while polycrystalline panels can be more cost-effective when space isn't a constraint. We'll recommend based on your roof and budget.",
        },
        {
          question: "Will installation damage my roof?",
          answer:
            "Our mounting systems are designed to protect your roof's waterproofing. We inspect roof condition before installation and flag any pre-existing issues so there's no confusion about what caused what.",
        },
        {
          question: "Can I add more panels later?",
          answer:
            "In most cases, yes, as long as your inverter and battery bank can handle the additional capacity. We design with room to expand where it's practical and tell you upfront if it isn't.",
        },
      ]}
    >
      <section className="bg-mist py-20">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionHeading
              align="center"
              eyebrow="A common mistake"
              title="Panels without the right inverter and battery are wasted money"
              description="Solar panels only work as well as the inverter and battery bank behind them. A poorly matched inverter throttles your output, and undersized batteries leave you without power exactly when you need it most, at night or during long outages."
            />
            <p className="mt-5 text-sm leading-relaxed text-charcoal/75">
              That&apos;s why we never sell panels in isolation. Every quote includes the{" "}
              <Link href="/services/inverter-installation" className="font-semibold text-orange">
                inverter
              </Link>{" "}
              and{" "}
              <Link href="/services/battery-replacement-storage" className="font-semibold text-orange">
                battery capacity
              </Link>{" "}
              needed to actually use the power your panels generate, so you&apos;re not left with a
              roof full of panels and no way to store what they produce.
            </p>
          </Reveal>
        </Container>
      </section>
    </ServiceDetailLayout>
  );
}
