import { extractHeadings } from "@/lib/markdown";

export function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);
  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-2xl border border-line bg-mist p-6">
      <p className="font-display text-sm font-bold uppercase tracking-wider text-navy">In this article</p>
      <ul className="mt-3 space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "ml-4" : ""}>
            <a href={`#${heading.id}`} className="text-charcoal/70 hover:text-orange">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
