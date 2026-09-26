import type { Metadata } from "next";
import Image from "next/image";
import { ServiceDetailLayout } from "@/components/marketing/ServiceDetailLayout";
import { Container, SectionHeading } from "@/components/ui/Container";
import { CheckIcon } from "@/components/marketing/Icons";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Solar & Inverter Maintenance and Repair in Lagos",
  description:
    "Scheduled maintenance and fast repairs for solar panels, inverters, and batteries in Lagos. Catch problems before they become expensive breakdowns.",
  alternates: { canonical: "/services/solar-maintenance-repair" },
};

const CHECKLIST = [
  "Panel cleaning and inspection for dust, cracks, or loose mounting",
  "Inverter diagnostics for error codes, overheating, and fan function",
  "Battery voltage and capacity testing under load",
  "Wiring and connection checks for corrosion or loose terminals",
  "Earthing and safety isolation verification",
];

export default function MaintenancePage() {
  return (
    <ServiceDetailLayout
      name="Solar & Inverter Maintenance"
      slug="solar-maintenance-repair"
      heroDescription="Solar and inverter systems lose efficiency quietly. Dust builds up on panels, connections loosen, and batteries degrade, until one day the system just doesn't perform. Scheduled maintenance catches this before it becomes a breakdown."
      benefits={[
        "Every system we install gets two free check-ups, at 6 and 12 months, to clean panels and inspect wiring before problems start.",
        "Fast-response repairs for inverters that are tripping, beeping, or underperforming.",
        "Honest diagnosis, we tell you when a part needs replacing, not just servicing.",
        "Maintenance plans for estates and businesses with multiple systems to manage.",
        "Documentation after every visit so you have a record of your system's health.",
      ]}
      pricingNote={
        <p>
          Maintenance visits are priced by system size and whether it&apos;s a one-off callout or
          a scheduled plan. Estates and commercial clients with multiple units typically get a
          lower per-visit rate on a maintenance contract. Ask us for a maintenance quote alongside
          your installation quote.
        </p>
      }
      processIntro="A maintenance visit follows a fixed checklist, so nothing gets missed."
      processSteps={[
        { title: "Book a visit", body: "Schedule a routine check or report a fault through WhatsApp or a call." },
        { title: "Full system inspection", body: "We run through our maintenance checklist covering panels, inverter, and battery." },
        { title: "Fix or flag issues", body: "Minor issues are fixed on the spot; anything bigger is quoted before we proceed." },
        { title: "Report & next visit", body: "You get a summary of what was found and when your next check is due." },
      ]}
      featuredAreas={["vgc", "ikoyi", "victoria-island", "sangotedo"]}
      faqs={[
        {
          question: "How often should I service my solar and inverter system?",
          answer:
            "We recommend at least twice a year, once before harmattan (dust builds up fast) and once before the heaviest rainy season months, to check for water ingress and loose connections.",
        },
        {
          question: "My inverter keeps beeping, what does that mean?",
          answer:
            "Beeping usually signals an overload, low battery voltage, or a fault code specific to your inverter brand. Don't ignore it, continued use in a fault state can damage the battery or inverter. Message us the beep pattern or error code and we'll advise before your visit.",
        },
        {
          question: "Do you offer maintenance contracts for estates?",
          answer:
            "Yes. We work with estate facility managers to schedule maintenance across multiple homes on a fixed calendar, which is more efficient and usually cheaper per unit than individual callouts.",
        },
      ]}
    >
      <section className="bg-mist py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="What we check"
              title="Our standard maintenance checklist"
              description="Every visit covers the same core checklist, so small issues get caught before they turn into a full system failure."
            />
          </Reveal>
          <Reveal delay={150}>
            <ul className="space-y-3 rounded-2xl border border-line bg-white p-7">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                  <span className="text-sm leading-relaxed text-charcoal/75">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Safety first"
              title="Isolation and earthing, checked every visit"
              description="Working on a live distribution board without proper isolation is how systems get damaged and people get hurt. Our technicians isolate before they touch anything, every time."
            />
          </Reveal>
          <Reveal delay={150} className="overflow-hidden rounded-2xl border border-line">
            <Image
              src="/images/installation-distribution-board.jpg"
              alt="A technician in a safety harness inspecting a distribution board"
              width={640}
              height={480}
              className="h-full w-full object-cover"
            />
          </Reveal>
        </Container>
      </section>
    </ServiceDetailLayout>
  );
}
