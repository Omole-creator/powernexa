import type { Metadata } from "next";
import Link from "next/link";
import { listAllPostsForAdmin } from "@/lib/blog";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export const metadata: Metadata = { title: "Blog", robots: { index: false } };

export default async function AdminBlogListPage() {
  const posts = await listAllPostsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Blog</h1>
          <p className="text-sm text-charcoal/55">Write, optimize, and publish articles with the built-in SEO checklist.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="self-start rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-dark"
        >
          New post
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-charcoal/45">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-3 font-medium text-navy">{post.title}</td>
                <td className="px-4 py-3 text-charcoal/65">{post.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      post.status === "published" ? "bg-green-100 text-green-700" : "bg-mist text-navy"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal/55">
                  {new Date(post.updated_at).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/blog/${post.id}/edit`} className="text-xs font-semibold text-navy hover:text-orange">
                      Edit
                    </Link>
                    {post.status === "published" ? (
                      <Link href={`/blog/${post.slug}`} target="_blank" className="text-xs font-semibold text-charcoal/50 hover:text-navy">
                        View
                      </Link>
                    ) : null}
                    <DeletePostButton id={post.id} title={post.title} slug={post.slug} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-charcoal/50">
                  No posts yet. Create your first one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
