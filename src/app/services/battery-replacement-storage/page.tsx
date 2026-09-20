import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ServiceDetailLayout } from "@/components/marketing/ServiceDetailLayout";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Battery Replacement & Storage in Lagos",
  description:
    "Lithium and tubular battery supply, installation, and replacement in Lagos. Sized for the backup hours you need, with safe disposal of your old batteries.",
  alternates: { canonical: "/services/battery-replacement-storage" },
};

export default function BatteryReplacementPage() {
  return (
    <ServiceDetailLayout
      name="Battery Replacement & Storage"
      slug="battery-replacement-storage"
      heroDescription="Your inverter is only as good as the batteries behind it. We supply, install, and replace lithium and tubular batteries across Lagos, sized to the number of backup hours you actually need."
      benefits={[
        "Honest assessment of your current battery health before recommending a replacement.",
        "Lithium (LiFePO4) options for longer lifespan and lighter weight, where budget allows.",
        "Tubular battery options for lower upfront cost with proper maintenance guidance.",
        "Correct battery bank sizing so your backup hours match your actual usage, not a guess.",
        "Safe removal and disposal of old batteries, not left in your compound to leak.",
      ]}
      pricingNote={
        <p>
          Battery cost depends on chemistry (lithium vs tubular), capacity (Ah), and how many
          batteries your backup-hour target requires. Lithium costs more upfront but lasts
          significantly longer. Compare both in our{" "}
          <Link href="/pricing" className="font-semibold text-orange">
            pricing guide
          </Link>
          .
        </p>
      }
      processIntro="Battery replacement is quick when it's done right, and it starts with an honest check of what's actually wrong."
      processSteps={[
        { title: "Test existing batteries", body: "We check voltage, capacity, and charge cycles to confirm replacement is actually needed." },
        { title: "Recommend the right type", body: "Lithium or tubular, based on your budget, backup-hour goal, and space available." },
        { title: "Install & configure", body: "New batteries are wired, balanced, and configured with your existing or new inverter." },
        { title: "Remove old batteries safely", body: "Old batteries are removed and disposed of responsibly, not left behind." },
      ]}
      featuredAreas={["ajah", "sangotedo", "ikeja", "lagos-mainland"]}
      faqs={[
        {
          question: "Lithium or tubular battery, which should I choose?",
          answer:
            "Lithium batteries cost more upfront but last significantly longer, charge faster, and weigh less, so they cost less per year of use over time. Tubular batteries are cheaper to buy today but need more maintenance and typically last fewer years. We'll walk you through both based on your budget.",
        },
        {
          question: "How do I know if my battery needs replacing?",
          answer:
            "Common signs include shorter backup time than before, the battery getting unusually hot, swelling on tubular batteries, or the inverter beeping about low voltage even after a full charge. We can test your existing battery and tell you honestly if replacement is needed.",
        },
        {
          question: "Can you install a battery from a different brand than my inverter?",
          answer:
            "In most cases yes, as long as the voltage and specifications are compatible. We check compatibility first and won't install a mismatch that could damage your system.",
        },
      ]}
    >
      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal className="overflow-hidden rounded-2xl border border-line">
            <Image
              src="/images/inverter-battery-stack.jpg"
              alt="Hybrid inverter mounted above a stack of batteries, with solar panels in the background"
              width={640}
              height={480}
              className="h-full w-full object-cover"
            />
          </Reveal>
          <Reveal delay={150}>
            <SectionHeading
              eyebrow="Sized to fit"
              title="Batteries stacked to match your backup goal"
              description="More backup hours means more battery capacity, not a bigger single unit. We stack the right number of batteries for your target, wired and balanced correctly, in a space that fits your home or office."
            />
          </Reveal>
        </Container>
      </section>

      <section className="bg-mist py-20">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="A quick comparison"
            title="Lithium vs tubular, at a glance"
          />
          <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-5 py-3.5 font-display">Factor</th>
                  <th className="px-5 py-3.5 font-display">Lithium (LiFePO4)</th>
                  <th className="px-5 py-3.5 font-display">Tubular</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr>
                  <td className="px-5 py-3.5 font-medium text-navy">Upfront cost</td>
                  <td className="px-5 py-3.5 text-charcoal/75">Higher</td>
                  <td className="px-5 py-3.5 text-charcoal/75">Lower</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-navy">Typical lifespan</td>
                  <td className="px-5 py-3.5 text-charcoal/75">Significantly longer</td>
                  <td className="px-5 py-3.5 text-charcoal/75">Shorter, more replacements</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-navy">Maintenance</td>
                  <td className="px-5 py-3.5 text-charcoal/75">Minimal</td>
                  <td className="px-5 py-3.5 text-charcoal/75">Regular topping up required</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-navy">Weight & space</td>
                  <td className="px-5 py-3.5 text-charcoal/75">Lighter, compact</td>
                  <td className="px-5 py-3.5 text-charcoal/75">Heavier, bulkier</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Container>
      </section>
    </ServiceDetailLayout>
  );
}
