import type { Metadata } from "next";
import { PostEditorForm } from "@/components/admin/PostEditorForm";
import { listAllPostsForAdmin } from "@/lib/blog";

export const metadata: Metadata = { title: "New Post", robots: { index: false } };

export default async function NewPostPage() {
  const allPosts = await listAllPostsForAdmin();
  const existingPosts = allPosts
    .filter((p) => p.status === "published")
    .map((p) => ({ title: p.title, slug: p.slug }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy">New post</h1>
      <div className="mt-6">
        <PostEditorForm mode="create" existingPosts={existingPosts} />
      </div>
    </div>
  );
}
