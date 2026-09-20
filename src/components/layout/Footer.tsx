import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  BUSINESS_ADDRESS,
  BUSINESS_HOURS,
  LAGOS_AREAS,
  PHONE_DISPLAY,
  PHONE_E164,
  SERVICES,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/constants";
import { EmailLink } from "./EmailLink";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-navy text-white">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div className="inline-flex rounded-2xl bg-white p-3 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)]">
            <Image
              src="/images/logo-transparent.png"
              alt={SITE_NAME}
              width={1536}
              height={1024}
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{SITE_TAGLINE}</p>
          <p className="mt-5 text-sm text-white/70">
            {BUSINESS_ADDRESS.street}, {BUSINESS_ADDRESS.area}, {BUSINESS_ADDRESS.city}
          </p>
          <a href={`tel:${PHONE_E164}`} className="mt-1 block font-mono-num text-sm text-white hover:text-orange">
            {PHONE_DISPLAY}
          </a>
          <EmailLink className="mt-1 block text-sm text-white/80 hover:text-orange" />
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-orange">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className="hover:text-white">
                  {service.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-orange">
            Lagos areas we serve
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {LAGOS_AREAS.slice(0, 6).map((area) => (
              <li key={area.slug}>
                <Link href={`/locations/${area.slug}`} className="hover:text-white">
                  {area.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/locations" className="font-semibold text-orange hover:text-orange-dark">
                See all areas →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-orange">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            <li><Link href="/about" className="hover:text-white">About us</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing guide</Link></li>
            <li><Link href="/testimonials" className="hover:text-white">Testimonials</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/get-a-quote" className="hover:text-white">Get a quote</Link></li>
          </ul>
          <div className="mt-5 text-xs text-white/50">
            {BUSINESS_HOURS.map((h) => (
              <p key={h.days}>
                {h.days}: {h.hours}
              </p>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} {SITE_NAME}. Proudly serving Lagos.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/admin/login" className="hover:text-white">
              Staff login
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
