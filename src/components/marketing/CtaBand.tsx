import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Waveform } from "./Waveform";
import { PHONE_DISPLAY, PHONE_E164, PHONE_DISPLAY_2, PHONE_E164_2 } from "@/lib/constants";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";

export function CtaBand({
  title = "Ready to stop worrying about power?",
  description = "Tell us what you need and we'll size a system that actually fits your load, not a generic package.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy py-16 text-white">
      <Waveform className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-20" />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">{title}</h2>
        <p className="max-w-xl text-white/75">{description}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/get-a-quote" size="lg">
            Get a Free Quote
          </Button>
          <Button href={buildWhatsAppUrl(defaultWhatsAppMessage())} variant="outlineWhite" size="lg">
            Chat on WhatsApp
          </Button>
        </div>
        <p className="font-mono-num text-sm text-white/70">
          Or call us directly:{" "}
          <a href={`tel:${PHONE_E164}`} className="hover:text-white">
            {PHONE_DISPLAY}
          </a>{" "}
          /{" "}
          <a href={`tel:${PHONE_E164_2}`} className="hover:text-white">
            {PHONE_DISPLAY_2}
          </a>
        </p>
      </Container>
    </section>
  );
}
