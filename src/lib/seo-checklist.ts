export type SeoCheckInput = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  content: string;
  focusKeyword: string;
  featuredImageAlt: string;
};

export type SeoCheck = {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
};

export type SeoResult = {
  score: number;
  checks: SeoCheck[];
  wordCount: number;
  headingCount: number;
  internalLinkCount: number;
  readability: { label: string; wordsPerSentence: number };
};

function countSyllables(word: string): number {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  if (cleaned.length <= 3) return 1;
  const matches = cleaned.match(/[aeiouy]+/g);
  return matches ? Math.max(matches.length, 1) : 1;
}

function readabilityLabel(avgWordsPerSentence: number): string {
  if (avgWordsPerSentence <= 14) return "Easy to read";
  if (avgWordsPerSentence <= 20) return "OK, could simplify";
  return "Hard to read, shorten your sentences";
}

export function computeSeoChecklist(input: SeoCheckInput): SeoResult {
  const checks: SeoCheck[] = [];
  const keyword = input.focusKeyword.trim().toLowerCase();
  const contentLower = input.content.toLowerCase();
  const words = input.content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const first100 = words.slice(0, 100).join(" ").toLowerCase();
  const headingMatches = input.content.match(/^#{2,3}\s+.+$/gm) ?? [];
  const headingCount = headingMatches.length;
  const internalLinkMatches = input.content.match(/\]\(\/[^)]*\)/g) ?? [];
  const internalLinkCount = internalLinkMatches.length;

  // Title length
  const titleLen = input.metaTitle.length || input.title.length;
  checks.push({
    label: "Meta title length",
    status: titleLen >= 50 && titleLen <= 60 ? "pass" : titleLen >= 40 && titleLen <= 70 ? "warn" : "fail",
    detail: `${titleLen} characters (aim for 50 to 60)`,
  });

  // Meta description length
  const descLen = input.metaDescription.length;
  checks.push({
    label: "Meta description length",
    status: descLen >= 140 && descLen <= 160 ? "pass" : descLen >= 120 && descLen <= 170 ? "warn" : "fail",
    detail: `${descLen} characters (aim for 140 to 160)`,
  });

  if (keyword) {
    checks.push({
      label: "Focus keyword in title",
      status: input.title.toLowerCase().includes(keyword) ? "pass" : "fail",
      detail: input.title.toLowerCase().includes(keyword) ? "Found in title" : "Not found in title",
    });
    checks.push({
      label: "Focus keyword in meta description",
      status: input.metaDescription.toLowerCase().includes(keyword) ? "pass" : "fail",
      detail: input.metaDescription.toLowerCase().includes(keyword) ? "Found" : "Not found",
    });
    checks.push({
      label: "Focus keyword in URL slug",
      status: input.slug.toLowerCase().includes(keyword.replace(/\s+/g, "-")) ? "pass" : "warn",
      detail: input.slug.toLowerCase().includes(keyword.replace(/\s+/g, "-")) ? "Found in slug" : "Consider adding it to the slug",
    });
    checks.push({
      label: "Focus keyword in first 100 words",
      status: first100.includes(keyword) ? "pass" : "fail",
      detail: first100.includes(keyword) ? "Found early in the content" : "Add it near the start of the article",
    });
    checks.push({
      label: "Focus keyword in a heading",
      status: contentLower.includes(keyword) && headingMatches.some((h) => h.toLowerCase().includes(keyword)) ? "pass" : "warn",
      detail: headingMatches.some((h) => h.toLowerCase().includes(keyword)) ? "Found in a heading" : "Add it to at least one H2/H3",
    });
    checks.push({
      label: "Focus keyword in image alt text",
      status: input.featuredImageAlt.toLowerCase().includes(keyword) ? "pass" : "warn",
      detail: input.featuredImageAlt.toLowerCase().includes(keyword) ? "Found in alt text" : "Add it to the featured image alt text",
    });
  } else {
    checks.push({ label: "Focus keyword set", status: "fail", detail: "Add a focus keyword to turn on these checks" });
  }

  checks.push({
    label: "Content length",
    status: wordCount >= 1200 ? "pass" : wordCount >= 600 ? "warn" : "fail",
    detail: `${wordCount} words (aim for 1200+ on pillar posts)`,
  });

  checks.push({
    label: "Subheadings",
    status: headingCount >= 2 ? "pass" : "warn",
    detail: `${headingCount} H2/H3 headings found`,
  });

  checks.push({
    label: "Internal links",
    status: internalLinkCount >= 2 ? "pass" : "warn",
    detail: `${internalLinkCount} internal links found (aim for 2+)`,
  });

  // Readability
  const sentences = input.content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const fleschApprox =
    wordCount > 0 && sentences.length > 0
      ? 206.835 - 1.015 * avgWordsPerSentence - 84.6 * (totalSyllables / wordCount)
      : 0;
  checks.push({
    label: "Readability",
    status: fleschApprox >= 60 ? "pass" : fleschApprox >= 40 ? "warn" : "fail",
    detail: readabilityLabel(avgWordsPerSentence),
  });

  const passCount = checks.filter((c) => c.status === "pass").length;
  const warnCount = checks.filter((c) => c.status === "warn").length;
  const score = Math.round(((passCount + warnCount * 0.5) / checks.length) * 100);

  return {
    score,
    checks,
    wordCount,
    headingCount,
    internalLinkCount,
    readability: { label: readabilityLabel(avgWordsPerSentence), wordsPerSentence: Math.round(avgWordsPerSentence) },
  };
}
