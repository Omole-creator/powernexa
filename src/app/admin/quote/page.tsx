import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { decodeQuote } from "@/lib/quote";
import { QuoteDocument } from "@/components/quote/QuoteDocument";
import { AutoPrint, PrintButton } from "@/components/quote/PrintButton";
import { createSystemFromQuoteAction } from "@/actions/customer-systems";
import { encodeQuote } from "@/lib/quote";
import { getSavedQuote } from "@/lib/saved-quotes";

export const metadata: Metadata = { title: "Customer Quote", robots: { index: false } };

// Sits outside the (protected) group so it prints without the admin sidebar,
// but is still admin-only.
export default async function AdminQuotePage({ searchParams }: { searchParams: Promise<{ d?: string; id?: string; print?: string }> }) {
  await requireAdmin();
  const { d, id, print } = await searchParams;
  // ?d= carries the quote as typed; ?id= is a saved quote (both when a saved
  // quote is opened straight from the builder).
  const savedId = Number(id) > 0 ? Number(id) : null;
  const saved = savedId ? await getSavedQuote(savedId) : null;
  const quote = decodeQuote(d) ?? saved?.quote ?? null;

  if (!quote) {
    return (
      <div className="mx-auto max-w-lg p-10 text-center">
        <p className="font-semibold text-navy">This quote link is incomplete.</p>
        <Link href="/admin/pricing" className="mt-3 inline-block text-sm font-semibold text-orange">
          Back to the calculator
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist py-6 print:bg-white print:py-0">
      {print === "1" ? <AutoPrint /> : null}
      <div className="mx-auto mb-4 flex max-w-[800px] flex-wrap items-center gap-3 px-4 print:hidden">
        <PrintButton />
        <form action={createSystemFromQuoteAction}>
          <input type="hidden" name="quote" value={encodeQuote(quote)} />
          {savedId ? <input type="hidden" name="quoteId" value={savedId} /> : null}
          <button
            type="submit"
            className="rounded-full border border-navy/20 bg-white px-5 py-2 text-sm font-semibold text-navy hover:border-orange"
          >
            {saved?.system_id ? "My System page already made: make another" : "Customer said yes: create their My System page"}
          </button>
        </form>
        <p className="w-full text-xs text-charcoal/55">
          Download PDF opens the print window. Choose &quot;Save as PDF&quot;, then send the file on WhatsApp.
        </p>
      </div>
      <div className="mx-auto max-w-[800px] shadow-[0_20px_50px_-24px_rgba(9,43,76,0.25)] print:max-w-none print:shadow-none">
        <QuoteDocument quote={quote} />
      </div>
    </div>
  );
}
