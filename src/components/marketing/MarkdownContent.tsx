import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Link from "next/link";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-pnx">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h2: ({ children, id }) => (
            <h2 id={id} className="mt-10 scroll-mt-28 font-display text-2xl font-bold text-navy">
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 id={id} className="mt-8 scroll-mt-28 font-display text-xl font-bold text-navy">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mt-4 leading-relaxed text-charcoal/85">{children}</p>,
          ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-charcoal/85">{children}</ul>,
          ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-charcoal/85">{children}</ol>,
          a: ({ href, children }) => {
            if (href && href.startsWith("/")) {
              return (
                <Link href={href} className="font-semibold text-orange underline decoration-orange/40 underline-offset-2 hover:decoration-orange">
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-orange underline decoration-orange/40 underline-offset-2 hover:decoration-orange"
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element -- images come from admin-uploaded markdown with arbitrary, unknown dimensions
              <img
                src={src}
                alt={alt ?? ""}
                loading="lazy"
                className="mt-6 w-full rounded-2xl shadow-[0_20px_40px_-24px_rgba(9,43,76,0.35)]"
              />
            ) : null,
          blockquote: ({ children }) => (
            <blockquote className="mt-5 border-l-4 border-orange bg-mist py-3 pl-5 italic text-charcoal/75">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="bg-mist px-4 py-2.5 font-display font-bold text-navy">{children}</th>,
          td: ({ children }) => <td className="border-t border-line px-4 py-2.5 text-charcoal/80">{children}</td>,
          strong: ({ children }) => <strong className="font-bold text-navy">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
