import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { BlogCard } from "@/components/marketing/BlogCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { listCategories, listPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog: Solar and Inverter Advice for Lagos",
  description:
    "Practical, honest advice on solar panels, inverters, and batteries for Lagos homes and businesses. Pricing guides, comparisons, and maintenance tips.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 60;

export default async function BlogListPage() {
  const posts = await listPublishedPosts();
  const categories = await listCategories();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />

      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
          <Reveal className="mt-6 max-w-2xl">
            <Eyebrow>The PowerNexa blog</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Everything we've learned installing solar in Lagos
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">
              No fluff, no fake numbers, just practical guidance on solar, inverters, and batteries
              from the team that installs them.
            </p>
          </Reveal>

          {categories.length > 0 ? (
            <Reveal delay={150} className="mt-8 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog/category/${encodeURIComponent(category.toLowerCase())}`}
                  className="rounded-full border border-navy/15 bg-white px-4 py-1.5 text-sm font-medium text-navy hover:border-orange hover:text-orange"
                >
                  {category}
                </Link>
              ))}
            </Reveal>
          ) : null}
        </Container>
      </section>

      <section className="py-20">
        <Container>
          {posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.id} delay={(index % 3) * 90}>
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-charcoal/60">
              New articles are on the way. Check back soon.
            </p>
          )}
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
