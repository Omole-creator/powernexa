"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/constants";

type LinkOption = { label: string; path: string };

export function InternalLinkHelper({ posts }: { posts: { title: string; slug: string }[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const options: LinkOption[] = [
    ...SERVICES.map((s) => ({ label: s.name, path: `/services/${s.slug}` })),
    ...posts.map((p) => ({ label: p.title, path: `/blog/${p.slug}` })),
  ];

  function copyLink(option: LinkOption) {
    const markdown = `[${option.label}](${option.path})`;
    navigator.clipboard?.writeText(markdown).then(() => {
      setCopied(option.path);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  if (options.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-navy">
        Internal link helper
      </h3>
      <p className="mt-1 text-xs text-charcoal/50">Click to copy a Markdown link, then paste it into your content.</p>
      <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto text-xs">
        {options.map((option) => (
          <li key={option.path}>
            <button
              type="button"
              onClick={() => copyLink(option)}
              className="block w-full truncate rounded-lg px-2 py-1.5 text-left text-charcoal/70 hover:bg-mist hover:text-navy"
            >
              {copied === option.path ? "Copied!" : option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
