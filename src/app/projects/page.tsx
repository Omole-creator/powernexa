import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { ProjectVideoCard } from "@/components/marketing/ProjectVideoCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { PROJECTS_COMPLETED, PROJECT_VIDEOS } from "@/lib/projects-data";

export const metadata: Metadata = {
  title: "Projects",
  description: `Watch solar, inverter and battery installs by PowerNexa Solutions in Lekki, Ikoyi, Ikeja, Okun-Aja and Mowe-Ibafo. ${PROJECTS_COMPLETED}+ projects completed.`,
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const moreCount = PROJECTS_COMPLETED - PROJECT_VIDEOS.length;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ])}
      />

      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }]} />
          <Reveal className="mt-6 max-w-2xl">
            <Eyebrow>Projects</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-navy sm:text-5xl">
              A few of our recent installs
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">
              These five are a small sample of the {PROJECTS_COMPLETED}+ jobs we&apos;ve done. Want to see a job close to
              your area? Ask us on WhatsApp.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden py-20">
        <GlowOrb color="orange" className="-right-24 top-20 h-72 w-72" />
        <GlowOrb color="navy" className="-left-24 bottom-10 h-64 w-64" />
        <Container className="relative">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECT_VIDEOS.map((project, index) => (
              <Reveal key={project.slug} delay={(index % 3) * 100}>
                <ProjectVideoCard project={project} priority={index < 3} />
              </Reveal>
            ))}

            <Reveal delay={200}>
              <div className="flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-[28px] bg-gradient-to-br from-navy to-navy-ink p-7 text-white shadow-[0_20px_50px_-24px_rgba(9,43,76,0.5)]">
                <p className="font-mono-num text-5xl font-bold text-orange">{moreCount}+</p>
                <p className="mt-3 font-display text-xl font-bold leading-snug">more installs across Lagos.</p>
                <p className="mt-2 text-sm text-white/70">Ask us about jobs near you.</p>
                <Button
                  href={buildWhatsAppUrl("Hi PowerNexa Solutions, can you show me an installation you did near my area?")}
                  variant="outlineWhite"
                  className="mt-6 self-start"
                >
                  Ask on WhatsApp
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
