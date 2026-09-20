import { BUSINESS_ADDRESS, CONTACT_EMAIL, PHONE_E164, SITE_NAME, SITE_URL } from "./constants";
import type { BlogPost } from "./blog";

export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    image: `${SITE_URL}/images/logo.png`,
    logo: `${SITE_URL}/images/logo.png`,
    url: SITE_URL,
    telephone: PHONE_E164,
    email: CONTACT_EMAIL,
    priceRange: "₦₦₦",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_ADDRESS.street,
      addressLocality: BUSINESS_ADDRESS.area,
      addressRegion: BUSINESS_ADDRESS.region,
      addressCountry: BUSINESS_ADDRESS.country,
    },
    areaServed: [
      "Victoria Island",
      "Lekki Phase 1",
      "Ikoyi",
      "Ajah",
      "VGC",
      "Sangotedo",
      "Ikeja",
      "Lagos Mainland",
      "Lagos",
    ].map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function serviceJsonLd(input: { name: string; description: string; path: string; areaServed?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: input.name,
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    areaServed: {
      "@type": "City",
      name: input.areaServed ?? "Lagos",
    },
    provider: {
      "@id": `${SITE_URL}/#business`,
    },
  };
}

export function blogPostingJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image ? [post.featured_image] : [`${SITE_URL}/opengraph-image`],
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Organization",
      name: post.author_name,
    },
    publisher: {
      "@id": `${SITE_URL}/#business`,
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
