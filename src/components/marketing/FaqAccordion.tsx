export type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {items.map((item) => (
        <details key={item.question} className="group px-6 py-5 open:bg-mist/50">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-navy">
            {item.question}
            <span className="relative h-5 w-5 shrink-0 text-orange">
              <span className="absolute inset-0 flex items-center justify-center text-lg group-open:hidden">+</span>
              <span className="absolute inset-0 hidden items-center justify-center text-lg group-open:flex">−</span>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
