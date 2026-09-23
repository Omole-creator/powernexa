import { Container, SectionHeading } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { CountUp } from "@/components/ui/CountUp";
import { ProjectVideoCard } from "./ProjectVideoCard";
import { CheckIcon } from "./Icons";
import { LAGOS_AREAS } from "@/lib/constants";
import { PROJECTS_COMPLETED, PROJECT_VIDEOS } from "@/lib/projects-data";

// Every figure here is provable: the project count is the owner's, the kVA and
// kWh come from the Elegushi install shown right beside them, and the area
// count is the site's own list of Lagos areas.
const STATS = [
  { to: PROJECTS_COMPLETED, suffix: "+", label: "projects completed" },
  { to: 22, suffix: "kVA", label: "hybrid system we commissioned at Elegushi Estate, Lekki" },
  { to: 64, suffix: "kWh", label: "of lithium storage in that same home" },
  { to: LAGOS_AREAS.length, suffix: "", label: "Lagos areas we cover" },
];

export function ProofSection() {
  const featured = PROJECT_VIDEOS[0];

  return (
    <section className="relative overflow-hidden py-24">
      <GlowOrb color="orange" className="-left-24 top-10 h-72 w-72" />
      <GlowOrb color="yellow" className="-right-20 bottom-0 h-56 w-56" />
      <Container className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Our track record"
              title={`More than ${PROJECTS_COMPLETED} installs done`}
              description={`Here's one of them: a ${STATS[1].to}kVA system at Elegushi Estate, Lekki.`}
            />
          </Reveal>

          <dl className="mt-10 grid grid-cols-2 gap-4">
            {STATS.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 90}>
                <div className="h-full rounded-[24px] bg-white p-5 shadow-[0_18px_40px_-24px_rgba(9,43,76,0.3)]">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-mono-num text-3xl font-bold text-navy sm:text-4xl">
                      <CountUp to={stat.to} suffix={stat.suffix} />
                    </span>
                    <span className="mt-2 block text-sm leading-snug text-charcoal/70">{stat.label}</span>
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={200}>
            <p className="mt-6 flex items-center gap-2 text-sm font-medium text-navy">
              <CheckIcon className="h-5 w-5 shrink-0 text-orange" />
              Every job comes with a written workmanship warranty.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/get-a-quote" size="lg">
                Get a Quote
              </Button>
              <Button href="/projects" variant="outline" size="lg">
                Watch more installs
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={150} className="mx-auto w-full max-w-sm">
          <ProjectVideoCard project={featured} priority />
        </Reveal>
      </Container>
    </section>
  );
}
