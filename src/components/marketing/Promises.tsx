import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { PROMISES } from "@/lib/promises";

// The six written promises (src/lib/promises.ts). The same wording goes on
// every customer quote, so the site never says more than the quote does.
export function Promises({ className = "" }: { className?: string }) {
  return (
    <section className={`relative overflow-hidden py-24 ${className}`}>
      <GlowOrb color="yellow" className="-left-24 top-10 h-72 w-72" />
      <GlowOrb color="orange" className="-right-24 bottom-0 h-64 w-64 opacity-70" />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="Our promises"
            title="Six promises we put in writing"
            description="They're printed on every quote we send, so you can hold us to them."
          />
        </Reveal>
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROMISES.map((promise, index) => (
            <Reveal key={promise.key} as="li" delay={(index % 3) * 90}>
              <div className="group relative h-full overflow-hidden rounded-[28px] bg-white p-7 shadow-[0_20px_50px_-28px_rgba(9,43,76,0.3)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(9,43,76,0.4)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange to-yellow font-mono-num text-base font-bold text-white shadow-[0_10px_24px_-8px_rgba(245,130,32,0.7)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  {index + 1}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold leading-snug text-navy">{promise.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{promise.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
