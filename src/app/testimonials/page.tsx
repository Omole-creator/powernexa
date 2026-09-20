import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { TESTIMONIALS } from "@/lib/testimonials-data";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What homeowners and businesses across Lagos say about PowerNexa Solutions.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Testimonials", path: "/testimonials" },
        ])}
      />

      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Testimonials", path: "/testimonials" }]} />
          <div className="mt-6 max-w-2xl">
            <Eyebrow>Customer stories</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              What Lagos homes and businesses say
            </h1>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
