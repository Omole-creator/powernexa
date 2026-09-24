import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { MarkdownContent } from "@/components/marketing/MarkdownContent";
import { TableOfContents } from "@/components/marketing/TableOfContents";
import { BlogCard } from "@/components/marketing/BlogCard";
import { BlogViewTracker } from "@/components/marketing/BlogViewTracker";
import { CtaBand } from "@/components/marketing/CtaBand";
import { LeadMagnetGate } from "@/components/marketing/LeadMagnetGate";
import { ShareButtons } from "@/components/marketing/ShareButtons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, blogPostingJsonLd } from "@/lib/seo";
import { getPublishedPostBySlug, listPublishedPosts, listRelatedPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { DEFAULT_LEAD_MAGNET } from "@/lib/lead-magnets";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await listPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: { canonical: post.canonical_url || `/blog/${post.slug}` },
    robots: post.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      images: post.featured_image ? [post.featured_image] : [`${SITE_URL}/blog/${post.slug}/opengraph-image`],
    },
  };
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const related = await listRelatedPosts(post.id, post.category, 3);
  const tags = post.tags;
  const shareUrl = `${SITE_URL}/blog/${post.slug}`;

  return (
    <>
      <BlogViewTracker slug={post.slug} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd data={blogPostingJsonLd(post)} />

      <article className="py-14 sm:py-16">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]}
          />

          <header className="mx-auto mt-6 max-w-3xl">
            <span className="rounded-full bg-orange/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-dark">
              {post.category}
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-charcoal/55">
              <span>{post.author_name}</span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(post.published_at)}</span>
              <span aria-hidden="true">·</span>
              <span>{post.reading_time_minutes} min read</span>
            </div>
            <ShareButtons url={shareUrl} title={post.title} className="mt-5" />
          </header>

          {post.featured_image ? (
            <div className="mx-auto mt-8 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-[28px] bg-mist shadow-[0_1px_2px_rgba(9,43,76,0.06),0_10px_24px_-16px_rgba(9,43,76,0.16)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featured_image}
                alt={post.featured_image_alt ?? post.title}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[1fr_260px]">
            <div className="min-w-0 max-w-3xl">
              <MarkdownContent content={post.content} />

              {tags.length > 0 ? (
                <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-charcoal/60">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <ShareButtons
                url={shareUrl}
                title={post.title}
                label="Found this useful? Share it"
                className={`rounded-[28px] bg-white p-5 shadow-[0_1px_2px_rgba(9,43,76,0.06),0_10px_24px_-16px_rgba(9,43,76,0.16)] ${tags.length > 0 ? "mt-6" : "mt-10"}`}
              />

              <div className="mt-10">
                <LeadMagnetGate
                  magnet={DEFAULT_LEAD_MAGNET}
                  title={DEFAULT_LEAD_MAGNET.title}
                  description="A step-by-step list of what to check before, during, and after your installation, so you never end up paying for someone else's guesswork."
                />
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents content={post.content} />
              </div>
            </aside>
          </div>
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="bg-mist py-20">
          <Container>
            <h2 className="font-display text-2xl font-bold text-navy">Related articles</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}
