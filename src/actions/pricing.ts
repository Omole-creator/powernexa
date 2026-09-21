"use server";

import { requireAdmin } from "@/lib/dal";
import { syncAllPriceBenchmarks } from "@/lib/price-benchmarks";
import { logAudit } from "@/lib/audit";

export type PricingSyncState = {
  error?: string;
  success?: string;
};

export async function syncEquipmentPricesNow(
  _prevState: PricingSyncState,
  _formData: FormData
): Promise<PricingSyncState> {
  const admin = await requireAdmin();

  try {
    const result = await syncAllPriceBenchmarks();
    await logAudit(admin.email, "sync_price_benchmarks", `Synced ${result.synced} benchmark rows from Itel Solar`);
    return { success: `Updated ${result.synced} price benchmarks from Itel Solar's live catalog.` };
  } catch (error) {
    console.error("Manual price sync failed", error);
    return { error: "Could not reach Itel Solar's catalog. Try again shortly." };
  }
}
