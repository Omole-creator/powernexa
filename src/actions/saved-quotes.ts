"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { parseQuote } from "@/lib/quote";
import { deleteSavedQuote, saveQuote } from "@/lib/saved-quotes";

export type SaveQuoteResult = { id?: number; error?: string };

export async function saveQuoteAction(id: number | null, quoteJson: string, calcJson: string): Promise<SaveQuoteResult> {
  const admin = await requireAdmin();
  if (quoteJson.length > 100_000 || calcJson.length > 100_000) return { error: "This quote is too large to save." };
  let quote;
  let calc: unknown = null;
  try {
    quote = parseQuote(JSON.parse(quoteJson));
    calc = JSON.parse(calcJson);
  } catch {
    return { error: "Could not read the quote." };
  }
  if (!quote) return { error: "Enter the customer's name and a quote date first." };

  let savedId: number;
  try {
    savedId = await saveQuote(id, quote, calc);
  } catch (error) {
    console.error("Save quote failed", error);
    return { error: "Could not save. Has the My System SQL been run in Supabase?" };
  }
  await logAudit(admin.email, "save_customer_quote", `${quote.number} ${quote.customer.name}`);
  revalidatePath("/admin/pricing");
  return { id: savedId };
}

export async function deleteQuoteAction(id: number, label: string) {
  const admin = await requireAdmin();
  await deleteSavedQuote(id);
  await logAudit(admin.email, "delete_customer_quote", `#${id} ${label}`);
  revalidatePath("/admin/pricing");
}
