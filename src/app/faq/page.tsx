import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CtaBand } from "@/components/marketing/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about solar panel installation, inverter sizing, batteries, pricing, warranty, and service areas across Lagos.",
  alternates: { canonical: "/faq" },
};

const GROUPS: { title: string; items: { question: string; answer: string }[] }[] = [
  {
    title: "Getting started",
    items: [
      {
        question: "How do I get a quote?",
        answer:
          "Fill in the quote form on this site, call us, or message us on WhatsApp with what you'd like to power. We'll ask a few questions, then book a site assessment and give you a written quote.",
      },
      {
        question: "Do you charge for the site visit?",
        answer:
          "Asking questions on WhatsApp or by phone is free. The site assessment has a small fee, and we tell you the amount before we book. If you go ahead with the installation, we take the full fee off your final price.",
      },
      {
        question: "How long does the whole process take, from quote to commissioning?",
        answer:
          "A typical residential project moves from site visit to commissioning within one to two weeks, depending on equipment availability and system size. Commercial projects vary based on scope.",
      },
    ],
  },
  {
    title: "Sizing & equipment",
    items: [
      {
        question: "How do you decide what size system I need?",
        answer:
          "We start with your electricity bill and a walk-through of what you want to run, then calculate the total load in watts, add a safety margin, and recommend an inverter, battery, and panel configuration that covers it.",
      },
      {
        question: "What's the difference between solar panels, an inverter, and a battery?",
        answer:
          "Solar panels generate electricity from sunlight. The inverter converts that electricity (or grid/generator power) into the type your appliances use, and manages switching between power sources. The battery stores power so you have backup when the sun isn't out or the grid is down.",
      },
      {
        question: "Do I need solar panels, or can I just get an inverter and battery?",
        answer:
          "Many Lagos homes start with just an inverter and battery for backup power, then add solar panels later to reduce reliance on the grid and extend backup time. We can design for either approach.",
      },
    ],
  },
  {
    title: "Service & warranty",
    items: [
      {
        question: "What happens if something breaks after installation?",
        answer:
          "Message us on WhatsApp, any time of day. We reply within 2 hours, and a technician comes to you within 48 hours. Faults caused by our work are covered free for your first year. Equipment faults are covered by each maker's warranty.",
      },
      {
        question: "When do I pay?",
        answer:
          "Your deposit covers the equipment, which we buy for your job. You pay the balance after we install the system and you see it working. The price on your written quote doesn't change unless you add appliances.",
      },
      {
        question: "What if the system can't carry what you said it would?",
        answer:
          "Your quote lists every appliance the system will power and for how many hours. If it can't do that in the first 30 days, we adjust it or add to it at our own cost.",
      },
      {
        question: "Do you offer ongoing maintenance?",
        answer:
          "Every system we install gets two free check-ups, at 6 and 12 months. After that, or for systems someone else installed, we do one-off visits and maintenance plans, which suit estates and businesses with several systems.",
      },
    ],
  },
  {
    title: "Service area",
    items: [
      {
        question: "Which areas of Lagos do you cover?",
        answer:
          "We actively serve Victoria Island, Lekki Phase 1, Ikoyi, Ajah, VGC, Sangotedo, Ikeja, and Lagos Mainland. If your area isn't listed, message us and we'll confirm whether we can reach you.",
      },
      {
        question: "Do you work outside Lagos?",
        answer:
          "Currently, no. We focus exclusively on Lagos so we can maintain fast response times and stay close to every system we install.",
      },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <JsonLd data={faqJsonLd(ALL_ITEMS)} />

      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]} />
          <Reveal className="mt-6 max-w-2xl">
            <Eyebrow>Help center</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">
              Everything homeowners and businesses usually ask before installing solar, inverter,
              or battery systems in Lagos.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container className="mx-auto max-w-3xl space-y-14">
          {GROUPS.map((group, index) => (
            <Reveal key={group.title} delay={index * 80}>
              <h2 className="font-display text-2xl font-bold text-navy">{group.title}</h2>
              <div className="mt-5">
                <FaqAccordion items={group.items} />
              </div>
            </Reveal>
          ))}
        </Container>
      </section>

      <CtaBand title="Still have a question?" description="Message us on WhatsApp, we usually reply fast during business hours." />
    </>
  );
}
