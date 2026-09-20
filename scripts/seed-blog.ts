// One-time setup script: publishes the 6 launch blog posts to Supabase.
// Safe to re-run, it skips any slug that already exists.
//
// Run with: node --env-file=.env.local scripts/seed-blog.ts

import { createClient } from "@supabase/supabase-js";
import { BLOG_SEED_POSTS } from "../src/lib/blog-seed-data.ts";

function computeReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in your environment.");
  }

  const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

  for (const post of BLOG_SEED_POSTS) {
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", post.slug)
      .maybeSingle();

    if (existing) {
      console.log(`Skipping "${post.slug}", already exists.`);
      continue;
    }

    const publishedAt = new Date(Date.now() - post.publishedDaysAgo * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase.from("blog_posts").insert({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags,
      focus_keyword: post.focusKeyword,
      meta_title: post.metaTitle,
      meta_description: post.metaDescription,
      featured_image_alt: post.featuredImageAlt ?? null,
      author_name: post.authorName,
      status: "published",
      noindex: false,
      reading_time_minutes: computeReadingTime(post.content),
      published_at: publishedAt,
    });

    if (error) {
      console.error(`Failed to insert "${post.slug}":`, error.message);
    } else {
      console.log(`Published "${post.slug}".`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
