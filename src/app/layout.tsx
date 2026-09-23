import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatButton } from "@/components/layout/WhatsAppFloatButton";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { AnalyticsBeacon } from "@/components/analytics/AnalyticsBeacon";
import { JsonLd } from "@/components/seo/JsonLd";
import { businessJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "PowerNexa Solutions installs and maintains solar panels, inverters, and battery backup systems for homes and businesses across Lagos. Get a quote today.",
  keywords: [
    "solar installation Lagos",
    "inverter installation Lagos",
    "solar panel installation Lagos",
    "solar installers near me",
    "solar and inverter installation Lagos",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Solar, inverter, and battery installation for homes and businesses across Lagos. Licensed installers, transparent pricing, fast response.",
    url: SITE_URL,
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: "Solar, inverter, and battery installation for homes and businesses across Lagos.",
  },
  alternates: {
    canonical: "/",
  },
};

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        <ConditionalChrome
          jsonLd={<JsonLd data={businessJsonLd()} />}
          analytics={
            <Suspense fallback={null}>
              <AnalyticsBeacon />
            </Suspense>
          }
          header={<Header />}
          footer={<Footer />}
          whatsapp={<WhatsAppFloatButton />}
        >
          {children}
        </ConditionalChrome>
      </body>
    </html>
  );
}
