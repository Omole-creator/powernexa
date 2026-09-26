"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteQuoteAction } from "@/actions/saved-quotes";
import { formatNaira } from "@/lib/costing";
import { formatDate } from "@/lib/quote";
import type { SavedQuoteSummary } from "@/lib/saved-quotes";

export function SavedQuotesList({ quotes, activeId }: { quotes: SavedQuoteSummary[]; activeId: number | null }) {
  return (
    <details className="group rounded-2xl border border-line bg-white p-5" open={activeId !== null}>
      <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg font-bold text-navy">
        <span>
          Saved quotes <span className="font-mono-num text-sm font-medium text-charcoal/45">({quotes.length})</span>
        </span>
        <span className="text-sm text-charcoal/40 transition-transform group-open:rotate-180" aria-hidden="true">
          ▾
        </span>
      </summary>
      {quotes.length === 0 ? (
        <p className="mt-3 text-sm text-charcoal/50">No saved quotes yet. Use &quot;Save quote&quot; in the customer quote below.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-charcoal/45">
              <tr className="border-b border-line">
                <th className="py-2">Quote</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Date</th>
                <th className="py-2 text-right">Total</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {quotes.map((q) => (
                <QuoteRow key={q.id} quote={q} active={q.id === activeId} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </details>
  );
}

function QuoteRow({ quote, active }: { quote: SavedQuoteSummary; active: boolean }) {
  const [isPending, startTransition] = useTransition();
  return (
    <tr className={active ? "bg-orange/5" : undefined}>
      <td className="py-2 font-mono-num text-xs text-charcoal/60">{quote.number}</td>
      <td className="py-2">
        <span className="font-medium text-navy">{quote.customer_name}</span>
        {quote.system_id ? (
          <Link href={`/admin/systems/${quote.system_id}`} className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-800">
            Installed
          </Link>
        ) : null}
      </td>
      <td className="py-2 text-charcoal/60">{formatDate(quote.date)}</td>
      <td className="py-2 text-right font-mono-num text-navy">{formatNaira(quote.total)}</td>
      <td className="py-2">
        <div className="flex justify-end gap-3 whitespace-nowrap text-xs font-semibold">
          <Link href={`/admin/pricing?quote=${quote.id}#customer-quote`} className="text-orange">
            {active ? "Editing" : "Edit"}
          </Link>
          <a href={`/admin/quote?id=${quote.id}`} target="_blank" rel="noopener" className="text-navy">
            PDF
          </a>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (confirm(`Delete quote ${quote.number} for ${quote.customer_name}?`)) {
                startTransition(() => deleteQuoteAction(quote.id, `${quote.number} ${quote.customer_name}`));
              }
            }}
            className="text-charcoal/50 hover:text-red-600"
          >
            {isPending ? "..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
