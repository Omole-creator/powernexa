import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSystemByToken } from "@/lib/customer-systems";
import { QuoteDocument } from "@/components/quote/QuoteDocument";
import { PrintButton } from "@/components/quote/PrintButton";

export const metadata: Metadata = {
  title: "Your quote",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function MySystemQuotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const details = await getSystemByToken(token);
  if (!details?.system.quote) notFound();

  return (
    <div className="min-h-screen bg-mist py-6 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-[800px] items-center gap-4 px-4 print:hidden">
        <PrintButton />
        <Link href={`/my-system/${token}`} className="text-sm font-semibold text-navy">
          ← Back to your system
        </Link>
      </div>
      <div className="mx-auto max-w-[800px] shadow-[0_20px_50px_-24px_rgba(9,43,76,0.25)] print:max-w-none print:shadow-none">
        <QuoteDocument quote={details.system.quote} />
      </div>
    </div>
  );
}
