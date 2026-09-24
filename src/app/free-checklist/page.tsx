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

// Question counts match the PDF's five stages (4 + 5 + 3 + 5 + 4 = 21).
const STAGES = [
  { name: "Before you call anyone", count: 4, body: "Know what you want to power, and ask for past customers you can call yourself." },
  { name: "Before you agree to a price", count: 5, body: "Get the load calculation in writing and the brand and model of every part." },
  { name: "Before you pay a deposit", count: 3, body: "Get the warranty and payment terms written down." },
  { name: "On installation day", count: 5, body: "Check the cables suit the load and the brand names match the quote." },
  { name: "Before you pay the balance", count: 4, body: "Watch the system run your appliances, and collect the warranty papers." },
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
              Most bad installations in Lagos go wrong for the same few reasons: the installer disappears after
              collecting the deposit, the battery is sized by guesswork, or the changeover switch is wired wrong.
              This free checklist gives you the questions that catch these problems before you pay.
            </p>

            <div className="mt-10 rounded-[28px] bg-white p-7 shadow-[0_1px_2px_rgba(9,43,76,0.06),0_10px_24px_-16px_rgba(9,43,76,0.16)]">
              <h2 className="font-display text-lg font-bold text-navy">What&apos;s inside</h2>
              <ol className="mt-5 space-y-4">
                {STAGES.map((stage, i) => (
                  <li key={stage.name} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange to-yellow font-mono-num text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-navy">
                        {stage.name}{" "}
                        <span className="font-mono-num text-xs font-medium text-charcoal/50">
                          {stage.count} questions
                        </span>
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-charcoal/70">{stage.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 flex items-start gap-3 border-t border-line pt-5 text-sm text-charcoal/75">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                At the end: the red flags that mean you should walk away.
              </p>
              <p className="mt-2 text-xs text-charcoal/50">Two pages. Print it, or keep it on your phone.</p>
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
