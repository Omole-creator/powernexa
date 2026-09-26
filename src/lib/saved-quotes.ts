import "server-only";
import { supabase } from "./supabase";
import { parseQuote, quoteTotal, type CustomerQuote } from "./quote";

// Customer quotes saved from /admin/pricing (table customer_quotes, created by
// the My System SQL). `quote` is what the customer sees; `calc` holds the
// calculator and quote-builder inputs so the quote can be reopened and edited.

export type SavedQuote = {
  id: number;
  number: string;
  customer_name: string;
  quote: CustomerQuote;
  calc: unknown;
  system_id: number | null;
  created_at: string;
  updated_at: string;
};

export type SavedQuoteSummary = Pick<SavedQuote, "id" | "number" | "customer_name" | "system_id" | "updated_at"> & {
  date: string;
  total: number;
};

function isMissingTable(error: { code?: string; message?: string }): boolean {
  return error.code === "42P01" || error.code === "PGRST205" || /does not exist|schema cache/i.test(error.message ?? "");
}

export async function listSavedQuotes(): Promise<{ quotes: SavedQuoteSummary[]; tableMissing: boolean }> {
  const { data, error } = await supabase
    .from("customer_quotes")
    .select("id, number, customer_name, quote, system_id, updated_at")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (error) {
    if (isMissingTable(error)) return { quotes: [], tableMissing: true };
    throw error;
  }
  const quotes = (data ?? []).flatMap((row) => {
    const quote = parseQuote(row.quote);
    if (!quote) return [];
    return [
      {
        id: row.id,
        number: row.number,
        customer_name: row.customer_name,
        system_id: row.system_id,
        updated_at: row.updated_at,
        date: quote.date,
        total: quoteTotal(quote),
      },
    ];
  });
  return { quotes, tableMissing: false };
}

export async function getSavedQuote(id: number): Promise<SavedQuote | null> {
  const { data, error } = await supabase.from("customer_quotes").select("*").eq("id", id).maybeSingle();
  if (error) {
    if (isMissingTable(error)) return null;
    throw error;
  }
  if (!data) return null;
  const quote = parseQuote(data.quote);
  return quote ? { ...data, quote } : null;
}

export async function saveQuote(id: number | null, quote: CustomerQuote, calc: unknown): Promise<number> {
  const row = { number: quote.number, customer_name: quote.customer.name, quote, calc, updated_at: new Date().toISOString() };
  if (id !== null) {
    const { error } = await supabase.from("customer_quotes").update(row).eq("id", id);
    if (error) throw error;
    return id;
  }
  const { data, error } = await supabase.from("customer_quotes").insert(row).select("id").single();
  if (error) throw error;
  return data.id;
}

export async function deleteSavedQuote(id: number): Promise<void> {
  const { error } = await supabase.from("customer_quotes").delete().eq("id", id);
  if (error) throw error;
}

export async function linkQuoteToSystem(id: number, systemId: number): Promise<void> {
  const { error } = await supabase.from("customer_quotes").update({ system_id: systemId }).eq("id", id);
  if (error) throw error;
}
