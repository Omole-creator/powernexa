import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { LeadMagnetGate } from "@/components/marketing/LeadMagnetGate";
import { ShareButtons } from "@/components/marketing/ShareButtons";
import { CheckIcon } from "@/components/marketing/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { DEFAULT_LEAD_MAGNET } from "@/lib/lead-magnets";

// Shareable home for the lead magnet, linked from the footer only. The same
// form also stays in its own section on the homepage.
const PATH = "/free-checklist";

export const metadata: Metadata = {
  title: "Free Inverter Installer Checklist for Lagos",
  description:
    "A free 2-page checklist of 21 questions to ask before you pay any solar or inverter installer in Lagos, plus the red flags that mean you should walk away.",
  alternates: { canonical: PATH },
  openGraph: {
    title: DEFAULT_LEAD_MAGNET.title,
    description: "Free 2-page checklist. Ask these questions before you pay any installer.",
    url: PATH,
  },
};

// Curiosity bullets for "What's inside". Each one points at a question or
// red flag that is in the PDF, without giving the answer away (only the
// download does). If the PDF changes, check every bullet is still true.
const TEASERS = [
  "Why \"How long has your company been around?\" can point you to the wrong installer, and what to ask instead.",
  "One kind of proof that tells you more than a phone full of finished-job photos.",
  "A warning sign that shows up before you even get a price, and tells you your system is being sized by guesswork.",
  "What every line of a proper quote should name, so the parts that arrive at your house are the parts you paid for.",
  "Four costs that may or may not be inside your quoted price, and the one question that settles it.",
  "How a simple WhatsApp message can protect your deposit, if it says the right things.",
  "Three details to collect before you pay a deposit, so you can still find the installer if they stop picking your calls.",
  "A wiring choice on installation day that decides what your inverter has to carry when NEPA takes light.",
  "A fire risk that comes from saving money in the wrong place on installation day.",
  "Why the spot where your batteries sit can make them fail sooner.",
  "What a quick light bulb test does not prove, and how the system should be tested before you pay the balance.",
  "The papers you should have in your hand before the installer leaves, because a spoken promise is not a warranty.",
  "Six red flags that mean you should walk away, including one thing some installers say about warranty that should end the conversation.",
];

export default function FreeChecklistPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Free checklist", path: PATH },
        ])}
      />

      <section className="bg-mist py-14 sm:py-20">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Free checklist", path: PATH }]} />
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Reveal>
            <Eyebrow>Free download</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-5xl">
              {DEFAULT_LEAD_MAGNET.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-charcoal/75">
              Most bad installations in Lagos don&apos;t fail because the equipment was bad. They fail because
              nobody asked the right question at the right time, and you only find out after you&apos;ve paid.
              This checklist gives you those questions, one stage at a time.
            </p>

            <div className="mt-10 rounded-[28px] bg-white p-7 shadow-[0_1px_2px_rgba(9,43,76,0.06),0_10px_24px_-16px_rgba(9,43,76,0.16)]">
              <h2 className="font-display text-lg font-bold text-navy">What&apos;s inside</h2>
              <p className="mt-2 text-sm text-charcoal/60">
                21 questions in 5 stages, from before you call anyone to the day you pay the balance.
                Here&apos;s some of what you&apos;ll find:
              </p>
              <ul className="mt-5 space-y-3.5">
                {TEASERS.map((teaser) => (
                  <li key={teaser} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                    <span className="text-[15px] leading-relaxed text-charcoal/80">{teaser}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-5 text-xs text-charcoal/50">Two pages. Print it, or keep it on your phone.</p>
            </div>
          </Reveal>

          <Reveal className="lg:sticky lg:top-28">
            <LeadMagnetGate
              magnet={DEFAULT_LEAD_MAGNET}
              title="Get your free copy"
              description="Enter your details and the checklist opens in a new tab."
            />
            <ShareButtons
              url={`${SITE_URL}${PATH}`}
              title={DEFAULT_LEAD_MAGNET.title}
              label="Know someone about to install an inverter? Send them this page."
              className="mt-6"
            />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
