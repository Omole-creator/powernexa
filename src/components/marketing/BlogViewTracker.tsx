"use client";

import { useEffect } from "react";
import { track } from "@/lib/track-client";

export function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track("blog_view", `/blog/${slug}`);
  }, [slug]);

  return null;
}
