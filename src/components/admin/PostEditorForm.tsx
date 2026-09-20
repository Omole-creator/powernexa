"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { createPostAction, updatePostAction, type PostFormState } from "@/actions/blog";
import { slugify } from "@/lib/validation";
import { SeoChecklist } from "./SeoChecklist";
import { InternalLinkHelper } from "./InternalLinkHelper";
import type { BlogPost } from "@/lib/blog";

const CATEGORY_SUGGESTIONS = ["Pricing", "Guides", "Locations", "Maintenance", "Comparisons"];

const initialState: PostFormState = {};

export function PostEditorForm({
  mode,
  post,
  existingPosts,
}: {
  mode: "create" | "edit";
  post?: BlogPost;
  existingPosts: { title: string; slug: string }[];
}) {
  const action = mode === "edit" && post ? updatePostAction.bind(null, post.id) : createPostAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [metaTitle, setMetaTitle] = useState(post?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.meta_description ?? "");
  const [focusKeyword, setFocusKeyword] = useState(post?.focus_keyword ?? "");
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image ?? "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(post?.featured_image_alt ?? "");

  const tagsDefault = useMemo(() => (post ? post.tags.join(", ") : ""), [post]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
    if (!metaTitle) setMetaTitle(value);
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-line bg-white p-6">
          <label className="block text-sm font-medium text-charcoal/80">Title</label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-lg font-semibold outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
          />

          <label className="mt-4 block text-sm font-medium text-charcoal/80">URL slug</label>
          <div className="mt-1.5 flex items-center gap-1 text-sm text-charcoal/50">
            <span>/blog/</span>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className="flex-1 rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
          </div>

          <label className="mt-4 block text-sm font-medium text-charcoal/80">Excerpt</label>
          <textarea
            name="excerpt"
            required
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
            placeholder="One or two sentences shown on blog cards and search results."
          />

          <label className="mt-4 block text-sm font-medium text-charcoal/80">
            Content (Markdown, use ## for headings)
          </label>
          <textarea
            name="content"
            required
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
          />
        </div>

        <div className="grid gap-5 rounded-2xl border border-line bg-white p-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-charcoal/80">Category</label>
            <input
              name="category"
              required
              defaultValue={post?.category ?? ""}
              list="category-suggestions"
              className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
            <datalist id="category-suggestions">
              {CATEGORY_SUGGESTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal/80">Tags (comma separated)</label>
            <input
              name="tags"
              defaultValue={tagsDefault}
              className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal/80">Author name</label>
            <input
              name="authorName"
              defaultValue={post?.author_name ?? "PowerNexa Solutions Team"}
              className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal/80">Canonical URL (optional)</label>
            <input
              name="canonicalUrl"
              defaultValue={post?.canonical_url ?? ""}
              placeholder="Leave blank unless republishing"
              className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal/80">Featured image URL</label>
            <input
              name="featuredImage"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://..."
              className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal/80">Featured image alt text</label>
            <input
              name="featuredImageAlt"
              value={featuredImageAlt}
              onChange={(e) => setFeaturedImageAlt(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-charcoal/80">
              <input type="radio" name="status" value="draft" defaultChecked={post?.status !== "published"} />
              Save as draft
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-charcoal/80">
              <input type="radio" name="status" value="published" defaultChecked={post?.status === "published"} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-charcoal/80">
              <input type="checkbox" name="noindex" defaultChecked={Boolean(post?.noindex)} />
              Noindex
            </label>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
          >
            {pending ? "Saving..." : mode === "edit" ? "Save changes" : "Create post"}
          </button>
        </div>
        {state.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-line bg-white p-6">
          <label className="block text-sm font-medium text-charcoal/80">Focus keyword</label>
          <input
            name="focusKeyword"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            placeholder="e.g. solar installation cost in lagos"
            className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
          />

          <label className="mt-4 block text-sm font-medium text-charcoal/80">
            Meta title <span className="text-charcoal/40">({metaTitle.length}/60)</span>
          </label>
          <input
            name="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
          />

          <label className="mt-4 block text-sm font-medium text-charcoal/80">
            Meta description <span className="text-charcoal/40">({metaDescription.length}/160)</span>
          </label>
          <textarea
            name="metaDescription"
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
          />
        </div>

        <SeoChecklist
          title={title}
          metaTitle={metaTitle}
          metaDescription={metaDescription}
          slug={slug}
          content={content}
          focusKeyword={focusKeyword}
          featuredImageAlt={featuredImageAlt}
        />

        <InternalLinkHelper posts={existingPosts} />
      </div>
    </form>
  );
}
