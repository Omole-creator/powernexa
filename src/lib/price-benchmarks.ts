import "server-only";
import { supabase } from "./supabase";
import { fetchItelBenchmarks } from "./itel-catalog";

export type PriceBenchmark = {
  id: number;
  source: string;
  category: "panel" | "inverter" | "battery";
  subtype: string;
  unit: "watt" | "kva" | "kwh";
  rate_ngn: number;
  min_rate_ngn: number;
  max_rate_ngn: number;
  sample_size: number;
  synced_at: string;
};

export async function listPriceBenchmarks(): Promise<PriceBenchmark[]> {
  const { data, error } = await supabase
    .from("equipment_price_benchmarks")
    .select("*")
    .order("category", { ascending: true })
    .order("subtype", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// Replaces every benchmark row from a given source with a fresh snapshot.
// Delete-then-insert (not upsert) because a sync can drop a subtype entirely
// (e.g. Itel sells out of 3-phase inverters), and a stale row for a subtype
// with no current data is worse than no row at all.
// An empty result is treated as a failure, never as "Itel sells nothing now",
// so a bad fetch can't wipe the last good snapshot.
export async function syncAllPriceBenchmarks(): Promise<{ synced: number }> {
  const itelRows = await fetchItelBenchmarks();
  if (itelRows.length === 0) {
    throw new Error("Itel Solar's catalog came back with no priced panels, inverters or batteries");
  }

  const { error: deleteError } = await supabase
    .from("equipment_price_benchmarks")
    .delete()
    .eq("source", "itel_solar");
  if (deleteError) throw deleteError;

  const { error: insertError } = await supabase.from("equipment_price_benchmarks").insert(
    itelRows.map((row) => ({
      source: row.source,
      category: row.category,
      subtype: row.subtype,
      unit: row.unit,
      rate_ngn: row.rateNgn,
      min_rate_ngn: row.minRateNgn,
      max_rate_ngn: row.maxRateNgn,
      sample_size: row.sampleSize,
      synced_at: new Date().toISOString(),
    }))
  );
  if (insertError) throw insertError;

  return { synced: itelRows.length };
}
