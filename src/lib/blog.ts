import "server-only";
import { supabase } from "./supabase";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  focus_keyword: string;
  meta_title: string;
  meta_description: string;
  canonical_url: string | null;
  featured_image: string | null;
  featured_image_alt: string | null;
  author_name: string;
  status: "draft" | "published";
  noindex: boolean;
  reading_time_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export function computeReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function listPublishedPosts(options?: { category?: string; limit?: number }): Promise<BlogPost[]> {
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (options?.category) query = query.eq("category", options.category);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function listAllPostsForAdmin(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from("blog_posts").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listCategories(): Promise<string[]> {
  const { data, error } = await supabase.from("blog_posts").select("category").eq("status", "published");
  if (error) throw error;
  const unique = Array.from(new Set((data ?? []).map((r) => r.category))).sort();
  return unique;
}

export async function listRelatedPosts(currentId: number, category: string, limit = 3): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .neq("id", currentId)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export type PostInput = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  focusKeyword: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  authorName: string;
  status: "draft" | "published";
  noindex: boolean;
};

export async function createPost(input: PostInput): Promise<number> {
  const readingTime = computeReadingTime(input.content);
  const publishedAt = input.status === "published" ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      tags: input.tags,
      focus_keyword: input.focusKeyword,
      meta_title: input.metaTitle,
      meta_description: input.metaDescription,
      canonical_url: input.canonicalUrl ?? null,
      featured_image: input.featuredImage ?? null,
      featured_image_alt: input.featuredImageAlt ?? null,
      author_name: input.authorName,
      status: input.status,
      noindex: input.noindex,
      reading_time_minutes: readingTime,
      published_at: publishedAt,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function updatePost(
  id: number,
  input: PostInput
): Promise<{ wasPublished: boolean; nowPublishing: boolean }> {
  const existing = await getPostById(id);
  const readingTime = computeReadingTime(input.content);
  const wasPublished = existing?.status === "published";
  const nowPublishing = input.status === "published";
  const publishedAt = nowPublishing
    ? existing?.published_at ?? new Date().toISOString()
    : existing?.published_at ?? null;

  const { error } = await supabase
    .from("blog_posts")
    .update({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      tags: input.tags,
      focus_keyword: input.focusKeyword,
      meta_title: input.metaTitle,
      meta_description: input.metaDescription,
      canonical_url: input.canonicalUrl ?? null,
      featured_image: input.featuredImage ?? null,
      featured_image_alt: input.featuredImageAlt ?? null,
      author_name: input.authorName,
      status: input.status,
      noindex: input.noindex,
      reading_time_minutes: readingTime,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  return { wasPublished, nowPublishing };
}

export async function deletePost(id: number): Promise<void> {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function slugExists(slug: string, excludeId?: number): Promise<boolean> {
  let query = supabase.from("blog_posts").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return Boolean(data);
}
