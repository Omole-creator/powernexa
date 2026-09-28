import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const PRIVATE_PATHS = ["/admin", "/api", "/my-system"];

// Search and AI-answer crawlers, named so it's explicit they're welcome.
// ChatGPT search (OAI-SearchBot, ChatGPT-User) leans on Bing's index, so
// bingbot matters as much as the OpenAI bots. A named group replaces the "*"
// group for that bot, so each one repeats the private paths.
const AI_AND_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "bingbot",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
