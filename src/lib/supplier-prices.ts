import "server-only";
import { supabase } from "./supabase";
import type { PriceSourceItem } from "./costing";

export type SupplierPriceItem = {
  id: number;
  supplier: string;
  category: "inverter" | "battery" | "panel";
  name: string;
  size: number;
  voltage: string | null;
  chemistry: "lithium" | "tubular" | null;
  price_ngn: number;
  available: boolean;
  notes: string | null;
  updated_at: string;
};

export type SupplierPriceInput = {
  category: SupplierPriceItem["category"];
  name: string;
  size: number;
  voltage?: string;
  chemistry?: "lithium" | "tubular";
  priceNgn: number;
  available?: boolean;
  notes?: string;
};

// Postgres "relation does not exist", i.e. the supplier_price_items SQL in
// supabase/schema.sql hasn't been pasted into the Supabase SQL editor yet.
function isMissingTable(error: { code?: string; message?: string }): boolean {
  return error.code === "42P01" || error.code === "PGRST205" || /does not exist|schema cache/i.test(error.message ?? "");
}

export async function listSupplierPrices(): Promise<{ items: SupplierPriceItem[]; tableMissing: boolean }> {
  const { data, error } = await supabase
    .from("supplier_price_items")
    .select("*")
    .order("supplier", { ascending: true })
    .order("category", { ascending: true })
    .order("size", { ascending: true });
  if (error) {
    if (isMissingTable(error)) return { items: [], tableMissing: true };
    throw error;
  }
  return {
    items: (data ?? []).map((row) => ({ ...row, size: Number(row.size), price_ngn: Number(row.price_ngn) })),
    tableMissing: false,
  };
}

function toRow(supplier: string, input: SupplierPriceInput) {
  return {
    supplier,
    category: input.category,
    name: input.name,
    size: input.size,
    voltage: input.voltage ?? null,
    chemistry: input.category === "battery" ? (input.chemistry ?? null) : null,
    price_ngn: input.priceNgn,
    available: input.available ?? true,
    notes: input.notes ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function addSupplierPrices(supplier: string, inputs: SupplierPriceInput[]): Promise<void> {
  const { error } = await supabase.from("supplier_price_items").insert(inputs.map((input) => toRow(supplier, input)));
  if (error) throw error;
}

export async function updateSupplierPrice(
  id: number,
  patch: { priceNgn?: number; available?: boolean; notes?: string | null }
): Promise<void> {
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.priceNgn !== undefined) update.price_ngn = patch.priceNgn;
  if (patch.available !== undefined) update.available = patch.available;
  if (patch.notes !== undefined) update.notes = patch.notes;
  const { error } = await supabase.from("supplier_price_items").update(update).eq("id", id);
  if (error) throw error;
}

export async function deleteSupplierPrice(id: number): Promise<void> {
  const { error } = await supabase.from("supplier_price_items").delete().eq("id", id);
  if (error) throw error;
}

// Turns the in-stock supplier items into the list the costing engine picks
// the cheapest option from.
export function buildPriceBook(supplierItems: SupplierPriceItem[]): PriceSourceItem[] {
  return supplierItems
    .filter((item) => item.available)
    .map((item) => ({
      source: item.supplier,
      category: item.category,
      name: item.name,
      size: item.size,
      chemistry: item.chemistry,
      price: item.price_ngn,
    }));
}
