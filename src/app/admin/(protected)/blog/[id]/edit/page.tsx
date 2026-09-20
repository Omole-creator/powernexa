import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostEditorForm } from "@/components/admin/PostEditorForm";
import { getPostById, listAllPostsForAdmin } from "@/lib/blog";

export const metadata: Metadata = { title: "Edit Post", robots: { index: false } };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(Number(id));
  if (!post) notFound();

  const allPosts = await listAllPostsForAdmin();
  const existingPosts = allPosts
    .filter((p) => p.status === "published" && p.id !== post.id)
    .map((p) => ({ title: p.title, slug: p.slug }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy">Edit post</h1>
      <div className="mt-6">
        <PostEditorForm mode="edit" post={post} existingPosts={existingPosts} />
      </div>
    </div>
  );
}
