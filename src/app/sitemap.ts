import type { MetadataRoute } from "next";
import { SITE_URL, LAGOS_AREAS, SERVICES } from "@/lib/constants";
import { listPublishedPosts, listCategories } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/locations",
    "/pricing",
    "/faq",
    "/testimonials",
    "/blog",
    "/get-a-quote",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceRoutes = SERVICES.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const locationRoutes = LAGOS_AREAS.map((area) => ({
    url: `${SITE_URL}/locations/${area.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categories = await listCategories();
  const categoryRoutes = categories.map((category) => ({
    url: `${SITE_URL}/blog/category/${category.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const publishedPosts = await listPublishedPosts();
  const postRoutes = publishedPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...locationRoutes, ...categoryRoutes, ...postRoutes];
}
