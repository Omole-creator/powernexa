import { computeSeoChecklist, type SeoCheckInput } from "@/lib/seo-checklist";

const STATUS_DOT: Record<string, string> = {
  pass: "bg-green-500",
  warn: "bg-amber-500",
  fail: "bg-red-500",
};

export function SeoChecklist(props: SeoCheckInput) {
  const result = computeSeoChecklist(props);

  const scoreColor = result.score >= 80 ? "text-green-600" : result.score >= 50 ? "text-amber-600" : "text-red-600";

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-navy">On-page SEO</h3>
        <span className={`font-mono-num text-xl font-bold ${scoreColor}`}>{result.score}/100</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-mist">
        <div
          className={`h-2 rounded-full ${result.score >= 80 ? "bg-green-500" : result.score >= 50 ? "bg-amber-500" : "bg-red-500"}`}
          style={{ width: `${result.score}%` }}
        />
      </div>
      <ul className="mt-4 space-y-2.5">
        {result.checks.map((check) => (
          <li key={check.label} className="flex items-start gap-2.5 text-xs">
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[check.status]}`} />
            <span>
              <span className="block font-medium text-charcoal/80">{check.label}</span>
              <span className="text-charcoal/50">{check.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
