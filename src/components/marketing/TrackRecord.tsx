import type { ComponentType, SVGProps } from "react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { CountUp } from "@/components/ui/CountUp";
import { HeadsetIcon, ProjectsIcon, ShieldIcon, SmileIcon } from "./Icons";
import { PROJECTS_COMPLETED } from "@/lib/projects-data";
import { PROMISE_TERMS } from "@/lib/promises";

// The owner's headline figures (Sept 2026). Each counts up from 1.
const STATS: {
  to: number;
  suffix: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { to: PROJECTS_COMPLETED, suffix: "+", label: "Projects completed", icon: ProjectsIcon },
  { to: 99, suffix: "%+", label: "Customer satisfaction", icon: SmileIcon },
  { to: 100, suffix: "%", label: "Installation warranty", icon: ShieldIcon },
  // Response promise from src/lib/promises.ts (owner, Sept 2026), replacing "24/7".
  { to: PROMISE_TERMS.replyHours, suffix: "hr", label: `WhatsApp reply, technician in ${PROMISE_TERMS.onSiteHours}hr`, icon: HeadsetIcon },
];

export function TrackRecord() {
  return (
    <section className="relative overflow-hidden bg-navy py-24 text-white">
      <GlowOrb color="orange" className="-left-24 -top-10 h-80 w-80" />
      <GlowOrb color="yellow" className="-right-24 bottom-0 h-72 w-72 opacity-60" />
      <Container className="relative">
        <Reveal>
          <SectionHeading light align="center" eyebrow="Our track record" title="The numbers behind our work" />
        </Reveal>

        <dl className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Reveal key={stat.label} delay={index * 110}>
                <div className="group relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-orange/40 hover:bg-white/[0.1] hover:shadow-[0_30px_60px_-30px_rgba(245,130,32,0.55)] sm:p-7">
                  <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-orange to-yellow transition-transform duration-500 group-hover:scale-x-100" />
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange to-yellow text-white shadow-[0_10px_24px_-8px_rgba(245,130,32,0.7)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <dd className="mt-6 font-mono-num text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    <CountUp to={stat.to} suffix={stat.suffix} />
                  </dd>
                  <dt className="mt-2 text-sm font-medium text-white/70 sm:text-base">{stat.label}</dt>
                </div>
              </Reveal>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}
