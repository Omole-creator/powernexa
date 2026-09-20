import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Eyebrow } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { BlogCard } from "@/components/marketing/BlogCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { listCategories, listPublishedPosts } from "@/lib/blog";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((category) => ({ category: category.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return {
    title: `${capitalize(decoded)} Articles`,
    description: `Articles about ${decoded} for solar and inverter systems in Lagos.`,
    alternates: { canonical: `/blog/category/${category}` },
  };
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const categories = await listCategories();
  const actualCategory = categories.find((c) => c.toLowerCase() === decoded.toLowerCase());
  if (!actualCategory) notFound();

  const posts = await listPublishedPosts({ category: actualCategory });

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: actualCategory, path: `/blog/category/${category}` },
        ])}
      />

      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: actualCategory, path: `/blog/category/${category}` },
            ]}
          />
          <div className="mt-6 max-w-2xl">
            <Eyebrow>Category</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              {actualCategory}
            </h1>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
