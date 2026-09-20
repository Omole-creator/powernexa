"use client";

import { useTransition } from "react";
import { deletePostAction } from "@/actions/blog";

export function DeletePostButton({ id, title, slug }: { id: number; title: string; slug: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(`Delete "${title}"? This cannot be undone.`)) {
          startTransition(() => deletePostAction(id, title, slug));
        }
      }}
      className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
