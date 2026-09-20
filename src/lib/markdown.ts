import GithubSlugger from "github-slugger";

export type Heading = { depth: 2 | 3; text: string; id: string };

export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.*)$/.exec(line.trim());
    if (!match) continue;
    const depth = match[1].length as 2 | 3;
    const text = match[2].replace(/[#*`]/g, "").trim();
    if (!text) continue;
    headings.push({ depth, text, id: slugger.slug(text) });
  }

  return headings;
}
