import type { Testimonial } from "@/lib/testimonials-data";
import { StarIcon } from "./Icons";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-[28px] bg-white p-7 shadow-[0_1px_2px_rgba(9,43,76,0.06),0_10px_24px_-16px_rgba(9,43,76,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(9,43,76,0.08),0_20px_36px_-18px_rgba(9,43,76,0.24)]">
      <div className="flex gap-1 text-yellow">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <StarIcon key={i} className="h-4 w-4" />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-charcoal/80">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 border-t border-line pt-4">
        <p className="font-display font-bold text-navy">{testimonial.name}</p>
        <p className="text-sm text-charcoal/55">
          {testimonial.location} · {testimonial.service}
        </p>
      </figcaption>
    </figure>
  );
}
