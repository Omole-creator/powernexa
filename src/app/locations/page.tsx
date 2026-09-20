import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { LocationCard } from "@/components/marketing/LocationCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { LAGOS_AREAS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Solar Installers Near Me: Lagos Areas We Serve",
  description:
    "PowerNexa Solutions installs solar, inverter, and battery systems across Lagos, including Victoria Island, Lekki Phase 1, Ikoyi, Ajah, VGC, Sangotedo, Ikeja, and the Mainland.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ])}
      />

      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }]} />
          <Reveal className="mt-6 max-w-2xl">
            <Eyebrow>Lagos, only</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Solar installers near you, wherever you are in Lagos
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">
              We focus on Lagos so we can respond fast and know the local terrain, estate rules,
              and wiring quirks in each area. Find your area below.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LAGOS_AREAS.map((area, index) => (
              <Reveal key={area.slug} delay={(index % 3) * 90}>
                <LocationCard area={area} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Don't see your area listed?"
        description="We may still cover it. Message us your location on WhatsApp and we'll confirm right away."
      />
    </>
  );
}
