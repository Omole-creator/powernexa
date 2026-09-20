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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(9,43,76,0.25)]"
    >
      <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-navy to-navy-ink p-6">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow">
          {post.category}
        </span>
        <span className="absolute bottom-4 right-4 font-mono-num text-xs text-white/50">
          {post.reading_time_minutes} min read
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium text-charcoal/50">{formatDate(post.published_at)}</p>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-navy group-hover:text-orange">
          {post.title}
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-charcoal/70">{post.excerpt}</p>
        <span className="mt-4 text-sm font-semibold text-orange">Read article →</span>
      </div>
    </Link>
  );
}
