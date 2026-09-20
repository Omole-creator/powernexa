import type { Testimonial } from "@/lib/testimonials-data";
import { StarIcon } from "./Icons";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initial = testimonial.name.trim().charAt(0).toUpperCase();

  return (
    <figure className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white p-7 shadow-[0_1px_2px_rgba(9,43,76,0.06),0_10px_24px_-16px_rgba(9,43,76,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(9,43,76,0.08),0_20px_36px_-18px_rgba(9,43,76,0.24)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-3 font-display text-[5.5rem] font-bold leading-none text-navy/[0.05]"
      >
        &rdquo;
      </span>
      <div className="relative flex gap-1 text-yellow">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <StarIcon key={i} className="h-4 w-4" />
        ))}
      </div>
      <blockquote className="relative mt-4 flex-1 text-[15px] leading-relaxed text-charcoal/80">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="relative mt-6 flex items-center gap-3 border-t border-line pt-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-ink font-display text-sm font-bold text-white">
          {initial}
        </span>
        <div>
          <p className="font-display font-bold text-navy">{testimonial.name}</p>
          <p className="text-sm text-charcoal/55">
            {testimonial.location} · {testimonial.service}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
