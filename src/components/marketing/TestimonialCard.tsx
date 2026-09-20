import type { Testimonial } from "@/lib/testimonials-data";
import { StarIcon } from "./Icons";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-7">
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
