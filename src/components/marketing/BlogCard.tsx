import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgba(9,43,76,0.06),0_10px_24px_-16px_rgba(9,43,76,0.16)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(9,43,76,0.08),0_28px_44px_-18px_rgba(9,43,76,0.3)]"
    >
      {post.featured_image ? (
        <div className="relative h-44 overflow-hidden bg-mist">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featured_image}
            alt={post.featured_image_alt ?? post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-ink/70 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-navy/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow backdrop-blur-sm">
            {post.category}
          </span>
          <span className="absolute bottom-4 right-4 font-mono-num text-xs text-white/85">
            {post.reading_time_minutes} min read
          </span>
        </div>
      ) : (
        <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-navy to-navy-ink p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange/10 transition-transform duration-500 group-hover:scale-125" />
          <span className="relative rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow">
            {post.category}
          </span>
          <span className="absolute bottom-4 right-4 font-mono-num text-xs text-white/50">
            {post.reading_time_minutes} min read
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium text-charcoal/50">{formatDate(post.published_at)}</p>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-navy group-hover:text-orange">
          {post.title}
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-charcoal/70">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange transition-all group-hover:gap-2.5">
          Read article <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
