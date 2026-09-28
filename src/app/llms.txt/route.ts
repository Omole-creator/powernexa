// Plain-text summary of the business for AI assistants (llms.txt convention).
// Built from the same constants as the site so the facts never drift.

import {
  BUSINESS_ADDRESS,
  BUSINESS_HOURS,
  CONTACT_EMAIL,
  LAGOS_AREAS,
  PHONE_DISPLAY,
  PHONE_DISPLAY_2,
  SERVICES,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { PROMISES } from "@/lib/promises";
import { PROJECTS_COMPLETED } from "@/lib/projects-data";
import { listPublishedPosts } from "@/lib/blog";

export const revalidate = 3600;

export async function GET() {
  let posts: { title: string; slug: string; excerpt: string | null }[] = [];
  try {
    posts = await listPublishedPosts();
  } catch {
    // Still serve the rest of the file if Supabase is unreachable.
  }

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} is a solar, inverter and battery installation company in Lagos, Nigeria. We install for homes and businesses across Lagos only. We buy and bring every panel, inverter and battery ourselves, so the customer never has to source parts. ${PROJECTS_COMPLETED}+ projects completed.`,
    "",
    `Office: ${BUSINESS_ADDRESS.street}, ${BUSINESS_ADDRESS.area}, ${BUSINESS_ADDRESS.city}, Nigeria (service area office, not a showroom).`,
    `Phone and WhatsApp: ${PHONE_DISPLAY} or ${PHONE_DISPLAY_2}. Email: ${CONTACT_EMAIL}.`,
    `Hours: ${BUSINESS_HOURS.map((h) => `${h.days}, ${h.hours}`).join(". ")}.`,
    `Social: ${SOCIAL_LINKS.map((s) => `${s.label} ${s.url}`).join(", ")}.`,
    `Quotes: every system is sized from a site assessment at the customer's property. Book at ${SITE_URL}/get-a-quote.`,
    "",
    "## Services",
    "",
    ...SERVICES.map((s) => `- [${s.name}](${SITE_URL}/services/${s.slug}): ${s.summary}`),
    "",
    "## Areas we cover in Lagos",
    "",
    ...LAGOS_AREAS.map((a) => `- [${a.name}](${SITE_URL}/locations/${a.slug})`),
    "",
    "## Written promises to every customer",
    "",
    ...PROMISES.map((p) => `- ${p.title}. ${p.body}`),
    "",
    "## Key pages",
    "",
    `- [About](${SITE_URL}/about)`,
    `- [Projects](${SITE_URL}/projects): videos of completed installations`,
    `- [How pricing works](${SITE_URL}/pricing)`,
    `- [FAQ](${SITE_URL}/faq)`,
    `- [Contact](${SITE_URL}/contact)`,
  ];

  if (posts.length > 0) {
    lines.push("", "## Guides", "");
    for (const post of posts) {
      lines.push(`- [${post.title}](${SITE_URL}/blog/${post.slug})${post.excerpt ? `: ${post.excerpt}` : ""}`);
    }
  }

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
