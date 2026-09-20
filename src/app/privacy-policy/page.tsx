import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { PHONE_DISPLAY, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and protects your information.`,
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-14 sm:py-16">
      <Container className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }]} />
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-5 font-display text-3xl font-bold text-navy sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-charcoal/50">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose-pnx mt-8 space-y-6 text-sm leading-relaxed text-charcoal/80">
          <p>
            {SITE_NAME} (&quot;we&quot;, &quot;us&quot;) operates this website to provide information
            about, and let you request, solar, inverter, and battery installation services in Lagos.
            This policy explains what information we collect and how we use it.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">Information you give us</h2>
          <p>
            When you submit our quote form, we collect your name, phone number, property area,
            property type, the service you&apos;re interested in, and any message you choose to add.
            We use this information to respond to your request, prepare a quote, and follow up with
            you by phone or WhatsApp.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">WhatsApp</h2>
          <p>
            Submitting a quote request opens a WhatsApp conversation with your details pre-filled.
            Once you send that message, it is handled according to WhatsApp&apos;s own privacy
            practices, which we don&apos;t control. We use the WhatsApp conversation to communicate
            with you about your request.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">Analytics information</h2>
          <p>
            We collect anonymous usage information, such as which pages are viewed, which buttons
            are clicked (for example, the WhatsApp or call buttons), device type, and referring
            website. This is stored against an anonymous identifier in a cookie on your browser,
            not your name or contact details, and is used to understand how the site is performing
            and to improve it. We do not sell this information to anyone.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">Cookies</h2>
          <p>
            We use two small cookies for analytics: one that identifies a returning visitor over
            time, and one that groups activity into a browsing session. Neither cookie contains
            your name, phone number, or any content you typed. You can clear cookies at any time
            from your browser settings.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">How we use your information</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>To respond to quote requests and provide accurate pricing.</li>
            <li>To schedule site visits, installations, and maintenance.</li>
            <li>To improve our website and services based on how they&apos;re used.</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-navy">Data sharing</h2>
          <p>
            We do not sell your personal information. We may share information with staff or
            contractors directly involved in fulfilling your installation or maintenance request.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">Your rights</h2>
          <p>
            You can ask us what information we hold about you, ask us to correct it, or ask us to
            delete it, subject to any records we&apos;re required to keep for legitimate business or
            legal reasons. Contact us by phone or WhatsApp at {PHONE_DISPLAY} to make a request.
          </p>

          <h2 className="font-display text-xl font-bold text-navy">Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The &quot;last updated&quot; date at the
            top of this page will reflect the most recent change.
          </p>
        </div>
      </Container>
    </section>
  );
}
