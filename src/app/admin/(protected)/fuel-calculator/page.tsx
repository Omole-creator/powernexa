import type { Metadata } from "next";
import { FuelSpendCalculator } from "@/components/admin/FuelSpendCalculator";

export const metadata: Metadata = { title: "Fuel Calculator", robots: { index: false } };

export default function FuelCalculatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">Fuel calculator</h1>
        <p className="text-sm text-charcoal/55">
          For a customer or business that doesn&apos;t know what they spend on fuel. Work it out from how long the
          generator runs, then type the monthly figure into &quot;Current fuel spend a month&quot; on their quote.
          Nothing here is saved.
        </p>
      </div>
      <FuelSpendCalculator />
    </div>
  );
}
