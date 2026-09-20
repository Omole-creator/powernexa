"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/dal";
import { createPost, updatePost, deletePost, slugExists, type PostInput } from "@/lib/blog";
import { logAudit } from "@/lib/audit";
import { requiredString, optionalString, slugify } from "@/lib/validation";

export type PostFormState = {
  error?: string;
};

function readPostInput(formData: FormData): { input: PostInput | null; error?: string } {
  const title = requiredString(formData.get("title"), 200);
  const rawSlug = requiredString(formData.get("slug"), 200);
  const excerpt = requiredString(formData.get("excerpt"), 400);
  const content = requiredString(formData.get("content"), 50000);
  const category = requiredString(formData.get("category"), 60);
  const metaTitle = requiredString(formData.get("metaTitle"), 200) ?? title ?? "";
  const metaDescription = requiredString(formData.get("metaDescription"), 300) ?? excerpt ?? "";
  const status = requiredString(formData.get("status"), 20) === "published" ? "published" : "draft";

  if (!title || !rawSlug || !excerpt || !content || !category) {
    return { input: null, error: "Title, slug, excerpt, content, and category are required." };
  }

  const tagsRaw = optionalString(formData.get("tags"), 400) ?? "";
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    input: {
      slug: slugify(rawSlug),
      title,
      excerpt,
      content,
      category,
      tags,
      focusKeyword: optionalString(formData.get("focusKeyword"), 100) ?? "",
      metaTitle,
      metaDescription,
      canonicalUrl: optionalString(formData.get("canonicalUrl"), 300),
      featuredImage: optionalString(formData.get("featuredImage"), 500),
      featuredImageAlt: optionalString(formData.get("featuredImageAlt"), 200),
      authorName: optionalString(formData.get("authorName"), 100) ?? "PowerNexa Solutions Team",
      status,
      noindex: formData.get("noindex") === "on",
    },
  };
}

export async function createPostAction(_prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  const admin = await requireAdmin();
  const { input, error } = readPostInput(formData);
  if (!input) return { error };

  if (await slugExists(input.slug)) {
    return { error: `The slug "${input.slug}" is already used by another post.` };
  }

  const id = await createPost(input);
  await logAudit(admin.email, "create_post", `#${id} ${input.title}`);
  if (input.status === "published") {
    await logAudit(admin.email, "publish_post", `#${id} ${input.title}`);
  }

  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function updatePostAction(
  postId: number,
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const admin = await requireAdmin();
  const { input, error } = readPostInput(formData);
  if (!input) return { error };

  if (await slugExists(input.slug, postId)) {
    return { error: `The slug "${input.slug}" is already used by another post.` };
  }

  const { wasPublished, nowPublishing } = await updatePost(postId, input);
  await logAudit(admin.email, "update_post", `#${postId} ${input.title}`);
  if (!wasPublished && nowPublishing) {
    await logAudit(admin.email, "publish_post", `#${postId} ${input.title}`);
  } else if (wasPublished && !nowPublishing) {
    await logAudit(admin.email, "unpublish_post", `#${postId} ${input.title}`);
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${input.slug}`);
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function deletePostAction(postId: number, title: string, slug: string) {
  const admin = await requireAdmin();
  await deletePost(postId);
  await logAudit(admin.email, "delete_post", `#${postId} ${title}`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
}
